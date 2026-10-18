import { expect, test } from "@playwright/test";
import { enterDemo } from "./support/demo";

test("legacy entry validates identity once, and a deep-link reload restores the session", async ({ page }) => {
  const authCalls: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/api/auth/")) authCalls.push(new URL(request.url()).pathname);
  });
  await page.goto("/auth/register");
  await expect(page).toHaveURL(/\/auth\/instantLogin$/);
  await page.getByRole("button", { name: /explore demo/i }).click();
  await expect(page.getByText("Orbit — Product Delivery", { exact: true })).toBeVisible();
  await page.waitForLoadState("networkidle");
  expect(authCalls).toEqual(["/api/auth/instant-login", "/api/auth/checkAuth"]);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await expect(page.getByText("Overall Progress", { exact: true })).toBeVisible();
  authCalls.length = 0;
  await page.reload();
  await expect(page.getByText("Overall Progress", { exact: true })).toBeVisible();
  expect(authCalls).toEqual(["/api/auth/refresh", "/api/auth/checkAuth"]);
});

test("unavailable session restoration retains the deep link and allows retry", async ({ page }) => {
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await expect(page.getByText("Overall Progress", { exact: true })).toBeVisible();
  const deepLink = page.url();
  await page.route("**/api/auth/refresh", (route) => route.fulfill({ status: 503, contentType: "application/json", body: '{"message":"Controlled local outage"}' }));
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("restore");
  await expect(page).toHaveURL(deepLink);
  await page.unroute("**/api/auth/refresh");
  await page.getByRole("button", { name: "Retry session" }).click();
  await expect(page.getByText("Overall Progress", { exact: true })).toBeVisible();
});

test("failed and pending logout recover, and another browser session stays signed in", async ({ page, browser }) => {
  await enterDemo(page);
  const independent = await browser.newContext();
  try {
    const other = await independent.newPage();
    await enterDemo(other);
    await page.route("**/api/auth/logout", (route) => route.fulfill({ status: 503, body: "unavailable" }));
    await page.getByRole("button", { name: "Open user menu" }).click();
    await page.getByRole("menuitem", { name: "Logout", exact: true }).click();
    await expect(page.getByRole("alert")).toContainText("Could not sign out");
    await expect(page).toHaveURL(/\/projects$/);
    await page.unroute("**/api/auth/logout");
    let release!: () => void;
    let reached!: () => void;
    const delayed = new Promise<void>((resolve) => { release = resolve; });
    const received = new Promise<void>((resolve) => { reached = resolve; });
    await page.route("**/api/auth/logout", async (route) => {
      reached();
      await delayed;
      await route.continue();
    });
    try {
      await page.getByRole("menuitem", { name: "Logout", exact: true }).click();
      await received;
      await expect(page.getByRole("menuitem", { name: "Signing out…" })).toBeDisabled();
    } finally { release(); }
    await expect(page).toHaveURL(/\/auth\/instantLogin$/);
    await other.reload();
    await expect(other.getByText("Orbit — Product Delivery", { exact: true })).toBeVisible();
    await page.goto("/projects");
    await expect(page).toHaveURL(/\/auth\/instantLogin$/);
    await expect(page.getByRole("alert").filter({ hasText: "session has ended" })).toBeVisible();
  } finally { await independent.close(); }
});

test("one scheduled refresh explains an expired session and entry can recover", async ({ page }) => {
  await page.clock.install();
  await enterDemo(page);
  let refreshes = 0;
  await page.route("**/api/auth/refresh", (route) => {
    refreshes += 1;
    return route.fulfill({ status: 401, contentType: "application/json", body: '{"message":"Expired demo session"}' });
  });
  await page.clock.fastForward(12 * 60 * 1000);
  await expect(page).toHaveURL(/\/auth\/instantLogin$/);
  await expect(page.getByRole("alert").filter({ hasText: "session has ended" })).toBeVisible();
  expect(refreshes).toBe(1);
  await page.unroute("**/api/auth/refresh");
  await page.getByRole("button", { name: /explore demo/i }).click();
  await expect(page.getByText("Orbit — Product Delivery", { exact: true })).toBeVisible();
});

test("entry reports an unavailable or malformed server response and permits retry", async ({ page }) => {
  await page.goto("/auth/login");
  await expect(page).toHaveURL(/\/auth\/instantLogin$/);
  await page.route("**/api/auth/instant-login", (route) => route.fulfill({ status: 503, body: "unavailable" }));
  await page.getByRole("button", { name: /explore demo/i }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Could not open" })).toBeVisible();
  await page.unroute("**/api/auth/instant-login");
  await page.route("**/api/auth/instant-login", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<html>unexpected response</html>" }));
  await page.getByRole("button", { name: /explore demo/i }).click();
  await expect(page.getByRole("alert").filter({ hasText: "unexpected response" })).toBeVisible();
  await page.unroute("**/api/auth/instant-login");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: /explore demo/i }).click();
  await expect(page.getByText("Orbit — Product Delivery", { exact: true })).toBeVisible();
});

