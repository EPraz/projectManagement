import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { AddressInfo, createServer } from 'node:net';

const cwd = join(__dirname, '..');

describe('Safe contributor commands', () => {
  it.each([
    ['production', 'postgresql://quality@127.0.0.1/fixture_browser_test'],
    ['test', undefined],
    [
      'test',
      'postgresql://quality:private-password@shared.example/fixture_browser_test',
    ],
    ['test', 'postgresql://quality@127.0.0.1/fixture_test'],
    [
      'test',
      'postgresql://quality@127.0.0.1/fixture_browser_test?schema=visitor_data',
    ],
    [
      'test',
      'postgresql://quality@127.0.0.1/fixture_browser_test?host=shared.example',
    ],
    ['test', 'invalid-private-value'],
  ])(
    'rejects unsafe browser fixture configuration before starting tools',
    (mode, database) => {
      const result = spawnSync(process.execPath, ['scripts/test-browser.mjs'], {
        cwd: join(cwd, '..', 'frontend'),
        env: {
          ...process.env,
          NODE_ENV: mode,
          BROWSER_DATABASE_URL: database,
          DATABASE_URL:
            'postgresql://quality:private-password@shared.example/owner_data',
        },
        encoding: 'utf8',
        timeout: 5000,
      });
      expect(result.error).toBeUndefined();
      expect(result.status).toBe(1);
      expect(result.stderr).toContain(
        'Set NODE_ENV=test and BROWSER_DATABASE_URL',
      );
      expect(result.stdout).toBe('');
      expect(result.stderr).not.toMatch(
        /private-password|invalid-private-value|shared\.example/,
      );
    },
  );

  it('explains an occupied backend port and exits instead of hanging', async () => {
    const listener = createServer();
    await new Promise<void>((resolve) =>
      listener.listen({ port: 0, host: '0.0.0.0', exclusive: true }, resolve),
    );
    const port = (listener.address() as AddressInfo).port;
    try {
      const result = spawnSync(
        process.execPath,
        [
          '-r',
          'ts-node/register',
          '-r',
          'tsconfig-paths/register',
          'src/main.ts',
        ],
        {
          cwd,
          env: {
            ...process.env,
            NODE_ENV: 'test',
            DATABASE_URL: process.env.TEST_DATABASE_URL,
            JWT_SECRET: 'a-local-example-secret-at-least-32-characters',
            CLIENT_URL: 'http://localhost:5173',
            PORT: String(port),
          },
          encoding: 'utf8',
          timeout: 20000,
        },
      );
      expect(result.error).toBeUndefined();
      expect(result.status).toBe(1);
      expect(result.stderr).toContain('Backend port is occupied');
    } finally {
      await new Promise<void>((resolve, reject) =>
        listener.close((error) => (error ? reject(error) : resolve())),
      );
    }
  }, 30000);

  it.each([
    undefined,
    'postgresql://user:private-password@shared.example/portfolio_test',
    'postgresql://user:private-password@localhost/portfolio',
    'postgresql://user:private-password@localhost/portfolio_test?schema=visitor_data',
    'invalid-private-value',
  ])(
    'rejects an unsafe fixture destination before running migrations',
    (url) => {
      const result = spawnSync(process.execPath, ['scripts/test-api.mjs'], {
        cwd,
        env: { ...process.env, TEST_DATABASE_URL: url },
        encoding: 'utf8',
      });
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain('isolated local database');
      expect(result.stderr).not.toContain('private-password');
      expect(result.stderr).not.toContain('invalid-private-value');
    },
  );

  it('reports an invalid database URL without echoing its private value', () => {
    const result = spawnSync(
      process.execPath,
      [
        '-r',
        'ts-node/register',
        '-e',
        "require('./src/environment').validateEnvironment(process.env)",
      ],
      {
        cwd,
        env: {
          ...process.env,
          DATABASE_URL: 'invalid-private-value',
          JWT_SECRET: 'a-local-example-secret-at-least-32-characters',
          CLIENT_URL: 'http://localhost:5173',
        },
        encoding: 'utf8',
      },
    );
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain('DATABASE_URL must be a PostgreSQL URL');
    expect(result.stderr).not.toContain('invalid-private-value');
  });
});
