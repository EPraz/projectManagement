import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";
import { enterDemo, navigateSection } from "./support/demo";
test.use({ actionTimeout: 5000 });
async function openTicket(page: Page, request: APIRequestContext) {
  const { accessToken } = await (
    await request.post("/api/auth/instant-login", { data: {} })
  ).json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const projects = await (
    await request.get("/api/projects/", { headers })
  ).json();
  const project = projects.find(
    (item: { title: string }) => item.title === "Orbit \u2014 Product Delivery",
  );
  const ticket = project.tickets.find(
    (item: { tasks: unknown[] }) => item.tasks.length > 0,
  );
  await enterDemo(page);
  await page.goto(
    `/projects/${project.id}/board?tab=backlog&ticketId=${ticket.id}`,
  );
  return { project, ticket, headers };
}
test("ticket close offers keep/discard and preserves the unsaved draft", async ({
  page,
  request,
}) => {
  await openTicket(page, request);
  const editor = page.getByRole("dialog", {
    name: "Ticket Details",
    exact: true,
  });
  await editor
    .getByPlaceholder("Ticket title")
    .fill("Unsaved studio ticket draft");
  await editor
    .getByRole("button", { name: "Close ticket editor", exact: true })
    .click();
  const warning = page.getByRole("alertdialog", {
    name: "Unsaved changes",
    exact: true,
  });
  await expect(warning).toBeVisible();
  await warning
    .getByRole("button", { name: "Keep editing", exact: true })
    .click();
  await expect(editor.getByPlaceholder("Ticket title")).toHaveValue(
    "Unsaved studio ticket draft",
  );
  await editor.getByRole("button", { name: "Cancel", exact: true }).click();
  await warning
    .getByRole("button", { name: "Discard changes", exact: true })
    .click();
  await expect(editor).toHaveCount(0);
});

test("browser Back protects a dirty ticket and can discard to the original workspace", async ({
  page,
  request,
}) => {
  const { project, ticket } = await openTicket(page, request);
  await page
    .getByRole("button", { name: "Close ticket editor", exact: true })
    .click();
  await navigateSection(page, "Overview");
  await navigateSection(page, "Taskboard");
  const sprint = project.sprints.find(
    (item: { id: string }) => item.id === ticket.sprintId,
  );
  await page
    .getByRole("combobox", { name: "Selected sprint", exact: true })
    .click();
  await page.getByRole("option", { name: sprint.name, exact: true }).click();
  await page.getByRole("heading", { name: ticket.title, exact: true }).click();
  await page.getByPlaceholder("Ticket title").fill("Protected Back draft");
  await page.goBack();
  const warning = page.getByRole("alertdialog", {
    name: "Unsaved changes",
    exact: true,
  });
  await expect(warning).toBeVisible();
  await warning
    .getByRole("button", { name: "Keep editing", exact: true })
    .click();
  await expect(page.getByPlaceholder("Ticket title")).toHaveValue(
    "Protected Back draft",
  );
  await page.goBack();
  await warning
    .getByRole("button", { name: "Discard changes", exact: true })
    .click();
  await expect(page).toHaveURL(/\/overview$/);
  await expect(page.getByPlaceholder("Ticket title")).toHaveCount(0);
});

test("ticket deadline can be edited, reloaded and cleared without changing other fields", async ({
  page,
  request,
}) => {
  const { project, ticket, headers } = await openTicket(page, request);
  try {
    const editor = page.getByRole("dialog", {
      name: "Ticket Details",
      exact: true,
    });
    await editor.getByRole("tab", { name: "Planning", exact: true }).click();
    await editor.getByLabel("Due date", { exact: true }).fill("2026-11-23");
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(editor).toHaveCount(0);
    const saved = await (
      await request.get(`/api/tickets/${ticket.id}`, { headers })
    ).json();
    expect(saved.dueDate).toBeTruthy();
    expect(saved.description).toBe(ticket.description);
    await page.goto(
      `/projects/${project.id}/board?tab=backlog&ticketId=${ticket.id}`,
    );
    await editor.getByRole("tab", { name: "Planning", exact: true }).click();
    await expect(editor.getByLabel("Due date", { exact: true })).toHaveValue(
      "2026-11-23",
    );
    await editor.getByLabel("Due date", { exact: true }).fill("");
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(editor).toHaveCount(0);
    expect(
      (
        await (
          await request.get(`/api/tickets/${ticket.id}`, { headers })
        ).json()
      ).dueDate,
    ).toBeNull();
  } finally {
    await request.patch(`/api/tickets/${ticket.id}`, {
      headers,
      data: {
        id: ticket.id,
        dueDate: ticket.dueDate ?? null,
        updatedBy: "visitor@demo.example",
      },
    });
  }
});

