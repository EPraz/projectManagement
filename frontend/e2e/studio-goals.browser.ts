import { expect, test } from "@playwright/test";
import { enterDemo, navigateSection } from "./support/demo";
test.use({ actionTimeout: 5000 });
test("goal creation protects a dirty draft with keep and discard before closing", async ({
  page,
}) => {
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await navigateSection(page, "Goals");
  await page.getByRole("button", { name: "Add New Goal", exact: true }).click();
  const editor = page.getByRole("dialog");
  await editor.getByLabel(/^title$/i).fill("Protected sprint goal draft");
  await editor.getByRole("button", { name: "Cancel", exact: true }).click();
  const warning = page.getByRole("alertdialog", {
    name: "Unsaved changes",
    exact: true,
  });
  await expect(warning).toBeVisible();
  await warning
    .getByRole("button", { name: "Keep editing", exact: true })
    .click();
  await expect(editor.getByLabel(/^title$/i)).toHaveValue(
    "Protected sprint goal draft",
  );
  await editor.getByRole("button", { name: "Cancel", exact: true }).click();
  await warning
    .getByRole("button", { name: "Discard changes", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("saving a goal from the exit warning retains failed input and confirms exactly one retry", async ({
  page,
  request,
}) => {
  const { accessToken } = await (
    await request.post("/api/auth/instant-login", { data: {} })
  ).json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  let id: string | undefined;
  try {
    await enterDemo(page);
    await page.getByText("Orbit — Product Delivery", { exact: true }).click();
    await navigateSection(page, "Goals");
    await page
      .getByRole("button", { name: "Add New Goal", exact: true })
      .click();
    const editor = page.getByRole("dialog", { name: "Add Goal", exact: true });
    const title = `Warning goal ${Date.now()}`;
    await editor.getByLabel(/^title$/i).fill(title);
    await page.route("**/api/sprint-goals", (route) =>
      route.request().method() === "POST"
        ? route.fulfill({ status: 503, body: "unavailable" })
        : route.continue(),
    );
    await editor.getByRole("button", { name: "Cancel", exact: true }).click();
    const warning = page.getByRole("alertdialog", {
      name: "Unsaved changes",
      exact: true,
    });
    await warning
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    await expect(warning.getByRole("alert")).toContainText("Could not save");
    await warning
      .getByRole("button", { name: "Keep editing", exact: true })
      .click();
    await expect(editor.getByLabel(/^title$/i)).toHaveValue(title);
    await page.unroute("**/api/sprint-goals");
    await editor.getByRole("button", { name: "Cancel", exact: true }).click();
    const saved = page.waitForResponse(
      (r) =>
        r.url().endsWith("/api/sprint-goals") &&
        r.request().method() === "POST",
    );
    await warning
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    const response = await saved;
    expect(response.status()).toBe(201);
    const goal = await response.json();
    id = goal.id;
    await expect(warning).toHaveCount(0);
    await expect(editor).toHaveCount(0);
    await expect(
      page.getByRole("article", { name: title, exact: true }),
    ).toBeVisible();
    expect(goal).toMatchObject({
      title,
      progress: 0,
      goalsStatus: "IN_PROGRESS",
    });
  } finally {
    await page.unroute("**/api/sprint-goals");
    if (id) await request.delete(`/api/sprint-goals/${id}`, { headers });
  }
});
for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`C sprint goals and editor fit ${width}px in ${theme}`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await enterDemo(page);
      await page.getByText("Orbit — Product Delivery", { exact: true }).click();
      await navigateSection(page, "Goals");
      const cards = page.getByRole("region", {
        name: "Sprint goal cards",
        exact: true,
      });
      await expect(cards).toBeVisible();
      const first = cards.getByRole("article").first();
      await expect(first.getByRole("progressbar")).toHaveCount(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: info.outputPath(`goals-${theme}-${width}.png`),
        fullPage: true,
      });
      await first
        .getByRole("button", { name: "Edit goal", exact: true })
        .click();
      const editor = page.getByRole("dialog", {
        name: "Edit Goal",
        exact: true,
      });
      await expect(editor).toBeVisible();
      const dimensions = await editor.evaluate((element) => ({
        scroll: element.scrollWidth,
        client: element.clientWidth,
      }));
      expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
      const bounds = await editor
        .getByRole("button", { name: "Save", exact: true })
        .boundingBox();
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(900);
      await page.screenshot({
        path: info.outputPath(`goal-editor-${theme}-${width}.png`),
      });
      await editor.getByRole("button", { name: "Cancel", exact: true }).click();
      await expect(editor).toHaveCount(0);
    });
  }
}
