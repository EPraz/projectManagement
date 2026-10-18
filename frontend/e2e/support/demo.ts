import { expect, Page } from "@playwright/test";

export const enterDemo = async (page: Page) => {
  await page.goto("/auth/instantLogin");
  await page.getByRole("button", { name: /explore demo/i }).click();
  await expect(
    page.getByText("Orbit — Product Delivery", { exact: true }),
  ).toBeVisible();
};

export const showProjectNavigation = async (page: Page) => {
  await page.getByRole("banner").waitFor({ state: "visible" });
  const menu = page.getByRole("button", {
    name: "Open project navigation",
    exact: true,
  });
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