test("ticket creation retains all field groups after an unconfirmed response and confirms one pending retry", async ({
  page,
  request,
}) => {
  await enterDemo(page);
  await page
    .getByRole("link", { name: "Orbit \u2014 Product Delivery", exact: true })
    .click();
  await navigateSection(page, "Taskboard");
  await page.getByRole("button", { name: "Add New Item", exact: true }).click();
  const editor = page.getByRole("dialog", {
    name: "Create Ticket",
    exact: true,
  });
  const marker = `Complete studio ticket ${Date.now()}`;
  await editor.getByPlaceholder("Ticket title").fill(marker);
  await editor
    .getByLabel("Description", { exact: true })
    .fill("Creation description retained");
  await editor.getByRole("tab", { name: "Planning", exact: true }).click();
  await editor.getByLabel("Estimated Hours", { exact: true }).fill("0");
  await editor.getByLabel("Story Points", { exact: true }).fill("3");
  await editor
    .getByRole("tab", { name: "Additional Info", exact: true })
    .click();
  await editor
    .getByLabel("Acceptance Criteria", { exact: true })
    .fill("A server-confirmed ticket exists");
  await editor
    .getByLabel("Notes", { exact: true })
    .fill("Retained creation note");
  await page.route("**/api/tickets", (route) =>
    route.request().method() === "POST"
      ? route.fulfill({
          status: 201,
          contentType: "application/json",
          body: "{}",
        })
      : route.continue(),
  );
  let createdId: number | undefined;
  let release = () => {};
  try {
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(editor.getByRole("alert")).toContainText("Could not save");
    await expect(editor.getByLabel("Notes", { exact: true })).toHaveValue(
      "Retained creation note",
    );
    await page.unroute("**/api/tickets");
    const delayed = new Promise<void>((resolve) => {
      release = resolve;
    });
    let reached!: () => void;
    const received = new Promise<void>((resolve) => {
      reached = resolve;
    });
    let posts = 0;
    await page.route("**/api/tickets", async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      posts++;
      const response = await route.fetch();
      const ticket = await response.json();
      createdId = ticket.id;
      reached();
      await delayed;
      await route.fulfill({ response });
    });
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await received;
    await expect(
      editor.getByRole("button", { name: "Saving…", exact: true }),
    ).toBeDisabled();
    await expect(editor.getByLabel("Notes", { exact: true })).toBeDisabled();
    expect(posts).toBe(1);
    release();
    await expect(editor).toHaveCount(0);
    const { accessToken } = await (
      await request.post("/api/auth/instant-login", { data: {} })
    ).json();
    const headers = { Authorization: `Bearer ${accessToken}` };
    const saved = await (
      await request.get(`/api/tickets/${createdId}`, { headers })
    ).json();
    expect(saved).toMatchObject({
      title: marker,
      description: "Creation description retained",
      estimatedHours: 0,
      storyPoints: 3,
      acceptanceCriteria: "A server-confirmed ticket exists",
      notes: "Retained creation note",
      status: { name: "NEW" },
    });
  } finally {
    release();
    await page.unroute("**/api/tickets");
    if (createdId) {
      const { accessToken } = await (
        await request.post("/api/auth/instant-login", { data: {} })
      ).json();
      await request.delete(`/api/tickets/${createdId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    }
  }
});

test("ticket Tasks opens one child editor and returns to its parent Tasks context", async ({
  page,
  request,
}) => {
  const { ticket } = await openTicket(page, request);
  const editor = page.getByRole("dialog", {
    name: "Ticket Details",
    exact: true,
  });
  await editor.getByRole("tab", { name: "Tasks", exact: true }).click();
  await editor
    .getByRole("button", {
      name: `Open task #${ticket.tasks[0].id} ${ticket.tasks[0].title}`,
      exact: true,
    })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await expect(
    page.getByRole("dialog", { name: "Task Details", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Close task editor", exact: true })
    .click();
  await expect(editor).toBeVisible();
  await expect(
    editor.getByRole("tab", { name: "Tasks", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  expect(new URL(page.url()).searchParams.get("ticketId")).toBe(
    String(ticket.id),
  );
});

for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`C ticket panel and actions fit at ${width}px in ${theme}`, async ({
      page,
      request,
    }, info) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await openTicket(page, request);
      const editor = page.getByRole("dialog", {
        name: "Ticket Details",
        exact: true,
      });
      await expect(editor).toBeVisible();
      const dimensions = await editor.evaluate((element) => ({
        scroll: element.scrollWidth,
        client: element.clientWidth,
      }));
      expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
      for (const tab of ["Details", "Planning", "Tasks", "Additional Info"]) {
        await editor.getByRole("tab", { name: tab, exact: true }).click();
        const bounds = await editor
          .getByRole("button", { name: "Save", exact: true })
          .boundingBox();
        expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(900);
        expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      }
      await editor.getByRole("tab", { name: "Details", exact: true }).click();
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: info.outputPath(`ticket-${theme}-${width}.png`),
      });
      await editor
        .getByRole("button", { name: "Close ticket editor", exact: true })
        .click();
      await expect(editor).toHaveCount(0);
    });
  }
}

