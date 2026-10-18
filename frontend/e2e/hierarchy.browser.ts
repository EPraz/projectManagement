import { expect, test } from "@playwright/test";
import { enterDemo, navigateSection } from "./support/demo";

test.use({ actionTimeout: 5000 });

test("a confirmed project with no hierarchy explains the empty state", async ({
  page,
  request,
}) => {
  const login = await request.post("/api/auth/instant-login", { data: {} });
  const { accessToken } = await login.json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const created = await request.post("/api/projects", {
    headers,
    data: {
      title: `Isolated empty hierarchy ${Date.now()}`,
      description: "Temporary browser fixture",
      createdBy: "visitor@demo.example",
    },
  });
  expect(created.status()).toBe(201);
  const project: { id: string } = await created.json();
  try {
    await enterDemo(page);
    await page.goto(`/projects/${project.id}/epics`);
    await expect(
      page.getByText("No epics yet.", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "New Feature", exact: true }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "New Epic", exact: true }),
    ).toBeEnabled();
  } finally {
    expect(
      (await request.delete(`/api/projects/${project.id}`, { headers })).ok(),
    ).toBe(true);
  }
});

test("independent hierarchy events refresh only the selected project", async ({
  page,
  request,
}) => {
  const login = await request.post("/api/auth/instant-login", { data: {} });
  const { accessToken } = await login.json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const projects: { id: string }[] = await (
    await request.get("/api/projects/", { headers })
  ).json();
  const [selected, other] = projects;
  const title = `Independent local epic ${Date.now()}`;
  const otherTitle = `Unrelated local epic ${Date.now()}`;
  const created: string[] = [];
  let received!: () => void;
  const unrelated = new Promise<void>((resolve) => {
    received = resolve;
  });
  let selectedReceived!: () => void;
  const selectedChange = new Promise<void>((resolve) => {
    selectedReceived = resolve;
  });
  let connected = false;
  page.on("websocket", (socket) => {
    connected = false;
    socket.on("framereceived", (frame) => {
      if (typeof frame.payload !== "string") return;
      if (frame.payload.startsWith('40{"sid"')) connected = true;
      if (
        frame.payload.includes("hierarchyChanged") &&
        frame.payload.includes(other.id)
      )
        received();
      if (
        frame.payload.includes("hierarchyChanged") &&
        frame.payload.includes(selected.id)
      )
        selectedReceived();
    });
  });
  try {
    await enterDemo(page);
    await page.goto(`/projects/${selected.id}/epics`);
    await expect(
      page.getByRole("heading", { name: "Epics & Features", exact: true }),
    ).toBeVisible();
    await expect.poll(() => connected).toBe(true);
    for (const item of [
      { projectId: selected.id, title },
      { projectId: other.id, title: otherTitle },
    ]) {
      const response = await request.post("/api/epics", {
        headers,
        data: { ...item, createdBy: "visitor@demo.example" },
      });
      expect(response.status()).toBe(201);
      created.push((await response.json()).id);
      if (item.projectId === selected.id) {
        await selectedChange;
        await expect(page.getByText(title, { exact: true })).toBeVisible();
      }
    }
    await unrelated;
    await expect(page.getByText(otherTitle, { exact: true })).toHaveCount(0);
    await expect(page).toHaveURL(new RegExp(`/projects/${selected.id}/epics$`));
  } finally {
    for (const id of created)
      await request.delete(`/api/epics/${id}`, { headers });
  }
});

for (const width of [390, 1280]) {
  test(`hierarchy keyboard controls and form fit at ${width}px`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await enterDemo(page);
    await page.getByText("Orbit — Product Delivery", { exact: true }).click();
    await navigateSection(page, "Epics & Features");
    const editBounds = await page
      .getByRole("button", { name: /^Edit / })
      .first()
      .boundingBox();
    expect(editBounds!.x + editBounds!.width).toBeLessThanOrEqual(width);
    const cardBounds = await page.getByRole("article").first().boundingBox();
    expect(editBounds!.x + editBounds!.width).toBeLessThanOrEqual(
      cardBounds!.x + cardBounds!.width,
    );
    await page.screenshot({
      path: info.outputPath(`hierarchy-read-${width}.png`),
      animations: "disabled",
    });
    const create = page.getByRole("button", { name: "New Epic", exact: true });
    await expect(create).toBeVisible();
    const bounds = await create.boundingBox();
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    await create.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByLabel("Title", { exact: true })).toBeFocused();
    for (let index = 0; index < 7; index++) {
      await page.keyboard.press("Tab");
      expect(
        await dialog.evaluate((element) =>
          element.contains(document.activeElement),
        ),
      ).toBe(true);
    }
    await page.screenshot({
      path: info.outputPath(`hierarchy-form-${width}.png`),
      animations: "disabled",
    });
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await page
      .getByLabel("Search epics and features", { exact: true })
      .fill("No matching local hierarchy marker");
    await expect(
      page.getByText("No matching epics or features.", { exact: true }),
    ).toBeVisible();
  });
}

