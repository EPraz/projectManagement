import { expect, Page } from "@playwright/test";

export const enterDemo = async (page: Page) => {
  await page.goto("/auth/instantLogin");
  await page.getByRole("button", { name: /explore demo/i }).click();
  await expect(
    page.getByText("Orbit — Product Delivery", { exact: true }),
  ).toBeVisible();
};

export const showProjectNavigation = async (page: Page) => {
  const menu = page.getByRole("button", {
    name: "Open project navigation",
    exact: true,
  });
  await menu
    .or(page.getByRole("navigation", { name: "Project sections", exact: true }))
    .filter({ visible: true })
    .first()
    .waitFor({ state: "visible" });
  if (await menu.isVisible()) await menu.click();
};
export const navigateSection = async (page: Page, name: string) => {
  await showProjectNavigation(page);
  await page.getByRole("button", { name, exact: true }).click();
};

// Use after an intentional Cancel in a journey that now protects a dirty form.
export const discardUnsavedChanges = async (page: Page) => {
  const warning = page.getByRole("alertdialog", {
    name: "Unsaved changes",
    exact: true,
  });
  if (await warning.isVisible())
    await warning
      .getByRole("button", { name: "Discard changes", exact: true })
      .click();
};

export const showWorkspaceControls = async (page: Page) => {
  const user = page.getByRole("button", {
    name: "Open user menu",
    exact: true,
  });
  const menu = page.getByRole("button", {
    name: /^Open (project|workspace) navigation$/,
  });
  // Wait for the destination workspace, not a control still visible on the leaving page.
  if (/^\/projects\/[^/]+(?:\/|$)/.test(new URL(page.url()).pathname)) {
    await showProjectNavigation(page);
  } else {
    await expect(
      page.getByRole("heading", { name: "Projects.", exact: true }),
    ).toBeVisible();
  }
  if (!(await user.isVisible())) await menu.click();
};

// Appearance is an explicit preference in visual checks; a new visitor defaults to light.
export const setAppearance = async (page: Page, mode: "light" | "dark") => {
  await page.addInitScript((value) => {
    localStorage.setItem("theme-mode", value);
    localStorage.setItem("theme-system-preference", "false");
  }, mode);
};
