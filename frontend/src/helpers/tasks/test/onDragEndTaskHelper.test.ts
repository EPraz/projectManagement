import { DragEndEvent } from "@dnd-kit/core";
import { TicketPriority, TicketType } from "../../../constants";
import { Task, TaskStatus, Ticket } from "../../../types";
import { onDragEndTaskHandler } from "../onDragEndTaskHelper";
import { mergeConfirmedTaskUpdate } from "../mergeConfirmedTaskUpdate";

const statuses: TaskStatus[] = [
  { id: "todo", name: "TODO", position: 0, color: "gray" },
  { id: "done", name: "DONE", position: 1, color: "green" },
];
const task: Task = {
  id: 10,
  ticketId: 1,
  title: "Check the customer portal",
  createdBy: "visitor@demo.example",
  updatedAt: "2026-10-17T00:00:00Z",
  statusId: "todo",
  status: statuses[0],
  assignedTo: "another-team-member",
  order: 0,
};
const tickets: Ticket[] = [{
  id: 1,
  title: "Customer portal",
  createdBy: "visitor@demo.example",
  createdAt: "2026-10-17T00:00:00Z",
  updatedAt: "2026-10-17T00:00:00Z",
  statusId: "active",
  status: { id: "active", name: "ACTIVE", position: 0 },
  tasks: [task],
  order: 0,
  priority: TicketPriority.MEDIUM,
  type: TicketType.PRODUCT_BACKLOG_ITEM,
  _count: null,
  pairProgrammingUsers: [],
}];
const drop = (status: string | null = "DONE", taskId = task.id) => ({
  active: { id: taskId },
  over: status ? { id: status } : null,
}) as DragEndEvent;

describe("task movement", () => {
  it("preserves newer confirmed changes to the same task when the move response arrives late", () => {
    const newer = { ...task, title: "Newer team edit", updatedAt: "2026-10-17T00:00:01Z" };
    const current = [{ ...tickets[0], tasks: [newer] }];
    const late = { ...task, statusId: "done", status: statuses[1] };
    expect(mergeConfirmedTaskUpdate(current, late)[0].tasks).toEqual([newer]);
  });

  it("does not re-add a task that another client deleted while its move response was pending", () => {
    const current = [{ ...tickets[0], tasks: [] }];
    expect(mergeConfirmedTaskUpdate(current, task)[0].tasks).toEqual([]);
  });

  it("applies a newer confirmed move to the existing task", () => {
    const persisted = { ...task, statusId: "done", status: statuses[1], updatedAt: "2026-10-17T00:00:01Z" };
    expect(mergeConfirmedTaskUpdate(tickets, persisted)[0].tasks).toEqual([persisted]);
  });

  it("attributes a move to the demo actor while preserving the assignee", async () => {
    const persisted = { ...task, statusId: "done", status: statuses[1], updatedBy: "visitor@demo.example" };
    const update = jest.fn().mockResolvedValue(persisted);
    const apply = jest.fn();
    await onDragEndTaskHandler(update, tickets, statuses, apply, "visitor@demo.example")(drop());
    expect(update).toHaveBeenCalledWith({ id: 10, statusId: "done", updatedBy: "visitor@demo.example" });
    expect(task.assignedTo).toBe("another-team-member");
    expect(apply).toHaveBeenCalledWith(persisted);
  });

  it("ignores a drop outside the project's task states", async () => {
    const update = jest.fn();
    const apply = jest.fn();
    await onDragEndTaskHandler(update, tickets, statuses, apply, "visitor@demo.example")(drop("UNKNOWN"));
    expect(update).not.toHaveBeenCalled();
    expect(apply).not.toHaveBeenCalled();
  });

  it("sends only one request while the same task is pending", async () => {
    let complete!: (value: Task) => void;
    const response = new Promise<Task>((resolve) => { complete = resolve; });
    const update = jest.fn().mockReturnValue(response);
    const handler = onDragEndTaskHandler(update, tickets, statuses, jest.fn(), "visitor@demo.example");
    const first = handler(drop());
    const repeated = handler(drop());
    try {
      expect(update).toHaveBeenCalledTimes(1);
    } finally {
      complete({ ...task, statusId: "done", status: statuses[1] });
      await Promise.all([first, repeated]);
    }
  });

  it.each([null, undefined])("keeps board state when saving returns %s, and permits retry", async (failure) => {
    const persisted = { ...task, statusId: "done", status: statuses[1] };
    const update = jest.fn().mockResolvedValueOnce(failure).mockResolvedValueOnce(persisted);
    const apply = jest.fn();
    const handler = onDragEndTaskHandler(update, tickets, statuses, apply, "visitor@demo.example");
    await handler(drop());
    expect(apply).not.toHaveBeenCalled();
    expect(tickets[0].tasks[0].statusId).toBe("todo");
    await handler(drop());
    expect(update).toHaveBeenCalledTimes(2);
    expect(apply).toHaveBeenCalledWith(persisted);
  });

  it.each([null, "TODO"])("ignores a cancelled or unchanged drop (%s)", async (destination) => {
    const update = jest.fn();
    const apply = jest.fn();
    await onDragEndTaskHandler(update, tickets, statuses, apply, "visitor@demo.example")(drop(destination));
    expect(update).not.toHaveBeenCalled();
    expect(apply).not.toHaveBeenCalled();
  });

  it("does not send a move without an authenticated actor or a known task", async () => {
    const update = jest.fn();
    await onDragEndTaskHandler(update, tickets, statuses, jest.fn(), undefined)(drop());
    await onDragEndTaskHandler(update, tickets, statuses, jest.fn(), "visitor@demo.example")(drop("DONE", -1));
    expect(update).not.toHaveBeenCalled();
  });

  it("preserves the pending guard across handler recreation", async () => {
    let complete!: (value: null) => void;
    const update = jest.fn().mockReturnValue(new Promise<null>((resolve) => { complete = resolve; }));
    const pending = new Set<number>();
    const first = onDragEndTaskHandler(update, tickets, statuses, jest.fn(), "visitor@demo.example", pending)(drop());
    const repeated = onDragEndTaskHandler(update, tickets, statuses, jest.fn(), "visitor@demo.example", pending)(drop());
    try {
      expect(update).toHaveBeenCalledTimes(1);
    } finally {
      complete(null);
      await Promise.all([first, repeated]);
    }
  });
});
