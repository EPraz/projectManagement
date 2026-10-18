import { expect, test, type APIRequestContext } from "@playwright/test";
import { enterDemo } from "./support/demo";

async function editingFixture(request: APIRequestContext) {
  const login = await request.post("/api/auth/instant-login", { data: {} });
  const { accessToken } = await login.json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const projects: {
    id: string;
    title: string;
    sprints: { id: string; name: string }[];
    tickets: {
      id: number;
      title: string;
      notes: string | null;
      sprintId: string | null;
      featureId: string | null;
      assignedTo: string | null;
      estimatedHours: number | null;
      tasks: { id: number; title: string }[];
    }[];
  }[] = await (await request.get("/api/projects/", { headers })).json();
  const project = projects[0];
  const delivery = project.sprints.find(
    (item) => item.name === "Sprint 2 — Delivery"
  )!;
  const ticket = project.tickets.find(
    (item) => item.tasks.length && item.sprintId === delivery.id
  )!;
  return { headers, project, ticket, task: ticket.tasks[0] };
}

test("a pending editor cannot close a later editor after browser navigation", async ({
  page,
  request
}) => {
  const { headers, project, ticket, task } = await editingFixture(request);
  const nextTask = ticket.tasks[1];
  const pattern = `**/api/tasks/${task.id}`;
  let release!: () => void;
  let reached!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  const received = new Promise<void>((resolve) => {
    reached = resolve;
  });
  await page.route(pattern, async (route) => {
    if (route.request().method() !== "PATCH") return route.continue();
    const saved = await route.fetch();
    reached();
    await pending;
    await route.fulfill({ response: saved });
  });
  try {
    await enterDemo(page);
    await page.getByText(project.title, { exact: true }).click();
    await page.getByRole("button", { name: "Board", exact: true }).click();
    const row = page
      .getByRole("row")
      .filter({
        has: page.getByRole("heading", { name: ticket.title, exact: true })
      });
    await test.step("Open the first task", async () => {
      await row
        .getByText(`#${task.id}`, { exact: true })
        .click({ timeout: 5000 });
    });
    await page
      .getByPlaceholder("Task title")
      .fill("First pending editor draft");
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Save", exact: true })
      .click();
    await test.step("First save reaches the delayed response", async () => {
      await received;
    });
    await test.step("Browser Back leaves the first editor", async () => {
      await page.goBack({ waitUntil: "commit" });
    });
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.getByRole("button", { name: "Board", exact: true }).click();
    await test.step("Open the second task", async () => {
      await row
        .getByText(`#${nextTask.id}`, { exact: true })
        .click({ timeout: 5000 });
    });
    await page
      .getByPlaceholder("Task title")
      .fill("Second unsaved editor draft");
    const completed = page.waitForResponse(
      (response) =>
        response.url().endsWith(`/api/tasks/${task.id}`) &&
        response.request().method() === "PATCH",
      { timeout: 5000 }
    );
    release();
    await completed;
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve))
        )
    );
    await expect(page.getByPlaceholder("Task title")).toHaveValue(
      "Second unsaved editor draft"
    );
    expect(new URL(page.url()).searchParams.get("taskId")).toBe(
      String(nextTask.id)
    );
  } finally {
    release();
    await page.unroute(pattern);
    await request.patch(`/api/tasks/${task.id}`, {
      headers,
      data: {
        id: task.id,
        title: task.title,
        updatedBy: "visitor@demo.example"
      }
    });
  }
});

test("task validation and unconfirmed server responses keep the editor open", async ({
  page,
  request
}) => {
  const { project, task } = await editingFixture(request);
  await enterDemo(page);
  await page.goto(`/projects/${project.id}/board?tab=board&taskId=${task.id}`);
  const dialog = page.getByRole("dialog");
  const title = dialog.getByPlaceholder("Task title");
  let submissions = 0;
  const pattern = `**/api/tasks/${task.id}`;
  await page.route(pattern, (route) => {
    if (route.request().method() !== "PATCH") return route.continue();
    submissions++;
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "{}"
    });
  });
  await title.fill("   ");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(
    dialog.getByText("Title is required", { exact: true })
  ).toBeVisible();
  expect(submissions).toBe(0);
  await title.fill("Retained validated draft");
  await dialog.getByLabel("Estimated Hours", { exact: true }).fill("-1");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(
    dialog.getByText("Enter a non-negative number", { exact: true })
  ).toBeVisible();
  expect(submissions).toBe(0);
  await dialog.getByLabel("Estimated Hours", { exact: true }).fill("1");
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("Could not save");
  await expect(title).toHaveValue("Retained validated draft");
  expect(submissions).toBe(1);
  await page.unroute(pattern);
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
});

