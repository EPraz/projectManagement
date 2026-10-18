import { expect, test } from "@playwright/test";
import { enterDemo, navigateSection } from "./support/demo";

test("compact retrospective selects a category without horizontal scrolling", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await navigateSection(page, "Retrospective");
  const category = page.getByRole("combobox", {
    name: "Feedback category",
    exact: true,
  });
  await expect(category).toBeVisible();
  await category.click();
  await page.getByRole("option", { name: /^Negative/ }).click();
  await expect(
    page.getByRole("region", { name: "Negative feedback", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Positive feedback", exact: true }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`C feedback categories and editor fit ${width}px in ${theme}`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await enterDemo(page);
      await page.getByText("Orbit — Product Delivery", { exact: true }).click();
      await navigateSection(page, "Retrospective");
      await expect(
        page.getByRole("heading", { name: "Retrospective.", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText("Name hiding and blur change this display only.", {
          exact: false,
        }),
      ).toBeVisible();
      const regions = page.getByRole("region", {
        name: /^(Positive|Negative|Improvements) feedback$/,
      });
      await expect(regions).toHaveCount(width >= 1200 ? 3 : 1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.screenshot({
        path: info.outputPath(`retro-${theme}-${width}.png`),
        animations: "disabled",
        fullPage: true,
      });
      const add = page.getByRole("button", {
        name: "Add new card",
        exact: true,
      });
      await add.click();
      const editor = page.getByRole("dialog", {
        name: "Add Retro Card",
        exact: true,
      });
      await expect(editor.getByLabel("Content", { exact: true })).toBeVisible();
      const save = await editor
        .getByRole("button", { name: "Save", exact: true })
        .boundingBox();
      expect(save!.x + save!.width).toBeLessThanOrEqual(width);
      expect(save!.y + save!.height).toBeLessThanOrEqual(900);
      await editor.getByRole("button", { name: "Cancel", exact: true }).click();
      await expect(add).toBeFocused();
    });
  }
}

test("narrow feedback creation follows its chosen category and persists a category edit", async ({
  page,
  request,
}) => {
  const { accessToken } = await (
    await request.post("/api/auth/instant-login", { data: {} })
  ).json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const created = await request.post("/api/projects", {
    headers,
    data: {
      title: `Category fixture ${Date.now()}`,
      description: "Temporary browser fixture",
      createdBy: "visitor@demo.example",
    },
  });
  expect(created.status()).toBe(201);
  const project = await created.json();
  try {
    const sprint = await request.post("/api/sprints", {
      headers,
      data: {
        projectId: project.id,
        name: "Review sprint",
        startDate: "2026-10-17T00:00:00Z",
        endDate: "2026-10-31T00:00:00Z",
        createdBy: "visitor@demo.example",
      },
    });
    expect(sprint.status()).toBe(201);
    await page.setViewportSize({ width: 390, height: 900 });
    await enterDemo(page);
    await page.getByText(project.title, { exact: true }).click();
    await navigateSection(page, "Retrospective");
    const category = page.getByRole("combobox", {
      name: "Feedback category",
      exact: true,
    });
    await category.click();
    await page.getByRole("option", { name: /^Negative/ }).click();
    await page
      .getByRole("button", { name: "Add new card", exact: true })
      .click();
    const editor = page.getByRole("dialog");
    await expect(editor.getByRole("combobox", { name: /^Type/ })).toHaveText(
      "Negative",
    );
    await editor
      .getByLabel("Content", { exact: true })
      .fill("Improve our review handoff");
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(editor).toHaveCount(0);
    const card = page
      .getByRole("article", { name: "Retrospective card", exact: true })
      .filter({ hasText: "Improve our review handoff" });
    await expect(card).toBeVisible();
    await card
      .getByRole("button", { name: "Card actions", exact: true })
      .click();
    await page.getByRole("menuitem", { name: "Edit", exact: true }).click();
    await editor.getByRole("combobox", { name: /^Type/ }).click();
    await page
      .getByRole("option", { name: "Improvement", exact: true })
      .click();
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(editor).toHaveCount(0);
    await expect(category).toContainText("Improvements");
    await expect(card).toBeVisible();
    await page.reload();
    await category.click();
    await page.getByRole("option", { name: /^Improvements/ }).click();
    await expect(card).toBeVisible();
  } finally {
    expect(
      (await request.delete(`/api/projects/${project.id}`, { headers })).ok(),
    ).toBe(true);
  }
});
