import { expect, test } from "@playwright/test";
import { enterDemo, navigateSection } from "./support/demo";

const boardModule =
  /\/(?:src\/pages\/board\/Board\.tsx(?:\?.*)?|assets\/Board-[^/]+\.js)$/;
test.use({ actionTimeout: 5000 });

test("a failed board module keeps entry usable and the deep link can reload after recovery", async ({
  page,
}) => {
  await page.route(boardModule, (route) =>
    route.fulfill({
      status: 503,
      contentType: "text/javascript",
      body: "unavailable",
    }),
  );
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await navigateSection(page, "Taskboard");
  await expect(page.getByRole("alert")).toContainText("Could not open Board");
  await expect(page).toHaveURL(/\/board/);
  await page.unroute(boardModule);
  await page.getByRole("button", { name: "Reload view", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Add New Item", exact: true }),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/board/);
});

test("a pending board download keeps navigation available and cannot replace a later view", async ({
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
  try {
    await page.route(boardModule, async (route) => {
      reached();
      await delay;
      await route.continue();
    });
    await enterDemo(page);
    await page.getByText("Orbit — Product Delivery", { exact: true }).click();
    await navigateSection(page, "Taskboard");
    await received;
    await expect(
      page.getByText("Loading Board…", { exact: true }),
    ).toBeVisible();
    await navigateSection(page, "Retrospective");
    await expect(
      page.getByRole("button", { name: "Add new card", exact: true }),
    ).toBeVisible();
    release();
    await page.unrouteAll({ behavior: "wait" });
    await expect(page).toHaveURL(/\/retrospective/);
    await expect(
      page.getByRole("button", { name: "Add new card", exact: true }),
    ).toBeVisible();
  } finally {
    release();
    await page.unrouteAll({ behavior: "wait" });
  }
});

test("an unavailable capacity panel preserves the board and another planning tab remains usable", async ({
  page,
}) => {
  const capacityModule =
    /\/(?:src\/pages\/board\/components\/capacityBoard\/CapacityBoard\.tsx(?:\?.*)?|assets\/CapacityBoard-[^/]+\.js)$/;
  await page.route(capacityModule, (route) =>
    route.fulfill({
      status: 503,
      contentType: "text/javascript",
      body: "unavailable",
    }),
  );
  await enterDemo(page);
  await page.getByText("Orbit — Product Delivery", { exact: true }).click();
  await navigateSection(page, "Taskboard");
  await navigateSection(page, "Capacity");
  await expect(page.getByRole("alert")).toContainText(
    "Could not open Capacity",
  );
  await navigateSection(page, "Goals");
  await expect(
    page.getByRole("button", { name: "Add New Goal", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});
