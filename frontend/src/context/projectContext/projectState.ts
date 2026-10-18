import { synchronizeProjectTickets } from "../../services/projectProjection";
import { SetStateAction } from "react";
import { Project } from "../../types/models/Project";
import { Sprint } from "../../types/models/Sprint";

export type ProjectState = {
  project: Project | null;
  selectedSprintId: string | null;
};
export type ProjectAction =
  | { type: "project"; value: SetStateAction<Project | null>; now: number }
  | { type: "sprints"; value: SetStateAction<Sprint[]>; now: number }
  | { type: "sprint"; value: SetStateAction<Sprint | null>; now: number };

const selectSprint = (project: Project, id: string | null, now: number) =>
  project.sprints.find((sprint) => sprint.id === id) ??
  project.sprints.find(
    (sprint) =>
      sprint.startDate &&
      sprint.endDate &&
      new Date(sprint.startDate).getTime() <= now &&
      new Date(sprint.endDate).getTime() >= now
  ) ??
  project.sprints[0] ??
  null;

const replaceProject = (
  state: ProjectState,
  project: Project | null,
  now: number
): ProjectState => {
  if (!project) return { project: null, selectedSprintId: null };
  const synchronized = synchronizeProjectTickets(project);
  return {
    project: synchronized,
    selectedSprintId:
      selectSprint(synchronized, state.selectedSprintId, now)?.id ?? null
  };
};

export const projectReducer = (
  state: ProjectState,
  action: ProjectAction
): ProjectState => {
  if (action.type === "project") {
    const project =
      typeof action.value === "function"
        ? action.value(state.project)
        : action.value;
    if (project === state.project) return state;
    return replaceProject(state, project, action.now);
  }
  if (!state.project) return state;
  if (action.type === "sprints") {
    const sprints =
      typeof action.value === "function"
        ? action.value(state.project.sprints)
        : action.value;
    if (sprints === state.project.sprints) return state;
    return replaceProject(state, { ...state.project, sprints }, action.now);
  }
  const previous =
    state.project.sprints.find(
      (sprint) => sprint.id === state.selectedSprintId
    ) ?? null;
  const next =
    typeof action.value === "function" ? action.value(previous) : action.value;
  if (!next) return { ...state, selectedSprintId: null };
  if (
    next.projectId !== state.project.id ||
    !state.project.sprints.some((sprint) => sprint.id === next.id)
  )
    return state;
  return {
    project: synchronizeProjectTickets({
      ...state.project,
      sprints: state.project.sprints.map((sprint) =>
        sprint.id === next.id ? next : sprint
      )
    }),
    selectedSprintId: next.id
  };
};
