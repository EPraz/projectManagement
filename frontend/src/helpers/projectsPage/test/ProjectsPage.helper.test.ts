import { TicketPriority, TicketType } from "../../../constants";
import { Ticket, TicketStatus } from "../../../types";
import { getProjectProgress } from "../ProjectsPage.helper";

const statuses: TicketStatus[] = [
  { id: "new", name: "NEW", position: 0 },
  { id: "completed", name: "COMPLETED", position: 1 },
  { id: "task-done", name: "DONE", position: 2 },
];

const ticket = (id: number, statusId: string): Ticket => ({
  id,
  title: `Ticket ${id}`,
  createdBy: "visitor@demo.example",
  createdAt: "2026-10-17T00:00:00Z",
  updatedAt: "2026-10-17T00:00:00Z",
  statusId,
  status: statuses.find((status) => status.id === statusId) ?? {
    id: statusId,
    name: "UNRECOGNIZED",
    position: 3,
  },
  tasks: [],
  order: id,
  priority: TicketPriority.MEDIUM,
  type: TicketType.PRODUCT_BACKLOG_ITEM,
  _count: null,
  pairProgrammingUsers: [],
});

describe("project-wide progress", () => {
  it("reports 33% for six COMPLETED tickets among eighteen", () => {
    const tickets = Array.from({ length: 18 }, (_, index) =>
      ticket(index + 1, index < 6 ? "completed" : "new")
    );

    expect(getProjectProgress(statuses, tickets)).toBe(33);
  });

  it.each([
    ["no tickets", [], 0],
    ["no completed tickets", ["new", "new"], 0],
    ["a partially completed project", ["completed", "new"], 50],
    ["all tickets completed", ["completed", "completed"], 100],
    ["a task DONE status", ["task-done"], 0],
    ["an unknown status", ["missing"], 0],
    ["a completed ticket alongside unknown work", ["completed", "missing"], 50],
  ])("handles %s", (_, statusIds, expected) => {
    expect(
      getProjectProgress(statuses, statusIds.map((id, index) => ticket(index + 1, id)))
    ).toBe(expected);
  });
});
