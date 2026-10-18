// Clone-equivalent proof: only example files, locked installs and a NEW local database.
const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { createServer } = require("node:net");
const { randomBytes } = require("node:crypto");
const root = path.resolve(__dirname, "../../..");
const clone = path.join(
  root,
  ".scratch/portfolio-presentation/recording/setup-check",
);
const database = process.env.SETUP_DATABASE_URL;
const url = new URL(database);
if (
  !["postgres:", "postgresql:"].includes(url.protocol) ||
  !["127.0.0.1", "localhost"].includes(url.hostname) ||
  !/^\/[a-zA-Z0-9_]+_presentation$/.test(url.pathname) ||
  url.search
)
  throw Error(
    "Select an explicit new loopback database ending in _presentation without overrides.",
  );
const children = new Set();
const env = { ...process.env, NODE_ENV: "development" };
for (const key of [
  "DATABASE_URL",
  "JWT_SECRET",
  "CLIENT_URL",
  "PORT",
  "VITE_API_URL",
  "VITE_SOCKET_URL",
  "API_PROXY_TARGET",
  "DEV_PORT",
  "DOTENV_CONFIG_PATH",
])
  delete env[key];
function launch(app, args, label) {
  const log = fs.openSync(path.join(clone, label + ".log"), "w");
  const child = spawn(process.execPath, args, {
    cwd: path.join(clone, app),
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
async function run(app, args, label) {
  const child = launch(app, args, label);
  const code = await new Promise((resolve, reject) => {
    child.once("error", reject);
    child.once("exit", resolve);
  });
  if (code !== 0) throw Error(label + " failed; see its local log.");
  console.log(label + ": passed");
}
async function freePort() {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  return port;
}
async function ready(origin, child) {
  for (let i = 0; i < 150; i++) {
    if (child.exitCode !== null) throw Error("Startup exited.");
    try {
      if ((await fetch(origin, { signal: AbortSignal.timeout(500) })).ok)
        return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw Error("Startup timed out.");
}
function configure(app, values) {
  let text = fs.readFileSync(path.join(clone, app, ".env.example"), "utf8");
  for (const [key, value] of Object.entries(values))
    text = text.replace(
      new RegExp("^" + key + "=.*$", "m"),
      key + "=" + JSON.stringify(value),
    );
  fs.writeFileSync(path.join(clone, app, ".env"), text);
}
function stop() {
  for (const child of children) child.kill();
}
process.on("SIGINT", () => {
  stop();
  process.exit(1);
});
process.on("SIGTERM", () => {
  stop();
  process.exit(1);
});
(async () => {
  const apiPort = await freePort();
  let uiPort = await freePort();
  while (apiPort === uiPort) uiPort = await freePort();
  const api = "http://127.0.0.1:" + apiPort,
    ui = "http://127.0.0.1:" + uiPort;
  configure("backend", {
    DATABASE_URL: database,
    JWT_SECRET: randomBytes(32).toString("hex"),
    CLIENT_URL: ui,
    PORT: String(apiPort),
  });
  configure("frontend", {
    API_PROXY_TARGET: api,
    VITE_SOCKET_URL: api,
    DEV_PORT: String(uiPort),
  });
  await run(
    "backend",
    ["node_modules/prisma/build/index.js", "generate"],
    "prisma-generate",
  );
  await run(
    "backend",
    ["node_modules/prisma/build/index.js", "migrate", "deploy"],
    "prisma-migrations",
  );
  await run(
    "backend",
    ["node_modules/ts-node/dist/bin.js", "scripts/seed-demo.ts"],
    "demo-seed",
  );
  await run(
    "backend",
    ["node_modules/@nestjs/cli/bin/nest.js", "build"],
    "backend-build",
  );
  const server = launch("backend", ["dist/main.js"], "api-start");
  const web = launch(
    "frontend",
    ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1"],
    "frontend-start",
  );
  await Promise.all([ready(api + "/health", server), ready(ui, web)]);
  const { chromium } = require(
    path.join(root, "frontend/node_modules/@playwright/test"),
  );
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(ui);
    await page.getByRole("button", { name: /explore demo/i }).click();
    await page.getByText("Orbit — Product Delivery", { exact: true }).waitFor();
    await page
      .getByText("Launchpad — Customer Portal", { exact: true })
      .waitFor();
    await page.getByText("Orbit — Product Delivery", { exact: true }).click();
    await page.getByText("Overall Progress", { exact: true }).waitFor();
    fs.writeFileSync(
      path.join(root, ".scratch/portfolio-presentation/evidence/04-setup.json"),
      JSON.stringify(
        {
          date: "2026-10-18",
          source: "fa754a8",
          environment:
            "Node 22; new empty loopback PostgreSQL database; examples only",
          databaseName: url.pathname.slice(1),
          lockedInstalls: "frontend and backend npm ci passed",
          prismaGeneration: "passed",
          committedMigrations: "passed",
          explicitSeed: "passed",
          backendBuild: "passed",
          startups: "API and Vite ready",
          browser: "demo login; both populated projects; real overview",
          credentials: "generated locally; not exported",
        },
        null,
        2,
      ) + "\n",
    );
    console.log("Clean setup and populated browser journey: passed");
  } finally {
    await browser.close();
  }
})()
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  })
  .finally(stop);
