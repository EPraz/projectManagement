import { expect, test } from "@playwright/test";
import { setAppearance } from "./support/demo";

for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 768, 1024, 1440]) {
    test(`studio entry stays readable at ${width}px in ${theme}`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: 900 });
      await setAppearance(page, theme);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/auth/instantLogin");
      await expect(page.getByRole("heading", { level: 1 })).toContainText(
        "A clear plan.",
      );
      await expect(
        page.getByRole("button", { name: "Explore demo", exact: true }),
      ).toBeEnabled();
      await expect(
        page.getByText(
          "Other visitors can see your changes. Please use fictional information.",
        ),
      ).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      // Measure the rendered heading against its actual inherited surface.
      const contrast = await page
        .getByRole("heading", { level: 1 })
        .evaluate((heading) => {
          const rgb = (color: string) =>
            color
              .match(/[\d.]+/g)!
              .slice(0, 3)
              .map(Number);
          const luminance = (color: string) =>
            rgb(color)
              .map((channel) => {
                const value = channel / 255;
                return value <= 0.04045
                  ? value / 12.92
                  : ((value + 0.055) / 1.055) ** 2.4;
              })
              .reduce(
                (sum, value, index) =>
                  sum + value * [0.2126, 0.7152, 0.0722][index],
                0,
              );
          let surface = heading.parentElement!;
          while (
            getComputedStyle(surface).backgroundColor === "rgba(0, 0, 0, 0)"
          )
            surface = surface.parentElement!;
          const text = luminance(getComputedStyle(heading).color);
          const background = luminance(
            getComputedStyle(surface).backgroundColor,
          );
          return (
            (Math.max(text, background) + 0.05) /
            (Math.min(text, background) + 0.05)
          );
        });
      expect(contrast).toBeGreaterThanOrEqual(4.5);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: info.outputPath(`entry-${theme}-${width}.png`),
        fullPage: true,
      });
    });
  }
}

for (const width of [390, 1440]) {
  test(`entry retains pending feedback and transitions through an accessible loading view at ${width}px`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 900 });
    let releaseLogin!: () => void;
    let releaseView!: () => void;
    const pendingLogin = new Promise<void>((resolve) => {
      releaseLogin = resolve;
    });
    const pendingView = new Promise<void>((resolve) => {
      releaseView = resolve;
    });
    await page.route("**/api/auth/instant-login", async (route) => {
      await pendingLogin;
      await route.continue();
    });
    await page.route(
      /\/(?:assets\/ProjectsPage-[^/]+\.js|src\/pages\/projects\/ProjectsPage\.tsx)(?:\?.*)?$/,
      async (route) => {
        await pendingView;
        await route.continue();
      },
    );
    try {
      await page.goto("/auth/instantLogin");
      await page
        .getByRole("button", { name: "Explore demo", exact: true })
        .click();
      await expect(
        page.getByRole("button", { name: /Opening demo/ }),
      ).toBeDisabled();
      await expect(page.getByRole("status")).toContainText("about a minute");
      releaseLogin();
      await expect(
        page.getByRole("progressbar", {
          name: "Loading projects…",
          exact: true,
        }),
      ).toBeVisible();
      await expect(page.getByRole("status")).toHaveAttribute(
        "aria-busy",
        "true",
      );
      await page.screenshot({
        path: info.outputPath(`loading-${width}.png`),
        fullPage: true,
      });
      releaseView();
      await expect(
        page.getByRole("heading", { name: "Projects.", exact: true }),
      ).toBeVisible();
    } finally {
      releaseLogin();
      releaseView();
    }
  });
}
