import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { createValidationPipe } from '../src/validation';
import { PrismaClient } from '@prisma/client';
import * as request from 'supertest';
import * as cookieParser from 'cookie-parser';
import { execFileSync, spawnSync } from 'child_process';
import { join } from 'path';
import { App } from 'supertest/types';
import { io } from 'socket.io-client';

const tokenOf = (response: { body: unknown }) =>
  (response.body as { accessToken: string }).accessToken;
const idOf = (response: { body: unknown }) =>
  (response.body as { id: string }).id;
type PlanningGoalView = {
  id: string;
  title: string;
  progress: number;
  goalsStatus: string;
  goalTask: { id: string; title: string; completed: boolean }[];
};
const planningGoalsOf = (response: { body: unknown }) =>
  response.body as PlanningGoalView[];
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
    app.useGlobalPipes(createValidationPipe());
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

  it('attributes retrospective cards to the authenticated demo instead of a supplied author', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const token = tokenOf(login);
    const projects = await request(app.getHttpServer())
      .get('/projects')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const sprintId = (projects.body as { sprints: { id: string }[] }[])[0]
      .sprints[0].id;
    const users = await request(app.getHttpServer())
      .get('/users')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const other = (users.body as { id: string }[]).find(
      (user) => user.id !== demoId,
    )!;
    const created = await request(app.getHttpServer())
      .post('/retrospectives')
      .auth(token, { type: 'bearer' })
      .send({
        sprintId,
        authorId: other.id,
        content: 'Authenticated retrospective attribution',
        type: 'IMPROVEMENT',
      })
      .expect(201);
    try {
      expect(created.body).toMatchObject({
        authorId: demoId,
        sprintId,
        type: 'IMPROVEMENT',
      });
      const saved = await request(app.getHttpServer())
        .get(`/retrospectives/${idOf(created)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(saved.body).toMatchObject({ authorId: demoId });
      expect(JSON.stringify(saved.body)).not.toMatch(/password|refreshToken/);
    } finally {
      await request(app.getHttpServer())
        .delete(`/retrospectives/${idOf(created)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
    }
  });

  it('validates retrospective drafts, scope and immutable relationships', async () => {
    const token = tokenOf(
      await request(app.getHttpServer()).post('/auth/instant-login').send({}),
    );
    const projects = await request(app.getHttpServer())
      .get('/projects')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const [project, otherProject] = projects.body as {
      sprints: { id: string }[];
    }[];
    const sprintId = project.sprints[0].id;
    for (const path of [
      '/retrospectives',
      '/retrospectives?sprintId=',
      '/retrospectives?sprintId=a&sprintId=b',
    ])
      await request(app.getHttpServer())
        .get(path)
        .auth(token, { type: 'bearer' })
        .expect(400);
    await request(app.getHttpServer())
      .get('/retrospectives?sprintId=missing')
      .auth(token, { type: 'bearer' })
      .expect(404);
    for (const invalid of [
      { content: '   ' },
      { type: 'OTHER' },
      { content: null },
    ])
      await request(app.getHttpServer())
        .post('/retrospectives')
        .auth(token, { type: 'bearer' })
        .send({ sprintId, content: 'Feedback', type: 'POSITIVE', ...invalid })
        .expect(400);
    await request(app.getHttpServer())
      .post('/retrospectives')
      .auth(token, { type: 'bearer' })
      .send({ sprintId: 'missing', content: 'Feedback', type: 'POSITIVE' })
      .expect(404);
    const created = await request(app.getHttpServer())
      .post('/retrospectives')
      .auth(token, { type: 'bearer' })
      .send({ sprintId, content: '  Retained feedback  ', type: 'NEGATIVE' })
      .expect(201);
    try {
      expect(created.body).toMatchObject({
        authorId: demoId,
        content: 'Retained feedback',
        likes: 0,
        likedBy: [],
      });
      for (const invalid of [
        { content: '   ' },
        { content: null },
        { type: null },
        { liked: 'true' },
        { liked: 'false' },
        { liked: null },
        { likedBy: null },
        { likes: -1 },
        { authorId: 'missing' },
        { sprintId: otherProject.sprints[0].id },
        { liked: true, likedBy: [] },
      ])
        await request(app.getHttpServer())
          .patch(`/retrospectives/${idOf(created)}`)
          .auth(token, { type: 'bearer' })
          .send(invalid)
          .expect(400);
      const edited = await request(app.getHttpServer())
        .patch(`/retrospectives/${idOf(created)}`)
        .auth(token, { type: 'bearer' })
        .send({ content: '  Confirmed feedback  ', type: 'IMPROVEMENT' })
        .expect(200);
      expect(edited.body).toMatchObject({
        content: 'Confirmed feedback',
        type: 'IMPROVEMENT',
        authorId: demoId,
        sprintId,
      });
      const list = await request(app.getHttpServer())
        .get(`/retrospectives?sprintId=${sprintId}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(list.body).toContainEqual(
        expect.objectContaining({
          id: idOf(created),
          content: 'Confirmed feedback',
        }),
      );
      expect(JSON.stringify(list.body)).not.toMatch(
        /"password"|"refreshToken"/,
      );
    } finally {
      await request(app.getHttpServer())
        .delete(`/retrospectives/${idOf(created)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
    }
    await request(app.getHttpServer())
      .patch('/retrospectives/missing')
      .auth(token, { type: 'bearer' })
      .send({ content: 'Feedback' })
      .expect(404);
    await request(app.getHttpServer())
      .delete('/retrospectives/missing')
      .auth(token, { type: 'bearer' })
      .expect(404);
  });

  it('preserves ISO date updates through the shared strict bootstrap validation', async () => {
    const token = tokenOf(
      await request(app.getHttpServer()).post('/auth/instant-login').send({}),
    );
    const projects = await request(app.getHttpServer())
      .get('/projects')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const projectId = (projects.body as { id: string }[])[0].id;
    const created = await request(app.getHttpServer())
      .post('/sprints')
      .auth(token, { type: 'bearer' })
      .send({
        projectId,
        name: 'Isolated ISO date update fixture',
        startDate: '2026-10-17T00:00:00Z',
        endDate: '2026-10-31T00:00:00Z',
        createdBy: 'visitor@demo.example',
      })
      .expect(201);
    try {
      const updated = await request(app.getHttpServer())
        .patch(`/sprints/${idOf(created)}`)
        .auth(token, { type: 'bearer' })
        .send({
          projectId,
          startDate: '2026-11-01T00:00:00Z',
          endDate: '2026-11-15T00:00:00Z',
        })
        .expect(200);
      expect(updated.body).toMatchObject({
        startDate: '2026-11-01T00:00:00.000Z',
        endDate: '2026-11-15T00:00:00.000Z',
      });
      await request(app.getHttpServer())
        .patch(`/sprints/${idOf(created)}`)
        .auth(token, { type: 'bearer' })
        .send({ projectId, startDate: 'invalid' })
        .expect(400);
      const saved = await request(app.getHttpServer())
        .get(`/sprints/${idOf(created)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(saved.body).toMatchObject({
        startDate: '2026-11-01T00:00:00.000Z',
        endDate: '2026-11-15T00:00:00.000Z',
      });
    } finally {
      await request(app.getHttpServer())
        .delete(`/sprints/${idOf(created)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
    }
  });

  it('preserves other reactions, makes shared-demo likes idempotent and publishes committed retrospective state', async () => {
    const token = tokenOf(
      await request(app.getHttpServer()).post('/auth/instant-login').send({}),
    );
    const otherToken = tokenOf(
      await request(app.getHttpServer()).post('/auth/instant-login').send({}),
    );
    const projects = await request(app.getHttpServer())
      .get('/projects')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const sprintId = (projects.body as { sprints: { id: string }[] }[])[0]
      .sprints[0].id;
    const otherUser = await prisma.user.findFirstOrThrow({
      where: { id: { not: demoId } },
    });
    // Fictional pre-existing reaction belongs to this isolated fixture only.
    const card = await prisma.retroCard.create({
      data: {
        content: 'Reaction concurrency fixture',
        type: 'POSITIVE',
        authorId: demoId,
        sprintId,
        likedBy: [otherUser.id],
        likes: 1,
      },
    });
    const observer = io(await app.getUrl(), {
      transports: ['websocket'],
      extraHeaders: { Origin: 'http://localhost:5173' },
      autoConnect: false,
      reconnection: false,
      timeout: 5000,
    });
    const events: {
      id: string;
      retroCard: { id: string; likes: number; likedBy: string[] }[];
    }[] = [];
    try {
      await new Promise<void>((resolve, reject) => {
        observer.once('connect', resolve);
        observer.once('connect_error', reject);
        observer.connect();
      });
      observer.on('sprintUpdated', (event: (typeof events)[number]) => {
        if (event.id === sprintId) events.push(event);
      });
      await Promise.all(
        [token, otherToken].map((session) =>
          request(app.getHttpServer())
            .patch(`/retrospectives/${card.id}`)
            .auth(session, { type: 'bearer' })
            .send({ liked: true })
            .expect(200),
        ),
      );
      const saved = await request(app.getHttpServer())
        .get(`/retrospectives/${card.id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(saved.body).toMatchObject({ likes: 2 });
      expect((saved.body as { likedBy: string[] }).likedBy).toEqual(
        expect.arrayContaining([otherUser.id, demoId]),
      );
      // The already deployed client submits its old whole-array snapshot. It may
      // change its own intent, but cannot erase or impersonate other reactions.
      const unliked = await request(app.getHttpServer())
        .patch(`/retrospectives/${card.id}`)
        .auth(token, { type: 'bearer' })
        .send({ likedBy: ['spoofed-id'], likes: 99 })
        .expect(200);
      expect(unliked.body).toMatchObject({ likes: 1, likedBy: [otherUser.id] });
      await request(app.getHttpServer())
        .delete(`/retrospectives/${card.id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      await request(app.getHttpServer())
        .get(`/retrospectives/${card.id}`)
        .auth(otherToken, { type: 'bearer' })
        .expect(404);
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(events).toHaveLength(4);
      expect(
        events[0].retroCard.find((item) => item.id === card.id),
      ).toMatchObject({ likes: 2 });
      expect(
        events[1].retroCard.find((item) => item.id === card.id),
      ).toMatchObject({ likes: 2 });
      expect(
        events[2].retroCard.find((item) => item.id === card.id),
      ).toMatchObject({ likes: 1, likedBy: [otherUser.id] });
      expect(events[3].retroCard.some((item) => item.id === card.id)).toBe(
        false,
      );
      expect(JSON.stringify(events)).not.toMatch(/"password"|"refreshToken"/);
    } finally {
      observer.disconnect();
      await prisma.retroCard.deleteMany({ where: { id: card.id } });
    }
  });

  it('validates project membership removals and preserves confirmed user lists', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const token = tokenOf(login);
    const users = await request(app.getHttpServer())
      .get('/users')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const outsider = (users.body as { id: string }[]).find(
      (user) => user.id !== demoId,
    )!;
    const project = await request(app.getHttpServer())
      .post('/projects')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'Isolated membership removal fixture',
        description: 'Temporary HTTP fixture',
        createdBy: 'visitor@demo.example',
      })
      .expect(201);
    try {
      await request(app.getHttpServer())
        .delete(`/projects/${idOf(project)}/users/missing`)
        .auth(token, { type: 'bearer' })
        .expect(404);
      await request(app.getHttpServer())
        .delete(`/projects/${idOf(project)}/users/${outsider.id}`)
        .auth(token, { type: 'bearer' })
        .expect(404);
      await request(app.getHttpServer())
        .post(`/projects/${idOf(project)}/users/missing`)
        .auth(token, { type: 'bearer' })
        .expect(404);
      await request(app.getHttpServer())
        .post(`/projects/${idOf(project)}/users/${outsider.id}`)
        .auth(token, { type: 'bearer' })
        .expect(201);
      await request(app.getHttpServer())
        .post(`/projects/${idOf(project)}/users/${outsider.id}`)
        .auth(token, { type: 'bearer' })
        .expect(409);
      const removed = await request(app.getHttpServer())
        .delete(`/projects/${idOf(project)}/users/${outsider.id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(removed.body).toEqual([expect.objectContaining({ id: demoId })]);
      const saved = await request(app.getHttpServer())
        .get(`/projects/${idOf(project)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect((saved.body as { users: { id: string }[] }).users).toEqual([
        expect.objectContaining({ id: demoId }),
      ]);
    } finally {
      await request(app.getHttpServer())
        .delete(`/projects/${idOf(project)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
    }
  });

  it('validates capacity numbers, duplicates and missing scope without partial changes', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const token = tokenOf(login);
    const project = await request(app.getHttpServer())
      .post('/projects')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'Isolated numeric capacity fixture',
        description: 'Temporary HTTP fixture',
        createdBy: 'visitor@demo.example',
      })
      .expect(201);
    try {
      const sprint = await request(app.getHttpServer())
        .post('/sprints')
        .auth(token, { type: 'bearer' })
        .send({
          projectId: idOf(project),
          name: 'Numeric capacity sprint',
          startDate: '2026-10-17T00:00:00Z',
          endDate: '2026-10-31T00:00:00Z',
          createdBy: 'visitor@demo.example',
        })
        .expect(201);
      const valid = {
        sprintId: idOf(sprint),
        userId: demoId,
        capacity: 40,
        daysOff: 1,
        remainingWork: 20,
      };
      for (const invalid of [
        { capacity: 2147483648 },
        { capacity: 0 },
        { capacity: -1 },
        { capacity: 1.5 },
        { daysOff: -1 },
        { daysOff: 0.5 },
        { remainingWork: -1 },
        { remainingWork: 41 },
        { daysOff: 2147483648 },
        { remainingWork: 2147483648 },
        { capacity: null },
      ]) {
        await request(app.getHttpServer())
          .post('/team-member-capacities')
          .auth(token, { type: 'bearer' })
          .send({ ...valid, ...invalid })
          .expect(400);
      }
      await request(app.getHttpServer())
        .get('/team-member-capacities?sprintId=first&sprintId=second')
        .auth(token, { type: 'bearer' })
        .expect(400);
      await request(app.getHttpServer())
        .get('/team-member-capacities')
        .auth(token, { type: 'bearer' })
        .expect(400);
      await request(app.getHttpServer())
        .get('/team-member-capacities?sprintId=missing')
        .auth(token, { type: 'bearer' })
        .expect(404);
      await request(app.getHttpServer())
        .post('/team-member-capacities')
        .auth(token, { type: 'bearer' })
        .send({ ...valid, userId: 'missing' })
        .expect(404);
      const parallel = await Promise.all(
        [1, 2].map(() =>
          request(app.getHttpServer())
            .post('/team-member-capacities')
            .auth(token, { type: 'bearer' })
            .send(valid),
        ),
      );
      expect(parallel.map((response) => response.status).sort()).toEqual([
        201, 409,
      ]);
      const created = parallel.find((response) => response.status === 201)!;
      for (const invalid of [
        { capacity: 2147483648 },
        { capacity: 10 },
        { daysOff: -1 },
        { remainingWork: 41 },
        { daysOff: 2147483648 },
        { remainingWork: 2147483648 },
        { capacity: null },
        { sprintId: 'missing' },
        { userId: 'missing' },
      ]) {
        await request(app.getHttpServer())
          .patch(`/team-member-capacities/${idOf(created)}`)
          .auth(token, { type: 'bearer' })
          .send(invalid)
          .expect(400);
      }
      const saved = await request(app.getHttpServer())
        .get(`/team-member-capacities/${idOf(created)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(saved.body).toMatchObject(valid);
    } finally {
      await request(app.getHttpServer())
        .delete(`/projects/${idOf(project)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
    }
  });

  it('requires a sprint capacity user to belong to its project before saving', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const token = tokenOf(login);
    const users = await request(app.getHttpServer())
      .get('/users')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const outsider = (users.body as { id: string }[]).find(
      (user) => user.id !== demoId,
    )!;
    const project = await request(app.getHttpServer())
      .post('/projects')
      .auth(token, { type: 'bearer' })
      .send({
        title: 'Isolated capacity membership fixture',
        description: 'Temporary HTTP fixture',
        createdBy: 'visitor@demo.example',
      })
      .expect(201);
    try {
      const sprint = await request(app.getHttpServer())
        .post('/sprints')
        .auth(token, { type: 'bearer' })
        .send({
          projectId: idOf(project),
          name: 'Membership capacity sprint',
          startDate: '2026-10-17T00:00:00Z',
          endDate: '2026-10-31T00:00:00Z',
          createdBy: 'visitor@demo.example',
        })
        .expect(201);
      const data = {
        sprintId: idOf(sprint),
        userId: outsider.id,
        capacity: 40,
        daysOff: 1,
        remainingWork: 20,
      };
      await request(app.getHttpServer())
        .post('/team-member-capacities')
        .auth(token, { type: 'bearer' })
        .send(data)
        .expect(400);
      const empty = await request(app.getHttpServer())
        .get(`/team-member-capacities?sprintId=${idOf(sprint)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(empty.body).toEqual([]);
      await request(app.getHttpServer())
        .post(`/projects/${idOf(project)}/users/${outsider.id}`)
        .auth(token, { type: 'bearer' })
        .expect(201);
      const capacity = await request(app.getHttpServer())
        .post('/team-member-capacities')
        .auth(token, { type: 'bearer' })
        .send(data)
        .expect(201);
      expect(capacity.body).toMatchObject(data);
      expect(JSON.stringify(capacity.body)).not.toMatch(
        /password|refreshToken/,
      );
    } finally {
      await request(app.getHttpServer())
        .delete(`/projects/${idOf(project)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
    }
  });

  it('rejects malformed planning values and missing parents without changing persisted goals', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const token = tokenOf(login);
    const projects = await request(app.getHttpServer())
      .get('/projects')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const project = (
      projects.body as { id: string; sprints: { id: string }[] }[]
    )[0];
    const sprintId = project.sprints[0].id;
    await request(app.getHttpServer())
      .post('/sprints')
      .auth(token, { type: 'bearer' })
      .send({
        projectId: project.id,
        name: '   ',
        startDate: '2026-10-17T00:00:00Z',
        endDate: '2026-10-31T00:00:00Z',
        createdBy: 'visitor@demo.example',
      })
      .expect(400);
    await request(app.getHttpServer())
      .post('/sprints')
      .auth(token, { type: 'bearer' })
      .send({
        projectId: project.id,
        name: 'Invalid dates',
        startDate: '2026-10-31T00:00:00Z',
        endDate: '2026-10-17T00:00:00Z',
        createdBy: 'visitor@demo.example',
      })
      .expect(400);
    await request(app.getHttpServer())
      .post('/sprint-goals')
      .auth(token, { type: 'bearer' })
      .send({ sprintId, title: '   ' })
      .expect(400);
    await request(app.getHttpServer())
      .get('/sprint-goals/not-a-sprint')
      .auth(token, { type: 'bearer' })
      .expect(404);
    await request(app.getHttpServer())
      .post('/sprint-goals')
      .auth(token, { type: 'bearer' })
      .send({ sprintId: 'missing', title: 'Missing parent' })
      .expect(404);
    await request(app.getHttpServer())
      .post('/sprint-goals/goalTask')
      .auth(token, { type: 'bearer' })
      .send({ goalId: 'missing', title: 'Missing parent' })
      .expect(404);
    const goals = await request(app.getHttpServer())
      .get(`/sprint-goals/${sprintId}`)
      .auth(token, { type: 'bearer' })
      .expect(200);
    const goal = planningGoalsOf(goals)[0];
    const task = goal.goalTask[0];
    for (const completed of ['true', 1, null]) {
      await request(app.getHttpServer())
        .patch(`/sprint-goals/goalTask/${task.id}`)
        .auth(token, { type: 'bearer' })
        .send({ id: task.id, completed })
        .expect(400);
    }
    await request(app.getHttpServer())
      .patch(`/sprint-goals/${goal.id}`)
      .auth(token, { type: 'bearer' })
      .send({ id: goal.id, title: ' ' })
      .expect(400);
    const after = await request(app.getHttpServer())
      .get(`/sprint-goals/${sprintId}`)
      .auth(token, { type: 'bearer' })
      .expect(200);
    expect(after.body).toEqual(goals.body);
  });

  it('preserves both different-goal changes in the last confirmed sprint event', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const token = tokenOf(login);
    const projects = await request(app.getHttpServer())
      .get('/projects')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const sprint = await request(app.getHttpServer())
      .post('/sprints')
      .auth(token, { type: 'bearer' })
      .send({
        projectId: (projects.body as { id: string }[])[0].id,
        name: 'Concurrent goal sprint',
        startDate: '2026-10-17T00:00:00Z',
        endDate: '2026-10-31T00:00:00Z',
        createdBy: 'visitor@demo.example',
      })
      .expect(201);
    const observer = io(await app.getUrl(), {
      transports: ['websocket'],
      extraHeaders: { Origin: 'http://localhost:5173' },
      reconnection: false,
      autoConnect: false,
      timeout: 5000,
    });
    const events: { id: string; sprintGoal: PlanningGoalView[] }[] = [];
    const removeDelay = async () => {
      await prisma.$executeRawUnsafe(
        'DROP TRIGGER IF EXISTS quality_delay_goal_commit ON "SprintGoal"',
      );
      await prisma.$executeRawUnsafe(
        'DROP FUNCTION IF EXISTS quality_delay_goal_commit()',
      );
    };
    try {
      const tasks: string[] = [];
      for (const title of ['Concurrent goal A', 'Concurrent goal B']) {
        const goal = await request(app.getHttpServer())
          .post('/sprint-goals')
          .auth(token, { type: 'bearer' })
          .send({ sprintId: idOf(sprint), title })
          .expect(201);
        const task = await request(app.getHttpServer())
          .post('/sprint-goals/goalTask')
          .auth(token, { type: 'bearer' })
          .send({ goalId: idOf(goal), title: 'Concurrent checkpoint' })
          .expect(201);
        tasks.push(idOf(task));
      }
      await new Promise<void>((resolve, reject) => {
        observer.once('connect', resolve);
        observer.once('connect_error', reject);
        observer.connect();
      });
      observer.on('sprintUpdated', (event: (typeof events)[number]) => {
        if (event.id === idOf(sprint)) events.push(event);
      });
      // Both snapshots are captured before their independent commit delays finish.
      // This fault is confined to this guarded local database and these two goals.
      await prisma.$executeRawUnsafe(
        `CREATE FUNCTION quality_delay_goal_commit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN PERFORM pg_sleep(0.4); RETURN NEW; END; $$`,
      );
      await prisma.$executeRawUnsafe(
        `CREATE CONSTRAINT TRIGGER quality_delay_goal_commit AFTER UPDATE ON "SprintGoal" DEFERRABLE INITIALLY DEFERRED FOR EACH ROW WHEN (NEW.title IN ('Concurrent goal A','Concurrent goal B')) EXECUTE FUNCTION quality_delay_goal_commit()`,
      );
      await Promise.all(
        tasks.map((id) =>
          request(app.getHttpServer())
            .patch(`/sprint-goals/goalTask/${id}`)
            .auth(token, { type: 'bearer' })
            .send({ id, completed: true })
            .expect(200),
        ),
      );
      const saved = await request(app.getHttpServer())
        .get(`/sprint-goals/${idOf(sprint)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(planningGoalsOf(saved).map((goal) => goal.progress)).toEqual([
        100, 100,
      ]);
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(events).toHaveLength(2);
      expect(events[1].sprintGoal.map((goal) => goal.progress)).toEqual([
        100, 100,
      ]);
    } finally {
      observer.disconnect();
      await removeDelay();
      await request(app.getHttpServer())
        .delete(`/sprints/${idOf(sprint)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
    }
  });

  it('rolls back a failed checklist aggregate and emits only committed results to another client', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const token = tokenOf(login);
    const projects = await request(app.getHttpServer())
      .get('/projects')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const sprint = await request(app.getHttpServer())
      .post('/sprints')
      .auth(token, { type: 'bearer' })
      .send({
        projectId: (projects.body as { id: string }[])[0].id,
        name: 'Atomic planning sprint',
        startDate: '2026-10-17T00:00:00Z',
        endDate: '2026-10-31T00:00:00Z',
        createdBy: 'visitor@demo.example',
      })
      .expect(201);
    const observer = io(await app.getUrl(), {
      transports: ['websocket'],
      extraHeaders: { Origin: 'http://localhost:5173' },
      reconnection: false,
      autoConnect: false,
      timeout: 5000,
    });
    const events: {
      id: string;
      sprintGoal: {
        id: string;
        progress: number;
        goalTask: { id: string; completed: boolean }[];
      }[];
    }[] = [];
    const removeFault = async () => {
      await prisma.$executeRawUnsafe(
        'DROP TRIGGER IF EXISTS quality_fail_goal_rollup ON "SprintGoal"',
      );
      await prisma.$executeRawUnsafe(
        'DROP FUNCTION IF EXISTS quality_fail_goal_rollup()',
      );
    };
    try {
      const goal = await request(app.getHttpServer())
        .post('/sprint-goals')
        .auth(token, { type: 'bearer' })
        .send({ sprintId: idOf(sprint), title: 'Atomic planning fixture' })
        .expect(201);
      const tasks: string[] = [];
      for (const title of ['Atomic one', 'Atomic two']) {
        const task = await request(app.getHttpServer())
          .post('/sprint-goals/goalTask')
          .auth(token, { type: 'bearer' })
          .send({ goalId: idOf(goal), title })
          .expect(201);
        tasks.push(idOf(task));
      }
      await new Promise<void>((resolve, reject) => {
        observer.once('connect', resolve);
        observer.once('connect_error', reject);
        observer.connect();
      });
      observer.on('sprintUpdated', (event: (typeof events)[number]) => {
        if (event.id === idOf(sprint)) events.push(event);
      });
      await prisma.$executeRawUnsafe(
        `CREATE FUNCTION quality_fail_goal_rollup() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Isolated aggregate failure'; END; $$`,
      );
      await prisma.$executeRawUnsafe(
        `CREATE TRIGGER quality_fail_goal_rollup BEFORE UPDATE ON "SprintGoal" FOR EACH ROW WHEN (OLD.title = 'Atomic planning fixture') EXECUTE FUNCTION quality_fail_goal_rollup()`,
      );
      await request(app.getHttpServer())
        .patch(`/sprint-goals/goalTask/${tasks[0]}`)
        .auth(token, { type: 'bearer' })
        .send({ id: tasks[0], completed: true })
        .expect(500);
      const after = await request(app.getHttpServer())
        .get(`/sprint-goals/${idOf(sprint)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(planningGoalsOf(after)[0]).toMatchObject({
        progress: 0,
        goalsStatus: 'IN_PROGRESS',
      });
      expect(planningGoalsOf(after)[0].goalTask).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: tasks[0], completed: false }),
        ]),
      );
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(events).toHaveLength(0);
      await removeFault();
      await Promise.all(
        tasks.map((id) =>
          request(app.getHttpServer())
            .patch(`/sprint-goals/goalTask/${id}`)
            .auth(token, { type: 'bearer' })
            .send({ id, completed: true })
            .expect(200),
        ),
      );
      const confirmed = await request(app.getHttpServer())
        .get(`/sprint-goals/${idOf(sprint)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(planningGoalsOf(confirmed)[0]).toMatchObject({
        progress: 100,
        goalsStatus: 'COMPLETED',
      });
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(events).toHaveLength(2);
      expect(
        events
          .map(
            (event) =>
              event.sprintGoal.find((item) => item.id === idOf(goal))!.progress,
          )
          .sort((a, b) => a - b),
      ).toEqual([50, 100]);
      expect(JSON.stringify(events)).not.toMatch(/password|refreshToken/);
      await request(app.getHttpServer())
        .delete(`/sprint-goals/goalTask/${tasks[0]}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(events).toHaveLength(3);
      expect(events[2].sprintGoal[0].goalTask).toEqual([
        expect.objectContaining({ id: tasks[1] }),
      ]);
    } finally {
      observer.disconnect();
      await removeFault();
      await request(app.getHttpServer())
        .delete(`/sprints/${idOf(sprint)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
    }
  });

  it('keeps checklist progress and status consistent through persisted task changes', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const token = tokenOf(login);
    const projects = await request(app.getHttpServer())
      .get('/projects')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const sprint = await request(app.getHttpServer())
      .post('/sprints')
      .auth(token, { type: 'bearer' })
      .send({
        projectId: (projects.body as { id: string }[])[0].id,
        name: 'Isolated planning workflow',
        startDate: '2026-10-17T00:00:00.000Z',
        endDate: '2026-10-31T00:00:00.000Z',
        createdBy: 'visitor@demo.example',
      })
      .expect(201);
    try {
      const goal = await request(app.getHttpServer())
        .post('/sprint-goals')
        .auth(token, { type: 'bearer' })
        .send({ sprintId: idOf(sprint), title: 'Confirmed checklist' })
        .expect(201);
      const tasks: string[] = [];
      for (const title of ['First checkpoint', 'Second checkpoint']) {
        const task = await request(app.getHttpServer())
          .post('/sprint-goals/goalTask')
          .auth(token, { type: 'bearer' })
          .send({ goalId: idOf(goal), title })
          .expect(201);
        tasks.push(idOf(task));
      }
      const read = async () =>
        planningGoalsOf(
          await request(app.getHttpServer())
            .get(`/sprint-goals/${idOf(sprint)}`)
            .auth(token, { type: 'bearer' })
            .expect(200),
        )[0];
      await request(app.getHttpServer())
        .patch(`/sprint-goals/goalTask/${tasks[0]}`)
        .auth(token, { type: 'bearer' })
        .send({ id: tasks[0], completed: true })
        .expect(200);
      expect(await read()).toMatchObject({
        progress: 50,
        goalsStatus: 'IN_PROGRESS',
      });
      await request(app.getHttpServer())
        .patch(`/sprint-goals/goalTask/${tasks[1]}`)
        .auth(token, { type: 'bearer' })
        .send({ id: tasks[1], completed: true })
        .expect(200);
      expect(await read()).toMatchObject({
        progress: 100,
        goalsStatus: 'COMPLETED',
      });
      await request(app.getHttpServer())
        .patch(`/sprint-goals/goalTask/${tasks[0]}`)
        .auth(token, { type: 'bearer' })
        .send({ id: tasks[0], completed: false })
        .expect(200);
      expect(await read()).toMatchObject({
        progress: 50,
        goalsStatus: 'IN_PROGRESS',
      });
      await request(app.getHttpServer())
        .delete(`/sprint-goals/goalTask/${tasks[0]}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(await read()).toMatchObject({
        progress: 100,
        goalsStatus: 'COMPLETED',
      });
      await request(app.getHttpServer())
        .delete(`/sprint-goals/goalTask/${tasks[1]}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(await read()).toMatchObject({
        progress: 0,
        goalsStatus: 'IN_PROGRESS',
        goalTask: [],
      });
    } finally {
      await request(app.getHttpServer())
        .delete(`/sprints/${idOf(sprint)}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
    }
  });

  it('reads and edits the real project hierarchy without breaking parent-child associations', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const token = tokenOf(login);
    const projects = await request(app.getHttpServer())
      .get('/projects')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const [project, other] = projects.body as {
      id: string;
      epics: { id: string; features: { id: string }[] }[];
      featureStatuses: { id: string }[];
    }[];
    const epics = await request(app.getHttpServer())
      .get('/epics')
      .query({ projectId: project.id })
      .auth(token, { type: 'bearer' })
      .expect(200);
    expect(epics.body).toHaveLength(project.epics.length);
    await request(app.getHttpServer())
      .post('/epics')
      .auth(token, { type: 'bearer' })
      .send({
        projectId: project.id,
        title: '   ',
        createdBy: 'visitor@demo.example',
      })
      .expect(400);
    await request(app.getHttpServer())
      .get('/epics')
      .auth(token, { type: 'bearer' })
      .expect(400);
    await request(app.getHttpServer())
      .get('/epics')
      .query({ projectId: 'missing' })
      .auth(token, { type: 'bearer' })
      .expect(404);
    await request(app.getHttpServer())
      .get('/features')
      .auth(token, { type: 'bearer' })
      .expect(400);
    await request(app.getHttpServer())
      .get('/features')
      .query({ epicId: 'missing' })
      .auth(token, { type: 'bearer' })
      .expect(404);
    await request(app.getHttpServer())
      .post('/features')
      .auth(token, { type: 'bearer' })
      .send({
        epicId: 'missing',
        title: 'Missing parent fixture',
        createdBy: 'visitor@demo.example',
      })
      .expect(404);
    const created = await request(app.getHttpServer())
      .post('/epics')
      .auth(token, { type: 'bearer' })
      .send({
        projectId: project.id,
        title: `Isolated hierarchy ${Date.now()}`,
        createdBy: 'visitor@demo.example',
      })
      .expect(201);
    const epic = created.body as { id: string; title: string };
    try {
      const changed = await request(app.getHttpServer())
        .patch(`/epics/${epic.id}`)
        .auth(token, { type: 'bearer' })
        .send({
          projectId: project.id,
          title: epic.title,
          description: 'Description changed without renaming',
          updatedBy: 'visitor@demo.example',
        })
        .expect(200);
      expect(changed.body).toMatchObject({
        id: epic.id,
        description: 'Description changed without renaming',
      });
      await request(app.getHttpServer())
        .patch(`/epics/${epic.id}`)
        .auth(token, { type: 'bearer' })
        .send({ projectId: other.id, updatedBy: 'visitor@demo.example' })
        .expect(400);
      const featureResponse = await request(app.getHttpServer())
        .post('/features')
        .auth(token, { type: 'bearer' })
        .send({
          epicId: epic.id,
          title: `Isolated feature ${Date.now()}`,
          createdBy: 'visitor@demo.example',
        })
        .expect(201);
      const feature = featureResponse.body as { id: string; title: string };
      const features = await request(app.getHttpServer())
        .get('/features')
        .query({ epicId: epic.id })
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect(features.body).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: feature.id })]),
      );
      await request(app.getHttpServer())
        .patch(`/features/${feature.id}`)
        .auth(token, { type: 'bearer' })
        .send({
          epicId: epic.id,
          title: feature.title,
          updatedBy: 'visitor@demo.example',
        })
        .expect(200);
      await request(app.getHttpServer())
        .patch(`/features/${feature.id}`)
        .auth(token, { type: 'bearer' })
        .send({ epicId: other.epics[0].id, updatedBy: 'visitor@demo.example' })
        .expect(400);
      await request(app.getHttpServer())
        .patch(`/features/${feature.id}`)
        .auth(token, { type: 'bearer' })
        .send({
          epicId: epic.id,
          statusId: other.featureStatuses[0].id,
          updatedBy: 'visitor@demo.example',
        })
        .expect(400);
      const ticketResponse = await request(app.getHttpServer())
        .post('/tickets')
        .auth(token, { type: 'bearer' })
        .send({
          featureId: feature.id,
          title: 'Linked isolated hierarchy ticket',
          createdBy: 'visitor@demo.example',
        })
        .expect(201);
      const ticket = ticketResponse.body as { id: number; projectId: string };
      expect(ticket.projectId).toBe(project.id);
      const linked = await request(app.getHttpServer())
        .get(`/projects/${project.id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      expect((linked.body as TaskProjectView).tickets).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: ticket.id })]),
      );
      await request(app.getHttpServer())
        .delete(`/features/${feature.id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      await request(app.getHttpServer())
        .get(`/tickets/${ticket.id}`)
        .auth(token, { type: 'bearer' })
        .expect(404);
    } finally {
      await request(app.getHttpServer())
        .delete(`/epics/${epic.id}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
    }
  });

  it('announces confirmed hierarchy changes to an independent client without publishing rejected edits', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const token = tokenOf(login);
    const projects = await request(app.getHttpServer())
      .get('/projects')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const [project, other] = projects.body as { id: string }[];
    const observer = io(await app.getUrl(), {
      transports: ['websocket'],
      extraHeaders: { Origin: 'http://localhost:5173' },
      reconnection: false,
      autoConnect: false,
      timeout: 5000,
    });
    const events: { projectId: string }[] = [];
    let timer: NodeJS.Timeout | undefined;
    let createdId: string | undefined;
    try {
      await new Promise<void>((resolve, reject) => {
        observer.once('connect', resolve);
        observer.once('connect_error', reject);
        observer.connect();
      });
      const changed = new Promise<void>((resolve, reject) => {
        timer = setTimeout(
          () => reject(new Error('Confirmed hierarchy event missing')),
          2000,
        );
        observer.on('hierarchyChanged', (event: { projectId: string }) => {
          events.push(event);
          resolve();
        });
      });
      void changed.catch(() => undefined);
      const created = await request(app.getHttpServer())
        .post('/epics')
        .auth(token, { type: 'bearer' })
        .send({
          projectId: project.id,
          title: `Independent hierarchy ${Date.now()}`,
          createdBy: 'visitor@demo.example',
        })
        .expect(201);
      createdId = (created.body as { id: string }).id;
      await changed;
      expect(events).toEqual([{ projectId: project.id }]);
      await request(app.getHttpServer())
        .get(`/epics/${createdId}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      await request(app.getHttpServer())
        .patch(`/epics/${createdId}`)
        .auth(token, { type: 'bearer' })
        .send({ projectId: other.id, updatedBy: 'visitor@demo.example' })
        .expect(400);
      clearTimeout(timer);
      const deleted = new Promise<void>((resolve, reject) => {
        timer = setTimeout(
          () => reject(new Error('Confirmed hierarchy deletion event missing')),
          2000,
        );
        observer.once('hierarchyChanged', resolve);
      });
      void deleted.catch(() => undefined);
      await request(app.getHttpServer())
        .delete(`/epics/${createdId}`)
        .auth(token, { type: 'bearer' })
        .expect(200);
      await deleted;
      expect(events).toEqual([
        { projectId: project.id },
        { projectId: project.id },
      ]);
      await request(app.getHttpServer())
        .get(`/epics/${createdId}`)
        .auth(token, { type: 'bearer' })
        .expect(404);
      createdId = undefined;
    } finally {
      clearTimeout(timer);
      observer.disconnect();
      if (createdId)
        await request(app.getHttpServer())
          .delete(`/epics/${createdId}`)
          .auth(token, { type: 'bearer' })
          .expect(200);
    }
  });

  it('validates editor values and persists cleared planning fields without nested response data', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/instant-login')
      .send({})
      .expect(201);
    const token = tokenOf(login);
    const projects = await request(app.getHttpServer())
      .get('/projects')
      .auth(token, { type: 'bearer' })
      .expect(200);
    const [project, other] = projects.body as (TaskProjectView & {
      ticketStatuses: { id: string }[];
      sprints: { id: string }[];
    })[];
    const ticket = project.tickets[0];
    const task = ticket.tasks[0];
    for (const invalid of [{ title: '   ' }, { estimatedHours: -1 }]) {
      await request(app.getHttpServer())
        .patch(`/tasks/${task.id}`)
        .auth(token, { type: 'bearer' })
        .send({ id: task.id, updatedBy: 'visitor@demo.example', ...invalid })
        .expect(400);
    }
    for (const invalid of [
      { storyPoints: 1.5 },
      { remainingHours: -1 },
      { statusId: other.ticketStatuses[0].id },
      { sprintId: other.sprints[0].id },
    ]) {
      await request(app.getHttpServer())
        .patch(`/tickets/${ticket.id}`)
        .auth(token, { type: 'bearer' })
        .send({ id: ticket.id, updatedBy: 'visitor@demo.example', ...invalid })
        .expect(400);
    }
    const clearedTask = await request(app.getHttpServer())
      .patch(`/tasks/${task.id}`)
      .auth(token, { type: 'bearer' })
      .send({
        id: task.id,
        updatedBy: 'visitor@demo.example',
        assignedTo: null,
        estimatedHours: null,
      })
      .expect(200);
    expect(clearedTask.body).toMatchObject({
      assignedTo: null,
      assignedUser: null,
      estimatedHours: null,
    });
    await request(app.getHttpServer())
      .patch(`/tasks/${task.id}`)
      .auth(token, { type: 'bearer' })
      .send({
        id: task.id,
        updatedBy: 'visitor@demo.example',
        assignedTo: task.assignedTo,
      })
      .expect(200);
    const clearedTicket = await request(app.getHttpServer())
      .patch(`/tickets/${ticket.id}`)
      .auth(token, { type: 'bearer' })
      .send({
        id: ticket.id,
        updatedBy: 'spoofed@example.com',
        sprintId: null,
        featureId: null,
        assignedTo: null,
        storyPoints: null,
      })
      .expect(200);
    expect(clearedTicket.body).toMatchObject({
      sprintId: null,
      featureId: null,
      assignedTo: null,
      storyPoints: null,
      updatedBy: 'visitor@demo.example',
    });
    expect(JSON.stringify(clearedTicket.body)).not.toMatch(
      /"password"|"refreshToken"/,
    );
  });

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
