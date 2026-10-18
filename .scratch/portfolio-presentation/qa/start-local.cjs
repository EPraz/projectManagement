// Owned presentation application: no dotenv, public database or fixture resets.
const { spawn } = require("node:child_process");
const { createServer } = require("node:net");
const path = require("node:path");
const fs = require("node:fs");
const root = path.resolve(__dirname, "../../..");
const output = path.join(root, ".scratch/portfolio-presentation/recording");
const database = process.env.PRESENTATION_DATABASE_URL;
let parsed;
try {
  parsed = new URL(database);
} catch {}
if (
  !parsed ||
  !["postgres:", "postgresql:"].includes(parsed.protocol) ||
  !["127.0.0.1", "localhost"].includes(parsed.hostname) ||
  !/^\/[a-zA-Z0-9_]+_presentation$/.test(parsed.pathname) ||
  parsed.search
) {
  throw Error(
    "PRESENTATION_DATABASE_URL must explicitly name a loopback PostgreSQL database ending in _presentation; no query overrides.",
  );
}
fs.mkdirSync(output, { recursive: true });
const children = new Set();
function launch(cwd, args, name) {
  const log = fs.openSync(path.join(output, name + ".log"), "a");
  const child = spawn(process.execPath, args, {
    cwd,
    env,
    stdio: ["ignore", log, log],
    windowsHide: true,
  });
  children.add(child);
  child.on("exit", () => {
    children.delete(child);
    fs.closeSync(log);
  });
  return child;
}
async function run(cwd, args, name) {
  const child = launch(cwd, args, name);
  const code = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", resolve);
  });
  if (code !== 0) throw Error(name + " failed; inspect its local log.");
}
async function port() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const value = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return value;
}
async function ready(url, child) {
  for (let i = 0; i < 100; i++) {
    if (child.exitCode !== null) throw Error("Owned server stopped.");
    try {
      if ((await fetch(url, { signal: AbortSignal.timeout(500) })).ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw Error("Owned server readiness timeout.");
}
function stop() {
  for (const child of children) child.kill();
}
process.on("SIGINT", () => {
  stop();
  process.exit();
});
process.on("SIGTERM", () => {
  stop();
  process.exit();
});
let env;
(async () => {
  const apiPort = await port();
  let uiPort = await port();
  while (uiPort === apiPort) uiPort = await port();
  const api = `http://127.0.0.1:${apiPort}`,
    ui = `http://127.0.0.1:${uiPort}`;
  env = {
    ...process.env,
    NODE_ENV: "test",
    DATABASE_URL: database,
    JWT_SECRET: "isolated-presentation-demo-secret-at-least-32-characters",
    PORT: String(apiPort),
    CLIENT_URL: ui,
    API_PROXY_TARGET: api,
    VITE_API_URL: "/api",
    VITE_SOCKET_URL: api,
    DOTENV_CONFIG_PATH: path.join(root, "backend/.presentation-no-env"),
  };
  const backend = path.join(root, "backend"),
    frontend = path.join(root, "frontend");
  await run(
    backend,
    ["node_modules/@nestjs/cli/bin/nest.js", "build"],
    "backend-build",
  );
  if (!process.argv.includes("--dev")) {
    env.NODE_ENV = "production";
    await run(
      frontend,
      ["node_modules/vite/bin/vite.js", "build", "--mode", "browser-test"],
      "frontend-build",
    );
    env.NODE_ENV = "test";
  }
  const server = launch(backend, ["dist/main.js"], "api");
  const args = [
    "node_modules/vite/bin/vite.js",
    ...(process.argv.includes("--dev") ? [] : ["preview"]),
    "--mode",
    "browser-test",
    "--host",
    "127.0.0.1",
    "--port",
    String(uiPort),
    "--strictPort",
  ];
  const web = launch(frontend, args, "frontend");
  await Promise.all([ready(api + "/health", server), ready(ui, web)]);
  const info = {
    ui,
    api,
    databaseHost: parsed.hostname,
    databaseName: parsed.pathname.slice(1),
    production: !process.argv.includes("--dev"),
    pid: process.pid,
  };
  fs.writeFileSync(
    path.join(output, "runtime.json"),
    JSON.stringify(info, null, 2),
  );
  console.log(JSON.stringify(info));
})().catch((error) => {
  console.error(error.message);
  stop();
  process.exitCode = 1;
});
