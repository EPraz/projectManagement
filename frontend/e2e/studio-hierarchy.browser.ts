import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";
import { enterDemo, navigateSection, setAppearance } from "./support/demo";
test.use({ actionTimeout: 5000 });
async function hierarchyFixture(page: Page, request: APIRequestContext) {
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
  await navigateSection(page, "Epics & Features");
  return { project, headers };
}
test("project-wide hierarchy opens a ticket outside the selected sprint and returns to hierarchy context", async ({
  page,
  request,
}) => {
  const { project } = await hierarchyFixture(page, request);
  const selected = project.sprints.find(
    (s: { name: string }) => s.name === "Sprint 2 — Delivery",
  );
  const ticket = project.tickets.find(
    (t: { featureId: string; sprintId: string }) =>
      t.featureId && t.sprintId !== selected.id,
  );
  const epic = project.epics.find((e: { features: { id: string }[] }) =>
    e.features.some((f) => f.id === ticket.featureId),
  );
  await page
    .getByRole("button", { name: `Expand ${epic.title}`, exact: true })
    .click();
  await page.getByRole("button", { name: ticket.title, exact: true }).click();
  const editor = page.getByRole("dialog", {
    name: "Ticket Details",
    exact: true,
  });
  await expect(editor.getByPlaceholder("Ticket title")).toHaveValue(
    ticket.title,
  );
  expect(new URL(page.url()).pathname).toBe(`/projects/${project.id}/epics`);
  await editor
    .getByRole("button", { name: "Close ticket editor", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: ticket.title, exact: true }),
  ).toBeVisible();
  await navigateSection(page, "Backlog");
  await expect(
    page.getByRole("button", { name: ticket.title, exact: true }),
  ).toHaveCount(0);
});

test("hierarchy editor keeps dirty fields and can save from its exit warning", async ({
  page,
  request,
}) => {
  const { project, headers } = await hierarchyFixture(page, request);
  const epic = project.epics[0];
  const draft = `Retained epic notes ${Date.now()}`;
  try {
    await page
      .getByRole("button", { name: `Edit ${epic.title}`, exact: true })
      .click();
    const editor = page.getByRole("dialog", { name: "Edit Epic", exact: true });
    await editor.getByLabel("Description", { exact: true }).fill(draft);
    await editor
      .getByRole("button", { name: "Close hierarchy editor", exact: true })
      .click();
    const warning = page.getByRole("alertdialog", {
      name: "Unsaved changes",
      exact: true,
    });
    await warning
      .getByRole("button", { name: "Keep editing", exact: true })
      .click();
    await expect(editor.getByLabel("Description", { exact: true })).toHaveValue(
      draft,
    );
    await page.route(`**/api/epics/${epic.id}`, (route) =>
      route.request().method() === "PATCH"
        ? route.fulfill({ status: 503, body: "unavailable" })
        : route.continue(),
    );
    await editor.getByRole("button", { name: "Cancel", exact: true }).click();
    await warning
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    await expect(warning.getByRole("alert")).toContainText("Could not save");
    await page.unroute(`**/api/epics/${epic.id}`);
    await warning
      .getByRole("button", { name: "Save changes", exact: true })
      .click();
    await expect(warning).toHaveCount(0);
    await expect(editor).toHaveCount(0);
    const saved = await (
      await request.get(`/api/projects/${project.id}`, { headers })
    ).json();
    expect(
      saved.epics.find((item: { id: string }) => item.id === epic.id)
        .description,
    ).toBe(draft);
  } finally {
    await page.unroute(`**/api/epics/${epic.id}`);
    await request.patch(`/api/epics/${epic.id}`, {
      headers,
      data: {
        title: epic.title,
        description: epic.description,
        projectId: project.id,
        updatedBy: "visitor@demo.example",
      },
    });
  }
});
for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 390, 768, 1024, 1440]) {
    test(`C hierarchy retains level context at ${width}px in ${theme}`, async ({
      page,
      request,
    }, info) => {
      await page.setViewportSize({ width, height: 900 });
      await setAppearance(page, theme);
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      const { project } = await hierarchyFixture(page, request);
      const epic = project.epics.find(
        (e: { features: unknown[] }) => e.features.length,
      );
      const feature = epic.features[0];
      const expand = page.getByRole("button", {
        name: `Expand ${epic.title}`,
        exact: true,
      });
      await expand.focus();
      await page.keyboard.press("Enter");
      if (width < 900) {
        const levels = page.getByRole("region", {
          name: "Hierarchy levels",
          exact: true,
        });
        await expect(
          levels.getByRole("button", { name: "All epics", exact: true }),
        ).toBeVisible();
        await levels
          .getByRole("button", { name: `Expand ${feature.title}`, exact: true })
          .click();
        await expect(levels).toBeFocused();
        await expect(
          levels.getByRole("button", { name: "Back to features", exact: true }),
        ).toBeVisible();
        await page.reload();
        await expect(
          page
            .getByRole("region", { name: "Hierarchy levels", exact: true })
            .getByRole("button", { name: "Back to features", exact: true }),
        ).toBeVisible();
      }
      const ticket = project.tickets.find(
        (t: { featureId: string }) => t.featureId === feature.id,
      );
      await page
        .getByRole("button", { name: ticket.title, exact: true })
        .click();
      await expect(
        page.getByRole("dialog", { name: "Ticket Details", exact: true }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Close ticket editor", exact: true })
        .click();
      if (width < 900) {
        await expect(
          page.getByRole("button", { name: "Back to features", exact: true }),
        ).toBeVisible();
        await page
          .getByRole("button", { name: "Back to features", exact: true })
          .click();
        await expect(
          page.getByRole("button", { name: "All epics", exact: true }),
        ).toBeVisible();
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: info.outputPath(`hierarchy-${theme}-${width}.png`),
        fullPage: true,
      });
    });
  }
}