test("a failed background refresh keeps the workspace visible and can be retried", async ({ page }) => {
  await page.clock.install();
  await enterDemo(page);
  await page.route("**/api/auth/refresh", (route) => route.fulfill({ status: 503, body: "unavailable" }));
  await page.clock.fastForward(12 * 60 * 1000);
  await expect(page.getByRole("alert")).toContainText("restore");
  await expect(page.getByText("Orbit — Product Delivery", { exact: true })).toBeVisible();
  await page.unroute("**/api/auth/refresh");
  await page.getByRole("button", { name: "Retry session" }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByText("Orbit — Product Delivery", { exact: true })).toBeVisible();
});

test("leaving a restoring deep link cancels its result without navigating away from entry", async ({ page }) => {
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await expect(page.getByText("Overall Progress", { exact: true })).toBeVisible();
  let release!: () => void;
  let reached!: () => void;
  const delayed = new Promise<void>((resolve) => { release = resolve; });
  const received = new Promise<void>((resolve) => { reached = resolve; });
  await page.route("**/api/auth/refresh", async (route) => {
    const result = await route.fetch();
    reached();
    await delayed;
    await route.fulfill({ response: result });
  });
  try {
    await page.reload({ waitUntil: "domcontentloaded" });
    await received;
    await page.goBack();
    await page.goBack();
    await expect(page).toHaveURL(/\/auth\/instantLogin$/);
  } finally { release(); }
  await page.waitForLoadState("networkidle");
  await expect(page).toHaveURL(/\/auth\/instantLogin$/);
  await expect(page.getByRole("button", { name: /explore demo/i })).toBeEnabled();
  await page.goForward();
  await expect(page.getByText("Orbit — Product Delivery", { exact: true })).toBeVisible();
});

test("a manual restoration retry is cancelled when navigating back to entry", async ({ page }) => {
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await expect(page.getByText("Overall Progress", { exact: true })).toBeVisible();
  await page.route("**/api/auth/refresh", (route) => route.fulfill({ status: 503, body: "unavailable" }));
  await page.reload();
  await expect(page.getByRole("button", { name: "Retry session" })).toBeVisible();
  await page.unroute("**/api/auth/refresh");
  let release!: () => void;
  let reached!: () => void;
  const delayed = new Promise<void>((resolve) => { release = resolve; });
  const received = new Promise<void>((resolve) => { reached = resolve; });
  let lateIdentities = 0;
  await page.route("**/api/auth/refresh", async (route) => {
    const result = await route.fetch();
    reached();
    await delayed;
    await route.fulfill({ response: result });
  });
  try {
    await page.getByRole("button", { name: "Retry session" }).click();
    await received;
    page.on("request", (request) => { if (request.url().endsWith("/auth/checkAuth")) lateIdentities += 1; });
    await page.goBack();
    await page.goBack();
    await expect(page).toHaveURL(/\/auth\/instantLogin$/);
  } finally { release(); }
  await page.waitForLoadState("networkidle");
  expect(lateIdentities).toBe(0);
});

test("session renewal and retry stay paused while logout is pending", async ({ page }) => {
  await page.clock.install();
  await enterDemo(page);
  await page.route("**/api/auth/refresh", (route) => route.fulfill({ status: 503, body: "unavailable" }));
  await page.clock.fastForward(12 * 60 * 1000);
  await expect(page.getByRole("button", { name: "Retry session" })).toBeVisible();
  await page.unroute("**/api/auth/refresh");
  let renewals = 0;
  await page.route("**/api/auth/refresh", (route) => { renewals += 1; return route.continue(); });
  let release!: () => void;
  let reached!: () => void;
  const delayed = new Promise<void>((resolve) => { release = resolve; });
  const received = new Promise<void>((resolve) => { reached = resolve; });
  await page.route("**/api/auth/logout", async (route) => { reached(); await delayed; await route.continue(); });
  try {
    await page.getByRole("button", { name: "Open user menu" }).click();
    await page.getByRole("menuitem", { name: "Logout", exact: true }).click();
    await received;
    await expect(page.getByRole("button", { name: "Retry session", includeHidden: true })).toBeDisabled();
    await page.clock.fastForward(12 * 60 * 1000);
    await page.clock.runFor(1000);
    expect(renewals).toBe(0);
  } finally { release(); }
  await expect(page).toHaveURL(/\/auth\/instantLogin$/);
});

test("an authenticated project request explains expiry immediately after demo entry", async ({ page }) => {
  await page.route("**/api/projects/?view=summary", (route) => route.fulfill({ status: 401, contentType: "application/json", body: '{"message":"Expired demo session"}' }));
  await page.goto("/auth/instantLogin");
  await page.getByRole("button", { name: /explore demo/i }).click();
  await expect(page).toHaveURL(/\/auth\/instantLogin$/);
  await expect(page.getByRole("alert").filter({ hasText: "session has ended" })).toBeVisible();
  await page.unroute("**/api/projects/?view=summary");
  await page.getByRole("button", { name: /explore demo/i }).click();
  await expect(page.getByText("Orbit — Product Delivery", { exact: true })).toBeVisible();
});
