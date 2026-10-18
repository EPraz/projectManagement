import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import { enterDemo, navigateSection } from "./support/demo";

test.use({ actionTimeout: 5000 });
for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 390, 768, 1024, 1280, 1440]) {
    test(`complete C workspace reflows at ${width}px in ${theme}`, async ({
      page,
    }) => {
      test.setTimeout(60000);
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await enterDemo(page);
      await page.getByText("Orbit — Product Delivery", { exact: true }).click();
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(() => document.fonts.check('16px "IBM Plex Sans"')),
      ).toBe(true);
      const output = fileURLToPath(
        new URL(
          "../../.design/product-redesign/screenshots/production-c/",
          import.meta.url,
        ),
      );
      await mkdir(output, { recursive: true });
      for (const section of [
        "Overview",
        "Taskboard",
        "Backlog",
        "Epics & Features",
        "Goals",
        "Capacity",
        "Team",
        "Retrospective",
      ]) {
        await navigateSection(page, section);
        const title =
          section === "Overview"
            ? "Orbit — Product Delivery."
            : section === "Team"
              ? "Team Members."
              : `${section}.`;
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
        await expect(
          page.getByText("This view is loading. Please wait.", { exact: true }),
        ).toHaveCount(0);
        if (section === "Taskboard")
          await expect(
            page.getByRole("region", {
              name:
                width >= 1200
                  ? "Sprint task matrix"
                  : "Tickets grouped by ticket state",
              exact: true,
            }),
          ).toBeVisible();
        if (section === "Backlog")
          await expect(
            page.getByRole("region", {
              name:
                width >= 1200 ? "Backlog table" : "Selected sprint work list",
              exact: true,
            }),
          ).toBeVisible();
        if (section === "Goals")
          await expect(
            page.getByRole("region", {
              name: "Sprint goal cards",
              exact: true,
            }),
          ).toBeVisible();
        if (section === "Capacity")
          await expect(
            page.getByRole("region", {
              name:
                width >= 1200
                  ? "Sprint capacity comparison"
                  : "Member capacity cards",
              exact: true,
            }),
          ).toBeVisible();
        if (section === "Retrospective")
          await expect(
            page.getByRole("region", {
              name: "Positive feedback",
              exact: true,
            }),
          ).toBeVisible();
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          section,
        ).toBe(true);
        if ([390, 768, 1280].includes(width)) {
          await page.mouse.move(width - 2, 2);
          await page.screenshot({
            path: resolve(
              output,
              `${section.replace(/[^a-z]/gi, "-")}-${theme}-${width}.png`,
            ),
            fullPage: true,
            animations: "disabled",
          });
        }
      }
      expect(errors).toEqual([]);
    });
  }
}

test("former project assignees remain visible and saving preserves their assignment", async ({
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
  const project = projects.find(
    (p: { title: string }) => p.title === "Orbit — Product Delivery",
  );
  const ticket = project.tickets.find(
    (t: { assignedTo: string; tasks: { assignedTo: string }[] }) =>
      t.assignedTo && t.tasks.some((task) => task.assignedTo === t.assignedTo),
  );
  const task = ticket.tasks.find(
    (t: { assignedTo: string }) => t.assignedTo === ticket.assignedTo,
  );
  expect(ticket).toBeTruthy();
  expect(task).toBeTruthy();
  const member = ticket.assignedTo;
  try {
    expect(
      (
        await request.delete(`/api/projects/${project.id}/users/${member}`, {
          headers,
        })
      ).ok(),
    ).toBe(true);
    await enterDemo(page);
    await page.goto(
      `/projects/${project.id}/board?tab=backlog&ticketId=${ticket.id}`,
    );
    const editor = page.getByRole("dialog");
    await expect(
      editor.getByRole("combobox", { name: "Assigned To", exact: true }),
    ).toContainText("Outside project team");
    await expect(
      editor.getByRole("complementary", {
        name: "Ticket summary",
        exact: true,
      }),
    ).toContainText("Outside project team");
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(editor).toHaveCount(0);
    await page.goto(
      `/projects/${project.id}/board?tab=backlog&taskId=${task.id}`,
    );
    await expect(
      editor.getByRole("combobox", { name: "Assigned To", exact: true }),
    ).toContainText("Outside project team");
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(editor).toHaveCount(0);
    const canonical = await (
      await request.get(`/api/projects/${project.id}`, { headers })
    ).json();
    const saved = canonical.tickets.find(
      (t: { id: number }) => t.id === ticket.id,
    );
    expect(saved.assignedTo).toBe(member);
    expect(
      saved.tasks.find((t: { id: number }) => t.id === task.id).assignedTo,
    ).toBe(member);
  } finally {
    expect(
      (
        await request.post(`/api/projects/${project.id}/users/${member}`, {
          headers,
        })
      ).ok(),
    ).toBe(true);
  }
});

for (const theme of ["light", "dark"] as const) {
  test(`C reflow and landscape editors retain visible keyboard actions in ${theme}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 640, height: 900 });
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    await enterDemo(page);
    await page.getByText("Orbit — Product Delivery", { exact: true }).click();
    // 640 CSS px models a 1280px viewport at 200% browser zoom; also enlarge root text.
    await page.addStyleTag({ content: "html { font-size: 200%; }" });
    for (const section of [
      "Overview",
      "Taskboard",
      "Goals",
      "Team",
      "Retrospective",
    ]) {
      await navigateSection(page, section);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        section,
      ).toBe(true);
    }
    await page.setViewportSize({ width: 780, height: 390 });
    await page.addStyleTag({ content: "html { font-size: 100%; }" });
    const add = page.getByRole("button", { name: "Add new card", exact: true });
    await add.focus();
    await page.keyboard.press("Enter");
    const editor = page.getByRole("dialog");
    const content = editor.getByLabel("Content", { exact: true });
    await content.focus();
    await page.keyboard.press("Tab");
    await expect(editor.getByRole("combobox", { name: /^Type/ })).toBeFocused();
    const save = editor.getByRole("button", { name: "Save", exact: true });
    const bounds = await save.boundingBox();
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(390);
    await editor.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(add).toBeFocused();
  });
}
