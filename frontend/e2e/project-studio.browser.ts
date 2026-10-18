import { expect, test } from "@playwright/test";

import { enterDemo, setAppearance } from "./support/demo";

test("new visitors start in light even on a dark system and manual appearance persists", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });

  await enterDemo(page);
  const account = page.getByRole("button", {
    name: "Open user menu",
    exact: true,
  });
  await account.click();

  await expect(
    page.getByRole("menuitem", { name: "Switch to dark theme", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("menuitem", { name: "Switch to dark theme", exact: true })
    .click();
  await expect(
    page.getByRole("menuitem", { name: "Switch to light theme", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.reload();
  await account.click();
  await expect(
    page.getByRole("menuitem", { name: "Switch to light theme", exact: true }),
  ).toBeVisible();
  const follow = page.getByRole("menuitemcheckbox", {
    name: /Follow system appearance/,
  });
  await expect(follow).toHaveAttribute("aria-checked", "false");
  await follow.click();
  await page.keyboard.press("Escape");
  await page.emulateMedia({ colorScheme: "light" });
  await account.click();
  await expect(
    page.getByRole("menuitem", { name: "Switch to dark theme", exact: true }),
  ).toBeVisible();
});

for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`C Projects stays usable at ${width}px in ${theme}`, async ({
      page,
    }, testInfo) => {
      await page.setViewportSize({ width, height: 1000 });

      await setAppearance(page, theme);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });

      await enterDemo(page);

      await expect(
        page.getByRole("progressbar", { name: "Project progress" }),
      ).toHaveCount(2);

      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);

      await page.evaluate(() => document.fonts.ready);

      expect(
        await page.evaluate(() => document.fonts.check('16px "IBM Plex Sans"')),
      ).toBe(true);

      await page.screenshot({
        path: testInfo.outputPath(`projects-${theme}-${width}.png`),
        fullPage: true,
      });

      await page
        .getByRole("textbox", { name: "Search projects" })
        .fill("NoSuchProjectName");

      await expect(
        page.getByText("No matching projects", { exact: true }),
      ).toBeVisible();

      await expect(
        page.getByText("No projects yet", { exact: true }),
      ).toHaveCount(0);

      await page
        .getByRole("textbox", { name: "Search projects" })
        .fill("Orbit");

      await page
        .getByRole("link", { name: "Orbit — Product Delivery", exact: true })
        .click();

      await expect(page).toHaveURL(/\/overview$/);
    });
  }
}

test("project deletion is confirmed and a failed deletion remains recoverable", async ({
  page,
  request,
}) => {
  const login = await request.post("/api/auth/instant-login", { data: {} });
  const { accessToken } = await login.json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const marker = `Studio deletion ${Date.now()}`;
  const created = await request.post("/api/projects", {
    headers,
    data: {
      title: marker,
      description: "Disposable UI fixture",
      createdBy: "visitor@demo.example",
    },
  });
  expect(created.status()).toBe(201);
  const project = await created.json();
  try {
    await enterDemo(page);
    await page
      .getByRole("button", {
        name: `Project actions for ${marker}`,
        exact: true,
      })
      .click();
    await page
      .getByRole("menuitem", { name: "Delete Project", exact: true })
      .click();
    const dialog = page.getByRole("dialog", { name: "Confirm Delete" });
    await expect(dialog).toContainText(marker);
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(
      page.getByRole("link", { name: marker, exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", {
        name: `Project actions for ${marker}`,
        exact: true,
      })
      .click();
    await page
      .getByRole("menuitem", { name: "Delete Project", exact: true })
      .click();
    await page.route(`**/api/projects/${project.id}`, (route) =>
      route.request().method() === "DELETE"
        ? route.fulfill({ status: 503, body: "unavailable" })
        : route.continue(),
    );
    await dialog.getByRole("button", { name: "Proceed", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText("Could not delete");
    await page.unroute(`**/api/projects/${project.id}`);
    await dialog.getByRole("button", { name: "Proceed", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: marker, exact: true }),
    ).toHaveCount(0);
  } finally {
    await page.unroute(`**/api/projects/${project.id}`);
    await request.delete(`/api/projects/${project.id}`, { headers });
  }
});
