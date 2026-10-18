import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const frontend = join(dirname(fileURLToPath(import.meta.url)), "..");

test("browser fixture builds exclude private frontend environment files", () => {
  const fixture = mkdtempSync(join(tmpdir(), "project-browser-env-"));
  try {
    writeFileSync(
      join(fixture, ".env"),
      "VITE_PRIVATE_FIXTURE=fixture-private-sentinel"
    );
    writeFileSync(
      join(fixture, "index.html"),
      '<script type="module" src="/main.js"></script>'
    );
    writeFileSync(
      join(fixture, "main.js"),
      "console.log(import.meta.env.VITE_PRIVATE_FIXTURE)"
    );
    const result = spawnSync(
      process.execPath,
      [
        join(frontend, "node_modules/vite/bin/vite.js"),
        "build",
        "--mode",
        "browser-test",
        "--config",
        join(frontend, "vite.config.ts"),
        "--outDir",
        join(fixture, "out")
      ],
      {
        cwd: fixture,
        env: { ...process.env, NODE_ENV: "production" },
        encoding: "utf8",
        timeout: 20000
      }
    );
    assert.ifError(result.error);
    assert.equal(result.status, 0, "Fixture asset build should succeed");
    const assets = readdirSync(join(fixture, "out/assets"))
      .map((name) => readFileSync(join(fixture, "out/assets", name), "utf8"))
      .join("");
    assert.ok(
      !assets.includes("fixture-private-sentinel"),
      "Private env sentinel must not enter fixture assets"
    );
  } finally {
    // Only the exact temporary directory created above can be removed.
    assert.equal(dirname(fixture), tmpdir());
    rmSync(fixture, { recursive: true, force: true });
  }
});