test("a failed backlog deletion keeps the confirmation available for retry", async ({
  page,
}) => {
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  const projectId = new URL(page.url()).pathname.split("/")[2];
  await page.goto(`/projects/${projectId}/board?tab=backlog`);
  const remove = page.getByRole("button", { name: /^Delete ticket / }).first();
  const id = (await remove.getAttribute("aria-label"))!.split(" ").pop();
  await page.route(`**/api/tickets/${id}`, (route) =>
    route.request().method() === "DELETE"
      ? route.fulfill({ status: 503, body: "unavailable" })
      : route.continue(),
  );
  await remove.click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("button", { name: "Proceed", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText(/try again/i);
  await expect(
    dialog.getByRole("button", { name: "Proceed", exact: true }),
  ).toBeEnabled();
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(dialog).toHaveCount(0);
  await expect(remove).toBeVisible();
});

test("backlog filters change the visible tickets without waiting for a data reload", async ({
  page,
}) => {
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  const projectId = new URL(page.url()).pathname.split("/")[2];
  await page.goto(`/projects/${projectId}/board?tab=backlog`);
  const table = page.getByRole("table");
  await expect(
    table.getByRole("cell", { name: "Low", exact: true }).first(),
  ).toBeVisible();
  await page.getByRole("button", { name: /^Filters/ }).click();
  const priority = page.getByRole("combobox", {
    name: "Priority",
    exact: true,
  });
  await priority.click();
  await page.getByRole("option", { name: "High", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(
    table.getByRole("cell", { name: "Low", exact: true }),
  ).toHaveCount(0);
  await expect(
    table.getByRole("cell", { name: "High", exact: true }).first(),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .click();
  await page.getByRole("button", { name: /^Filters/ }).click();
  const blocked = page.getByRole("combobox", { name: "Blocked", exact: true });
  await blocked.click();
  await page.getByRole("option", { name: "Blocked", exact: true }).click();
  await blocked.click();
  await page.getByRole("option", { name: "All tickets", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(
    table.getByRole("cell", { name: "Blocked", exact: true }).first(),
  ).toBeVisible();
});

for (const width of [390, 1280]) {
  test(`backlog expansion and linked task editor work with the keyboard at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await enterDemo(page);
    await page.getByText("Orbit — Product Delivery", { exact: true }).click();
    const projectId = new URL(page.url()).pathname.split("/")[2];
    await page.goto(`/projects/${projectId}/board?tab=backlog`);
    const expand = page
      .getByRole("button", { name: /^Expand tasks for / })
      .first();
    await expand.focus();
    await page.keyboard.press("Enter");
    const edit = page.getByRole("button", { name: /^Edit task / }).first();
    await edit.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByPlaceholder("Task title")).toBeVisible();
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page).toHaveURL(
      new RegExp(`/projects/${projectId}/board\\?tab=backlog$`),
    );
    await expect(
      page.getByRole("button", { name: /^Collapse tasks for / }).first(),
    ).toBeVisible();
  });
}

test("hierarchy shows the selected project's real epics, features and linked tickets", async ({
  page,
  request,
}) => {
  page.on("pageerror", (error) =>
    console.error("Hierarchy browser error:", error.message),
  );
  const login = await request.post("/api/auth/instant-login", { data: {} });
  const { accessToken } = await login.json();
  const projects: {
    id: string;
    epics: {
      id: string;
      title: string;
      features: { id: string; title: string }[];
    }[];
    tickets: { id: number; title: string; featureId: string | null }[];
  }[] = await (
    await request.get("/api/projects/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  ).json();
  const project = projects[0];
  const epic = project.epics[0];
  const feature = epic.features[0];
  const ticket = project.tickets.find((item) => item.featureId === feature.id)!;
  await enterDemo(page);
  await page.goto(`/projects/${project.id}/epics`);
  await expect(page.getByText(epic.title, { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: `Expand ${epic.title}`, exact: true })
    .click();
  await expect(page.getByText(feature.title, { exact: true })).toBeVisible();
  await page.getByRole("button", { name: ticket.title, exact: true }).click();
  await expect(
    page.getByRole("dialog").getByPlaceholder("Ticket title"),
  ).toHaveValue(ticket.title);
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await expect(page).toHaveURL(
    new RegExp(`/projects/${project.id}/board\\?tab=backlog`),
  );
});

test("hierarchy feature editing and deletion preserve confirmed parent associations", async ({
  page,
  request,
}) => {
  const login = await request.post("/api/auth/instant-login", { data: {} });
  const { accessToken } = await login.json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const projects: { id: string }[] = await (
    await request.get("/api/projects/", { headers })
  ).json();
  const project = projects[0];
  const title = `Local hierarchy parent ${Date.now()}`;
  const epicResponse = await request.post("/api/epics", {
    headers,
    data: { projectId: project.id, title, createdBy: "visitor@demo.example" },
  });
  expect(epicResponse.status()).toBe(201);
  const epic: { id: string } = await epicResponse.json();
  const featureTitle = `Local editable feature ${Date.now()}`;
  try {
    await enterDemo(page);
    await page.goto(`/projects/${project.id}/epics`);
    await page
      .getByRole("button", { name: "New Feature", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Title", { exact: true }).fill(featureTitle);
    await dialog.getByRole("combobox", { name: /^Epic/ }).click();
    await page.getByRole("option", { name: title, exact: true }).click();
    await dialog.getByRole("button", { name: "Create", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await page
      .getByRole("button", { name: `Expand ${title}`, exact: true })
      .click();
    await expect(page.getByText(featureTitle, { exact: true })).toBeVisible();
    await page
      .getByRole("button", { name: `Edit ${featureTitle}`, exact: true })
      .click();
    await dialog
      .getByLabel("Description", { exact: true })
      .fill("Changed without renaming the feature");
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await page
      .getByRole("button", { name: `Delete ${featureTitle}`, exact: true })
      .click();
    await expect(dialog).toContainText("linked tickets");
    const current: {
      epics: {
        id: string;
        features: { id: string; title: string; description: string }[];
      }[];
    } = await (
      await request.get(`/api/projects/${project.id}`, { headers })
    ).json();
    const feature = current.epics
      .find((item) => item.id === epic.id)!
      .features.find((item) => item.title === featureTitle)!;
    expect(feature.description).toBe("Changed without renaming the feature");
    const pattern = `**/api/features/${feature.id}`;
    await page.route(pattern, (route) =>
      route.request().method() === "DELETE"
        ? route.fulfill({ status: 503, body: "unavailable" })
        : route.continue(),
    );
    await dialog.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText(/try again/i);
    await page.unroute(pattern);
    await dialog.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByText(featureTitle, { exact: true })).toHaveCount(0);
  } finally {
    await request.delete(`/api/epics/${epic.id}`, { headers });
  }
});

test("creating an epic retains failed input and retries a confirmed write", async ({
  page,
  request,
}) => {
  const login = await request.post("/api/auth/instant-login", { data: {} });
  const { accessToken } = await login.json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const projects: { id: string }[] = await (
    await request.get("/api/projects/", { headers })
  ).json();
  const project = projects[0];
  const title = `Recoverable local epic ${Date.now()}`;
  const pattern = "**/api/epics";
  let release!: () => void;
  let reached!: () => void;
  const delayed = new Promise<void>((resolve) => {
    release = resolve;
  });
  const received = new Promise<void>((resolve) => {
    reached = resolve;
  });
  let submissions = 0;
  try {
    await enterDemo(page);
    await page.goto(`/projects/${project.id}/epics`);
    await page.getByRole("button", { name: "New Epic", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Title", { exact: true }).fill(title);
    await dialog
      .getByLabel("Description", { exact: true })
      .fill("Preserved hierarchy draft");
    await page.route(pattern, async (route) => {
      if (route.request().method() !== "POST") return route.continue();
      submissions++;
      reached();
      await delayed;
      await route.fulfill({ status: 503, body: "unavailable" });
    });
    await dialog.getByRole("button", { name: "Create", exact: true }).click();
    await received;
    await expect(
      dialog.getByRole("button", { name: "Saving…", exact: true }),
    ).toBeDisabled();
    expect(submissions).toBe(1);
    release();
    await expect(dialog.getByRole("alert")).toContainText(/try again/i);
    await expect(dialog.getByLabel("Title", { exact: true })).toHaveValue(
      title,
    );
    await page.unroute(pattern);
    await dialog.getByRole("button", { name: "Create", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  } finally {
    release();
    await page.unroute(pattern);
    const current: { epics: { id: string; title: string }[] } = await (
      await request.get(`/api/projects/${project.id}`, { headers })
    ).json();
    const created = current.epics.find((item) => item.title === title);
    if (created) await request.delete(`/api/epics/${created.id}`, { headers });
  }
});
