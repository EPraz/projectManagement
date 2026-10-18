import { expect, test } from "@playwright/test";
import { enterDemo, navigateSection } from "./support/demo";

test("ticket deletion during refresh cannot be restored by an older project snapshot", async ({
  page,
  request,
}) => {
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await expect(
    page.getByText("Overall Progress", { exact: true }),
  ).toBeVisible();
  const id = new URL(page.url()).pathname.split("/")[2];
  const login = await request.post("/api/auth/instant-login", { data: {} });
  const { accessToken } = await login.json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const project: { sprints: { id: string; name: string }[] } = await (
    await request.get(`/api/projects/${id}`, { headers })
  ).json();
  const sprintName = await page.getByRole("combobox").inputValue();
  const sprint = project.sprints.find((item) => item.name === sprintName)!;
  const marker = `Pending refresh deletion ${Date.now()}`;
  const created = await request.post("/api/tickets", {
    headers,
    data: {
      title: marker,
      sprintId: sprint.id,
      createdBy: "visitor@demo.example",
    },
  });
  expect(created.status()).toBe(201);
  const ticket: { id: number } = await created.json();
  const pattern = `**/api/projects/${id}?view=workspace`;
  let release!: () => void;
  let reached!: () => void;
  let finished!: () => void;
  const delayed = new Promise<void>((resolve) => {
    release = resolve;
  });
  const received = new Promise<void>((resolve) => {
    reached = resolve;
  });
  const fulfilled = new Promise<void>((resolve) => {
    finished = resolve;
  });
  try {
    await navigateSection(page, "Taskboard");
    await expect(
      page.getByRole("heading", { name: marker, exact: true }),
    ).toBeVisible();
    let first = true;
    await page.route(pattern, async (route) => {
      if (!first) return route.continue();
      first = false;
      const oldSnapshot = await route.fetch();
      reached();
      await delayed;
      try {
        await route.fulfill({ response: oldSnapshot });
      } finally {
        finished();
      }
    });
    await page
      .getByRole("button", { name: "Refresh project", exact: true })
      .click();
    await received;
    const refreshed = page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === `/api/projects/${id}` &&
        response.ok(),
    );
    expect(
      (await request.delete(`/api/tickets/${ticket.id}`, { headers })).ok(),
    ).toBe(true);
    await refreshed;
    await expect(
      page.getByRole("heading", { name: marker, exact: true }),
    ).toHaveCount(0);
    release();
    await fulfilled;
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    await expect(
      page.getByRole("heading", { name: marker, exact: true }),
    ).toHaveCount(0);
  } finally {
    release();
    await page.unroute(pattern);
    await request.delete(`/api/tickets/${ticket.id}`, { headers });
  }
});

