import { DragEndEvent } from "@dnd-kit/core";
import { Task, TaskStatus, Ticket } from "../../types";

export const onDragEndTaskHandler =
  (
    updateTask: (data: Partial<Task>) => Promise<Task | null | undefined>,
    originalTickets: Ticket[],
    projectTaskStatuses: TaskStatus[] | undefined,
    applyTaskUpdate: (task: Task) => void,
    actorEmail: string | undefined,
    pendingTaskIds: Set<Task["id"]> = new Set()
  ) =>
  async ({ active, over }: DragEndEvent) => {
    if (!over || !actorEmail) return;
    const task = originalTickets
      .flatMap((ticket) => ticket.tasks)
      .find((candidate) => candidate.id === active.id);
    const status = projectTaskStatuses?.find((candidate) => candidate.name === over.id);
    if (!task || !status || status.id === task.statusId || pendingTaskIds.has(task.id)) return;

    pendingTaskIds.add(task.id);
    try {
      const persisted = await updateTask({ id: task.id, statusId: status.id, updatedBy: actorEmail });
      // Merge only the confirmed task into current state, preserving concurrent updates.
      if (persisted) applyTaskUpdate(persisted);
    } finally {
      pendingTaskIds.delete(task.id);
    }
  };
