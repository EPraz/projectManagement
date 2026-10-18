import { expect, test, type APIRequestContext } from "@playwright/test";
import { enterDemo, navigateSection, setAppearance } from "./support/demo";
test.use({ actionTimeout: 5000 });
async function memberFixture(request: APIRequestContext) {
  const { accessToken } = await (
    await request.post("/api/auth/instant-login", { data: {} })
  ).json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const users = await (await request.get("/api/users", { headers })).json();
  const member = users.find(
    (u: { email: string }) => u.email !== "visitor@demo.example",
  );
  const response = await request.post("/api/projects", {
    headers,
    data: {
      title: `Studio team ${Date.now()}`,
      createdBy: "visitor@demo.example",
    },
  });
  expect(response.status()).toBe(201);
  const project = await response.json();
  expect(
    (
      await request.post(`/api/projects/${project.id}/users/${member.id}`, {
        headers,
      })
    ).ok(),
  ).toBe(true);
  return { headers, project, member };
}
test("removing project membership requires confirmation and keeps the person in the user catalog", async ({
  page,
  request,
}) => {
  const { headers, project, member } = await memberFixture(request);
  try {
    const sprintResponse = await request.post("/api/sprints", {
      headers,
      data: {
        name: "Membership capacity",
        projectId: project.id,
        startDate: "2026-10-01T00:00:00Z",
        endDate: "2026-10-31T00:00:00Z",
        createdBy: "visitor@demo.example",
      },
    });
    expect(sprintResponse.status()).toBe(201);
    const sprint = await sprintResponse.json();
    const capacityResponse = await request.post("/api/team-member-capacities", {
      headers,
      data: {
        sprintId: sprint.id,
        userId: member.id,
        capacity: 40,
        daysOff: 0,
        remainingWork: 20,
      },
    });
    expect(capacityResponse.status()).toBe(201);
    const capacity = await capacityResponse.json();
    await enterDemo(page);
    await page.getByText(project.title, { exact: true }).click();
    await navigateSection(page, "Team");
    await page
      .getByRole("button", { name: `Actions for ${member.name}`, exact: true })
      .click();
    await page
      .getByRole("menuitem", { name: "Remove From Project", exact: true })
      .click();
    const confirmation = page.getByRole("dialog", {
      name: "Remove project member",
      exact: true,
    });
    await expect(confirmation).toBeVisible();
    await confirmation
      .getByRole("button", { name: "Cancel", exact: true })
      .click();
    const before = await (
      await request.get(`/api/projects/${project.id}`, { headers })
    ).json();
    expect(before.users.some((u: { id: string }) => u.id === member.id)).toBe(
      true,
    );
    await page
      .getByRole("button", { name: `Actions for ${member.name}`, exact: true })
      .click();
    await page
      .getByRole("menuitem", { name: "Remove From Project", exact: true })
      .click();
    await confirmation
      .getByRole("button", { name: "Remove member", exact: true })
      .click();
    await expect(confirmation).toHaveCount(0);
    await expect(
      page.getByRole("button", {
        name: `Actions for ${member.name}`,
        exact: true,
      }),
    ).toHaveCount(0);
    const after = await (
      await request.get(`/api/projects/${project.id}`, { headers })
    ).json();
    expect(after.users.some((u: { id: string }) => u.id === member.id)).toBe(
      false,
    );
    const catalog = await (await request.get("/api/users", { headers })).json();
    expect(catalog.some((u: { id: string }) => u.id === member.id)).toBe(true);
    await navigateSection(page, "Capacity");
    await expect(
      page.getByRole("heading", {
        name: "No capacity planned yet",
        exact: true,
      }),
    ).toBeVisible();
    expect(
      (
        await request.get(`/api/team-member-capacities/${capacity.id}`, {
          headers,
        })
      ).status(),
    ).toBe(200);
    expect(
      (
        await request.post(`/api/projects/${project.id}/users/${member.id}`, {
          headers,
        })
      ).ok(),
    ).toBe(true);
    await expect(
      page.getByRole("row").filter({ hasText: member.email }),
    ).toBeVisible();
  } finally {
    await request.delete(`/api/projects/${project.id}`, { headers });
  }
});

