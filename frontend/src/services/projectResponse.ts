import { Project } from "../types/models/Project";
import { ApiError } from "./apiRequest";

export const readProject = (value: unknown): Project => {
  if (!value || typeof value !== "object")
    throw new ApiError(
      502,
      "The server returned an unexpected project. Please try again.",
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
    "featureStatuses",
  ];
  if (
    typeof project.id !== "string" ||
    typeof project.title !== "string" ||
    !collections.every((key) => Array.isArray(project[key]))
  ) {
    throw new ApiError(
      502,
      "The server returned an unexpected project. Please try again.",
    );
  }
  return value as Project;
};

export const readProjects = (value: unknown): Project[] => {
  if (!Array.isArray(value))
    throw new ApiError(
      502,
      "The server returned an unexpected project list. Please try again.",
    );
  return value.map(readProject);
};
