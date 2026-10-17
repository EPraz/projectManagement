import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// No dotenv: the owner's DATABASE_URL must never become a fixture destination.
const value = process.env.TEST_DATABASE_URL;
let url;
try {
  url = new URL(value);
} catch {
  // Report the requirement below without echoing credentials or malformed input.
}
if (
  !url ||
  !['postgres:', 'postgresql:'].includes(url.protocol) ||
  !['127.0.0.1', 'localhost'].includes(url.hostname) ||
  !/^\/[a-zA-Z0-9_]+_test$/.test(url.pathname) ||
  [...url.searchParams].some(
    ([key, value]) => key !== 'schema' || value !== 'public',
  )
) {
  console.error(
    'TEST_DATABASE_URL must identify an isolated local database ending in _test, using the public schema.',
  );
  process.exit(1);
}

const cwd = join(dirname(fileURLToPath(import.meta.url)), '..');
const env = { ...process.env, NODE_ENV: 'test', DATABASE_URL: value };
const commands = [
  ['node_modules/prisma/build/index.js', 'migrate', 'deploy'],
  [
    'node_modules/jest/bin/jest.js',
    '--config',
    'test/jest-e2e.json',
    '--runInBand',
    ...process.argv.slice(2),
  ],
];
for (const args of commands) {
  const result = spawnSync(process.execPath, args, {
    cwd,
    env,
    stdio: 'inherit',
  });
  if (result.error || result.status !== 0) process.exit(result.status || 1);
}
