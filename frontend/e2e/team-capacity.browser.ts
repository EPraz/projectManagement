import { expect, test } from "@playwright/test";
import {
  enterDemo,
  navigateSection,
  discardUnsavedChanges,
} from "./support/demo";

test.use({ actionTimeout: 5000 });

test("a failed capacity edit retains the draft and saved summary", async ({
  page,
}) => {
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await navigateSection(page, "Taskboard");
  await navigateSection(page, "Capacity");
  const row = page
    .getByRole("row")
    .filter({
      has: page.getByRole("button", { name: "Edit capacity", exact: true }),
    })
    .first();
  await row.getByRole("button", { name: "Edit capacity", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Capacity (hours)", { exact: true }).fill("99");
  await page.route("**/api/team-member-capacities/*", (route) =>
    route.request().method() === "PATCH"
      ? route.fulfill({ status: 503, body: "unavailable" })
      : route.continue(),
  );
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("alert")).toContainText("Could not save");
  await expect(
    dialog.getByLabel("Capacity (hours)", { exact: true }),
  ).toHaveValue("99");
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await discardUnsavedChanges(page);
  await expect(row).not.toContainText("99h");
});

test("an unavailable member catalog stays distinct from an empty list and can retry", async ({
  page,
}) => {
  await page.route(/\/api\/users\/?$/, (route) =>
    route.fulfill({ status: 503, body: "unavailable" }),
  );
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await navigateSection(page, "Team");
  await page.getByRole("button", { name: "Add Member", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("alert")).toContainText(
    "Could not load team users",
  );
  await expect(
    dialog.getByText("All users are already part of this project", {
      exact: true,
    }),
  ).toHaveCount(0);
  await page.unroute(/\/api\/users\/?$/);
  await dialog
    .getByRole("button", { name: "Retry users", exact: true })
    .click();
  await expect(dialog.getByRole("alert")).toHaveCount(0);
  await expect(
    dialog.getByText("All users are already part of this project", {
      exact: true,
    }),
  ).toBeVisible();
});

async function teamFixture(
  request: import("@playwright/test").APIRequestContext,
) {
  const { accessToken } = await (
    await request.post("/api/auth/instant-login", { data: {} })
  ).json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const users: { id: string; name: string; email: string }[] = await (
    await request.get("/api/users", { headers })
  ).json();
  const demo = users.find((user) => user.email === "visitor@demo.example")!;
  const outsider = users.find((user) => user.id !== demo.id)!;
  const created = await request.post("/api/projects", {
    headers,
    data: {
      title: `Isolated team capacity ${Date.now()}`,
      description: "Temporary browser fixture",
      createdBy: demo.email,
    },
  });
  expect(created.status()).toBe(201);
  const project = await created.json();
  const dispose = async () => {
    expect(
      (await request.delete(`/api/projects/${project.id}`, { headers })).ok(),
    ).toBe(true);
  };
  try {
    const sprints: { id: string; name: string }[] = [];
    const capacities: { id: string; capacity: number }[] = [];
    for (const [name, capacity] of [
      ["Capacity A", 40],
      ["Capacity B", 80],
    ] as const) {
      const response = await request.post("/api/sprints", {
        headers,
        data: {
          projectId: project.id,
          name,
          startDate: "2026-10-17T00:00:00Z",
          endDate: "2026-10-31T00:00:00Z",
          createdBy: demo.email,
        },
      });
      expect(response.status()).toBe(201);
      const sprint = await response.json();
      sprints.push(sprint);
      const planned = await request.post("/api/team-member-capacities", {
        headers,
        data: {
          userId: demo.id,
          sprintId: sprint.id,
          capacity,
          daysOff: 1,
          remainingWork: 20,
        },
      });
      expect(planned.status()).toBe(201);
      capacities.push(await planned.json());
    }
    return { headers, project, demo, outsider, sprints, capacities, dispose };
  } catch (error) {
    await dispose();
    throw error;
  }
}
async function chooseSprint(
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
  await page.getByRole("option", { name, exact: true }).click();
}

test("membership failures retain selection and retry synchronizes a second browser session", async ({
  page,
  request,
  browser,
}) => {
  const fixture = await teamFixture(request);
  const otherContext = await browser.newContext();
  const other = await otherContext.newPage();
  try {
    for (const current of [page, other]) {
      await enterDemo(current);
      await current.getByText(fixture.project.title, { exact: true }).click();
      await current.getByRole("button", { name: "Team", exact: true }).click();
    }
    await page.getByRole("button", { name: "Add Member", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByRole("combobox", { name: "Select User", exact: true })
      .fill(fixture.outsider.name);
    await page
      .getByRole("option")
      .filter({ hasText: fixture.outsider.email })
      .click();
    const path = `**/api/projects/${fixture.project.id}/users/${fixture.outsider.id}`;
    await page.route(path, (route) =>
      route.fulfill({ status: 503, body: "unavailable" }),
    );
    await dialog
      .getByRole("button", { name: "Add Member", exact: true })
      .click();
    await expect(dialog.getByRole("alert")).toContainText(
      "Could not change project membership",
    );
    await expect(dialog.getByRole("combobox")).toHaveValue(
      `${fixture.outsider.email} (${fixture.outsider.name})`,
    );
    await page.unroute(path);
    await dialog
      .getByRole("button", { name: "Add Member", exact: true })
      .click();
    await expect(dialog).toHaveCount(0);
    for (const current of [page, other])
      await expect(
        current.getByRole("row").filter({ hasText: fixture.outsider.email }),
      ).toBeVisible();
    await page
      .getByRole("button", {
        name: `Actions for ${fixture.outsider.name}`,
        exact: true,
      })
      .click();
    await page.route(path, (route) =>
      route.fulfill({ status: 503, body: "unavailable" }),
    );
    await page
      .getByRole("menuitem", { name: "Remove From Project", exact: true })
      .click();
    await expect(page.getByRole("menu").getByRole("alert")).toContainText(
      "Could not change project membership",
    );
    await page.unroute(path);
    await page
      .getByRole("menuitem", { name: "Remove From Project", exact: true })
      .click();
    for (const current of [page, other])
      await expect(
        current.getByRole("row").filter({ hasText: fixture.outsider.email }),
      ).toHaveCount(0);
    await page
      .getByPlaceholder("Search members...")
      .fill("No such fictional member");
    await expect(
      page.getByText("No team members found", { exact: true }),
    ).toBeVisible();
  } finally {
    await otherContext.close();
    await fixture.dispose();
  }
});

test("independent capacity changes update only their own sprint", async ({
  page,
  request,
}) => {
  const fixture = await teamFixture(request);
  let connected = false;
  page.on("websocket", (socket) => {
    connected = false;
    socket.on("framereceived", (frame) => {
      if (
        typeof frame.payload === "string" &&
        frame.payload.startsWith('40{"sid"')
      )
        connected = true;
    });
  });
  try {
    await enterDemo(page);
    await page.goto(`/projects/${fixture.project.id}/board?tab=capacity`);
    await chooseSprint(page, "Capacity A");
    await expect.poll(() => connected).toBe(true);
    const row = page.getByRole("row").filter({ hasText: fixture.demo.email });
    await expect(row).toContainText("40h");
    expect(
      (
        await request.patch(
          `/api/team-member-capacities/${fixture.capacities[0].id}`,
          { headers: fixture.headers, data: { capacity: 68 } },
        )
      ).ok(),
    ).toBe(true);
    await expect(row).toContainText("68h");
    await chooseSprint(page, "Capacity B");
    await expect(row).toContainText("80h");
    expect(
      (
        await request.patch(
          `/api/team-member-capacities/${fixture.capacities[0].id}`,
          { headers: fixture.headers, data: { capacity: 70 } },
        )
      ).ok(),
    ).toBe(true);
    await expect(row).toContainText("80h");
    await chooseSprint(page, "Capacity A");
    await expect(row).toContainText("70h");
    await page.reload();
    await expect(row).toContainText("70h");
  } finally {
    await fixture.dispose();
  }
});

test("a late capacity response preserves the next sprint's draft", async ({
  page,
  request,
}) => {
  const fixture = await teamFixture(request);
  let release!: () => void;
  const delay = new Promise<void>((resolve) => {
    release = resolve;
  });
  let reached!: () => void;
  const received = new Promise<void>((resolve) => {
    reached = resolve;
  });
  try {
    await enterDemo(page);
    await page.getByText(fixture.project.title, { exact: true }).click();
    await navigateSection(page, "Taskboard");
    await navigateSection(page, "Capacity");
    await chooseSprint(page, "Capacity A");
    await page
      .getByRole("button", { name: "Edit capacity", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("Capacity (hours)", { exact: true }).fill("60");
    await page.route(
      `**/api/team-member-capacities/${fixture.capacities[0].id}`,
      async (route) => {
        const response = await route.fetch();
        reached();
        await delay;
        await route.fulfill({ response });
      },
    );
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await received;
    await page.goBack();
    await navigateSection(page, "Taskboard");
    await navigateSection(page, "Capacity");
    await chooseSprint(page, "Capacity B");
    await page
      .getByRole("button", { name: "Edit capacity", exact: true })
      .click();
    await dialog.getByLabel("Capacity (hours)", { exact: true }).fill("90");
    release();
    await page.unrouteAll({ behavior: "wait" });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByLabel("Capacity (hours)", { exact: true }),
    ).toHaveValue("90");
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await discardUnsavedChanges(page);
    await expect(
      page.getByRole("row").filter({ hasText: fixture.demo.email }),
    ).toContainText("80h");
  } finally {
    release();
    await page.unrouteAll({ behavior: "wait" });
    await fixture.dispose();
  }
});

for (const width of [390, 1280]) {
  test(`team and capacity controls remain reachable at ${width}px`, async ({
    page,
    request,
  }, info) => {
    const fixture = await teamFixture(request);
    try {
      expect(
        (
          await request.delete(
            `/api/team-member-capacities/${fixture.capacities[0].id}`,
            { headers: fixture.headers },
          )
        ).ok(),
      ).toBe(true);
      await page.setViewportSize({ width, height: 900 });
      await enterDemo(page);
      await page.getByText(fixture.project.title, { exact: true }).click();
      await navigateSection(page, "Team");
      const add = page.getByRole("button", { name: "Add Member", exact: true });
      const teamBounds = await add.boundingBox();
      expect(teamBounds!.x + teamBounds!.width).toBeLessThanOrEqual(width);
      await add.focus();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("dialog")).toContainText("Add Team Member");
      await page.getByRole("button", { name: "Cancel", exact: true }).click();
      await discardUnsavedChanges(page);
      await navigateSection(page, "Taskboard");
      await navigateSection(page, "Capacity");
      await chooseSprint(page, "Capacity A");
      const create = page.getByRole("button", {
        name: "Add capacity",
        exact: true,
      });
      const capacityBounds = await create.boundingBox();
      expect(capacityBounds!.x + capacityBounds!.width).toBeLessThanOrEqual(
        width,
      );
      await expect(create).toBeEnabled();
      await create.focus();
      await page.keyboard.press("Enter");
      const dialog = page.getByRole("dialog");
      await expect(
        dialog.getByRole("combobox", { name: /^User/ }),
      ).toBeVisible();
      await page.screenshot({
        path: info.outputPath(`capacity-form-${width}.png`),
        animations: "disabled",
      });
      await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
      await discardUnsavedChanges(page);
    } finally {
      await fixture.dispose();
    }
  });
}

test("capacity create, edit and failed deletion recover from an empty sprint", async ({
  page,
  request,
}) => {
  const fixture = await teamFixture(request);
  try {
    expect(
      (
        await request.delete(
          `/api/team-member-capacities/${fixture.capacities[0].id}`,
          { headers: fixture.headers },
        )
      ).ok(),
    ).toBe(true);
    expect(
      (
        await request.post(
          `/api/projects/${fixture.project.id}/users/${fixture.outsider.id}`,
          { headers: fixture.headers },
        )
      ).ok(),
    ).toBe(true);
    await enterDemo(page);
    await page.goto(`/projects/${fixture.project.id}/board?tab=capacity`);
    await chooseSprint(page, "Capacity A");
    await expect(
      page.getByRole("heading", {
        name: "No capacity planned yet",
        exact: true,
      }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Add capacity", exact: true })
      .first()
      .click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("combobox", { name: /^User/ }).click();
    await page
      .getByRole("option")
      .filter({ hasText: fixture.outsider.email })
      .click();
    await dialog.getByLabel("Capacity (hours)", { exact: true }).fill("40");
    await dialog
      .getByLabel("Remaining Work (hours)", { exact: true })
      .fill("10");
    await page.route("**/api/team-member-capacities", (route) =>
      route.request().method() === "POST"
        ? route.fulfill({ status: 503, body: "unavailable" })
        : route.continue(),
    );
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText(
      "Could not save capacity",
    );
    await expect(
      dialog.getByLabel("Capacity (hours)", { exact: true }),
    ).toHaveValue("40");
    await page.unroute("**/api/team-member-capacities");
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    const row = page
      .getByRole("row")
      .filter({ hasText: fixture.outsider.email });
    await expect(row).toContainText("40h");
    await expect(row.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "75",
    );
    await expect(
      page.getByRole("columnheader", { name: "Completed work", exact: true }),
    ).toBeVisible();
    await expect(row).toContainText("30.0h");
    await row
      .getByRole("button", { name: "Edit capacity", exact: true })
      .click();
    await dialog.getByLabel("Capacity (hours)", { exact: true }).fill("80");
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(row).toContainText("80h");
    await page.reload();
    await expect(row).toContainText("80h");
    const records: { id: string; userId: string; capacity: number }[] = await (
      await request.get(
        `/api/team-member-capacities?sprintId=${fixture.sprints[0].id}`,
        { headers: fixture.headers },
      )
    ).json();
    const record = records.find((item) => item.userId === fixture.outsider.id)!;
    expect(record.capacity).toBe(80);
    await row
      .getByRole("button", { name: "Delete capacity", exact: true })
      .click();
    const path = `**/api/team-member-capacities/${record.id}`;
    await page.route(path, (route) =>
      route.fulfill({ status: 503, body: "unavailable" }),
    );
    await dialog.getByRole("button", { name: "Proceed", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText("Could not delete");
    const retained = await request.get(
      `/api/team-member-capacities/${record.id}`,
      { headers: fixture.headers },
    );
    expect(retained.ok()).toBe(true);
    expect((await retained.json()).capacity).toBe(80);
    await page.unroute(path);
    await dialog.getByRole("button", { name: "Proceed", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(
      page.getByRole("heading", {
        name: "No capacity planned yet",
        exact: true,
      }),
    ).toBeVisible();
  } finally {
    await fixture.dispose();
  }
});

test("pending membership saves keep the selected user and block duplicate actions", async ({
  page,
  request,
}) => {
  const fixture = await teamFixture(request);
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
    await page.getByText(fixture.project.title, { exact: true }).click();
    await navigateSection(page, "Team");
    await page.getByRole("button", { name: "Add Member", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByRole("combobox", { name: "Select User", exact: true })
      .fill(fixture.outsider.name);
    await page
      .getByRole("option")
      .filter({ hasText: fixture.outsider.email })
      .click();
    await page.route(
      `**/api/projects/${fixture.project.id}/users/${fixture.outsider.id}`,
      async (route) => {
        submissions++;
        reached();
        await delay;
        await route.fulfill({ status: 503, body: "unavailable" });
      },
    );
    await dialog
      .getByRole("button", { name: "Add Member", exact: true })
      .click();
    await received;
    await expect(
      dialog.getByRole("button", { name: "Add Member", exact: true }),
    ).toBeDisabled();
    await expect(
      dialog.getByRole("button", { name: "Cancel", exact: true }),
    ).toBeDisabled();
    await expect(dialog.getByRole("combobox")).toHaveValue(
      `${fixture.outsider.email} (${fixture.outsider.name})`,
    );
    expect(submissions).toBe(1);
    release();
    await expect(dialog.getByRole("alert")).toContainText("Could not change");
    await expect(
      dialog.getByRole("button", { name: "Add Member", exact: true }),
    ).toBeEnabled();
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await discardUnsavedChanges(page);
  } finally {
    release();
    await page.unrouteAll({ behavior: "wait" });
    await fixture.dispose();
  }
});
