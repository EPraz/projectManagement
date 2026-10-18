import { expect, test } from "@playwright/test";
import { enterDemo } from "./support/demo";

test("confirmed bulk events update the selected board while unavailable ordering stays disabled", async ({
  page,
  request
}) => {
  const login = await request.post("/api/auth/instant-login", { data: {} });
  const { accessToken } = await login.json();
  const headers = { Authorization: `Bearer ${accessToken}` };
  const projects: {
    id: string;
    title: string;
    sprints: { id: string; name: string }[];
    tickets: { id: number; title: string; sprintId: string | null }[];
  }[] = await (await request.get("/api/projects", { headers })).json();
  const project = projects[0];
  const sprint = project.sprints.find(
    (item) => item.name === "Sprint 2 — Delivery"
  )!;
  const [first, second] = project.tickets.filter(
    (item) => item.sprintId === sprint.id
  );
  const outsider = projects[1].tickets[0];
  const changedTitle = `Confirmed batch ${first.id}`;
  try {
    await enterDemo(page);
    await page.getByText(project.title, { exact: true }).click();
    await page.getByRole("button", { name: "Board", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: first.title, exact: true })
    ).toBeVisible();
    const arrows = page.getByRole("button", {
      name: "Move ticket up (unavailable)",
      exact: true
    });
    await expect(arrows.first()).toBeVisible();
    for (const arrow of await arrows.all()) await expect(arrow).toBeDisabled();
    const confirmed = await request.patch("/api/tickets/bulk-update", {
      headers,
      data: [
        { id: first.id, title: changedTitle },
        { id: outsider.id, title: "Unrelated project batch" }
      ]
    });
    expect(confirmed.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: changedTitle, exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Unrelated project batch",
        exact: true
      })
    ).toHaveCount(0);
    const rejected = await request.patch("/api/tickets/bulk-update", {
      headers,
      data: [
        { id: first.id, title: "Must not be shown" },
        { id: second.id, title: null }
      ]
    });
    expect(rejected.status()).toBe(400);
    await page.reload();
    await expect(
      page.getByRole("heading", { name: changedTitle, exact: true })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Must not be shown", exact: true })
    ).toHaveCount(0);
  } finally {
    for (const ticket of [first, outsider]) {
      const restored = await request.patch(`/api/tickets/${ticket.id}`, {
        headers,
        data: { id: ticket.id, title: ticket.title, updatedBy: "visitor@demo.example" }
      });
      expect(restored.status()).toBe(200);
    }
  }
});