for (const failure of ["unavailable", "non-JSON"]) {
  test(`project-list ${failure} failure stays recoverable instead of showing an empty workspace`, async ({
    page,
  }) => {
    await page.route("**/api/projects/?view=summary", (route) =>
      route.fulfill(
        failure === "unavailable"
          ? { status: 503, body: "unavailable" }
          : {
              status: 200,
              contentType: "text/html",
              body: "<html>unexpected</html>",
            },
      ),
    );
    await page.goto("/auth/instantLogin");
    await page.getByRole("button", { name: /explore demo/i }).click();
    await expect(
      page.getByRole("button", { name: "Retry projects" }),
    ).toBeVisible();
    await expect(
      page.getByText("No projects yet", { exact: true }),
    ).toHaveCount(0);
    await page.unroute("**/api/projects/?view=summary");
    await page.getByRole("button", { name: "Retry projects" }).click();
    await expect(
      page.getByText("Orbit — Product Delivery", { exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("progressbar")).toHaveCount(2);
  });
}

test("a confirmed empty list differs from an unavailable workspace", async ({
  page,
}) => {
  await page.route("**/api/projects/?view=summary", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
  );
  await page.goto("/auth/instantLogin");
  await page.getByRole("button", { name: /explore demo/i }).click();
  await expect(
    page.getByText("No projects yet", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Retry projects" }),
  ).toHaveCount(0);
  await page.unroute("**/api/projects/?view=summary");
  await page.getByRole("button", { name: "Refresh projects" }).click();
  await expect(
    page.getByText("Orbit — Product Delivery", { exact: true }),
  ).toBeVisible();
});

test("refresh keeps loaded projects visible through pending, failure and retry", async ({
  page,
}) => {
  await enterDemo(page);
  let release!: () => void;
  let reached!: () => void;
  const delayed = new Promise<void>((resolve) => {
    release = resolve;
  });
  const received = new Promise<void>((resolve) => {
    reached = resolve;
  });
  await page.route("**/api/projects/?view=summary", async (route) => {
    reached();
    await delayed;
    await route.fulfill({ status: 503, body: "unavailable" });
  });
  try {
    await page.getByRole("button", { name: "Refresh projects" }).click();
    await received;
    await expect(
      page.getByRole("button", { name: "Refreshing…" }),
    ).toBeDisabled();
    await expect(
      page.getByText("Orbit — Product Delivery", { exact: true }),
    ).toBeVisible();
  } finally {
    release();
  }
  await expect(
    page.getByRole("button", { name: "Retry projects" }),
  ).toBeVisible();
  await expect(
    page.getByText("Orbit — Product Delivery", { exact: true }),
  ).toBeVisible();
  await page.unroute("**/api/projects/?view=summary");
  await page.getByRole("button", { name: "Retry projects" }).click();
  await expect(
    page.getByRole("button", { name: "Retry projects" }),
  ).toHaveCount(0);
  await expect(page.getByRole("progressbar")).toHaveCount(2);
});

test("a missing project explains the failure and links back to projects", async ({
  page,
}) => {
  await enterDemo(page);
  await page.goto("/projects/missing-project/overview");
  await expect(page.getByRole("alert")).toContainText("not found");
  await page.getByRole("button", { name: "Back to projects" }).click();
  await expect(
    page.getByText("Orbit — Product Delivery", { exact: true }),
  ).toBeVisible();
});

test("another project's confirmed socket update never replaces the selected project", async ({
  page,
  request,
}) => {
  const marker = "Unrelated local QA project update";
  let received!: () => void;
  const unrelatedEvent = new Promise<void>((resolve) => {
    received = resolve;
  });
  page.on("websocket", (socket) =>
    socket.on("framereceived", (frame) => {
      if (
        typeof frame.payload === "string" &&
        frame.payload.includes("projectUpdated") &&
        frame.payload.includes(marker)
      )
        received();
    }),
  );
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await expect(
    page.getByText("Overall Progress", { exact: true }),
  ).toBeVisible();
  const selected = page.url();
  const selectedId = new URL(selected).pathname.split("/")[2];
  const login = await request.post("/api/auth/instant-login", { data: {} });
  const { accessToken } = await login.json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const response = await request.get("/api/projects/", { headers });
  const projects: { id: string; title: string; description: string }[] =
    await response.json();
  const other = projects.find((project) => project.id !== selectedId)!;
  try {
    expect(
      (
        await request.patch(`/api/projects/${other.id}`, {
          headers,
          data: { description: marker, updatedBy: "visitor@demo.example" },
        })
      ).ok(),
    ).toBe(true);
    await unrelatedEvent;
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    await expect(page).toHaveURL(selected);
    await expect(
      page.getByText("Orbit — Product Delivery", { exact: true }).first(),
    ).toBeVisible();
    await expect(page.getByText(marker, { exact: true })).toHaveCount(0);
  } finally {
    await request.patch(`/api/projects/${other.id}`, {
      headers,
      data: {
        description: other.description,
        updatedBy: "visitor@demo.example",
      },
    });
  }
});

test("a failed detail refresh retains the selected project and offers retry", async ({
  page,
}) => {
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await expect(
    page.getByText("Overall Progress", { exact: true }),
  ).toBeVisible();
  const id = new URL(page.url()).pathname.split("/")[2];
  const pattern = `**/api/projects/${id}?view=workspace`;
  await page.route(pattern, (route) =>
    route.fulfill({ status: 503, body: "unavailable" }),
  );
  await expect(
    page.getByRole("button", { name: "Refresh project", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Refresh project", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Retry project", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Overall Progress", { exact: true }),
  ).toBeVisible();
  await page.unroute(pattern);
  await page
    .getByRole("button", { name: "Retry project", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Retry project", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("alert").filter({ hasText: "Could not load this project" }),
  ).toHaveCount(0);
  await expect(
    page.getByText("Overall Progress", { exact: true }),
  ).toBeVisible();
});

test("sprint selections are retained separately for each project", async ({
  page,
}) => {
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await page.getByRole("combobox").click();
  await page
    .getByRole("option", { name: "Sprint 1 — Foundation", exact: true })
    .click();
  await expect(page.getByRole("combobox")).toHaveValue("Sprint 1 — Foundation");
  await page.getByRole("button", { name: "Back to projects" }).click();
  await page.getByText("Launchpad — Customer Portal", { exact: true }).click();
  await page.getByRole("combobox").click();
  await page
    .getByRole("option", { name: "Sprint 3 — Launch", exact: true })
    .click();
  await expect(page.getByRole("combobox")).toHaveValue("Sprint 3 — Launch");
  await page.getByRole("button", { name: "Back to projects" }).click();
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await expect(page.getByRole("combobox")).toHaveValue("Sprint 1 — Foundation");
  await expect(
    page.getByRole("progressbar", { name: "Overall Progress", exact: true }),
  ).toHaveAttribute("aria-valuenow", "33");
  await expect(
    page.getByText("Completion", { exact: true }).locator(".."),
  ).toContainText("100%");
});

test("an unrelated sprint event does not add another project's sprint to selection", async ({
  page,
  request,
}) => {
  const marker = `Unrelated local QA sprint ${Date.now()}`;
  let received!: () => void;
  const sprintEvent = new Promise<void>((resolve) => {
    received = resolve;
  });
  page.on("websocket", (socket) =>
    socket.on("framereceived", (frame) => {
      if (
        typeof frame.payload === "string" &&
        frame.payload.includes("sprintCreated") &&
        frame.payload.includes(marker)
      )
        received();
    }),
  );
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await expect(
    page.getByText("Overall Progress", { exact: true }),
  ).toBeVisible();
  const selectedId = new URL(page.url()).pathname.split("/")[2];
  const login = await request.post("/api/auth/instant-login", { data: {} });
  const { accessToken } = await login.json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const projects: { id: string }[] = await (
    await request.get("/api/projects/", { headers })
  ).json();
  const other = projects.find((project) => project.id !== selectedId)!;
  const response = await request.post("/api/sprints", {
    headers,
    data: {
      projectId: other.id,
      name: marker,
      createdBy: "visitor@demo.example",
      startDate: "2026-11-01T00:00:00Z",
      endDate: "2026-11-14T23:59:59Z",
    },
  });
  expect(response.status()).toBe(201);
  const created: { id: string } = await response.json();
  try {
    await sprintEvent;
    await page.getByRole("combobox").click();
    await expect(
      page.getByRole("option", { name: marker, exact: true }),
    ).toHaveCount(0);
  } finally {
    await request.delete(`/api/sprints/${created.id}`, { headers });
  }
});

test("a socket update invalidates an older pending project snapshot", async ({
  page,
  request,
}) => {
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await expect(
    page.getByText("Overall Progress", { exact: true }),
  ).toBeVisible();
  const id = new URL(page.url()).pathname.split("/")[2];
  const pattern = `**/api/projects/${id}?view=workspace`;
  const login = await request.post("/api/auth/instant-login", { data: {} });
  const { accessToken } = await login.json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const original: { description: string } = await (
    await request.get(`/api/projects/${id}`, { headers })
  ).json();
  let release!: () => void;
  let reached!: () => void;
  let finished!: () => void;
  const delayed = new Promise<void>((resolve) => {
    release = resolve;
  });
  const received = new Promise<void>((resolve) => {
    reached = resolve;
  });
  const fulfilled = new Promise<void>((resolve) => {
    finished = resolve;
  });
  let first = true;
  await page.route(pattern, async (route) => {
    if (!first) return route.continue();
    first = false;
    const oldSnapshot = await route.fetch();
    reached();
    await delayed;
    try {
      await route.fulfill({ response: oldSnapshot });
    } finally {
      finished();
    }
  });
  const marker = "Newer selected project local QA description";
  try {
    await page
      .getByRole("button", { name: "Refresh project", exact: true })
      .click();
    await received;
    expect(
      (
        await request.patch(`/api/projects/${id}`, {
          headers,
          data: { description: marker, updatedBy: "visitor@demo.example" },
        })
      ).ok(),
    ).toBe(true);
    await expect(page.getByText(marker, { exact: true })).toBeVisible();
    release();
    await fulfilled;
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    await expect(page.getByText(marker, { exact: true })).toBeVisible();
  } finally {
    release();
    await page.unroute(pattern);
    await request.patch(`/api/projects/${id}`, {
      headers,
      data: {
        description: original.description,
        updatedBy: "visitor@demo.example",
      },
    });
  }
});