for (const kind of ["task", "ticket"] as const) {
  test(`an incomplete nonempty ${kind} response cannot confirm a save`, async ({
    page,
    request
  }) => {
    const fixture = await editingFixture(request);
    const item = fixture[kind];
    await enterDemo(page);
    await page.goto(
      `/projects/${fixture.project.id}/board?tab=board&${kind}Id=${item.id}`
    );
    const draft = `Incomplete response ${kind} draft`;
    const dialog = page.getByRole("dialog");
    await dialog
      .getByPlaceholder(`${kind === "task" ? "Task" : "Ticket"} title`)
      .fill(draft);
    await page.route(`**/api/${kind}s/${item.id}`, (route) =>
      route.request().method() === "PATCH"
        ? route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              id: item.id,
              title: draft,
              updatedAt: new Date().toISOString()
            })
          })
        : route.continue()
    );
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText("Could not save");
    await expect(
      dialog.getByPlaceholder(`${kind === "task" ? "Task" : "Ticket"} title`)
    ).toHaveValue(draft);
  });
}

test("a delayed ticket-save response preserves a newer independent task change on the board", async ({
  page,
  request
}) => {
  const { headers, project, ticket, task } = await editingFixture(request);
  const pattern = `**/api/tickets/${ticket.id}`;
  const title = `Confirmed ticket ${Date.now()}`;
  const taskTitle = `Newer independent task ${Date.now()}`;
  let release!: () => void;
  let reached!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  const received = new Promise<void>((resolve) => {
    reached = resolve;
  });
  await page.route(pattern, async (route) => {
    if (route.request().method() !== "PATCH") return route.continue();
    const saved = await route.fetch();
    reached();
    await pending;
    await route.fulfill({ response: saved });
  });
  try {
    await enterDemo(page);
    await page.goto(
      `/projects/${project.id}/board?tab=board&ticketId=${ticket.id}`
    );
    const dialog = page.getByRole("dialog");
    await dialog.getByPlaceholder("Ticket title").fill(title);
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await received;
    expect(
      (
        await request.patch(`/api/tasks/${task.id}`, {
          headers,
          data: {
            id: task.id,
            title: taskTitle,
            updatedBy: "visitor@demo.example"
          }
        })
      ).ok()
    ).toBe(true);
    // The real task event is rendered even while the modal makes the board inert.
    await expect(page.getByText(taskTitle, { exact: true })).toHaveCount(1);
    release();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByText(taskTitle, { exact: true })).toBeVisible();
  } finally {
    release();
    await page.unroute(pattern);
    await request.patch(`/api/tasks/${task.id}`, {
      headers,
      data: {
        id: task.id,
        title: task.title,
        updatedBy: "visitor@demo.example"
      }
    });
    await request.patch(`/api/tickets/${ticket.id}`, {
      headers,
      data: {
        id: ticket.id,
        title: ticket.title,
        updatedBy: "visitor@demo.example"
      }
    });
  }
});

for (const width of [390, 1280]) {
  for (const kind of ["task", "ticket"] as const) {
    test(`${kind} editor keeps keyboard focus and controls usable at ${width}px`, async ({
      page,
      request
    }, info) => {
      const fixture = await editingFixture(request);
      const item = fixture[kind];
      await page.setViewportSize({ width, height: 844 });
      await enterDemo(page);
      await page.goto(
        `/projects/${fixture.project.id}/board?tab=board&${kind}Id=${item.id}`
      );
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      const dimensions = await dialog.evaluate((element) => ({
        scroll: element.scrollWidth,
        client: element.clientWidth
      }));
      expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 2);
      await dialog
        .getByPlaceholder(`${kind === "task" ? "Task" : "Ticket"} title`)
        .focus();
      for (let index = 0; index < 12; index++) {
        await page.keyboard.press("Tab");
        expect(
          await dialog.evaluate((element) =>
            element.contains(document.activeElement)
          )
        ).toBe(true);
      }
      await dialog
        .getByRole("button", { name: "Save", exact: true })
        .scrollIntoViewIfNeeded();
      const bounds = await dialog
        .getByRole("button", { name: "Save", exact: true })
        .boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      await page.screenshot({ path: info.outputPath(`${kind}-${width}.png`) });
      await page.keyboard.press("Escape");
      await expect(dialog).toHaveCount(0);
      expect(new URL(page.url()).searchParams.has(`${kind}Id`)).toBe(false);
    });
  }
}

