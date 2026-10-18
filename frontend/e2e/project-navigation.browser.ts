import { expect, test } from "@playwright/test";
import { enterDemo } from "./support/demo";

test("project API slash aliases stay JSON and the project deep link reloads", async ({
  page,
  request,
}) => {
  const sessionResponse = page.waitForResponse("**/api/auth/instant-login");
  await enterDemo(page);
  const { accessToken } = await (await sessionResponse).json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  for (const path of ["/api/projects", "/api/projects/"]) {
    const response = await request.get(path, { headers });
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(await response.json()).toHaveLength(2);
  }
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await expect(
    page.getByText("Overall Progress", { exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Overall Progress", { exact: true }).locator(".."),
  ).toContainText("33%");
});

test("a non-JSON detail response stays recoverable", async ({ page }) => {
  await enterDemo(page);
  const detail = page.waitForResponse((response) =>
    /\/api\/projects\/[^/]+$/.test(new URL(response.url()).pathname),
  );
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  const url = (await detail).url();
  await expect(
    page.getByText("Overall Progress", { exact: true }),
  ).toBeVisible();
  await page.route(url, (route) =>
    route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<html>unexpected</html>",
    }),
  );
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("unexpected response");
  await page.unroute(url);
  await page
    .getByRole("button", { name: "Retry project", exact: true })
    .click();
  await expect(
    page.getByText("Overall Progress", { exact: true }),
  ).toBeVisible();
});

test("leaving a pending project load prevents it from replacing the next project", async ({
  page,
}) => {
  await enterDemo(page);
  let release!: () => void;
  let reached!: () => void;
  const delayed = new Promise<void>((resolve) => {
    release = resolve;
  });
  const received = new Promise<void>((resolve) => {
    reached = resolve;
  });
  let first = true;
  await page.route("**/api/projects/*", async (route) => {
    if (!first) return route.continue();
    first = false;
    const result = await route.fetch();
    reached();
    await delayed;
    await route.fulfill({ response: result });
  });
  try {
    await page.getByText("Orbit — Product Delivery", { exact: true }).click();
    await received;
    await page.goBack();
    await page
      .getByText("Launchpad — Customer Portal", { exact: true })
      .click();
    await expect(
      page.getByText("Launchpad — Customer Portal", { exact: true }).first(),
    ).toBeVisible();
  } finally {
    release();
  }
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByText("Launchpad — Customer Portal", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("Orbit — Product Delivery", { exact: true }),
  ).toHaveCount(0);
});
