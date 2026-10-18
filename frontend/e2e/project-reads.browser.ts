import { expect, test } from "@playwright/test";
import { enterDemo, navigateSection } from "./support/demo";

test("compact project reads preserve progress in grid, list and the selected workspace", async ({
  page,
}) => {
  const list = page.waitForResponse("**/api/projects/?view=summary");
  await enterDemo(page);
  const summaries: {
    id: string;
    tickets: { statusId: string | null }[];
    ticketStatuses: { id: string; name: string }[];
  }[] = await (await list).json();
  for (const summary of summaries) {
    expect(summary).not.toHaveProperty("epics");
    for (const ticket of summary.tickets)
      expect(ticket).not.toHaveProperty("tasks");
  }
  const expected = summaries
    .map((project) =>
      project.tickets.length
        ? Math.round(
            (100 *
              project.tickets.filter(
                (ticket) =>
                  project.ticketStatuses.find(
                    (status) => status.id === ticket.statusId,
                  )?.name === "COMPLETED",
              ).length) /
              project.tickets.length,
          )
        : 0,
    )
    .sort((a, b) => a - b);
  const shownProgress = () =>
    page
      .getByRole("progressbar")
      .evaluateAll((nodes) =>
        nodes
          .map((node) => Number(node.getAttribute("aria-valuenow")))
          .sort((a, b) => a - b),
      );
  expect(await shownProgress()).toEqual(expected);
  await page
    .getByRole("button", { name: "Switch to list view", exact: true })
    .click();
  expect(await shownProgress()).toEqual(expected);
  await page
    .getByRole("button", { name: "Switch to grid view", exact: true })
    .click();
  expect(await shownProgress()).toEqual(expected);
  const detail = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname.startsWith("/api/projects/") &&
      new URL(response.url()).searchParams.get("view") === "workspace",
  );
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  const workspace: { sprints: { id: string }[]; tickets: { id: number }[] } =
    await (await detail).json();
  for (const sprint of workspace.sprints)
    expect(sprint).not.toHaveProperty("tickets");
  expect(workspace.tickets.length).toBeGreaterThan(0);
  await expect(
    page.getByText("Overall Progress", { exact: true }),
  ).toBeVisible();
  await navigateSection(page, "Taskboard");
  await expect(
    page.getByRole("button", { name: "Add New Item", exact: true }),
  ).toBeVisible();
});

test("malformed compact summary data stays distinct from an empty list and can retry", async ({
  page,
}) => {
  const pattern = "**/api/projects/?view=summary";
  await page.route(pattern, async (route) => {
    const response = await route.fetch();
    const data = await response.json();
    data[0].tickets = [{}];
    await route.fulfill({ response, json: data });
  });
  await page.goto("/auth/instantLogin");
  await page.getByRole("button", { name: /explore demo/i }).click();
  await expect(page.getByRole("alert")).toContainText(
    "unexpected project list",
  );
  await expect(page.getByText("No projects yet", { exact: true })).toHaveCount(
    0,
  );
  await page.unroute(pattern);
  await page
    .getByRole("button", { name: "Retry projects", exact: true })
    .click();
  await expect(
    page.getByText("Orbit — Product Delivery", { exact: true }),
  ).toBeVisible();
});

test("a valid null-status ticket remains incomplete in populated grid and list progress", async ({
  page,
}) => {
  await page.route("**/api/projects/?view=summary", async (route) => {
    const response = await route.fetch();
    const data = await response.json();
    const completed = data[0].ticketStatuses.find(
      (status: { name: string }) => status.name === "COMPLETED",
    );
    data[0].tickets = [{ statusId: completed.id }, { statusId: null }];
    await route.fulfill({ response, json: data });
  });
  await page.goto("/auth/instantLogin");
  await page.getByRole("button", { name: /explore demo/i }).click();
  await expect(page.getByText("50%", { exact: true })).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Switch to list view", exact: true })
    .click();
  await expect(page.getByText("50%", { exact: true })).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});
