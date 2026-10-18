import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";
import { enterDemo, navigateSection } from "./support/demo";
test.use({ actionTimeout: 5000 });
async function backlogFixture(page: Page, request: APIRequestContext) {
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
  await enterDemo(page);
  await page.getByText(project.title, { exact: true }).click();
  await navigateSection(page, "Backlog");
  return { project, headers };
}
test("Backlog ticket assignment filters only the selected sprint and clears without broadening scope", async ({
  page,
  request,
}) => {
  const { project } = await backlogFixture(page, request);
  const sprint = project.sprints.find(
    (s: { name: string }) => s.name === "Sprint 2 — Delivery",
  );
  const tickets = project.tickets.filter(
    (t: { sprintId: string }) => t.sprintId === sprint.id,
  );
  const user = project.users.find((u: { id: string }) =>
    tickets.some((t: { assignedTo: string }) => t.assignedTo === u.id),
  );
  await page
    .getByRole("combobox", { name: "Ticket assignee", exact: true })
    .click();
  await page.getByRole("option", { name: user.name, exact: true }).click();
  const table = page.getByRole("table", {
    name: "Selected sprint backlog",
    exact: true,
  });
  const matching = tickets.filter(
    (t: { assignedTo: string }) => t.assignedTo === user.id,
  );
  for (const ticket of matching)
    await expect(
      table.getByRole("button", { name: ticket.title, exact: true }),
    ).toBeVisible();
  for (const ticket of tickets.filter(
    (t: { assignedTo: string }) => t.assignedTo !== user.id,
  ))
    await expect(
      table.getByRole("button", { name: ticket.title, exact: true }),
    ).toHaveCount(0);
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  for (const ticket of tickets)
    await expect(
      table.getByRole("button", { name: ticket.title, exact: true }),
    ).toHaveCount(1);
  const other = project.sprints.find((s: { id: string }) => s.id !== sprint.id);
  await page
    .getByRole("combobox", { name: "Selected sprint", exact: true })
    .click();
  await page.getByRole("option", { name: other.name, exact: true }).click();
  for (const ticket of tickets)
    await expect(
      table.getByRole("button", { name: ticket.title, exact: true }),
    ).toHaveCount(0);
  for (const ticket of project.tickets.filter(
    (t: { sprintId: string }) => t.sprintId === other.id,
  ))
    await expect(
      table.getByRole("button", { name: ticket.title, exact: true }),
    ).toHaveCount(1);
});

