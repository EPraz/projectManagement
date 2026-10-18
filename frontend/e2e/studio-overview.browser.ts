import { expect, test } from "@playwright/test";
import { enterDemo, setAppearance } from "./support/demo";
for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`C Overview modules are readable at ${width}px in ${theme}`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: 1000 });
      await setAppearance(page, theme);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await enterDemo(page);
      await page
        .getByRole("link", {
          name: "Orbit \u2014 Product Delivery",
          exact: true,
        })
        .click();
      await expect(
        page.getByRole("progressbar", {
          name: "Overall Progress",
          exact: true,
        }),
      ).toHaveAttribute("aria-valuenow", "33");
      await expect(
        page.getByRole("heading", { name: "Recent updates", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Project details", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("heading", { name: "Team workload", exact: true }),
      ).toBeVisible();
      await expect(
        page.getByRole("region", { name: "Ticket states", exact: true }),
      ).toContainText("Completed");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: info.outputPath(`overview-${theme}-${width}.png`),
        fullPage: true,
      });
    });
  }
}

test("Overview keeps project progress separate from sprint blockers, deadlines and canonical live changes", async ({
  page,
  request,
}) => {
  const { accessToken } = await (
    await request.post("/api/auth/instant-login", { data: {} })
  ).json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const created = await request.post("/api/projects", {
    headers,
    data: {
      title: `Overview fixture ${Date.now()}`,
      createdBy: "visitor@demo.example",
    },
  });
  expect(created.status()).toBe(201);
  const project = await created.json();
  try {
    const workspace = await (
      await request.get(`/api/projects/${project.id}`, { headers })
    ).json();
    const state = (name: string) =>
      workspace.ticketStatuses.find(
        (status: { name: string }) => status.name === name,
      ).id;
    const sprints: { id: string; name: string }[] = [];
    for (const name of ["Attention sprint", "Completed sprint"]) {
      const response = await request.post("/api/sprints", {
        headers,
        data: {
          name,
          startDate: "2026-10-01T00:00:00Z",
          endDate: "2026-10-31T00:00:00Z",
          projectId: project.id,
          createdBy: "visitor@demo.example",
        },
      });
      expect(response.status()).toBe(201);
      sprints.push(await response.json());
    }
    const records: { id: number }[] = [];
    for (let index = 0; index < 7; index++) {
      const completed = index >= 5;
      const response = await request.post("/api/tickets", {
        headers,
        data: {
          title: `Attention item ${index}`,
          sprintId: sprints[index === 6 ? 1 : 0].id,
          createdBy: "visitor@demo.example",
          isBlocked: !completed && index % 2 === 0,
          dueDate: new Date(Date.now() - 3 * 86400000).toISOString(),
        },
      });
      expect(response.status()).toBe(201);
      const ticket = await response.json();
      const patched = await request.patch(`/api/tickets/${ticket.id}`, {
        headers,
        data: {
          id: ticket.id,
          statusId: state(
            completed ? "COMPLETED" : index % 2 ? "BLOCKED" : "NEW",
          ),
          isBlocked: !completed && index % 2 === 0,
          updatedBy: "visitor@demo.example",
        },
      });
      expect(patched.status()).toBe(200);
      records.push(ticket);
    }
    await enterDemo(page);
    await page.goto(`/projects/${project.id}/overview`);
    const selector = page.getByRole("combobox", {
      name: "Selected sprint",
      exact: true,
    });
    await selector.click();
    await page
      .getByRole("option", { name: "Attention sprint", exact: true })
      .click();
    await expect(
      page.getByRole("progressbar", { name: "Overall Progress", exact: true }),
    ).toHaveAttribute("aria-valuenow", "29");
    await expect(
      page.getByRole("progressbar", { name: "Sprint completion", exact: true }),
    ).toHaveAttribute("aria-valuenow", "17");
    const attention = page.getByRole("region", {
      name: "Needs attention",
      exact: true,
    });
    await expect(attention).toContainText("5 blocked");
    await expect(
      attention.getByRole("button", { name: /^Open ticket/ }),
    ).toHaveCount(4);
    await expect(
      page.getByRole("tab", { name: "Overdue · 5", exact: true }),
    ).toBeVisible();
    await selector.click();
    await page
      .getByRole("option", { name: "Completed sprint", exact: true })
      .click();
    await expect(attention).toContainText("0 blocked");
    await expect(
      page.getByRole("progressbar", { name: "Sprint completion", exact: true }),
    ).toHaveAttribute("aria-valuenow", "100");
    await expect(
      page.getByRole("tab", { name: "Overdue · 0", exact: true }),
    ).toBeVisible();
    expect(
      (
        await request.patch(`/api/tickets/${records[0].id}`, {
          headers,
          data: {
            id: records[0].id,
            isBlocked: false,
            statusId: state("NEW"),
            updatedBy: "visitor@demo.example",
          },
        })
      ).ok(),
    ).toBe(true);
    await selector.click();
    await page
      .getByRole("option", { name: "Attention sprint", exact: true })
      .click();
    await expect(attention).toContainText("4 blocked");
    await expect(
      page.getByRole("progressbar", { name: "Overall Progress", exact: true }),
    ).toHaveAttribute("aria-valuenow", "29");
  } finally {
    await request.delete(`/api/projects/${project.id}`, { headers });
  }
});