test("an existing assigned task saves an allowed payload and remains saved after reload", async ({
  page,
  request
}) => {
  const { headers, project, task } = await editingFixture(request);
  const title = `Verified task edit ${Date.now()}`;
  try {
    await enterDemo(page);
    await page.goto(
      `/projects/${project.id}/board?tab=board&taskId=${task.id}`
    );
    const dialog = page.getByRole("dialog");
    await dialog.getByPlaceholder("Task title").fill(title);
    const saved = page.waitForResponse(
      (response) =>
        response.url().endsWith(`/api/tasks/${task.id}`) &&
        response.request().method() === "PATCH"
    );
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    expect((await saved).status()).toBe(200);
    await expect(dialog).toHaveCount(0);
    await page.goto(
      `/projects/${project.id}/board?tab=board&taskId=${task.id}`
    );
    await expect(page.getByPlaceholder("Task title")).toHaveValue(title);
  } finally {
    await request.patch(`/api/tasks/${task.id}`, {
      headers,
      data: {
        id: task.id,
        title: task.title,
        updatedBy: "visitor@demo.example"
      }
    });
  }
});

test("planning selections and cleared assignment/estimates persist from the ticket editor", async ({
  page,
  request
}) => {
  const { headers, project, ticket } = await editingFixture(request);
  try {
    await enterDemo(page);
    await page.goto(
      `/projects/${project.id}/board?tab=board&ticketId=${ticket.id}`
    );
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("combobox", { name: /^Assigned To/ }).click();
    await page.getByRole("option", { name: "Unassigned", exact: true }).click();
    await dialog.getByLabel("Estimated Hours", { exact: true }).fill("");
    await dialog.getByRole("tab", { name: "Planning", exact: true }).click();
    await dialog.getByRole("combobox", { name: /^Sprint/ }).click();
    await page.getByRole("option", { name: "Backlog", exact: true }).click();
    await dialog.getByRole("combobox", { name: /^Feature/ }).click();
    await page.getByRole("option", { name: "None", exact: true }).click();
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    const saved = await (
      await request.get(`/api/tickets/${ticket.id}`, { headers })
    ).json();
    expect(saved).toMatchObject({
      sprintId: null,
      featureId: null,
      assignedTo: null,
      estimatedHours: null
    });
    await page.goto(
      `/projects/${project.id}/board?tab=board&ticketId=${ticket.id}`
    );
    await expect(
      page.getByRole("combobox", { name: /^Assigned To/ })
    ).toHaveText("Unassigned");
    await expect(
      page.getByLabel("Estimated Hours", { exact: true })
    ).toHaveValue("");
  } finally {
    await request.patch(`/api/tickets/${ticket.id}`, {
      headers,
      data: {
        id: ticket.id,
        sprintId: ticket.sprintId,
        featureId: ticket.featureId,
        assignedTo: ticket.assignedTo,
        estimatedHours: ticket.estimatedHours,
        updatedBy: "visitor@demo.example"
      }
    });
  }
});

for (const kind of ["task", "ticket"] as const) {
  test(`${kind} editor preserves typing after an independent update and a failed deletion`, async ({
    page,
    request
  }) => {
    const fixture = await editingFixture(request);
    const item = fixture[kind];
    const plural = `${kind}s`;
    const pattern = `**/api/${plural}/${item.id}`;
    const draft = `Unsaved ${kind} draft ${Date.now()}`;
    let received!: () => void;
    const event = new Promise<void>((resolve) => {
      received = resolve;
    });
    const marker = `Independent ${kind} edit ${Date.now()}`;
    page.on("websocket", (socket) =>
      socket.on("framereceived", (frame) => {
        if (
          typeof frame.payload === "string" &&
          frame.payload.includes("ticketUpdated") &&
          frame.payload.includes(marker)
        )
          received();
      })
    );
    try {
      await enterDemo(page);
      await page.goto(
        `/projects/${fixture.project.id}/board?tab=board&${kind}Id=${item.id}`
      );
      const dialog = page.getByRole("dialog");
      await dialog
        .getByPlaceholder(`${kind === "task" ? "Task" : "Ticket"} title`)
        .fill(draft);
      expect(
        (
          await request.patch(`/api/${plural}/${item.id}`, {
            headers: fixture.headers,
            data: {
              id: item.id,
              title: marker,
              updatedBy: "visitor@demo.example"
            }
          })
        ).ok()
      ).toBe(true);
      await event;
      await expect(
        dialog.getByPlaceholder(`${kind === "task" ? "Task" : "Ticket"} title`)
      ).toHaveValue(draft);
      await page.route(pattern, (route) =>
        route.request().method() === "DELETE"
          ? route.fulfill({ status: 503, body: "unavailable" })
          : route.continue()
      );
      await dialog.getByRole("button", { name: "Delete", exact: true }).click();
      await expect(dialog.getByRole("alert")).toContainText("Could not delete");
      await expect(
        dialog.getByPlaceholder(`${kind === "task" ? "Task" : "Ticket"} title`)
      ).toHaveValue(draft);
      await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
      await expect(dialog).toHaveCount(0);
      expect(new URL(page.url()).searchParams.has(`${kind}Id`)).toBe(false);
    } finally {
      await page.unroute(pattern);
      await request.patch(`/api/${plural}/${item.id}`, {
        headers: fixture.headers,
        data: {
          id: item.id,
          title: item.title,
          updatedBy: "visitor@demo.example"
        }
      });
    }
  });
}

