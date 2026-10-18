import { expect, test } from "@playwright/test";
import { enterDemo, setAppearance } from "./support/demo";
for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 1440]) {
    test(`C navigation retains the selected sprint and exposes all sections at ${width}px in ${theme}`, async ({
      page,
    }, testInfo) => {
      await setAppearance(page, theme);
      await page.emulateMedia({ colorScheme: theme });
      await page.setViewportSize({ width, height: 1000 });
      await enterDemo(page);
      await page
        .getByRole("link", {
          name: "Orbit \u2014 Product Delivery",
          exact: true,
        })
        .click();
      const navigate = async (name: string) => {
        if (width < 900)
          await page
            .getByRole("button", {
              name: "Open project navigation",
              exact: true,
            })
            .click();
        await page.getByRole("button", { name, exact: true }).click();
      };
      await navigate("Taskboard");
      await expect(page).toHaveURL(/board\?tab=board$/);
      await page
        .getByRole("combobox", { name: "Selected sprint", exact: true })
        .click();
      await page
        .getByRole("option", {
          name: "Sprint 1 \u2014 Foundation",
          exact: true,
        })
        .click();
      await navigate("Goals");
      await expect(
        page.getByRole("combobox", { name: "Selected sprint", exact: true }),
      ).toHaveValue("Sprint 1 \u2014 Foundation");
      await navigate("Team");
      await expect(
        page.getByText("Project-wide team", { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("combobox", { name: "Selected sprint", exact: true }),
      ).toHaveCount(0);
      await navigate("Epics & Features");
      await expect(
        page.getByText("Project-wide hierarchy", { exact: true }),
      ).toBeVisible();
      await navigate("Capacity");
      await expect(
        page.getByRole("combobox", { name: "Selected sprint" }),
      ).toHaveValue("Sprint 1 \u2014 Foundation");
      await navigate("Retrospective");
      await expect(
        page.getByRole("combobox", { name: "Selected sprint" }),
      ).toHaveValue("Sprint 1 \u2014 Foundation");
      await navigate("Backlog");
      await expect(page).toHaveURL(/board\?tab=backlog$/);
      await navigate("Overview");
      await expect(
        page.getByRole("combobox", { name: "Selected sprint", exact: true }),
      ).toHaveValue("Sprint 1 \u2014 Foundation");
      await expect(
        page.getByRole("button", { name: "Settings", exact: true }),
      ).toHaveCount(0);
      await page.screenshot({
        path: testInfo.outputPath(`shell-${theme}-${width}.png`),
        fullPage: true,
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    });
  }
}
