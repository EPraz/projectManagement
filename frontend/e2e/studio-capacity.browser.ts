import { expect, test } from "@playwright/test";
import { enterDemo, navigateSection } from "./support/demo";
test.use({ actionTimeout: 5000 });
test("compact capacity shows member details without inventing a Development activity", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await navigateSection(page, "Capacity");
  const cards = page.getByRole("region", {
    name: "Member capacity cards",
    exact: true,
  });
  await expect(cards).toBeVisible();
  await expect(page.getByText("Development", { exact: true })).toHaveCount(0);
  await cards
    .getByRole("button", { name: /^Show capacity details for / })
    .first()
    .click();
  await expect(
    cards.getByText("Completed work", { exact: true }).first(),
  ).toBeVisible();
  await expect(cards.getByRole("progressbar").first()).toBeVisible();
});

test("capacity validation rejects zero capacity, accepts zero days/remaining and keeps canonical progress", async ({
  page,
  request,
}) => {
  const { accessToken } = await (
    await request.post("/api/auth/instant-login", { data: {} })
  ).json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const projects = await (
    await request.get("/api/projects", { headers })
  ).json();
  const selected = projects.find(
    (p: { title: string }) => p.title === "Orbit — Product Delivery",
  );
  const project = await (
    await request.get(`/api/projects/${selected.id}`, { headers })
  ).json();
  const sprint = project.sprints.find(
    (s: { name: string }) => s.name === "Sprint 2 — Delivery",
  );
  const member = sprint.teamMemberCapacities[0];
  let writes = 0;
  page.on("request", (r) => {
    if (
      r.url().endsWith(`/api/team-member-capacities/${member.id}`) &&
      r.method() === "PATCH"
    )
      writes++;
  });
  try {
    await enterDemo(page);
    await page.getByText(project.title, { exact: true }).click();
    await navigateSection(page, "Capacity");
    const row = page.getByRole("row").filter({ hasText: member.user.name });
    await row
      .getByRole("button", { name: "Edit capacity", exact: true })
      .click();
    const editor = page.getByRole("dialog", {
      name: "Edit Team Member Capacity",
      exact: true,
    });
    await editor.getByLabel("Capacity (hours)", { exact: true }).fill("0");
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(
      editor.getByText("Capacity must be at least 1", { exact: true }),
    ).toBeVisible();
    expect(writes).toBe(0);
    await editor.getByLabel("Capacity (hours)", { exact: true }).fill("20");
    await editor.getByLabel("Days Off", { exact: true }).fill("0");
    await editor
      .getByLabel("Remaining Work (hours)", { exact: true })
      .fill("0");
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(editor).toHaveCount(0);
    expect(writes).toBe(1);
    await expect(row.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
    await expect(row.getByText("20.0h", { exact: true })).toBeVisible();
    const saved = await (
      await request.get(`/api/team-member-capacities/${member.id}`, { headers })
    ).json();
    expect(saved).toMatchObject({
      userId: member.userId,
      sprintId: sprint.id,
      capacity: 20,
      daysOff: 0,
      remainingWork: 0,
    });
  } finally {
    await request.patch(`/api/team-member-capacities/${member.id}`, {
      headers,
      data: {
        capacity: member.capacity,
        daysOff: member.daysOff,
        remainingWork: member.remainingWork,
      },
    });
  }
});
for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`C capacity remains readable at ${width}px in ${theme}`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await enterDemo(page);
      await page.getByText("Orbit — Product Delivery", { exact: true }).click();
      await navigateSection(page, "Capacity");
      if (width < 1200) {
        const cards = page.getByRole("region", {
          name: "Member capacity cards",
          exact: true,
        });
        await expect(cards).toBeVisible();
        await cards
          .getByRole("button", { name: /^Show capacity details for / })
          .first()
          .click();
        await expect(cards.getByRole("progressbar").first()).toBeVisible();
      } else
        await expect(
          page.getByRole("table", { name: "Member capacity", exact: true }),
        ).toBeVisible();
      await expect(page.getByText("Development", { exact: true })).toHaveCount(
        0,
      );
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: info.outputPath(`capacity-${theme}-${width}.png`),
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Edit capacity", exact: true })
        .first()
        .click();
      const editor = page.getByRole("dialog", {
        name: "Edit Team Member Capacity",
        exact: true,
      });
      await expect(editor).toBeVisible();
      const bounds = await editor
        .getByRole("button", { name: "Save", exact: true })
        .boundingBox();
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(900);
      await editor.getByRole("button", { name: "Cancel", exact: true }).click();
      await expect(editor).toHaveCount(0);
    });
  }
}
