import { expect, Page } from "@playwright/test";

export const enterDemo = async (page: Page) => {
  await page.goto("/auth/instantLogin");
  await page.getByRole("button", { name: /explore demo/i }).click();
  await expect(
    page.getByText("Orbit — Product Delivery", { exact: true }),
  ).toBeVisible();
};
