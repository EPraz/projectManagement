import { expect, test } from "@playwright/test";
import {
  enterDemo,
  navigateSection,
  showProjectNavigation,
} from "./support/demo";

test.use({ actionTimeout: 5000 });

test("a failed goal save retains the draft and retry creates one goal", async ({
  page,
  request,
}) => {
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await navigateSection(page, "Taskboard");
  await navigateSection(page, "Goals");
  await page.getByRole("button", { name: /Add New Goal/i }).click();
  const dialog = page.getByRole("dialog");
  const title = `Recoverable planning goal ${Date.now()}`;
  await dialog.getByLabel("title", { exact: true }).fill(title);
  await page.route("**/api/sprint-goals", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ message: "Temporary planning outage" }),
    }),
  );
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("title", { exact: true })).toHaveValue(title);
  await expect(dialog.getByRole("alert")).toBeVisible();
  await page.unroute("**/api/sprint-goals");
  const saved = page.waitForResponse(
    (r) =>
      r.request().method() === "POST" && /\/api\/sprint-goals$/.test(r.url()),
  );
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  const response = await saved;
  expect(response.status()).toBe(201);
  const goal = await response.json();
  try {
    await expect(dialog).toHaveCount(0);
    await expect(page.getByText(title, { exact: true })).toHaveCount(1);
    await page.reload();
    await expect(page.getByText(title, { exact: true })).toHaveCount(1);
  } finally {
    const login = await request.post("/api/auth/instant-login", { data: {} });
    const { accessToken } = await login.json();
    expect(
      (
        await request.delete(`/api/sprint-goals/${goal.id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
      ).ok(),
    ).toBe(true);
  }
});

test("planning tabs and new-sprint creation are reachable with the keyboard", async ({
  page,
}) => {
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await navigateSection(page, "Taskboard");
  await showProjectNavigation(page);
  const goals = page.getByRole("button", { name: "Goals", exact: true });
  await goals.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Sprint Goals", exact: true }),
  ).toBeVisible();
  const selector = page.getByRole("combobox", {
    name: "Selected sprint",
    exact: true,
  });
  await selector.fill("New Sprint");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toContainText("Create Sprint");
});

async function planningFixture(
  request: import("@playwright/test").APIRequestContext,
) {
  const { accessToken } = await (
    await request.post("/api/auth/instant-login", { data: {} })
  ).json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const response = await request.post("/api/projects", {
    headers,
    data: {
      title: `Isolated planning ${Date.now()}`,
      description: "Temporary planning fixture",
      createdBy: "visitor@demo.example",
    },
  });
  expect(response.status()).toBe(201);
  const project = await response.json();
  const dispose = async () => {
    expect(
      (await request.delete(`/api/projects/${project.id}`, { headers })).ok(),
    ).toBe(true);
  };
  try {
    const sprints: { id: string; name: string }[] = [];
    const goals: { id: string; title: string }[] = [];
    for (const name of ["Planning A", "Planning B"]) {
      const sprint = await request.post("/api/sprints", {
        headers,
        data: {
          projectId: project.id,
          name,
          startDate: "2026-10-17T00:00:00Z",
          endDate: "2026-10-31T00:00:00Z",
          createdBy: "visitor@demo.example",
        },
      });
      expect(sprint.status()).toBe(201);
      sprints.push(await sprint.json());
      const goal = await request.post("/api/sprint-goals", {
        headers,
        data: { sprintId: sprints.at(-1)!.id, title: `${name} goal` },
      });
      expect(goal.status()).toBe(201);
      goals.push(await goal.json());
    }
    const tasks: { id: string; title: string }[] = [];
    for (const title of ["Planning check one", "Planning check two"]) {
      const response = await request.post("/api/sprint-goals/goalTask", {
        headers,
        data: { goalId: goals[0].id, title },
      });
      expect(response.status()).toBe(201);
      tasks.push(await response.json());
    }
    return { headers, project, sprints, goals, tasks, dispose };
  } catch (error) {
    await dispose();
    throw error;
  }
}

async function selectSprint(
  page: import("@playwright/test").Page,
  name: string,
) {
  const selector = page.getByRole("combobox", {
    name: "Selected sprint",
    exact: true,
  });
  if ((await selector.inputValue()) === name) return;
  await selector.click();
  await selector.fill(name);
  await page.getByRole("option", { name: new RegExp(name) }).click();
}

test("checklist failure, retry and deletion keep board, overview and persistence consistent", async ({
  page,
  request,
}) => {
  const fixture = await planningFixture(request);
  try {
    await enterDemo(page);
    await page.goto(`/projects/${fixture.project.id}/board?tab=goals`);
    await selectSprint(page, "Planning A");
    const toggle = page
      .getByRole("button", { name: "Mark as complete", exact: true })
      .first();
    const path = `**/api/sprint-goals/goalTask/${fixture.tasks[0].id}`;
    await page.route(path, (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: '{"message":"Temporary checklist outage"}',
      }),
    );
    await toggle.click();
    await expect(page.getByRole("alert")).toContainText("Could not save");
    await expect(page.getByText("0%", { exact: true })).toBeVisible();
    await page.unroute(path);
    await toggle.click();
    await expect(page.getByText("50%", { exact: true })).toBeVisible();
    // Second independent HTTP client confirms the same saved checklist.
    const goals = await (
      await request.get(`/api/sprint-goals/${fixture.sprints[0].id}`, {
        headers: fixture.headers,
      })
    ).json();
    expect(goals[0]).toMatchObject({
      progress: 50,
      goalsStatus: "IN_PROGRESS",
    });
    await page
      .getByRole("button", { name: "Mark as complete", exact: true })
      .click();
    await expect(page.getByText("100%", { exact: true })).toBeVisible();
    await navigateSection(page, "Overview");
    await expect(page.getByText("completed", { exact: true })).toBeVisible();
    await navigateSection(page, "Taskboard");
    await navigateSection(page, "Goals");
    await page
      .getByRole("button", { name: "Mark as incomplete", exact: true })
      .first()
      .click();
    await expect(page.getByText("50%", { exact: true })).toBeVisible();
    const row = page
      .getByRole("listitem")
      .filter({ hasText: fixture.tasks[0].title });
    await row.getByRole("button", { name: "Delete task", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "Proceed", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByText("100%", { exact: true })).toBeVisible();
    await page.reload();
    await expect(
      page.getByText(fixture.tasks[0].title, { exact: true }),
    ).toHaveCount(0);
    await expect(page.getByText("100%", { exact: true })).toBeVisible();
  } finally {
    await fixture.dispose();
  }
});

test("a late goal response cannot replace another selected sprint or its new draft", async ({
  page,
  request,
}) => {
  const fixture = await planningFixture(request);
  let release!: () => void;
  const delayed = new Promise<void>((r) => {
    release = r;
  });
  let reached!: () => void;
  const received = new Promise<void>((r) => {
    reached = r;
  });
  const path = `**/api/sprint-goals/${fixture.goals[0].id}`;
  try {
    await enterDemo(page);
    await page.getByText(fixture.project.title, { exact: true }).click();
    await navigateSection(page, "Taskboard");
    await navigateSection(page, "Goals");
    await selectSprint(page, "Planning A");
    await page.getByRole("button", { name: "Edit goal", exact: true }).click();
    await page
      .getByRole("dialog")
      .getByLabel("title", { exact: true })
      .fill("Saved only in planning A");
    await page.route(path, async (route) => {
      const response = await route.fetch();
      reached();
      await delayed;
      await route.fulfill({ response });
    });
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Save", exact: true })
      .click();
    await received;
    // Browser navigation remains available while the old form is pending.
    await page.goBack();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await navigateSection(page, "Taskboard");
    await navigateSection(page, "Goals");
    await selectSprint(page, "Planning B");
    await page.getByRole("button", { name: "Edit goal", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByLabel("title", { exact: true })
      .fill("Unsaved planning B draft");
    release();
    await page.unrouteAll({ behavior: "wait" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("title", { exact: true })).toHaveValue(
      "Unsaved planning B draft",
    );
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(
      page.getByText("Planning B goal", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Saved only in planning A", { exact: true }),
    ).toHaveCount(0);
  } finally {
    release();
    await fixture.dispose();
  }
});

for (const width of [390, 1280]) {
  test(`planning controls and goal draft fit at ${width}px`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await enterDemo(page);
    await page.getByText("Orbit — Product Delivery", { exact: true }).click();
    await navigateSection(page, "Taskboard");
    await showProjectNavigation(page);
    const goals = page.getByRole("button", { name: "Goals", exact: true });
    await goals.focus();
    await page.keyboard.press("Enter");
    const add = page.getByRole("button", { name: "Add New Goal", exact: true });
    const bounds = await add.boundingBox();
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    await add.click();
    const dialog = page.getByRole("dialog");
    const input = dialog.getByLabel("title", { exact: true });
    await input.fill("Narrow keyboard draft");
    await expect(input).toHaveValue("Narrow keyboard draft");
    const save = dialog.getByRole("button", { name: "Save", exact: true });
    const saveBounds = await save.boundingBox();
    expect(saveBounds!.x + saveBounds!.width).toBeLessThanOrEqual(width);
    await page.screenshot({
      path: info.outputPath(`planning-${width}.png`),
      animations: "disabled",
    });
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  });
}

test("confirmed independent goal changes preserve the current draft and failed task editing can retry", async ({
  page,
  request,
}) => {
  const fixture = await planningFixture(request);
  let connected = false;
  let notify!: () => void;
  const changed = new Promise<void>((resolve) => {
    notify = resolve;
  });
  page.on("websocket", (socket) => {
    connected = false;
    socket.on("framereceived", (frame) => {
      if (typeof frame.payload !== "string") return;
      if (frame.payload.startsWith('40{"sid"')) connected = true;
      if (
        frame.payload.includes("sprintUpdated") &&
        frame.payload.includes("Independent confirmed goal")
      )
        notify();
    });
  });
  try {
    await enterDemo(page);
    await page.goto(`/projects/${fixture.project.id}/board?tab=goals`);
    await selectSprint(page, "Planning A");
    await expect.poll(() => connected).toBe(true);
    await page.getByRole("button", { name: "Edit goal", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByLabel("title", { exact: true })
      .fill("Keep this unsaved goal draft");
    const edited = await request.patch(
      `/api/sprint-goals/${fixture.goals[0].id}`,
      {
        headers: fixture.headers,
        data: { id: fixture.goals[0].id, title: "Independent confirmed goal" },
      },
    );
    expect(edited.ok()).toBe(true);
    await changed;
    await expect(dialog.getByLabel("title", { exact: true })).toHaveValue(
      "Keep this unsaved goal draft",
    );
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(
      page.getByText("Independent confirmed goal", { exact: true }),
    ).toBeVisible();
    await page
      .getByRole("listitem")
      .filter({ hasText: fixture.tasks[0].title })
      .getByRole("button", { name: "Edit task", exact: true })
      .click();
    await dialog
      .getByLabel("title", { exact: true })
      .fill("Recoverable checklist title");
    const path = `**/api/sprint-goals/goalTask/${fixture.tasks[0].id}`;
    await page.route(path, (route) =>
      route.fulfill({ status: 503, body: "unavailable" }),
    );
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText("Could not save");
    await expect(dialog.getByLabel("title", { exact: true })).toHaveValue(
      "Recoverable checklist title",
    );
    await page.unroute(path);
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(
      page.getByText("Recoverable checklist title", { exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Add Task", exact: true }).click();
    await dialog
      .getByLabel("title", { exact: true })
      .fill("New confirmed checklist task");
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(
      page.getByText("New confirmed checklist task", { exact: true }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Delete goal", exact: true })
      .click();
    const pathGoal = `**/api/sprint-goals/${fixture.goals[0].id}`;
    await page.route(pathGoal, (route) =>
      route.fulfill({ status: 503, body: "unavailable" }),
    );
    await dialog.getByRole("button", { name: "Proceed", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText("Could not delete");
    await page.unroute(pathGoal);
    await dialog.getByRole("button", { name: "Proceed", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(
      page.getByText("No goals added yet.", { exact: false }),
    ).toBeVisible();
  } finally {
    await fixture.dispose();
  }
});

test("assigning backlog work to another sprint updates its board and survives reload", async ({
  page,
  request,
}) => {
  const fixture = await planningFixture(request);
  try {
    const created = await request.post("/api/tickets", {
      headers: fixture.headers,
      data: {
        sprintId: fixture.sprints[0].id,
        title: "Planning assignment fixture",
        createdBy: "visitor@demo.example",
      },
    });
    expect(created.status()).toBe(201);
    const ticket = await created.json();
    await enterDemo(page);
    await page.goto(
      `/projects/${fixture.project.id}/board?tab=backlog&ticketId=${ticket.id}`,
    );
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("tab", { name: "Planning", exact: true }).click();
    await dialog.getByRole("combobox", { name: /^Sprint/ }).click();
    await page.getByRole("option", { name: "Planning B", exact: true }).click();
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await page
      .getByRole("button", { name: "Taskboard", exact: true })
      .last()
      .click();
    await selectSprint(page, "Planning A");
    await expect(
      page.getByRole("heading", {
        name: "Planning assignment fixture",
        exact: true,
      }),
    ).toHaveCount(0);
    await selectSprint(page, "Planning B");
    await expect(
      page.getByRole("heading", {
        name: "Planning assignment fixture",
        exact: true,
      }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("heading", {
        name: "Planning assignment fixture",
        exact: true,
      }),
    ).toBeVisible();
    const saved = await (
      await request.get(`/api/tickets/${ticket.id}`, {
        headers: fixture.headers,
      })
    ).json();
    expect(saved.sprintId).toBe(fixture.sprints[1].id);
  } finally {
    await fixture.dispose();
  }
});

test("new sprint creation preserves failed input and its empty goals remain selectable after reload", async ({
  page,
  request,
}) => {
  const fixture = await planningFixture(request);
  try {
    await enterDemo(page);
    await page.goto(`/projects/${fixture.project.id}/board?tab=goals`);
    const selector = page.getByRole("combobox", {
      name: "Selected sprint",
      exact: true,
    });
    await selector.fill("New Sprint");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("name", { exact: true }).fill("New planned sprint");
    await dialog.getByLabel("endDate", { exact: true }).fill("10/31/2026");
    await dialog.getByLabel("endDate", { exact: true }).press("Tab");
    await page.route("**/api/sprints", (route) =>
      route.request().method() === "POST"
        ? route.fulfill({ status: 503, body: "unavailable" })
        : route.continue(),
    );
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText("Could not save");
    await expect(dialog.getByLabel("name", { exact: true })).toHaveValue(
      "New planned sprint",
    );
    await page.unroute("**/api/sprints");
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await selectSprint(page, "New planned sprint");
    await expect(
      page.getByText("No goals added yet.", { exact: false }),
    ).toBeVisible();
    await page.reload();
    await expect(
      page.getByRole("combobox", { name: "Selected sprint", exact: true }),
    ).toHaveValue("New planned sprint");
    await selector.click();
    await page
      .getByRole("button", { name: "Delete New planned sprint", exact: true })
      .click();
    await dialog.getByRole("button", { name: "Proceed", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(selector).not.toHaveValue("New planned sprint");
  } finally {
    await fixture.dispose();
  }
});

test("a pending goal submission keeps input and blocks duplicate saves", async ({
  page,
}) => {
  let release!: () => void;
  const delay = new Promise<void>((r) => {
    release = r;
  });
  let reached!: () => void;
  const received = new Promise<void>((r) => {
    reached = r;
  });
  let submissions = 0;
  try {
    await enterDemo(page);
    await page.getByText("Orbit — Product Delivery", { exact: true }).click();
    await navigateSection(page, "Taskboard");
    await navigateSection(page, "Goals");
    await page
      .getByRole("button", { name: "Add New Goal", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByLabel("title", { exact: true })
      .fill("Pending retained goal");
    await page.route("**/api/sprint-goals", async (route) => {
      submissions++;
      reached();
      await delay;
      await route.fulfill({ status: 503, body: "unavailable" });
    });
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await received;
    await expect(
      dialog.getByRole("button", { name: "Save", exact: true }),
    ).toBeDisabled();
    await expect(dialog.getByLabel("title", { exact: true })).toHaveValue(
      "Pending retained goal",
    );
    expect(submissions).toBe(1);
    release();
    await expect(dialog.getByRole("alert")).toContainText("Could not save");
    await expect(
      dialog.getByRole("button", { name: "Save", exact: true }),
    ).toBeEnabled();
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  } finally {
    release();
    await page.unrouteAll({ behavior: "wait" });
  }
});
