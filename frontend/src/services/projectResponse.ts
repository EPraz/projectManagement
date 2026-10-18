import { Project } from "../types/models/Project";
import type { ProjectSummary } from "../types/models/ProjectSummary";
import {
  synchronizeProjectTickets,
  type WorkspaceRead
} from "./projectProjection";
import { ApiError } from "./apiRequest";

export const readProject = (value: unknown): Project => {
  if (!value || typeof value !== "object")
    throw new ApiError(
      502,
      "The server returned an unexpected project. Please try again."
    );
  const project = value as Record<string, unknown>;
  const collections = [
    "tickets",
    "sprints",
    "users",
    "ticketStatuses",
    "taskStatuses",
    "epics",
    "epicStatuses",
    "featureStatuses"
  ];
  if (
    typeof project.id !== "string" ||
    typeof project.title !== "string" ||
    !collections.every((key) => Array.isArray(project[key]))
  ) {
    throw new ApiError(
      502,
      "The server returned an unexpected project. Please try again."
    );
  }
  return synchronizeProjectTickets(value as WorkspaceRead);
};

const record = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const readProjectSummaries = (value: unknown): ProjectSummary[] => {
  const invalid = () =>
    new ApiError(
      502,
      "The server returned an unexpected project list. Please try again."
    );
  if (!Array.isArray(value)) throw invalid();
  return value.map((item: unknown) => {
    if (
      !record(item) ||
      typeof item.id !== "string" ||
      typeof item.title !== "string" ||
      typeof item.createdAt !== "string" ||
      typeof item.createdBy !== "string" ||
      !Array.isArray(item.tickets) ||
      !item.tickets.every(
        (ticket: unknown) =>
          record(ticket) &&
          (ticket.statusId === null || typeof ticket.statusId === "string")
      ) ||
      !Array.isArray(item.sprints) ||
      !item.sprints.every(
        (sprint: unknown) => record(sprint) && typeof sprint.id === "string"
      ) ||
      !Array.isArray(item.ticketStatuses) ||
      !item.ticketStatuses.every(
        (status: unknown) =>
          record(status) &&
          typeof status.id === "string" &&
          typeof status.name === "string"
      ) ||
      !Array.isArray(item.users) ||
      !item.users.every(
        (user: unknown) =>
          record(user) &&
          typeof user.id === "string" &&
          typeof user.name === "string" &&
          typeof user.email === "string"
      ) ||
      (item.updatedBy !== undefined &&
        item.updatedBy !== null &&
        typeof item.updatedBy !== "string") ||
      (item.description !== undefined &&
        item.description !== null &&
        typeof item.description !== "string")
    )
      throw invalid();
    return item as ProjectSummary;
  });
};