test("an independently removed sprint keeps the new ticket draft recoverable", async ({
  page,
  request,
}) => {
  const { accessToken } = await (
    await request.post("/api/auth/instant-login", { data: {} })
  ).json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const response = await request.post("/api/projects", {
    headers,
    data: {
      title: `Draft scope fixture ${Date.now()}`,
      createdBy: "visitor@demo.example",
    },
  });
  expect(response.status()).toBe(201);
  const project = await response.json();
  const sprints: { id: string; name: string }[] = [];
  try {
    for (const name of ["Draft sprint A", "Draft sprint B"]) {
      const created = await request.post("/api/sprints", {
        headers,
        data: {
          name,
          projectId: project.id,
          startDate: "2026-10-01T00:00:00Z",
          endDate: "2026-10-31T00:00:00Z",
          createdBy: "visitor@demo.example",
        },
      });
      expect(created.status()).toBe(201);
      sprints.push(await created.json());
    }
    await enterDemo(page);
    await page.goto(`/projects/${project.id}/board?tab=board`);
    const selector = page.getByRole("combobox", {
      name: "Selected sprint",
      exact: true,
      includeHidden: true,
    });
    await expect(selector).toHaveValue(/Draft sprint [AB]/);
    const name = await selector.inputValue();
    const selected = sprints.find((sprint) => sprint.name === name)!;
    await page
      .getByRole("button", { name: "Add New Item", exact: true })
      .click();
    const editor = page.getByRole("dialog", {
      name: "Create Ticket",
      exact: true,
    });
    await editor.getByPlaceholder("Ticket title").fill("Keep my ticket draft");
    expect(
      (await request.delete(`/api/sprints/${selected.id}`, { headers })).ok(),
    ).toBe(true);
    await expect(selector).not.toHaveValue(name);
    await expect(editor.getByPlaceholder("Ticket title")).toHaveValue(
      "Keep my ticket draft",
    );
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(editor).toContainText("That sprint is no longer available");
    const other = sprints.find((sprint) => sprint.id !== selected.id)!;
    await editor.getByRole("combobox", { name: /^Sprint/ }).click();
    await page.getByRole("option", { name: other.name, exact: true }).click();
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(editor).toHaveCount(0);
  } finally {
    await request.delete(`/api/projects/${project.id}`, { headers });
  }
});

test("Save changes from the unsaved warning retains a failed draft and confirms retry", async ({
  page,
  request,
}) => {
  const { ticket, headers } = await openTicket(page, request);
  const marker = `Warning save ${Date.now()}`;
  const editor = page.getByRole("dialog", {
    name: "Ticket Details",
    exact: true,
  });
  const pattern = `**/api/tickets/${ticket.id}`;
  try {
    await editor.getByPlaceholder("Ticket title").fill(marker);
    await page.route(pattern, (route) =>
      route.request().method() === "PATCH"
        ? route.fulfill({ status: 503, body: "unavailable" })
        : route.continue(),
    );
    await editor.getByRole("button", { name: "Cancel", exact: true }).click();
    const warning = page.getByRole("alertdialog", {
      name: "Unsaved changes",
      exact: true,
    });
    await warning
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    await expect(warning.getByRole("alert")).toContainText("Could not save");
    await warning
      .getByRole("button", { name: "Keep editing", exact: true })
      .click();
    await expect(editor.getByPlaceholder("Ticket title")).toHaveValue(marker);
    await page.unroute(pattern);
    await editor.getByRole("button", { name: "Cancel", exact: true }).click();
    await warning
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    await expect(warning).toHaveCount(0);
    await expect(editor).toHaveCount(0);
    expect(
      (
        await (
          await request.get(`/api/tickets/${ticket.id}`, { headers })
        ).json()
      ).title,
    ).toBe(marker);
  } finally {
    await page.unroute(pattern);
    await request.patch(`/api/tickets/${ticket.id}`, {
      headers,
      data: {
        id: ticket.id,
        title: ticket.title,
        updatedBy: "visitor@demo.example",
      },
    });
  }
});