test("team search and existing name/email filters recover without losing project scope", async ({
  page,
}) => {
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await navigateSection(page, "Team");
  await page
    .getByRole("textbox", { name: "Search members", exact: true })
    .fill("No matching member here");
  await expect(
    page.getByText("No team members found", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Clear member search", exact: true })
    .click();
  await expect(
    page.getByRole("table", { name: "Project members", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: /^Filters/ }).click();
  await page
    .getByRole("textbox", { name: "Member name", exact: true })
    .fill("Alex");
  await page
    .getByRole("textbox", { name: "Member email", exact: true })
    .fill("alex@demo.example");
  await page
    .getByRole("button", { name: "Apply Filters", exact: true })
    .click();
  const table = page.getByRole("table", {
    name: "Project members",
    exact: true,
  });
  await expect(table.getByRole("row")).toHaveCount(2);
  await expect(table.getByText("Alex Morgan", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Clear Filters", exact: true })
    .click();
  await expect(table.getByRole("row")).toHaveCount(7);
  await page.getByRole("button", { name: /^Filters/ }).click();
  await page.getByRole("checkbox", { name: "Developer", exact: true }).check();
  await page
    .getByRole("button", { name: "Apply Filters", exact: true })
    .click();
  await expect(table.getByRole("row")).toHaveCount(3);
  await expect(table.getByText("Jordan Lee", { exact: true })).toBeVisible();
  await expect(table.getByText("Taylor Chen", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Clear Filters", exact: true })
    .click();
  await expect(table.getByRole("row")).toHaveCount(7);
});
for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`C project team and member selector fit ${width}px in ${theme}`, async ({
      page,
    }, info) => {
      await page.setViewportSize({ width, height: 900 });
      await setAppearance(page, theme);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await enterDemo(page);
      await page.getByText("Orbit — Product Delivery", { exact: true }).click();
      await navigateSection(page, "Team");
      if (width < 900)
        await expect(
          page.getByRole("region", {
            name: "Project member cards",
            exact: true,
          }),
        ).toBeVisible();
      else
        await expect(
          page.getByRole("table", { name: "Project members", exact: true }),
        ).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: info.outputPath(`team-${theme}-${width}.png`),
        fullPage: true,
      });
      await page
        .getByRole("button", { name: "Add Member", exact: true })
        .click();
      const editor = page.getByRole("dialog", {
        name: "Add Team Member",
        exact: true,
      });
      await expect(editor).toBeVisible();
      const bounds = await editor
        .getByRole("button", { name: "Add Member", exact: true })
        .boundingBox();
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(900);
      await editor.getByRole("button", { name: "Cancel", exact: true }).click();
      await expect(editor).toHaveCount(0);
    });
  }
}

test("confirmed membership while HTTP is pending keeps the selected person and cannot close a later project draft", async ({
  page,
  request,
}) => {
  const first = await memberFixture(request);
  const second = await memberFixture(request);
  const users = await (
    await request.get("/api/users", { headers: first.headers })
  ).json();
  const candidate = users.find(
    (u: { id: string; email: string }) =>
      u.id !== first.member.id && u.email !== "visitor@demo.example",
  );
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  let reached!: () => void;
  const responseReady = new Promise<void>((resolve) => {
    reached = resolve;
  });
  let live = false;
  const endpoint = `**/api/projects/${first.project.id}/users/${candidate.id}`;
  page.on("websocket", (socket) =>
    socket.on("framereceived", (frame) => {
      if (
        typeof frame.payload === "string" &&
        frame.payload.includes("projectUpdated") &&
        frame.payload.includes(first.project.id) &&
        frame.payload.includes(candidate.email)
      )
        live = true;
    }),
  );
  try {
    await enterDemo(page);
    await page.getByText(first.project.title, { exact: true }).click();
    await navigateSection(page, "Team");
    await page.getByRole("button", { name: "Add Member", exact: true }).click();
    const editor = page.getByRole("dialog", {
      name: "Add Team Member",
      exact: true,
    });
    await editor
      .getByRole("combobox", { name: "Select User", exact: true })
      .fill(candidate.name);
    await page.getByRole("option").filter({ hasText: candidate.email }).click();
    await page.route(endpoint, async (route) => {
      const response = await route.fetch();
      reached();
      await held;
      await route.fulfill({ response });
    });
    await editor
      .getByRole("button", { name: "Add Member", exact: true })
      .click();
    await responseReady;
    await expect.poll(() => live).toBe(true);
    await expect(editor.getByRole("combobox")).toHaveValue(
      `${candidate.email} (${candidate.name})`,
    );
    await page.goBack();
    await navigateSection(page, "All projects");
    await page.getByText(second.project.title, { exact: true }).click();
    await navigateSection(page, "Team");
    await page.getByRole("button", { name: "Add Member", exact: true }).click();
    await editor
      .getByRole("combobox", { name: "Select User", exact: true })
      .fill(candidate.name);
    await page.getByRole("option").filter({ hasText: candidate.email }).click();
    const completed = page.waitForResponse(
      (response) =>
        response
          .url()
          .endsWith(
            `/api/projects/${first.project.id}/users/${candidate.id}`,
          ) && response.request().method() === "POST",
    );
    release();
    await completed;
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    await expect(editor.getByRole("combobox")).toHaveValue(
      `${candidate.email} (${candidate.name})`,
    );
    expect(new URL(page.url()).pathname).toBe(
      `/projects/${second.project.id}/teammembers`,
    );
    const canonical = await (
      await request.get(`/api/projects/${second.project.id}`, {
        headers: second.headers,
      })
    ).json();
    expect(
      canonical.users.some((u: { id: string }) => u.id === candidate.id),
    ).toBe(false);
  } finally {
    release();
    await page.unrouteAll({ behavior: "wait" });
    for (const fixture of [first, second])
      await request.delete(`/api/projects/${fixture.project.id}`, {
        headers: fixture.headers,
      });
  }
});

test("a removed member's capacity draft is retained but cannot write outside the current roster", async ({
  page,
  request,
}) => {
  const { headers, project, member } = await memberFixture(request);
  let writes = 0;
  try {
    const sprint = await (
      await request.post("/api/sprints", {
        headers,
        data: {
          name: "Roster draft",
          projectId: project.id,
          startDate: "2026-10-01T00:00:00Z",
          endDate: "2026-10-31T00:00:00Z",
          createdBy: "visitor@demo.example",
        },
      })
    ).json();
    const capacity = await (
      await request.post("/api/team-member-capacities", {
        headers,
        data: {
          sprintId: sprint.id,
          userId: member.id,
          capacity: 40,
          daysOff: 0,
          remainingWork: 20,
        },
      })
    ).json();
    await enterDemo(page);
    await page.getByText(project.title, { exact: true }).click();
    await navigateSection(page, "Capacity");
    await page
      .getByRole("button", { name: "Edit capacity", exact: true })
      .click();
    const editor = page.getByRole("dialog", {
      name: "Edit Team Member Capacity",
      exact: true,
    });
    await editor.getByLabel("Capacity (hours)", { exact: true }).fill("80");
    expect(
      (
        await request.delete(`/api/projects/${project.id}/users/${member.id}`, {
          headers,
        })
      ).ok(),
    ).toBe(true);
    await expect(editor.getByRole("combobox", { name: /^User/ })).toContainText(
      "Unknown",
    );
    page.on("request", (r) => {
      if (
        r.method() === "PATCH" &&
        r.url().endsWith(`/api/team-member-capacities/${capacity.id}`)
      )
        writes++;
    });
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(editor.getByRole("alert")).toContainText(
      "no longer a member of this project",
    );
    await expect(
      editor.getByLabel("Capacity (hours)", { exact: true }),
    ).toHaveValue("80");
    expect(writes).toBe(0);
    await editor.getByRole("button", { name: "Cancel", exact: true }).click();
    await page
      .getByRole("alertdialog", { name: "Unsaved changes", exact: true })
      .getByRole("button", { name: "Discard changes", exact: true })
      .click();
    await expect(
      page.getByRole("heading", {
        name: "No capacity planned yet",
        exact: true,
      }),
    ).toBeVisible();
    expect(
      (
        await (
          await request.get(`/api/team-member-capacities/${capacity.id}`, {
            headers,
          })
        ).json()
      ).capacity,
    ).toBe(40);
  } finally {
    await request.delete(`/api/projects/${project.id}`, { headers });
  }
});
