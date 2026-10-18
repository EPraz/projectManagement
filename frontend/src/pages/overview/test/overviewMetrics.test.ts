import { generateActivities } from "../components/recentActivity/RecentActivity.helpers";
import { TicketPriority, TicketType } from "../../../constants";
import type { Ticket } from "../../../types";
import { getBlockedTickets, getTicketDeadlines } from "../overviewMetrics";

test("blocked tickets include flag-only, state-only and both once, without truncating the total", () => {
  const tickets = [
    { id: 1, isBlocked: true, status: { name: "NEW" } },
    { id: 2, isBlocked: false, status: { name: "BLOCKED" } },
    { id: 3, isBlocked: true, status: { name: "BLOCKED" } },
    { id: 4, isBlocked: true, status: { name: "IN_PROGRESS" } },
    { id: 5, isBlocked: true, status: { name: "NEW" } },
    { id: 6, isBlocked: false, status: { name: "NEW" } },
  ];
  expect(getBlockedTickets(tickets).map((ticket) => ticket.id)).toEqual([
    1, 2, 3, 4, 5,
  ]);
});

test("calendar separates overdue and upcoming unfinished work, excluding missing/invalid dates and completed tickets", () => {
  const tickets = [
    { id: 1, dueDate: "2026-10-16T00:00:00Z", status: { name: "NEW" } },
    { id: 2, dueDate: "2026-10-20T00:00:00Z", status: { name: "IN_PROGRESS" } },
    { id: 3, dueDate: "2026-10-15T00:00:00Z", status: { name: "COMPLETED" } },
    { id: 4, dueDate: undefined, status: { name: "NEW" } },
    { id: 5, dueDate: "invalid", status: { name: "NEW" } },
    { id: 6, dueDate: "2026-10-18T13:00:00Z", status: { name: "NEW" } },
    { id: 7, dueDate: "2026-10-25T00:00:00Z", status: { name: "COMPLETED" } },
  ];
  const result = getTicketDeadlines(tickets, new Date("2026-10-18T12:00:00Z"));
  expect(result.overdue.map((ticket) => ticket.id)).toEqual([1]);
  expect(result.upcoming.map((ticket) => ticket.id)).toEqual([6, 2]);
});

test("recent updates describe known creation/latest modification without inferring assignment or state history", () => {
  const ticket: Ticket = {
    id: 42,
    title: "Checkout",
    createdBy: "visitor@demo.example",
    updatedBy: "visitor@demo.example",
    createdAt: "2026-10-17T09:00:00Z",
    updatedAt: "2026-10-18T09:00:00Z",
    statusId: "active",
    status: { id: "active", name: "IN_PROGRESS", position: 1 },
    assignedTo: "member",
    tasks: [],
    order: 0,
    priority: TicketPriority.MEDIUM,
    type: TicketType.PRODUCT_BACKLOG_ITEM,
    _count: null,
    pairProgrammingUsers: [],
  };
  const updates = generateActivities(null, [ticket], [ticket], [], 10);
  expect(updates.map((update) => update.action)).toEqual([
    'updated ticket "Checkout"',
    'created ticket "Checkout"',
  ]);
});