test("feature parent changes persist and move the feature to its confirmed epic", async ({
  page,
  request,
}) => {
  const { project, headers } = await hierarchyFixture(page, request);
  const prefix = `Parent move ${Date.now()}`;
  const owned: string[] = [];
  try {
    for (const suffix of ["source", "target"]) {
      const response = await request.post("/api/epics", {
        headers,
        data: {
          title: `${prefix} ${suffix}`,
          projectId: project.id,
          createdBy: "visitor@demo.example",
        },
      });
      expect(response.status()).toBe(201);
      owned.push((await response.json()).id);
    }
    const response = await request.post("/api/features", {
      headers,
      data: {
        title: `${prefix} feature`,
        epicId: owned[0],
        createdBy: "visitor@demo.example",
      },
    });
    expect(response.status()).toBe(201);
    const feature = await response.json();
    await page.reload();
    await page
      .getByRole("button", { name: `Expand ${prefix} source`, exact: true })
      .click();
    await page
      .getByRole("button", { name: `Edit ${prefix} feature`, exact: true })
      .click();
    const editor = page.getByRole("dialog", {
      name: "Edit Feature",
      exact: true,
    });
    await editor.getByRole("combobox", { name: "Epic", exact: true }).click();
    await page
      .getByRole("option", { name: `${prefix} target`, exact: true })
      .click();
    await editor.getByRole("button", { name: "Save", exact: true }).click();
    await expect(editor).toHaveCount(0);
    const snapshot = await (
      await request.get(`/api/projects/${project.id}`, { headers })
    ).json();
    expect(
      snapshot.epics
        .find((epic: { id: string }) => epic.id === owned[1])
        .features.some((item: { id: string }) => item.id === feature.id),
    ).toBe(true);
    expect(
      snapshot.epics.find((epic: { id: string }) => epic.id === owned[0])
        .features,
    ).toHaveLength(0);
    await page
      .getByRole("button", { name: `Expand ${prefix} target`, exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: `${prefix} feature`, exact: true }),
    ).toBeVisible();
  } finally {
    for (const id of owned)
      await request.delete(`/api/epics/${id}`, { headers });
  }
});
test("an unplanned ticket remains reachable from project hierarchy without entering Backlog", async ({
  page,
  request,
}) => {
  const { project, headers } = await hierarchyFixture(page, request);
  const ticket = project.tickets.find(
    (t: { featureId: string }) => t.featureId,
  );
  const epic = project.epics.find((e: { features: { id: string }[] }) =>
    e.features.some((f) => f.id === ticket.featureId),
  );
  try {
    expect(
      (
        await request.patch(`/api/tickets/${ticket.id}`, {
          headers,
          data: { id: ticket.id, sprintId: null, updatedBy: ticket.createdBy },
        })
      ).ok(),
    ).toBe(true);
    await page.reload();
    await page
      .getByRole("button", { name: `Expand ${epic.title}`, exact: true })
      .click();
    await page.getByRole("button", { name: ticket.title, exact: true }).click();
    const editor = page.getByRole("dialog", {
      name: "Ticket Details",
      exact: true,
    });
    await editor.getByRole("tab", { name: "Planning", exact: true }).click();
    await expect(
      editor.getByRole("combobox", { name: "Sprint", exact: true }),
    ).toHaveText("Unplanned");
    expect(new URL(page.url()).pathname).toBe(`/projects/${project.id}/epics`);
  } finally {
    await request.patch(`/api/tickets/${ticket.id}`, {
      headers,
      data: {
        id: ticket.id,
        sprintId: ticket.sprintId,
        updatedBy: ticket.createdBy,
      },
    });
  }
});
