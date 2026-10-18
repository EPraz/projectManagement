import { expect, test } from "@playwright/test";
import { enterDemo } from "./support/demo";

for (const failure of ["unavailable", "malformed", "incomplete"]) {
  test(`project creation retains its draft after a ${failure} response and confirms retry`, async ({
    page,
    request,
  }) => {
    await enterDemo(page);
    const marker = `Finish fixture ${failure} ${Date.now()}`;
    await page
      .getByRole("button", { name: "New Project", exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    await dialog.getByLabel("title", { exact: true }).fill(marker);
    await dialog
      .getByLabel("description", { exact: true })
      .fill("Isolated browser fixture");
    await page.route("**/api/projects", (route) =>
      route.request().method() !== "POST"
        ? route.continue()
        : route.fulfill({
            status: failure === "unavailable" ? 503 : 201,
            contentType: "application/json",
            body:
              failure === "unavailable"
                ? '{"message":"Controlled outage"}'
                : failure === "incomplete"
                  ? JSON.stringify({
                      id: "incomplete",
                      title: marker,
                      tickets: [],
                      sprints: [],
                      users: [],
                      ticketStatuses: [],
                      taskStatuses: [],
                      epics: [],
                      epicStatuses: [],
                      featureStatuses: [],
                    })
                  : "{}",
          }),
    );
    let createdId: string | undefined;
    try {
      await dialog.getByRole("button", { name: "Save", exact: true }).click();
      await expect(dialog.getByRole("alert")).toBeVisible();
      await expect(dialog.getByLabel("title", { exact: true })).toHaveValue(
        marker,
      );
      await page.unroute("**/api/projects");
      const response = page.waitForResponse(
        (item) =>
          new URL(item.url()).pathname === "/api/projects" &&
          item.request().method() === "POST",
      );
      await dialog.getByRole("button", { name: "Save", exact: true }).click();
      const created = await response;
      expect(created.status()).toBe(201);
      createdId = (await created.json()).id;
      await expect(dialog).toHaveCount(0);
      await expect(page.getByText(marker, { exact: true })).toBeVisible();
      await page.reload();
      await expect(page.getByText(marker, { exact: true })).toBeVisible();
    } finally {
      await page.unroute("**/api/projects");
      if (createdId) {
        const { accessToken } = await (
          await request.post("/api/auth/instant-login", { data: {} })
        ).json();
        expect(
          (
            await request.delete(`/api/projects/${createdId}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            })
          ).ok(),
        ).toBe(true);
      }
    }
  });
}

test("project entry works through a keyboard link in grid and list views", async ({
  page,
}) => {
  await enterDemo(page);
  for (const view of ["grid", "list"]) {
    if (view === "list")
      await page
        .getByRole("button", { name: "Switch to list view", exact: true })
        .click();
    const link = page.getByRole("link", {
      name: "Orbit — Product Delivery",
      exact: true,
    });
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(
      page.getByText("Overall Progress", { exact: true }),
    ).toBeVisible();
    await page.goBack();
  }
});

for (const width of [390, 1280])
  test(`shared demo information and appearance preferences are reachable at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await enterDemo(page);
    await page
      .getByRole("link", { name: "Orbit \u2014 Product Delivery", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Open user menu", exact: true })
      .click();
    await expect(page.getByRole("menu")).toContainText("Demo Visitor");
    await expect(page.getByRole("menu")).toContainText("Shared demo workspace");
    await expect(
      page.getByRole("menuitemcheckbox", { name: /Follow system appearance/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("menuitem", { name: "Settings", exact: true }),
    ).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });
