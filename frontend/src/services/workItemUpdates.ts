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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);
const nullableString = (value: unknown) =>
  value === null || typeof value === "string";
const nullableNumber = (value: unknown) =>
  value === null || (typeof value === "number" && Number.isFinite(value));
const timestamp = (value: unknown) =>
  typeof value === "string" && Number.isFinite(Date.parse(value));
const status = (value: unknown) =>
  value === null ||
  (isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.name === "string");
const assignee = (value: unknown) =>
  value === null ||
  (isRecord(value) &&
    [value.id, value.name, value.email].every(
      (field) => typeof field === "string"
    ));
const baseResponse = (value: unknown): value is Record<string, unknown> =>
  isRecord(value) &&
  typeof value.id === "number" &&
  Number.isInteger(value.id) &&
  typeof value.title === "string" &&
  typeof value.createdBy === "string" &&
  timestamp(value.createdAt) &&
  timestamp(value.updatedAt) &&
  nullableString(value.updatedBy) &&
  nullableString(value.description) &&
  nullableString(value.discussion) &&
  nullableString(value.assignedTo) &&
  assignee(value.assignedUser) &&
  nullableString(value.statusId) &&
  status(value.status) &&
  [value.estimatedHours, value.remainingHours, value.completedHours].every(
    nullableNumber
  );
const taskResponse = (value: unknown): value is Task =>
  baseResponse(value) &&
  typeof value.ticketId === "number" &&
  Number.isInteger(value.ticketId);
const unconfirmed = (): never => {
  throw new ApiError(
    502,
    "The server did not confirm the saved item. Please refresh and try again."
  );
};

export const readTaskUpdate = (value: unknown, id: number | undefined): Task =>
  taskResponse(value) && value.id === id ? value : unconfirmed();

export const readTicketUpdate = (
  value: unknown,
  id: number | undefined
): Ticket => {
  if (
    !baseResponse(value) ||
    value.id !== id ||
    !nullableString(value.projectId) ||
    !nullableString(value.sprintId) ||
    !nullableString(value.featureId) ||
    !Array.isArray(value.tasks) ||
    !value.tasks.every(taskResponse) ||
    typeof value.type !== "string" ||
    typeof value.priority !== "string" ||
    typeof value.isBlocked !== "boolean" ||
    !nullableNumber(value.storyPoints) ||
    !nullableNumber(value.blockedBy) ||
    ![
      value.acceptanceCriteria,
      value.designInformation,
      value.additionalDetails,
      value.notes,
      value.dueDate
    ].every(nullableString) ||
    !Array.isArray(value.tags) ||
    !Array.isArray(value.blockedTickets) ||
    !Array.isArray(value.pairProgrammingUsers)
  )
    return unconfirmed();
  return value as Ticket;
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
