import { expect, test } from "@playwright/test";
import {
  enterDemo,
  navigateSection,
  setAppearance,
  showWorkspaceControls,
} from "./support/demo";

for (const width of [320, 768, 1024, 1440]) {
  test(`workspace starts with content and keeps bottom controls reachable at ${width}px`, async ({
    page,
  }, info) => {
    const theme = width === 768 || width === 1440 ? "dark" : "light";
    await setAppearance(page, theme);
    await page.setViewportSize({ width, height: 900 });
    await enterDemo(page);
    if (width >= 900) {
      await expect(page.getByRole("banner")).toHaveCount(0);
      const title = await page
        .getByRole("heading", { name: "Projects.", exact: true })
        .boundingBox();
      expect(title!.y).toBeLessThan(100);
    }
    await showWorkspaceControls(page);
    const account = page.getByRole("button", {
      name: "Open user menu",
      exact: true,
    });
    const accountBounds = await account.boundingBox();
    expect(accountBounds!.y).toBeGreaterThan(790);
    await account.click();
    await expect(page.getByRole("menu")).toContainText("Shared demo workspace");
    await page.keyboard.press("Escape");
    if (width < 900) await page.keyboard.press("Escape");
    await page.getByText("Orbit — Product Delivery", { exact: true }).click();
    await expect(
      page.getByRole("combobox", { name: "Selected sprint", exact: true }),
    ).toBeVisible();
    if (width >= 900) {
      await expect(page.getByRole("banner")).toHaveCount(0);
      expect(
        (await page
          .getByRole("combobox", { name: "Selected sprint", exact: true })
          .boundingBox())!.y,
      ).toBeLessThan(60);
    }
    await navigateSection(page, "Goals");
    await expect(
      page.getByRole("heading", { name: "Goals.", exact: true }),
    ).toBeVisible();
    await showWorkspaceControls(page);
    await expect(
      page.getByRole("button", { name: "Refresh project", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^Switch to (light|dark) theme$/ }),
    ).toHaveCount(0);
    expect((await account.boundingBox())!.y).toBeGreaterThan(790);
    await account.click();
    await expect(
      page.getByRole("menuitem", { name: /^Switch to (light|dark) theme$/ }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    if (width < 900) await page.keyboard.press("Escape");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: info.outputPath(`goals-${width}.png`),
      fullPage: true,
      animations: "disabled",
    });
  });
}