test("failed task edits keep the draft and retry only after the pending request completes", async ({
  page,
  request
}) => {
  const { headers, project, task } = await editingFixture(request);
  const title = `Recoverable task edit ${Date.now()}`;
  let release!: () => void;
  let reached!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  const received = new Promise<void>((resolve) => {
    reached = resolve;
  });
  let submissions = 0;
  const pattern = `**/api/tasks/${task.id}`;
  await page.route(pattern, async (route) => {
    if (route.request().method() !== "PATCH") return route.continue();
    submissions++;
    reached();
    await pending;
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: '{"message":"unavailable"}'
    });
  });
  try {
    await enterDemo(page);
    await page.goto(
      `/projects/${project.id}/board?tab=board&taskId=${task.id}`
    );
    const dialog = page.getByRole("dialog");
    await dialog.getByPlaceholder("Task title").fill(title);
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await received;
    await expect(
      dialog.getByRole("button", { name: /saving/i })
    ).toBeDisabled();
    expect(submissions).toBe(1);
    release();
    await expect(dialog.getByRole("alert")).toContainText(/try again/i);
    await expect(dialog.getByPlaceholder("Task title")).toHaveValue(title);
    await page.unroute(pattern);
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    expect(
      (await (await request.get(`/api/tasks/${task.id}`, { headers })).json())
        .title
    ).toBe(title);
  } finally {
    release();
    await page.unroute(pattern);
    await request.patch(`/api/tasks/${task.id}`, {
      headers,
      data: {
        id: task.id,
        title: task.title,
        updatedBy: "visitor@demo.example"
      }
    });
  }
});

test("ticket tabs retain edited requirements across a failed save and retry", async ({
  page,
  request
}) => {
  const { headers, project, ticket } = await editingFixture(request);
  const notes = `Recoverable requirements ${Date.now()}`;
  const pattern = `**/api/tickets/${ticket.id}`;
  try {
    await enterDemo(page);
    await page.goto(
      `/projects/${project.id}/board?tab=board&ticketId=${ticket.id}`
    );
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByPlaceholder("Ticket title")).toHaveValue(
      ticket.title
    );
    await dialog.getByRole("tab", { name: "Planning", exact: true }).click();
    await expect(
      dialog.getByLabel("Story Points", { exact: true })
    ).toBeVisible();
    await dialog
      .getByRole("tab", { name: "Additional Info", exact: true })
      .click();
    await expect(
      dialog.getByPlaceholder("Define what makes this ticket complete...")
    ).toBeVisible();
    await dialog.getByPlaceholder("Add notes...", { exact: true }).fill(notes);
    await page.route(pattern, (route) =>
      route.request().method() === "PATCH"
        ? route.fulfill({ status: 503, body: "unavailable" })
        : route.continue()
    );
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText(/try again/i);
    await expect(
      dialog.getByPlaceholder("Add notes...", { exact: true })
    ).toHaveValue(notes);
    await page.unroute(pattern);
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    expect(
      (
        await (
          await request.get(`/api/tickets/${ticket.id}`, { headers })
        ).json()
      ).notes
    ).toBe(notes);
  } finally {
    await page.unroute(pattern);
    await request.patch(`/api/tickets/${ticket.id}`, {
      headers,
      data: {
        id: ticket.id,
        notes: ticket.notes,
        updatedBy: "visitor@demo.example"
      }
    });
  }
});
