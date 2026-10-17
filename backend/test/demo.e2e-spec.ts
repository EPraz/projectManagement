import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { execFileSync, spawnSync } from 'child_process';
import { join } from 'path';
import { App } from 'supertest/types';

const tokenOf = (response: { body: unknown }) =>
  (response.body as { accessToken: string }).accessToken;
type ProjectView = {
  title: string;
  sprints: {
    sprintGoal: unknown[];
    retroCard: unknown[];
    teamMemberCapacities: unknown[];
  }[];
};

const databaseUrl = process.env.TEST_DATABASE_URL;
if (
  !databaseUrl ||
  !['127.0.0.1', 'localhost'].includes(new URL(databaseUrl).hostname) ||
  !new URL(databaseUrl).pathname.endsWith('_test')
) {
  throw new Error(
    'TEST_DATABASE_URL must identify an isolated local database ending in _test',
  );
}
process.env.DATABASE_URL = databaseUrl;
process.env.JWT_SECRET = 'isolated-demo-tests-secret-at-least-32-characters';
process.env.CLIENT_URL = 'http://localhost:5173';
process.env.NODE_ENV = 'test';

describe('Acceso demo HTTP API', () => {
  let app: INestApplication<App>;
  const prisma = new PrismaClient({ datasourceUrl: databaseUrl });
  const demoId = 'd0000000-0000-4000-8000-000000000001';

  beforeAll(async () => {
    await prisma.$executeRawUnsafe(
      'TRUNCATE "Project", "User", "Tag", "DbHeartbeat" CASCADE',
    );
    await prisma.user.upsert({
      where: { id: demoId },
      create: {
        id: demoId,
        name: 'Demo Visitor',
        email: 'visitor@demo.example',
        password: 'not-a-login-password',
        role: 'ADMIN',
      },
      update: {},
    });
    const { AppModule } = await import('../src/app.module');
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication<INestApplication<App>>();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
    await prisma.$disconnect();
  });

  it('rejects choosing an identity by email', async () => {
    await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({ email: 'someone@example.com' })
      .expect(400);
  });

  it('reports database readiness without serving the former bundled frontend', async () => {
    const health = await request(app.getHttpServer())
      .get('/health')
      .expect(200);
    expect(health.body).toEqual({ status: 'ok' });
    await request(app.getHttpServer()).get('/').expect(404);
    await request(app.getHttpServer()).get('/projects').expect(401);
  });

  it.each(['/auth/register', '/auth/login'])(
    'does not expose personal accounts at %s',
    async (path) => {
      await request(app.getHttpServer())
        .post(path)
        .send({
          name: 'Personal',
          email: 'private@example.com',
          password: 'do-not-create-me',
        })
        .expect(404);
    },
  );

  it('keeps independent visitor sessions through refresh and logout without exposing secrets', async () => {
    const first = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const cookies = first.headers['set-cookie'] as unknown as string[];
    expect(cookies[0]).toContain('HttpOnly');
    expect(cookies[0]).toContain('SameSite=Lax');
    expect(first.body).not.toHaveProperty('refreshToken');
    await request(app.getHttpServer())
      .get('/auth/checkAuth')
      .auth(cookies[0].split(';')[0].slice(4), { type: 'bearer' })
      .expect(401);
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', `jwt=${tokenOf(first)}`)
      .expect(401);
    const identity = await request(app.getHttpServer())
      .get('/auth/checkAuth')
      .auth(tokenOf(first), { type: 'bearer' })
      .expect(200);
    expect(identity.body).toMatchObject({
      id: demoId,
      email: 'visitor@demo.example',
    });
    expect(identity.body).not.toHaveProperty('password');
    expect(identity.body).not.toHaveProperty('refreshToken');
    await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const refreshed = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', cookies[0].split(';')[0])
      .expect(201);
    expect(tokenOf(refreshed)).toEqual(expect.any(String));
    expect(refreshed.body).not.toHaveProperty('refreshToken');
    await request(app.getHttpServer()).post('/auth/refresh').expect(401);
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', 'jwt=invalid-token')
      .expect(401);
    const logout = await request(app.getHttpServer())
      .post('/auth/logout')
      .expect(201);
    expect(logout.headers['set-cookie'][0]).toContain(
      'Expires=Thu, 01 Jan 1970',
    );
  });

  it('protects the demo identity and does not create personal accounts through team APIs', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({});
    const token = tokenOf(login);
    await request(app.getHttpServer())
      .post('/users')
      .auth(token, { type: 'bearer' })
      .send({
        name: 'Personal',
        email: 'private@example.com',
        password: 'anything',
      })
      .expect(404);
    await request(app.getHttpServer())
      .delete(`/users/${demoId}`)
      .auth(token, { type: 'bearer' })
      .expect(403);
    await request(app.getHttpServer())
      .put(`/users/${demoId}`)
      .auth(token, { type: 'bearer' })
      .send({ email: 'changed@example.com', password: 'anything' })
      .expect(403);
    const users = await request(app.getHttpServer())
      .get('/users')
      .auth(token, { type: 'bearer' })
      .expect(200);
    expect(JSON.stringify(users.body)).not.toMatch(/"password"|"refreshToken"/);
  });

  it('initializes a populated demo through the seed CLI', async () => {
    await prisma.user.deleteMany();
    const output = execFileSync(
      process.execPath,
      ['-r', 'ts-node/register', 'scripts/seed-demo.ts'],
      {
        cwd: join(__dirname, '..'),
        env: {
          ...process.env,
          DATABASE_URL: databaseUrl,
        },
        encoding: 'utf8',
      },
    );
    expect(JSON.parse(output)).toMatchObject({
      status: 'created',
      projects: 2,
      users: 6,
      tickets: 36,
      tasks: 72,
      sprints: 6,
    });
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({});
    const projects = await request(app.getHttpServer())
      .get('/projects')
      .auth(tokenOf(login), { type: 'bearer' })
      .expect(200);
    expect(projects.body).toHaveLength(2);
    expect((projects.body as ProjectView[])[0].sprints).toHaveLength(3);
    expect(
      (projects.body as ProjectView[])[0].sprints.some(
        (sprint: {
          sprintGoal: unknown[];
          retroCard: unknown[];
          teamMemberCapacities: unknown[];
        }) =>
          sprint.sprintGoal.length &&
          sprint.retroCard.length &&
          sprint.teamMemberCapacities.length,
      ),
    ).toBe(true);
    expect(JSON.stringify(projects.body)).not.toMatch(
      /"password"|"refreshToken"/,
    );
  }, 30000);

  it('preserves visitor edits on repeated initialization and restores only with explicit confirmation', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({});
    const token = tokenOf(login);
    const projectId = 'd0000000-0000-4000-8000-000000000100';
    await request(app.getHttpServer())
      .patch(`/projects/${projectId}`)
      .auth(token, { type: 'bearer' })
      .send({
        title: 'Visitor edits remain',
        updatedBy: 'visitor@demo.example',
      })
      .expect(200);
    await request(app.getHttpServer())
      .post('/projects')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'Visitor project',
        description: 'A new project',
        createdBy: 'visitor@demo.example',
      })
      .expect(201);
    const options = {
      cwd: join(__dirname, '..'),
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
      },
      encoding: 'utf8' as const,
    };
    const args = ['-r', 'ts-node/register', 'scripts/seed-demo.ts'];
    expect(
      JSON.parse(execFileSync(process.execPath, args, options)),
    ).toMatchObject({ status: 'unchanged', projects: 3, tickets: 36 });
    const edited = await request(app.getHttpServer())
      .get(`/projects/${projectId}`)
      .auth(token, { type: 'bearer' })
      .expect(200);
    expect((edited.body as ProjectView).title).toBe('Visitor edits remain');
    expect(
      spawnSync(process.execPath, [...args, '--reset'], options).status,
    ).not.toBe(0);
    const restored: unknown = JSON.parse(
      execFileSync(
        process.execPath,
        [...args, '--reset', '--confirm-demo-reset'],
        options,
      ),
    );
    expect(restored).toMatchObject({
      status: 'restored',
      projects: 2,
      tickets: 36,
      tasks: 72,
    });
    const original = await request(app.getHttpServer())
      .get(`/projects/${projectId}`)
      .auth(token, { type: 'bearer' })
      .expect(200);
    expect((original.body as ProjectView).title).toBe(
      'Orbit — Product Delivery',
    );
  }, 30000);
});
