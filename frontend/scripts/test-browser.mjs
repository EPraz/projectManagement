import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Deliberately no dotenv or fallback to DATABASE_URL.
const database = process.env.BROWSER_DATABASE_URL;
let url;
try {
  url = new URL(database);
} catch {
  // Do not echo malformed input or credentials.
}
if (
  process.env.NODE_ENV !== "test" ||
  !url ||
  !["postgres:", "postgresql:"].includes(url.protocol) ||
  !["127.0.0.1", "localhost"].includes(url.hostname) ||
  !/^\/[a-zA-Z0-9_]+_browser_test$/.test(url.pathname) ||
  [...url.searchParams].some(
    ([key, value]) => key !== "schema" || value !== "public"
  )
) {
  console.error(
    "Set NODE_ENV=test and BROWSER_DATABASE_URL to a disposable loopback PostgreSQL database ending in _browser_test, using the public schema. Its fixtures will be replaced."
  );
  process.exit(1);
}

const frontend = join(dirname(fileURLToPath(import.meta.url)), "..");
const backend = join(frontend, "..", "backend");
const children = new Set();
let stopping = false;

function launch(cwd, args, env, background = false) {
  const child = spawn(process.execPath, args, {
    cwd,
    env,
    stdio: background ? "ignore" : "inherit",
    windowsHide: true
  });
  children.add(child);
  const done = new Promise((resolve) => {
    child.once("error", () => {
      children.delete(child);
      resolve(1);
    });
    child.once("exit", (code) => {
      children.delete(child);
      resolve(code ?? 1);
    });
  });
  return { child, done };
}

async function run(cwd, args, env) {
  const result = await launch(cwd, args, env).done;
  if (result !== 0 || stopping)
    throw new Error("A browser-check command failed.");
}

async function stop() {
  stopping = true;
  await Promise.all(
    [...children].map(async (child) => {
      const exited = new Promise((resolve) => child.once("exit", resolve));
      child.kill("SIGTERM");
      const force = setTimeout(() => child.kill("SIGKILL"), 3000);
      force.unref();
      await exited;
      clearTimeout(force);
    })
  );
}

for (const signal of ["SIGINT", "SIGTERM"])
  process.once(signal, () => {
    void stop().finally(() => process.exit(1));
  });

async function freePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const port = server.address().port;
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve()))
  );
  return port;
}

async function ready(address, child) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (stopping || child.exitCode !== null || !children.has(child))
      throw new Error(
        "An owned browser-check server stopped before readiness."
      );
    try {
      const response = await fetch(address, {
        signal: AbortSignal.timeout(500)
      });
      if (response.ok && children.has(child)) return;
    } catch {
      /* The owned listener is still starting. */
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("An owned browser-check server did not become ready.");
}

try {
  const apiPort = await freePort();
  let uiPort = await freePort();
  while (uiPort === apiPort) uiPort = await freePort();
  const api = `http://127.0.0.1:${apiPort}`;
  const ui = `http://127.0.0.1:${uiPort}`;
  const env = {
    ...process.env,
    NODE_ENV: "test",
    DATABASE_URL: database,
    JWT_SECRET: "isolated-browser-tests-secret-at-least-32-characters",
    PORT: String(apiPort),
    CLIENT_URL: ui,
    API_PROXY_TARGET: api,
    VITE_API_URL: "/api",
    VITE_SOCKET_URL: api,
    BROWSER_BASE_URL: ui,
    DOTENV_CONFIG_PATH: join(backend, ".browser-fixture-no-env")
  };
  console.log(
    "Preparing disposable local browser fixtures and production applications."
  );
  await run(frontend, ["--test", "scripts/check-browser-env.mjs"], env);
  await run(backend, ["node_modules/prisma/build/index.js", "generate"], env);
  await run(
    backend,
    ["node_modules/prisma/build/index.js", "migrate", "deploy"],
    env
  );
  const requireBackend = createRequire(join(backend, "package.json"));
  const { PrismaClient } = requireBackend("@prisma/client");
  const prisma = new PrismaClient({ datasourceUrl: database });
  try {
    await prisma.$executeRawUnsafe(
      'TRUNCATE "Project", "User", "Tag", "DbHeartbeat" RESTART IDENTITY CASCADE'
    );
  } finally {
    await prisma.$disconnect();
  }
  await run(
    backend,
    ["node_modules/ts-node/dist/bin.js", "scripts/seed-demo.ts"],
    env
  );
  await run(backend, ["node_modules/@nestjs/cli/bin/nest.js", "build"], env);
  await run(frontend, ["node_modules/typescript/bin/tsc", "-b"], env);
  const productionFrontend = { ...env, NODE_ENV: "production" };
  await run(
    frontend,
    ["node_modules/vite/bin/vite.js", "build", "--mode", "browser-test"],
    productionFrontend
  );
  const apiServer = launch(backend, ["dist/main.js"], env, true);
  const uiServer = launch(
    frontend,
    [
      "node_modules/vite/bin/vite.js",
      "preview",
      "--mode",
      "browser-test",
      "--host",
      "127.0.0.1",
      "--port",
      String(uiPort),
      "--strictPort"
    ],
    productionFrontend,
    true
  );
  await Promise.all([
    ready(`${api}/health`, apiServer.child),
    ready(ui, uiServer.child)
  ]);
  console.log(
    "Owned local API and production preview are ready; running browser journeys."
  );
  await run(
    frontend,
    ["node_modules/@playwright/test/cli.js", "test", ...process.argv.slice(2)],
    env
  );
} catch (error) {
  console.error(
    error instanceof Error ? error.message : "Browser checks failed."
  );
  process.exitCode = 1;
} finally {
  await stop();
}
