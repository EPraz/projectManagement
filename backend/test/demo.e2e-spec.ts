import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { execFileSync, spawnSync } from 'child_process';
import { join } from 'path';
import { App } from 'supertest/types';
import { io } from 'socket.io-client';

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
type TaskProjectView = {
  id: string;
  taskStatuses: { id: string; name: string }[];
  tickets: {
    id: number;
    tasks: {
      id: number;
      statusId: string;
      assignedTo: string | null;
      updatedBy: string | null;
    }[];
  }[];
};

const databaseUrl = process.env.TEST_DATABASE_URL;
if (
  !databaseUrl ||
  !['127.0.0.1', 'localhost'].includes(new URL(databaseUrl).hostname) ||
  !/^\/[a-zA-Z0-9_]+_test$/.test(new URL(databaseUrl).pathname) ||
  [...new URL(databaseUrl).searchParams].some(
    ([key, value]) => key !== 'schema' || value !== 'public',
  )
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
    await app.listen(0, '127.0.0.1');
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

  it.each([
    '/users',
    '/projects',
    '/epics',
    '/features',
    '/tickets',
    '/tasks',
    '/sprints',
    '/sprint-goals/unknown',
    '/team-member-capacities',
    '/retrospectives',
  ])('requires an authenticated demo session for %s', async (path) => {
    await request(app.getHttpServer()).get(path).expect(401);
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

  it('attributes task changes to the authenticated demo session rather than the supplied actor', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const token = tokenOf(login);
    const projects = await request(app.getHttpServer())
      .get('/projects')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const project = (projects.body as TaskProjectView[])[0];
    const task = project.tickets[0].tasks[0];
    const target = project.taskStatuses.find(
      (status) => status.id !== task.statusId,
    )!;
    const updated = await request(app.getHttpServer())
      .patch(`/tasks/${task.id}`)
      .auth(token, { type: 'bearer' })
      .send({ id: task.id, statusId: target.id, updatedBy: 'xana@xana.com' })
      .expect(200);
    expect(updated.body).toMatchObject({
      id: task.id,
      statusId: target.id,
      updatedBy: 'visitor@demo.example',
      assignedTo: task.assignedTo,
      assignedUser: { id: task.assignedTo },
    });
    expect(JSON.stringify(updated.body)).not.toMatch(
      /"password"|"refreshToken"/,
    );
    const persisted = await request(app.getHttpServer())
      .get(`/tasks/${task.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200);
    expect(persisted.body).toMatchObject({
      statusId: target.id,
      updatedBy: 'visitor@demo.example',
    });
  });

  it('rejects task states from another project without changing the task', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const token = tokenOf(login);
    const projects = await request(app.getHttpServer())
      .get('/projects')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const [project, otherProject] = projects.body as TaskProjectView[];
    const task = project.tickets[0].tasks[0];
    await request(app.getHttpServer())
      .patch(`/tasks/${task.id}`)
      .auth(token, { type: 'bearer' })
      .send({
        id: task.id,
        statusId: otherProject.taskStatuses[0].id,
        updatedBy: 'visitor@demo.example',
      })
      .expect(400);
    const persisted = await request(app.getHttpServer())
      .get(`/tasks/${task.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200);
    expect(persisted.body).toMatchObject({ statusId: task.statusId });
  });

  it('publishes only a confirmed task update to an independent client and preserves rejected state', async () => {
    const firstLogin = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const secondLogin = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const token = tokenOf(firstLogin);
    const projects = await request(app.getHttpServer())
      .get('/projects')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const project = (projects.body as TaskProjectView[])[0];
    const ticket = project.tickets[0];
    const task = ticket.tasks[0];
    const target = project.taskStatuses.find(
      (status) => status.id !== task.statusId,
    )!;
    const observer = io(await app.getUrl(), {
      transports: ['websocket'],
      extraHeaders: { Origin: 'http://localhost:5173' },
      reconnection: false,
      autoConnect: false,
      timeout: 5000,
    });
    const events: TaskProjectView['tickets'][number][] = [];
    let timer: NodeJS.Timeout | undefined;
    try {
      await new Promise<void>((resolve, reject) => {
        observer.once('connect', resolve);
        observer.once('connect_error', reject);
        observer.connect();
      });
      const confirmed = new Promise<TaskProjectView['tickets'][number]>(
        (resolve, reject) => {
          timer = setTimeout(
            () => reject(new Error('Confirmed task event was not received')),
            5000,
          );
          observer.on(
            'ticketUpdated',
            (event: TaskProjectView['tickets'][number]) => {
              events.push(event);
              if (
                event.id === ticket.id &&
                event.tasks.some(
                  (changed) =>
                    changed.id === task.id && changed.statusId === target.id,
                )
              )
                resolve(event);
            },
          );
        },
      );
      // Attach rejection immediately so failed HTTP assertions cannot leave an unhandled timer.
      void confirmed.catch(() => undefined);
      await request(app.getHttpServer())
        .patch(`/tasks/${task.id}`)
        .auth(token, { type: 'bearer' })
        .send({
          id: task.id,
          statusId: 'missing-task-status',
          updatedBy: 'visitor@demo.example',
        })
        .expect(404);
      await request(app.getHttpServer())
        .patch(`/tasks/${task.id}`)
        .auth(token, { type: 'bearer' })
        .send({
          id: task.id,
          ticketId: project.tickets[1].id,
          updatedBy: 'visitor@demo.example',
        })
        .expect(400);
      await request(app.getHttpServer())
        .patch(`/tasks/${task.id}`)
        .send({
          id: task.id,
          statusId: target.id,
          updatedBy: 'visitor@demo.example',
        })
        .expect(401);
      const unchanged = await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .auth(tokenOf(secondLogin), { type: 'bearer' })
        .expect(200);
      expect(unchanged.body).toMatchObject({ statusId: task.statusId });
      await request(app.getHttpServer())
        .patch(`/tasks/${task.id}`)
        .auth(token, { type: 'bearer' })
        .send({
          id: task.id,
          statusId: target.id,
          updatedBy: 'spoofed@example.com',
        })
        .expect(200);
      const event = await confirmed;
      expect(events).toHaveLength(1);
      expect(event.tasks).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: task.id,
            statusId: target.id,
            updatedBy: 'visitor@demo.example',
          }),
        ]),
      );
      expect(JSON.stringify(event)).not.toMatch(/"password"|"refreshToken"/);
      const persisted = await request(app.getHttpServer())
        .get(`/tasks/${task.id}`)
        .auth(tokenOf(secondLogin), { type: 'bearer' })
        .expect(200);
      expect(persisted.body).toMatchObject({
        statusId: target.id,
        updatedBy: 'visitor@demo.example',
        assignedTo: task.assignedTo,
      });
    } finally {
      clearTimeout(timer);
      observer.disconnect();
    }
  });

  it('publishes ticket deletion only after a fresh read confirms it is gone', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const token = tokenOf(login);
    const ticket = await prisma.ticket.create({
      data: {
        title: 'Isolated delayed deletion',
        createdBy: 'visitor@demo.example',
      },
    });
    const observer = io(await app.getUrl(), {
      transports: ['websocket'],
      extraHeaders: { Origin: 'http://localhost:5173' },
      reconnection: false,
      autoConnect: false,
      timeout: 5000,
    });
    let timer: NodeJS.Timeout | undefined;
    try {
      // A test-only database delay exposes reads racing the DELETE commit.
      await prisma.$executeRawUnsafe(`CREATE FUNCTION quality_delay_ticket_delete()
        RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN
        PERFORM pg_sleep(1); RETURN OLD; END $$`);
      await prisma.$executeRawUnsafe(`CREATE TRIGGER quality_delay_ticket_delete
        BEFORE DELETE ON "Ticket" FOR EACH ROW WHEN (OLD.id = ${ticket.id})
        EXECUTE FUNCTION quality_delay_ticket_delete()`);
      await new Promise<void>((resolve, reject) => {
        observer.once('connect', resolve);
        observer.once('connect_error', reject);
        observer.connect();
      });
      const readAfterEvent = new Promise<number>((resolve, reject) => {
        timer = setTimeout(
          () => reject(new Error('Ticket deletion event missing')),
          5000,
        );
        observer.on('ticketDeleted', (event: { id: number }) => {
          if (event.id !== ticket.id) return;
          void request(app.getHttpServer())
            .get(`/tickets/${ticket.id}`)
            .auth(token, { type: 'bearer' })
            .then((response) => resolve(response.status), reject);
        });
      });
      void readAfterEvent.catch(() => undefined);
      await request(app.getHttpServer())
        .delete(`/tickets/${ticket.id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(await readAfterEvent).toBe(404);
    } finally {
      clearTimeout(timer);
      observer.disconnect();
      await prisma.$executeRawUnsafe(
        'DROP TRIGGER IF EXISTS quality_delay_ticket_delete ON "Ticket"',
      );
      await prisma.$executeRawUnsafe(
        'DROP FUNCTION IF EXISTS quality_delay_ticket_delete()',
      );
      await prisma.ticket.deleteMany({ where: { id: ticket.id } });
    }
  });

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
