import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";
import { enterDemo, navigateSection, setAppearance } from "./support/demo";
test.use({ actionTimeout: 5000 });
async function boardFixture(page: Page, request: APIRequestContext) {
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
  await navigateSection(page, "Taskboard");
  return { project, headers };
}
test("wide taskboard keeps all task columns and collapses one ticket row without changing other rows", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const { project } = await boardFixture(page, request);
  const board = page.getByRole("region", {
    name: "Sprint task matrix",
    exact: true,
  });
  for (const name of [
    "Todo",
    "In Progress",
    "Blocked",
    "Code Review",
    "Testing",
    "Done",
  ])
    await expect(
      board.getByRole("columnheader", {
        name: `Task state: ${name}`,
        exact: true,
      }),
    ).toHaveCount(1);
  const first = project.tickets.find(
    (t: { sprintId: string }) =>
      t.sprintId ===
      project.sprints.find(
        (s: { name: string }) => s.name === "Sprint 2 — Delivery",
      ).id,
  );
  const row = board.getByRole("row").filter({
    has: page.getByRole("heading", { name: first.title, exact: true }),
  });
  await row
    .getByRole("button", { name: `Collapse ticket #${first.id}`, exact: true })
    .click();
  await expect(
    row.getByRole("button", {
      name: `Expand ticket #${first.id}`,
      exact: true,
    }),
  ).toHaveAttribute("aria-expanded", "false");
  await expect(row.getByText("Tasks collapsed", { exact: true })).toBeVisible();
  await expect(
    board.getByRole("button", { name: /^Collapse ticket #/ }),
  ).not.toHaveCount(0);
  await row
    .getByRole("button", { name: `Expand ticket #${first.id}`, exact: true })
    .click();
  await expect(row.getByText("Tasks collapsed", { exact: true })).toHaveCount(
    0,
  );
});

test("task-assignee and task-state filters retain matching parents and never broaden the sprint", async ({
  page,
  request,
}) => {
  const { project } = await boardFixture(page, request);
  const delivery = project.sprints.find(
    (s: { name: string }) => s.name === "Sprint 2 — Delivery",
  );
  const tickets = project.tickets.filter(
    (t: { sprintId: string }) => t.sprintId === delivery.id,
  );
  const user = project.users.find(
    (u: { id: string }) => u.id !== tickets[0].assignedTo,
  );
  expect(user).toBeTruthy();
  const fixtureTask = tickets[0].tasks[0];
  const originalAssignee = fixtureTask.assignedTo;
  const { accessToken } = await (
    await request.post("/api/auth/instant-login", { data: {} })
  ).json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  expect(
    (
      await request.patch(`/api/tasks/${fixtureTask.id}`, {
        headers,
        data: {
          id: fixtureTask.id,
          assignedTo: user.id,
          updatedBy: fixtureTask.createdBy,
        },
      })
    ).ok(),
  ).toBe(true);
  fixtureTask.assignedTo = user.id;
  await page.reload();
  try {
    await page
      .getByRole("combobox", { name: "Task assignee", exact: true })
      .click();
    await page.getByRole("option", { name: user.name, exact: true }).click();
    const expected = tickets.filter((t: { tasks: { assignedTo: string }[] }) =>
      t.tasks.some((task) => task.assignedTo === user.id),
    );
    const board = page.getByRole("region", {
      name: "Sprint task matrix",
      exact: true,
    });
    await expect(board.getByRole("heading", { level: 3 })).toHaveCount(
      expected.length,
    );
    for (const ticket of expected)
      await expect(
        board.getByRole("heading", { name: ticket.title, exact: true }),
      ).toBeVisible();
    const state = project.taskStatuses.find(
      (s: { name: string }) => s.name === "DONE",
    );
    await page
      .getByRole("combobox", { name: "Task state", exact: true })
      .click();
    await page.getByRole("option", { name: "Done", exact: true }).click();
    const remaining = tickets.filter(
      (t: { tasks: { assignedTo: string; statusId: string }[] }) =>
        t.tasks.some(
          (task) => task.assignedTo === user.id && task.statusId === state.id,
        ),
    );
    await expect(board.getByRole("heading", { level: 3 })).toHaveCount(
      remaining.length,
    );
    await page
      .getByRole("button", { name: "Clear filters", exact: true })
      .click();
    await expect(board.getByRole("heading", { level: 3 })).toHaveCount(
      tickets.length,
    );
    await page
      .getByRole("textbox", { name: "Search work", exact: true })
      .fill("A title that does not exist anywhere");
    await expect(page.getByRole("alert")).toContainText("No work matches");
    await page
      .getByRole("button", { name: "Clear filters", exact: true })
      .click();
    const other = project.sprints.find(
      (s: { id: string }) => s.id !== delivery.id,
    );
    await page
      .getByRole("combobox", { name: "Selected sprint", exact: true })
      .click();
    await page.getByRole("option", { name: other.name, exact: true }).click();
    const otherTickets = project.tickets.filter(
      (t: { sprintId: string }) => t.sprintId === other.id,
    );
    await expect(board.getByRole("heading", { level: 3 })).toHaveCount(
      otherTickets.length,
    );
    for (const ticket of otherTickets)
      await expect(
        board.getByRole("heading", { name: ticket.title, exact: true }),
      ).toHaveCount(1);
    for (const ticket of tickets)
      await expect(
        board.getByRole("heading", { name: ticket.title, exact: true }),
      ).toHaveCount(0);
  } finally {
    await request.patch(`/api/tasks/${fixtureTask.id}`, {
      headers,
      data: {
        id: fixtureTask.id,
        assignedTo: originalAssignee,
        updatedBy: fixtureTask.createdBy,
      },
    });
  }
});
test("desktop task drag recovers from failure and changes only task state in its original ticket", async ({
  page,
  request,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  const { project, headers } = await boardFixture(page, request);
  const sprint = project.sprints.find(
    (s: { name: string }) => s.name === "Sprint 2 — Delivery",
  );
  const ticket = project.tickets.find(
    (t: { sprintId: string; tasks: { status: { position: number } }[] }) =>
      t.sprintId === sprint.id &&
      t.tasks.some((task) => task.status.position < 3),
  );
  const task = ticket.tasks.find(
    (t: { status: { position: number } }) => t.status.position < 3,
  );
  const target = project.taskStatuses.find(
    (s: { position: number }) =>
      s.position === (task.status.position === 1 ? 2 : 1),
  );
  const endpoint = `**/api/tasks/${task.id}`;
  async function drag() {
    const handle = page.getByRole("button", {
      name: `Drag task #${task.id}`,
      exact: true,
    });
    await handle.scrollIntoViewIfNeeded();
    const destination = page.locator(
      `[data-task-state="${target.name}"][data-ticket-id="${ticket.id}"]`,
    );
    const start = await handle.boundingBox();
    const end = await destination.boundingBox();
    await page.mouse.move(
      start!.x + start!.width / 2,
      start!.y + start!.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      start!.x + start!.width / 2 + 8,
      start!.y + start!.height / 2,
      { steps: 3 },
    );
    await page.mouse.move(end!.x + end!.width / 2, end!.y + 80, { steps: 12 });
    await page.mouse.up();
  }
  try {
    await page.route(endpoint, (route) =>
      route.request().method() === "PATCH"
        ? route.fulfill({ status: 503, body: "unavailable" })
        : route.continue(),
    );
    const rejected = page.waitForResponse(
      (r) =>
        r.url().endsWith(`/api/tasks/${task.id}`) &&
        r.request().method() === "PATCH",
      { timeout: 5000 },
    );
    await drag();
    expect((await rejected).status()).toBe(503);
    await expect(page.getByRole("alert")).toContainText(
      "Failed to update task",
    );
    await expect(
      page
        .locator(
          `[data-task-state="${task.status.name}"][data-ticket-id="${ticket.id}"]`,
        )
        .getByRole("button", { name: `Drag task #${task.id}`, exact: true }),
    ).toBeVisible();
    await page.unroute(endpoint);
    const accepted = page.waitForResponse(
      (r) =>
        r.url().endsWith(`/api/tasks/${task.id}`) &&
        r.request().method() === "PATCH",
      { timeout: 5000 },
    );
    await drag();
    expect((await accepted).status()).toBe(200);
    await expect(
      page
        .locator(
          `[data-task-state="${target.name}"][data-ticket-id="${ticket.id}"]`,
        )
        .getByRole("button", { name: `Drag task #${task.id}`, exact: true }),
    ).toBeVisible();
    const saved = await (
      await request.get(`/api/tasks/${task.id}`, { headers })
    ).json();
    expect(saved).toMatchObject({
      ticketId: ticket.id,
      statusId: target.id,
      assignedTo: task.assignedTo,
    });
  } finally {
    await page.unroute(endpoint);
    await request.patch(`/api/tasks/${task.id}`, {
      headers,
      data: { id: task.id, statusId: task.statusId, updatedBy: task.createdBy },
    });
  }
});
for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 390, 768, 1024, 1280, 1440]) {
    test(`C taskboard stays in its viewport at ${width}px in ${theme}`, async ({
      page,
      request,
    }, info) => {
      await page.setViewportSize({ width, height: 900 });
      await setAppearance(page, theme);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await boardFixture(page, request);
      if (width < 1200) {
        const groups = page.getByRole("region", {
          name: "Tickets grouped by ticket state",
          exact: true,
        });
        await expect(groups).toBeVisible();
        await groups
          .getByRole("button", { name: /^Expand ticket #/ })
          .first()
          .click();
        const action = groups
          .getByRole("button", { name: /^Change status for task #/ })
          .first();
        await action.click();
        const editor = page.getByRole("dialog", {
          name: "Task Details",
          exact: true,
        });
        await editor
          .getByRole("combobox", { name: "Change status", exact: true })
          .click();
        await expect(
          page.getByRole("option", { name: "Testing", exact: true }),
        ).toBeVisible();
        await page.keyboard.press("Escape");
        await editor.getByRole("button", { name: /^Back to ticket #/ }).click();
        const parent = page.getByRole("dialog", {
          name: "Ticket Details",
          exact: true,
        });
        await expect(
          parent.getByRole("tab", { name: "Tasks", exact: true }),
        ).toHaveAttribute("aria-selected", "true");
        await parent
          .getByRole("button", { name: "Close ticket editor", exact: true })
          .click();
      } else {
        const matrix = page.getByRole("region", {
          name: "Sprint task matrix",
          exact: true,
        });
        await expect(matrix).toBeVisible();
        const bounds = await matrix.evaluate((element) => ({
          scroll: element.scrollWidth,
          client: element.clientWidth,
        }));
        expect(bounds.scroll).toBeGreaterThan(bounds.client);
        await matrix.evaluate((element) => {
          element.scrollLeft = element.scrollWidth;
        });
        const sticky = await matrix
          .locator("tbody tr")
          .first()
          .locator("td")
          .first()
          .boundingBox();
        const region = await matrix.boundingBox();
        expect(sticky!.x).toBeGreaterThanOrEqual(region!.x - 1);
        await matrix.evaluate((element) => {
          element.scrollLeft = 0;
        });
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: info.outputPath(`taskboard-${theme}-${width}.png`),
        fullPage: true,
      });
    });
  }
}
