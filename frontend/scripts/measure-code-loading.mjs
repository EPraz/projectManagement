import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const origin = new URL(process.argv[2] || "http://127.0.0.1:5183");
if (
  origin.protocol !== "http:" ||
  !["127.0.0.1", "localhost"].includes(origin.hostname) ||
  origin.username ||
  origin.password
)
  throw new Error(
    "Measurements require an isolated loopback production preview"
  );
async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const context = await browser.newContext({
      baseURL: origin.origin,
      viewport: { width: 1280, height: 900 }
    });
    const page = await context.newPage();
    const failures = [];
    page.on("pageerror", (error) => failures.push(error.message));
    const resources = async () =>
      await page.evaluate(() =>
        performance
          .getEntriesByType("resource")
          .filter(
            (entry) =>
              entry.initiatorType === "script" ||
              /\/assets\/.*\.js/.test(entry.name)
          )
          .map((entry) => ({
            name: new URL(entry.name).pathname,
            transferSize: entry.transferSize,
            encodedBodySize: entry.encodedBodySize,
            decodedBodySize: entry.decodedBodySize,
            duration: Math.round(entry.duration)
          }))
      );
    const result = {
      label: "local-production-preview",
      environment:
        "Node22.20.0 / local production Vite preview / Chrome / fresh context / no throttling"
    };
    await page.goto("/auth/instantLogin");
    await page.getByRole("button", { name: /explore demo/i }).waitFor();
    await page.waitForLoadState("networkidle");
    result.entry = await resources();
    await page.getByRole("button", { name: /explore demo/i }).click();
    await page.getByText("Orbit — Product Delivery", { exact: true }).waitFor();
    await page.waitForLoadState("networkidle");
    result.projects = await resources();
    await page.getByText("Orbit — Product Delivery", { exact: true }).click();
    await page.getByRole("button", { name: "Board", exact: true }).waitFor();
    await page.waitForLoadState("networkidle");
    result.workspace = await resources();
    await page.getByRole("button", { name: "Board", exact: true }).click();
    await page
      .getByRole("button", { name: "Add New Item", exact: true })
      .waitFor();
    await page.waitForLoadState("networkidle");
    result.board = await resources();
    result.errors = failures;
    for (const stage of ["entry", "projects", "workspace", "board"])
      result[stage + "Totals"] = {
        requests: result[stage].length,
        encodedBodySize: result[stage].reduce(
          (n, r) => n + r.encodedBodySize,
          0
        ),
        transferSize: result[stage].reduce((n, r) => n + r.transferSize, 0)
      };
    assert.equal(
      failures.length,
      0,
      "The measured application must not have page errors"
    );
    console.log(JSON.stringify(result, null, 2));
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
