import { expect, test } from "@playwright/test";
import {
  discardUnsavedChanges,
  enterDemo,
  navigateSection,
} from "./support/demo";
test.use({ actionTimeout: 5000 });
test("failed retrospective creation retains feedback and offers retry", async ({
  page,
}) => {
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await navigateSection(page, "Retrospective");
  await page.getByRole("button", { name: "Add new card", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog
    .getByLabel("Content", { exact: true })
    .fill("Keep this retrospective feedback draft");
  await page.route("**/api/retrospectives", (route) =>
    route.fulfill({ status: 503, body: "unavailable" }),
  );
  await dialog.getByRole("button", { name: "Save", exact: true }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("alert")).toContainText("Could not save");
  await expect(dialog.getByLabel("Content", { exact: true })).toHaveValue(
    "Keep this retrospective feedback draft",
  );
  await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
  await discardUnsavedChanges(page);
});
import type { APIRequestContext, Page } from "@playwright/test";

test.use({ actionTimeout: 5000 });

async function retroFixture(request: APIRequestContext) {
  const { accessToken } = await (
    await request.post("/api/auth/instant-login", { data: {} })
  ).json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const response = await request.post("/api/projects", {
    headers,
    data: {
      title: `Isolated retrospective ${Date.now()}`,
      description: "Temporary browser fixture",
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
    const cards: { id: string; content: string }[] = [];
    for (const name of ["Retro A", "Retro B"]) {
      const sprintResponse = await request.post("/api/sprints", {
        headers,
        data: {
          projectId: project.id,
          name,
          startDate: "2026-10-17T00:00:00Z",
          endDate: "2026-10-31T00:00:00Z",
          createdBy: "visitor@demo.example",
        },
      });
      expect(sprintResponse.status()).toBe(201);
      const sprint = await sprintResponse.json();
      sprints.push(sprint);
      const cardResponse = await request.post("/api/retrospectives", {
        headers,
        data: {
          sprintId: sprint.id,
          content: `${name} feedback`,
          type: "POSITIVE",
        },
      });
      expect(cardResponse.status()).toBe(201);
      cards.push(await cardResponse.json());
    }
    return { project, headers, sprints, cards, dispose };
  } catch (error) {
    await dispose();
    throw error;
  }
}
async function chooseSprint(page: Page, name: string) {
  const selector = page.getByRole("combobox", {
    name: "Selected sprint",
    exact: true,
  });
  if ((await selector.inputValue()) === name) return;
  await selector.click();
  await selector.fill(name);
  await page.getByRole("option", { name, exact: true }).click();
}
async function openRetro(page: Page, title: string) {
  await enterDemo(page);
  await page.getByText(title, { exact: true }).click();
  await navigateSection(page, "Retrospective");
}
const cardWith = (page: Page, content: string) =>
  page
    .getByRole("article", { name: "Retrospective card", exact: true })
    .filter({ hasText: content });

test("retrospective create, edit and delete retain failed drafts and persist retries", async ({
  page,
  request,
}) => {
  const fixture = await retroFixture(request);
  try {
    await openRetro(page, fixture.project.title);
    await chooseSprint(page, "Retro A");
    await page
      .getByRole("button", { name: "Add new card", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByLabel("Content", { exact: true })
      .fill("Browser retrospective draft");
    await page.route("**/api/retrospectives", (route) =>
      route.fulfill({ status: 503, body: "unavailable" }),
    );
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText("Could not save");
    await expect(dialog.getByLabel("Content", { exact: true })).toHaveValue(
      "Browser retrospective draft",
    );
    await page.unroute("**/api/retrospectives");
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    let card = cardWith(page, "Browser retrospective draft");
    await expect(card).toBeVisible();
    await card
      .getByRole("button", { name: "Card actions", exact: true })
      .click();
    await page.getByRole("menuitem", { name: "Edit", exact: true }).click();
    await dialog
      .getByLabel("Content", { exact: true })
      .fill("Edited browser retrospective");
    await page.route("**/api/retrospectives/*", (route) =>
      route.request().method() === "PATCH"
        ? route.fulfill({ status: 503, body: "unavailable" })
        : route.continue(),
    );
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText("Could not save");
    await expect(dialog.getByLabel("Content", { exact: true })).toHaveValue(
      "Edited browser retrospective",
    );
    await page.unroute("**/api/retrospectives/*");
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await page.reload();
    card = cardWith(page, "Edited browser retrospective");
    await expect(card).toBeVisible();
    await card
      .getByRole("button", { name: "Card actions", exact: true })
      .click();
    await page.getByRole("menuitem", { name: "Delete", exact: true }).click();
    await page.route("**/api/retrospectives/*", (route) =>
      route.request().method() === "DELETE"
        ? route.fulfill({ status: 503, body: "unavailable" })
        : route.continue(),
    );
    await dialog.getByRole("button", { name: "Proceed", exact: true }).click();
    await expect(dialog.getByRole("alert")).toContainText("Could not delete");
    await page.unroute("**/api/retrospectives/*");
    await dialog.getByRole("button", { name: "Proceed", exact: true }).click();
    await expect(dialog).toHaveCount(0);
    await expect(card).toHaveCount(0);
    await page.reload();
    await expect(card).toHaveCount(0);
  } finally {
    await fixture.dispose();
  }
});

test("reaction failure retains the saved count and retries without duplicating the shared-demo like", async ({
  page,
  request,
}) => {
  const fixture = await retroFixture(request);
  try {
    await openRetro(page, fixture.project.title);
    await chooseSprint(page, "Retro A");
    const card = cardWith(page, "Retro A feedback");
    const like = card.getByRole("button", {
      name: "Like feedback",
      exact: true,
    });
    await expect(like).toHaveAttribute("aria-pressed", "false");
    await expect(like).toHaveText("0");
    await page.route(`**/api/retrospectives/${fixture.cards[0].id}`, (route) =>
      route.fulfill({ status: 503, body: "unavailable" }),
    );
    await like.click();
    await expect(page.getByRole("alert")).toContainText(
      "Could not update this reaction",
    );
    await expect(like).toHaveText("0");
    await expect(like).toHaveAttribute("aria-pressed", "false");
    await page.unroute(`**/api/retrospectives/${fixture.cards[0].id}`);
    await page
      .getByRole("button", { name: "Retry reaction", exact: true })
      .click();
    await expect(like).toHaveText("1");
    await expect(like).toHaveAttribute("aria-pressed", "true");
    await page.reload();
    await expect(like).toHaveText("1");
    await like.click();
    await expect(like).toHaveText("0");
    await expect(like).toHaveAttribute("aria-pressed", "false");
  } finally {
    await fixture.dispose();
  }
});

test("pending retrospective saves retain input and prevent duplicate submissions", async ({
  page,
}) => {
  let release!: () => void;
  const delay = new Promise<void>((resolve) => {
    release = resolve;
  });
  let reached!: () => void;
  const received = new Promise<void>((resolve) => {
    reached = resolve;
  });
  let submissions = 0;
  try {
    await openRetro(page, "Orbit — Product Delivery");
    await page
      .getByRole("button", { name: "Add new card", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByLabel("Content", { exact: true })
      .fill("Pending retrospective feedback");
    await page.route("**/api/retrospectives", async (route) => {
      submissions++;
      reached();
      await delay;
      await route.fulfill({ status: 503, body: "unavailable" });
    });
    await dialog.getByRole("button", { name: "Save", exact: true }).click();
    await received;
    await expect(
      dialog.getByRole("button", { name: /^Sav(e|ing…)/ }),
    ).toBeDisabled();
    await expect(
      dialog.getByRole("button", { name: "Cancel", exact: true }),
    ).toBeDisabled();
    await expect(dialog.getByLabel("Content", { exact: true })).toHaveValue(
      "Pending retrospective feedback",
    );
    expect(submissions).toBe(1);
    release();
    await expect(dialog.getByRole("alert")).toContainText("Could not save");
  } finally {
    release();
    await page.unrouteAll({ behavior: "wait" });
  }
});

test("retrospective follows the selected sprint and confirmed changes from another session", async ({
  page,
  request,
  browser,
}) => {
  const fixture = await retroFixture(request);
  const otherContext = await browser.newContext();
  const otherPage = await otherContext.newPage();
  try {
    await openRetro(page, fixture.project.title);
    await chooseSprint(page, "Retro A");
    await openRetro(otherPage, fixture.project.title);
    await chooseSprint(otherPage, "Retro A");
    await cardWith(otherPage, "Retro A feedback")
      .getByRole("button", { name: "Like feedback", exact: true })
      .click();
    await expect(
      cardWith(page, "Retro A feedback").getByRole("button", {
        name: "Like feedback",
        exact: true,
      }),
    ).toHaveText("1");
    await chooseSprint(page, "Retro B");
    await expect(cardWith(page, "Retro A feedback")).toHaveCount(0);
    await expect(cardWith(page, "Retro B feedback")).toBeVisible();
    expect(
      (
        await request.patch(`/api/retrospectives/${fixture.cards[0].id}`, {
          headers: fixture.headers,
          data: { content: "Remote revised retro A" },
        })
      ).ok(),
    ).toBe(true);
    await expect(cardWith(page, "Retro B feedback")).toBeVisible();
    await expect(cardWith(page, "Remote revised retro A")).toHaveCount(0);
    await chooseSprint(page, "Retro A");
    await expect(cardWith(page, "Remote revised retro A")).toBeVisible();
    await page.reload();
    await expect(cardWith(page, "Remote revised retro A")).toBeVisible();
  } finally {
    await otherContext.close();
    await fixture.dispose();
  }
});

test("a late retrospective save cannot close the next sprint's draft", async ({
  page,
  request,
}) => {
  const fixture = await retroFixture(request);
  let release!: () => void;
  const delay = new Promise<void>((resolve) => {
    release = resolve;
  });
  let reached!: () => void;
  const received = new Promise<void>((resolve) => {
    reached = resolve;
  });
  try {
    await openRetro(page, fixture.project.title);
    await chooseSprint(page, "Retro A");
    await cardWith(page, "Retro A feedback")
      .getByRole("button", { name: "Card actions", exact: true })
      .click();
    await page.getByRole("menuitem", { name: "Edit", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await dialog
      .getByLabel("Content", { exact: true })
      .fill("Saved in old sprint");
    await page.route(
      `**/api/retrospectives/${fixture.cards[0].id}`,
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
    await navigateSection(page, "Retrospective");
    await chooseSprint(page, "Retro B");
    await page
      .getByRole("button", { name: "Add new card", exact: true })
      .click();
    await dialog
      .getByLabel("Content", { exact: true })
      .fill("Next sprint unsaved draft");
    release();
    await page.unrouteAll({ behavior: "wait" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("Content", { exact: true })).toHaveValue(
      "Next sprint unsaved draft",
    );
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await discardUnsavedChanges(page);
    await expect(cardWith(page, "Retro B feedback")).toBeVisible();
  } finally {
    release();
    await page.unrouteAll({ behavior: "wait" });
    await fixture.dispose();
  }
});

test("hiding names also hides reaction attribution and blurred feedback describes the display truthfully", async ({
  page,
  request,
}) => {
  const fixture = await retroFixture(request);
  try {
    await openRetro(page, fixture.project.title);
    await chooseSprint(page, "Retro A");
    const card = cardWith(page, "Retro A feedback");
    await card
      .getByRole("button", { name: "Like feedback", exact: true })
      .click();
    await expect(
      card.getByRole("button", { name: "Like feedback", exact: true }),
    ).toHaveText("1");
    await expect(card.getByText("Demo Visitor", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Hide Names", exact: true }).click();
    await expect(card.getByText("Demo Visitor", { exact: true })).toHaveCount(
      0,
    );
    await card
      .getByRole("button", { name: "Like feedback", exact: true })
      .hover();
    await expect(page.getByRole("tooltip")).toHaveText("1 reactions");
    await expect(
      page.getByRole("tab", { name: "Anonymous Feedback", exact: true }),
    ).toHaveCount(0);
    await page
      .getByRole("tab", { name: "Blurred feedback", exact: true })
      .click();
    await expect(card.getByText("Retro A feedback", { exact: true })).toHaveCSS(
      "filter",
      "blur(4px)",
    );
    await page
      .getByRole("tab", { name: "Team Discussion", exact: true })
      .click();
    await expect(card.getByText("Retro A feedback", { exact: true })).toHaveCSS(
      "filter",
      "none",
    );
    await page.getByRole("button", { name: "Show Names", exact: true }).click();
    await expect(card.getByText("Demo Visitor", { exact: true })).toBeVisible();
  } finally {
    await fixture.dispose();
  }
});

for (const width of [390, 1280]) {
  test(`retrospective controls and form remain reachable with keyboard at ${width}px`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 900 });
    await openRetro(page, "Orbit — Product Delivery");
    const add = page.getByRole("button", { name: "Add new card", exact: true });
    const bounds = await add.boundingBox();
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    await add.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("dialog");
    const content = dialog.getByLabel("Content", { exact: true });
    await content.focus();
    await page.keyboard.type("Keyboard feedback");
    await expect(content).toBeFocused();
    await content.press("Tab");
    await expect(dialog.getByRole("combobox", { name: /^Type/ })).toBeFocused();
    await page.screenshot({
      path: info.outputPath(`retrospective-form-${width}.png`),
      animations: "disabled",
    });
    await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
    await discardUnsavedChanges(page);
    await expect(add).toBeFocused();
  });
}