test("Backlog columns remain selectable and no matches stays distinct from hidden columns", async ({
  page,
  request,
}) => {
  await backlogFixture(page, request);
  const table = page.getByRole("table", {
    name: "Selected sprint backlog",
    exact: true,
  });
  await page
    .getByRole("button", { name: "Column Options", exact: true })
    .click();
  await page
    .getByRole("checkbox", { name: "Show Priority column", exact: true })
    .uncheck();
  await page.keyboard.press("Escape");
  await expect(
    table.getByRole("columnheader", { name: "Priority", exact: true }),
  ).toHaveCount(0);
  await page
    .getByRole("textbox", { name: "Search work", exact: true })
    .fill("No matching portfolio ticket title");
  await expect(page.getByRole("alert")).toContainText(
    "No tickets match this sprint",
  );
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await expect(table).toBeVisible();
  await page
    .getByRole("button", { name: "Column Options", exact: true })
    .click();
  await page.getByRole("button", { name: "Hide All", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("alert")).toContainText("Select a column");
  await page
    .getByRole("button", { name: "Column Options", exact: true })
    .click();
  await page.getByRole("button", { name: "Show All", exact: true }).click();
  await page.keyboard.press("Escape");
  for (const name of [
    "Order",
    "ID",
    "State",
    "Title",
    "Type",
    "Priority",
    "Assigned To",
    "Sprint",
    "Due Date",
    "Est. Hours",
    "Rem. Hours",
    "Blocking",
    "Tags",
    "Actions",
  ])
    await expect(
      table.getByRole("columnheader", { name, exact: true }),
    ).toHaveCount(1);
});
test("empty sprint Backlog supports ticket and child-task CRUD through canonical editors", async ({
  page,
  request,
}) => {
  const { accessToken } = await (
    await request.post("/api/auth/instant-login", { data: {} })
  ).json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const title = `Backlog journey ${Date.now()}`;
  const created = await request.post("/api/projects", {
    headers,
    data: { title, createdBy: "visitor@demo.example" },
  });
  expect(created.status()).toBe(201);
  const project = await created.json();
  try {
    expect(
      (
        await request.post("/api/sprints", {
          headers,
          data: {
            name: "Focused demo sprint",
            projectId: project.id,
            startDate: "2026-10-01T00:00:00Z",
            endDate: "2026-10-31T00:00:00Z",
            createdBy: "visitor@demo.example",
          },
        })
      ).status(),
    ).toBe(201);
    await enterDemo(page);
    await page.getByText(title, { exact: true }).click();
    await navigateSection(page, "Backlog");
    await expect(
      page
        .getByRole("alert")
        .filter({ hasText: "No tickets in this sprint yet" }),
    ).toHaveCount(1);
    await page
      .getByRole("button", { name: "Add New Item", exact: true })
      .click();
    const ticketEditor = page.getByRole("dialog", {
      name: "Create Ticket",
      exact: true,
    });
    await ticketEditor
      .getByPlaceholder("Ticket title")
      .fill("A complete backlog journey");
    await ticketEditor
      .getByRole("button", { name: "Save", exact: true })
      .click();
    await expect(ticketEditor).toHaveCount(0);
    let snapshot = await (
      await request.get(`/api/projects/${project.id}`, { headers })
    ).json();
    const ticket = snapshot.tickets.find(
      (t: { title: string }) => t.title === "A complete backlog journey",
    );
    expect(ticket.sprintId).toBe(snapshot.sprints[0].id);
    await page
      .getByRole("button", {
        name: "Expand tasks for A complete backlog journey",
        exact: true,
      })
      .click();
    await page.getByRole("button", { name: "Add task", exact: true }).click();
    const createTask = page.getByRole("dialog", {
      name: "Create Task",
      exact: true,
    });
    await createTask.getByPlaceholder("Task title").fill("Verify child work");
    await createTask.getByRole("button", { name: "Save", exact: true }).click();
    await expect(createTask).toHaveCount(0);
    snapshot = await (
      await request.get(`/api/projects/${project.id}`, { headers })
    ).json();
    const task = snapshot.tickets.find(
      (t: { id: number }) => t.id === ticket.id,
    ).tasks[0];
    await page
      .getByRole("button", { name: `Edit task ${task.id}`, exact: true })
      .click();
    const taskEditor = page.getByRole("dialog", {
      name: "Task Details",
      exact: true,
    });
    await taskEditor
      .getByRole("combobox", { name: "Change status", exact: true })
      .click();
    await page.getByRole("option", { name: "Done", exact: true }).click();
    await taskEditor.getByLabel("Remaining Hours", { exact: true }).fill("0");
    await taskEditor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(taskEditor).toHaveCount(0);
    expect(
      (await (await request.get(`/api/tasks/${task.id}`, { headers })).json())
        .status.name,
    ).toBe("DONE");
    await page
      .getByRole("button", { name: `Delete task ${task.id}`, exact: true })
      .click();
    await page
      .getByRole("dialog", { name: "Confirm Delete", exact: true })
      .getByRole("button", { name: "Proceed", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: `Edit task ${task.id}`, exact: true }),
    ).toHaveCount(0);
    await page
      .getByRole("button", { name: `Delete ticket ${ticket.id}`, exact: true })
      .click();
    await page
      .getByRole("dialog", { name: "Confirm Delete", exact: true })
      .getByRole("button", { name: "Proceed", exact: true })
      .click();
    await expect(
      page
        .getByRole("alert")
        .filter({ hasText: "No tickets in this sprint yet" }),
    ).toHaveCount(1);
    expect(
      (await request.get(`/api/tickets/${ticket.id}`, { headers })).status(),
    ).toBe(404);
  } finally {
    await request.delete(`/api/projects/${project.id}`, { headers });
  }
});
for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`C Backlog preserves task access and viewport at ${width}px in ${theme}`, async ({
      page,
      request,
    }, info) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await backlogFixture(page, request);
      const expand = page
        .getByRole("button", { name: /^Expand tasks for / })
        .first();
      await expand.focus();
      await page.keyboard.press("Enter");
      const edit = page.getByRole("button", { name: /^Edit task / }).first();
      await edit.focus();
      await page.keyboard.press("Enter");
      const editor = page.getByRole("dialog", {
        name: "Task Details",
        exact: true,
      });
      await expect(editor).toBeVisible();
      await editor
        .getByRole("button", { name: "Close task editor", exact: true })
        .click();
      await expect(editor).toHaveCount(0);
      await expect(
        page.getByRole("button", { name: /^Collapse tasks for / }).first(),
      ).toBeVisible();
      if (width < 1200)
        await expect(
          page.getByRole("region", {
            name: "Selected sprint work list",
            exact: true,
          }),
        ).toBeVisible();
      else
        await expect(
          page.getByRole("table", {
            name: "Selected sprint backlog",
            exact: true,
          }),
        ).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: info.outputPath(`backlog-${theme}-${width}.png`),
        fullPage: true,
      });
    });
  }
}
