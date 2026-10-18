import type { Task, Ticket } from "../types";
import { ApiError } from "./apiRequest";

type NullableEstimates = {
  assignedTo?: string | null;
  estimatedHours?: number | null;
  remainingHours?: number | null;
  completedHours?: number | null;
};
export type TaskUpdate = Partial<
  Pick<
    Task,
    "id" | "title" | "description" | "discussion" | "statusId" | "updatedBy"
  >
> &
  NullableEstimates;
export type TicketUpdate = Partial<
  Pick<
    Ticket,
    | "id"
    | "title"
    | "description"
    | "statusId"
    | "type"
    | "priority"
    | "isBlocked"
    | "blockedBy"
    | "acceptanceCriteria"
    | "designInformation"
    | "additionalDetails"
    | "notes"
    | "discussion"
    | "updatedBy"
  >
> &
  NullableEstimates & {
    sprintId?: string | null;
    featureId?: string | null;
    storyPoints?: number | null;
  };

export const readWorkItemUpdate = <T extends Task | Ticket>(
  value: unknown,
  id: number | undefined
): T => {
  if (
    !value ||
    typeof value !== "object" ||
    !("id" in value) ||
    value.id !== id ||
    !("title" in value) ||
    typeof value.title !== "string" ||
    !("updatedAt" in value) ||
    typeof value.updatedAt !== "string" ||
    !Number.isFinite(Date.parse(value.updatedAt))
  ) {
    throw new ApiError(
      502,
      "The server did not confirm the saved item. Please refresh and try again."
    );
  }
  return value as T;
};

const estimates = (item: Pick<Partial<Task>, keyof NullableEstimates>) => ({
  assignedTo: item.assignedTo || null,
  estimatedHours: item.estimatedHours ?? null,
  remainingHours: item.remainingHours ?? null,
  completedHours: item.completedHours ?? null
});

// Editors send writable fields explicitly, never nested response objects or metadata.
export const taskUpdateFromDraft = (task: Task, actor: string): TaskUpdate => ({
  id: task.id,
  title: task.title.trim(),
  description: task.description,
  discussion: task.discussion,
  updatedBy: actor,
  ...estimates(task)
});

export const ticketUpdateFromDraft = (
  ticket: Partial<Ticket>,
  actor: string
): TicketUpdate => ({
  id: ticket.id,
  title: ticket.title?.trim(),
  description: ticket.description,
  statusId: ticket.statusId,
  type: ticket.type,
  priority: ticket.priority,
  sprintId: ticket.sprintId || null,
  featureId: ticket.featureId || null,
  isBlocked: ticket.isBlocked,
  blockedBy: ticket.blockedBy ?? null,
  storyPoints: ticket.storyPoints ?? null,
  acceptanceCriteria: ticket.acceptanceCriteria,
  designInformation: ticket.designInformation,
  additionalDetails: ticket.additionalDetails,
  notes: ticket.notes,
  discussion: ticket.discussion,
  updatedBy: actor,
  ...estimates(ticket)
});

export const validateWorkItem = (draft: Partial<Task> | Partial<Ticket>) => {
  const errors: Record<string, string> = {};
  if (!draft.title?.trim()) errors.title = "Title is required";
  for (const field of [
    "estimatedHours",
    "remainingHours",
    "completedHours"
  ] as const) {
    const value = draft[field];
    if (value != null && (!Number.isFinite(value) || value < 0))
      errors[field] = "Enter a non-negative number";
  }
  if ("type" in draft) {
    if (!draft.statusId) errors.statusId = "Status is required";
    if (!draft.type) errors.type = "Type is required";
    if (!draft.priority) errors.priority = "Priority is required";
    if (
      draft.storyPoints != null &&
      (!Number.isInteger(draft.storyPoints) || draft.storyPoints < 0)
    )
      errors.storyPoints = "Enter a non-negative whole number";
  }
  return errors;
};
