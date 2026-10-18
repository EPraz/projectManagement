import { defineConfig } from "@playwright/test";

const baseURL = process.env.BROWSER_BASE_URL ?? "http://127.0.0.1:5182";
const origin = new URL(baseURL);
if (
  origin.protocol !== "http:" ||
  !["127.0.0.1", "localhost"].includes(origin.hostname) ||
  origin.username ||
  origin.password
) {
  throw new Error("Browser checks require an isolated local HTTP application");
}

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.browser.ts",
  workers: 1,
  forbidOnly: true,
  retries: 0,
  timeout: 30000,
  // Serial end-to-end coverage now includes both themes and six device widths.
  globalTimeout: 20 * 60 * 1000,
  reporter: "list",
  use: {
    baseURL,
    channel: process.env.BROWSER_CHANNEL ?? "chrome",
    viewport: { width: 1440, height: 1000 },
    video: "off",
    trace: "off",
    screenshot: "only-on-failure",
  },
});