test("confirmed ticket-editor deletion removes the real record and its deep link", async ({
  page,
  request,
}) => {
  const { project, ticket, headers } = await openTicket(page, request);
  await page
    .getByRole("button", { name: "Close ticket editor", exact: true })
    .click();
  const response = await request.post("/api/tickets", {
    headers,
    data: {
      title: `Disposable editor deletion ${Date.now()}`,
      sprintId: ticket.sprintId,
      createdBy: "visitor@demo.example",
    },
  });
  expect(response.status()).toBe(201);
  const created = await response.json();
  try {
    await page.goto(
      `/projects/${project.id}/board?tab=backlog&ticketId=${created.id}`,
    );
    const editor = page.getByRole("dialog", {
      name: "Ticket Details",
      exact: true,
    });
    await editor.getByRole("button", { name: "Delete", exact: true }).click();
    const confirmation = page.getByRole("dialog", {
      name: "Confirm Delete",
      exact: true,
    });
    await confirmation
      .getByRole("button", { name: "Cancel", exact: true })
      .click();
    await expect(editor.getByPlaceholder("Ticket title")).toHaveValue(
      created.title,
    );
    await editor.getByRole("button", { name: "Delete", exact: true }).click();
    await confirmation
      .getByRole("button", { name: "Proceed", exact: true })
      .click();
    await expect(confirmation).toHaveCount(0);
    await expect(editor).toHaveCount(0);
    expect(
      (await request.get(`/api/tickets/${created.id}`, { headers })).status(),
    ).toBe(404);
    expect(new URL(page.url()).searchParams.has("ticketId")).toBe(false);
  } finally {
    await request.delete(`/api/tickets/${created.id}`, { headers });
  }
});

test("a late deletion response cannot clear another project's editor link or draft", async ({
  page,
  request,
}) => {
  const { project, ticket, headers } = await openTicket(page, request);
  await page
    .getByRole("button", { name: "Close ticket editor", exact: true })
    .click();
  const created = await (
    await request.post("/api/tickets", {
      headers,
      data: {
        title: `Pending scoped deletion ${Date.now()}`,
        sprintId: ticket.sprintId,
        createdBy: "visitor@demo.example",
      },
    })
  ).json();
  let release!: () => void;
  const delayed = new Promise<void>((resolve) => {
    release = resolve;
  });
  let reached!: () => void;
  const received = new Promise<void>((resolve) => {
    reached = resolve;
  });
  const pattern = `**/api/tickets/${created.id}`;
  await page.route(pattern, async (route) => {
    if (route.request().method() !== "DELETE") return route.continue();
    const response = await route.fetch();
    reached();
    await delayed;
    await route.fulfill({ response });
  });
  try {
    await page.goto(
      `/projects/${project.id}/board?tab=backlog&ticketId=${created.id}`,
    );
    await page
      .getByRole("dialog", { name: "Ticket Details", exact: true })
      .getByRole("button", { name: "Delete", exact: true })
      .click();
    await page
      .getByRole("dialog", { name: "Confirm Delete", exact: true })
      .getByRole("button", { name: "Proceed", exact: true })
      .click();
    await received;
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page
      .getByRole("button", { name: "Back to projects", exact: true })
      .click();
    await page
      .getByRole("link", {
        name: "Launchpad \u2014 Customer Portal",
        exact: true,
      })
      .click();
    const otherId = new URL(page.url()).pathname.split("/")[2];
    const other = await (
      await request.get(`/api/projects/${otherId}`, { headers })
    ).json();
    const target = other.tickets.find(
      (item: { tasks: unknown[] }) => item.tasks.length,
    );
    const sprint = other.sprints.find(
      (item: { id: string }) => item.id === target.sprintId,
    );
    await navigateSection(page, "Taskboard");
    await page
      .getByRole("combobox", { name: "Selected sprint", exact: true })
      .click();
    await page.getByRole("option", { name: sprint.name, exact: true }).click();
    await page
      .getByRole("heading", { name: target.title, exact: true })
      .click();
    const editor = page.getByRole("dialog", {
      name: "Ticket Details",
      exact: true,
    });
    await editor
      .getByPlaceholder("Ticket title")
      .fill("Other project draft stays here");
    const completed = page.waitForResponse(
      (response) =>
        response.url().endsWith(`/api/tickets/${created.id}`) &&
        response.request().method() === "DELETE",
    );
    release();
    await completed;
    await expect(editor.getByPlaceholder("Ticket title")).toHaveValue(
      "Other project draft stays here",
    );
    expect(new URL(page.url()).pathname).toContain(otherId);
    expect(new URL(page.url()).searchParams.get("ticketId")).toBe(
      String(target.id),
    );
    await expect(
      page.getByRole("alertdialog", { name: "Unsaved changes", exact: true }),
    ).toHaveCount(0);
  } finally {
    release();
    await page.unroute(pattern);
    await request.delete(`/api/tickets/${created.id}`, { headers });
  }
});
