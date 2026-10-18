// Read-only cloud navigation. No fixture initialization, content mutation or recording.
const {
  chromium,
  expect,
} = require("../../../frontend/node_modules/@playwright/test");
const fs = require("node:fs"),
  path = require("node:path");
const origin = "https://project-management-murex-pi.vercel.app";
(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const results = [];
  try {
    for (const width of [390, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        reducedMotion: "reduce",
      });
      const page = await context.newPage();
      page.setDefaultTimeout(20000);
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(origin + "/auth/instantLogin");
      await page
        .getByRole("button", { name: "Explore demo", exact: true })
        .click();
      await expect(
        page.getByRole("link", {
          name: "Orbit — Product Delivery",
          exact: true,
        }),
      ).toBeVisible({ timeout: 90000 });
      await page
        .getByRole("link", { name: "Orbit — Product Delivery", exact: true })
        .click();
      await expect(
        page.getByRole("combobox", { name: "Selected sprint", exact: true }),
      ).toBeVisible();
      for (const name of [
        "Epics & Features",
        "Backlog",
        "Taskboard",
        "Team",
        "Capacity",
        "Goals",
        "Retrospective",
        "Overview",
      ]) {
        if (width < 900)
          await page
            .getByRole("button", {
              name: "Open project navigation",
              exact: true,
            })
            .click();
        await page.getByRole("button", { name, exact: true }).click();
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
      }
      expect(errors).toEqual([]);
      results.push({
        width,
        sections: 8,
        browserErrors: 0,
        contentMutations: 0,
      });
      await context.close();
    }
    const out = path.resolve(__dirname, "../evidence");
    fs.mkdirSync(out, { recursive: true });
    fs.writeFileSync(
      path.join(out, "03-public-navigation.json"),
      JSON.stringify({ origin, results, recording: false }, null, 2),
    );
    console.log(JSON.stringify(results));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error.stack);
  process.exitCode = 1;
});
