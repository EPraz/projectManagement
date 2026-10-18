import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";
test.use({ actionTimeout: 5000 });
import { enterDemo, setAppearance } from "./support/demo";
async function openTask(page: Page, request: APIRequestContext) {
  const { accessToken } = await (
    await request.post("/api/auth/instant-login", { data: {} })
  ).json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const projects = await (
    await request.get("/api/projects/", { headers })
  ).json();
  const project = projects.find(
    (p: { title: string }) => p.title === "Orbit — Product Delivery",
  );
  const ticket = project.tickets.find(
    (t: { tasks: unknown[] }) => t.tasks.length,
  );
  const task = ticket.tasks[0];
  await enterDemo(page);
  await page.goto(`/projects/${project.id}/board?tab=board&taskId=${task.id}`);
  return { project, ticket, task, headers };
}
test("task editor offers the full state catalog, saves zero hours and returns to its actual parent", async ({
  page,
  request,
}) => {
  const { project, ticket, task, headers } = await openTask(page, request);
  const editor = page.getByRole("dialog", {
    name: "Task Details",
    exact: true,
  });
  try {
    await editor
      .getByRole("combobox", { name: "Change status", exact: true })
      .click();
    for (const state of [
      "Todo",
      "In Progress",
      "Blocked",
      "Code Review",
      "Testing",
      "Done",
    ])
      await expect(
        page.getByRole("option", { name: state, exact: true }),
      ).toBeVisible();
    await page.getByRole("option", { name: "Done", exact: true }).click();
    await editor.getByLabel("Remaining Hours", { exact: true }).fill("0");
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(editor).toHaveCount(0);
    const saved = await (
      await request.get(`/api/tasks/${task.id}`, { headers })
    ).json();
    expect(saved.status.name).toBe("DONE");
    expect(saved.remainingHours).toBe(0);
    expect(saved.ticketId).toBe(ticket.id);
    const currentProject = await (
      await request.get(`/api/projects/${project.id}`, { headers })
    ).json();
    expect(
      currentProject.tickets.find((t: { id: number }) => t.id === ticket.id)
        .statusId,
    ).toBe(ticket.statusId);
    await page.goto(
      `/projects/${project.id}/board?tab=board&taskId=${task.id}`,
    );
    await editor
      .getByRole("button", {
        name: `Back to ticket #${ticket.id}`,
        exact: true,
      })
      .click();
    const parent = page.getByRole("dialog", {
      name: "Ticket Details",
      exact: true,
    });
    await expect(
      parent.getByRole("tab", { name: "Tasks", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("dialog")).toHaveCount(1);
  } finally {
    await request.patch(`/api/tasks/${task.id}`, {
      headers,
      data: {
        id: task.id,
        statusId: task.statusId,
        remainingHours: task.remainingHours,
        updatedBy: task.createdBy,
      },
    });
  }
});

test("task parent navigation protects a draft and supports save then return", async ({
  page,
  request,
}) => {
  const { ticket, task, headers } = await openTask(page, request);
  const editor = page.getByRole("dialog", {
    name: "Task Details",
    exact: true,
  });
  try {
    await editor.getByPlaceholder("Task title").fill("Protected task draft");
    await editor
      .getByRole("button", {
        name: `Back to ticket #${ticket.id}`,
        exact: true,
      })
      .click();
    const warning = page.getByRole("alertdialog", {
      name: "Unsaved changes",
      exact: true,
    });
    await warning
      .getByRole("button", { name: "Keep editing", exact: true })
      .click();
    await expect(editor.getByPlaceholder("Task title")).toHaveValue(
      "Protected task draft",
    );
    await editor
      .getByRole("button", {
        name: `Back to ticket #${ticket.id}`,
        exact: true,
      })
      .click();
    await warning
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    await expect(warning).toHaveCount(0);
    const parent = page.getByRole("dialog", {
      name: "Ticket Details",
      exact: true,
    });
    await expect(
      parent.getByRole("tab", { name: "Tasks", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(
      parent.getByRole("button", {
        name: `Open task #${task.id} Protected task draft`,
        exact: true,
      }),
    ).toBeVisible();
    expect(
      (await (await request.get(`/api/tasks/${task.id}`, { headers })).json())
        .title,
    ).toBe("Protected task draft");
  } finally {
    await request.patch(`/api/tasks/${task.id}`, {
      headers,
      data: { id: task.id, title: task.title, updatedBy: task.createdBy },
    });
  }
});
test("task creation retains failed drafts, starts Todo, and confirmed deletion returns to parent", async ({
  page,
  request,
}) => {
  const { ticket, project, headers } = await openTask(page, request);
  let createdId: number | undefined;
  const title = `Studio task ${Date.now()}`;
  try {
    await page
      .getByRole("button", {
        name: `Back to ticket #${ticket.id}`,
        exact: true,
      })
      .click();
    await page.getByRole("button", { name: "Add task", exact: true }).click();
    const editor = page.getByRole("dialog", {
      name: "Create Task",
      exact: true,
    });
    await expect(page.getByRole("dialog")).toHaveCount(1);
    await editor.getByPlaceholder("Task title").fill(title);
    await editor
      .getByLabel("Description", { exact: true })
      .fill("A real task created in the contextual studio editor.");
    await page.route("**/api/tasks", (route) =>
      route.request().method() === "POST"
        ? route.fulfill({ status: 503, body: "unavailable" })
        : route.continue(),
    );
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(
      editor.getByRole("alert").filter({ hasText: "Could not save" }),
    ).toBeVisible();
    await expect(editor.getByPlaceholder("Task title")).toHaveValue(title);
    await page.unroute("**/api/tasks");
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(editor).toHaveCount(0);
    const snapshot = await (
      await request.get(`/api/projects/${project.id}`, { headers })
    ).json();
    const tasks = snapshot.tickets.find(
      (item: { id: number }) => item.id === ticket.id,
    ).tasks;
    const created = tasks.find(
      (task: { title: string }) => task.title === title,
    );
    expect(created).toMatchObject({
      ticketId: ticket.id,
      status: { name: "TODO" },
      assignedTo: null,
      estimatedHours: null,
    });
    createdId = created.id;
    await page.goto(
      `/projects/${project.id}/board?tab=board&ticketId=${ticket.id}&ticketTab=tasks&taskId=${createdId}`,
    );
    const edit = page.getByRole("dialog", {
      name: "Task Details",
      exact: true,
    });
    await edit.getByRole("button", { name: "Delete", exact: true }).click();
    const confirmation = page.getByRole("dialog", {
      name: "Confirm Delete",
      exact: true,
    });
    expect(
      (await request.get(`/api/tasks/${createdId}`, { headers })).ok(),
    ).toBe(true);
    await confirmation
      .getByRole("button", { name: "Proceed", exact: true })
      .click();
    await expect(edit).toHaveCount(0);
    await expect(confirmation).toHaveCount(0);
    await expect(
      page
        .getByRole("dialog", { name: "Ticket Details", exact: true })
        .getByRole("tab", { name: "Tasks", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    expect(new URL(page.url()).searchParams.has("taskId")).toBe(false);
    expect(
      (await request.get(`/api/tasks/${createdId}`, { headers })).status(),
    ).toBe(404);
  } finally {
    if (createdId) await request.delete(`/api/tasks/${createdId}`, { headers });
  }
});
for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`C task editor fits ${width}px in ${theme}`, async ({
      page,
      request,
    }, info) => {
      await page.setViewportSize({ width, height: 900 });
      await setAppearance(page, theme);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await openTask(page, request);
      const editor = page.getByRole("dialog", {
        name: "Task Details",
        exact: true,
      });
      await expect(editor).toBeVisible();
      const dimensions = await editor.evaluate((element) => ({
        scroll: element.scrollWidth,
        client: element.clientWidth,
      }));
      expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
      const save = await editor
        .getByRole("button", { name: "Save", exact: true })
        .boundingBox();
      expect(save!.y + save!.height).toBeLessThanOrEqual(900);
      expect(save!.x + save!.width).toBeLessThanOrEqual(width);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: info.outputPath(`task-${theme}-${width}.png`),
      });
    });
  }
}
