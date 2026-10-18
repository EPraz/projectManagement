import { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useProject } from "../../context/projectContext";
import { usePendingWorkItems } from "../../hooks/usePendingWorkItems";
import type { GoalTask, Sprint, SprintGoal } from "../../types/models/Sprint";

const record = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const useSprintPlanning = (
  sprint: Sprint | null,
  goal: SprintGoal | null,
  task: GoalTask | null
) => {
  const { request, user } = useAuth();
  const { project, reloadProject } = useProject();
  const { begin, finish, isPending } = usePendingWorkItems<string>();
  const [error, setError] = useState<{
    sprintId?: string;
    message: string;
  } | null>(null);

  const run = async (
    key: string,
    path: string,
    method: "POST" | "PATCH" | "DELETE",
    body: object | undefined,
    confirmed: (value: unknown) => boolean
  ) => {
    if (!begin(key)) return false;
    setError(null);
    try {
      const result = await request<unknown>(path, {
        method,
        body,
        errorMessage: "Could not save this planning change. Please try again."
      });
      if (!confirmed(result))
        throw new Error(
          "The server did not confirm this change. Please refresh and try again."
        );
      // A fresh canonical project reconciles every sprint, goal and assignment.
      // Never append an old response to whichever sprint is selected now.
      await reloadProject();
      return true;
    } catch (failure) {
      setError({
        sprintId: sprint?.id,
        message:
          failure instanceof Error
            ? failure.message
            : "Could not save this planning change. Please try again."
      });
      return false;
    } finally {
      finish(key);
    }
  };
  const entity =
    (parent: string, parentId: string | undefined, id?: string) =>
    (value: unknown) =>
      record(value) &&
      typeof value.id === "string" &&
      (!id || value.id === id) &&
      typeof value.title === "string" &&
      value[parent] === parentId;
  const removed = (value: unknown) => value === true;
  const createSprintKey = `createSprint:${project?.id}`;
  const createGoalKey = `createGoal:${sprint?.id}`;
  const createTaskKey = `createTask:${goal?.id}`;

  return {
    planningError:
      error?.sprintId === sprint?.id ? (error?.message ?? null) : null,
    loadingCreateSprint: isPending(createSprintKey),
    isDeletingSprint: (id?: string) => isPending(`deleteSprint:${id}`),
    loadingCreateSprintGoal: isPending(createGoalKey),
    loadingUpdateSprintGoal: isPending(`goal:${goal?.id}`),
    loadingDeleteSprintGoal: isPending(`deleteGoal:${goal?.id}`),
    loadingCreateGoalTask: isPending(createTaskKey),
    loadingUpdateGoalTask: isPending(`task:${task?.id}`),
    loadingDeleteGoalTask: isPending(`deleteTask:${task?.id}`),
    isGoalTaskPending: (id: string) => isPending(`task:${id}`),
    handleCreateSprint: (data: Partial<Sprint>) =>
      run(
        createSprintKey,
        "sprints",
        "POST",
        {
          name: data.name,
          startDate: data.startDate
            ? new Date(data.startDate).toISOString()
            : null,
          endDate: data.endDate ? new Date(data.endDate).toISOString() : null,
          projectId: project?.id,
          createdBy: user?.email
        },
        (value) =>
          record(value) &&
          typeof value.id === "string" &&
          value.projectId === project?.id &&
          typeof value.name === "string" &&
          Array.isArray(value.sprintGoal)
      ),
    handleDeleteSprint: (data: Partial<Sprint>) =>
      run(
        `deleteSprint:${data.id}`,
        `sprints/${data.id}`,
        "DELETE",
        undefined,
        removed
      ),
    handleCreateSprintGoal: (data: Partial<SprintGoal>) =>
      run(
        createGoalKey,
        "sprint-goals",
        "POST",
        {
          title: data.title,
          description: data.description,
          sprintId: sprint?.id
        },
        entity("sprintId", sprint?.id)
      ),
    handleEditSprintGoal: (data: Partial<SprintGoal>) =>
      run(
        `goal:${goal?.id}`,
        `sprint-goals/${goal?.id}`,
        "PATCH",
        {
          id: goal?.id,
          title: data.title,
          description: data.description,
          goalsStatus: data.goalsStatus
        },
        entity("sprintId", goal?.sprintId, goal?.id)
      ),
    handleDeleteSprintGoal: (data: Partial<SprintGoal>) =>
      run(
        `deleteGoal:${data.id}`,
        `sprint-goals/${data.id}`,
        "DELETE",
        undefined,
        removed
      ),
    handleCreateGoalTask: (data: Partial<GoalTask>) =>
      run(
        createTaskKey,
        "sprint-goals/goalTask",
        "POST",
        { title: data.title, goalId: goal?.id },
        entity("goalId", goal?.id)
      ),
    handleEditGoalTask: (data: Partial<GoalTask>) =>
      run(
        `task:${task?.id}`,
        `sprint-goals/goalTask/${task?.id}`,
        "PATCH",
        { id: task?.id, title: data.title },
        entity("goalId", task?.goalId, task?.id)
      ),
    handleDeleteGoalTask: (data: Partial<GoalTask>) =>
      run(
        `deleteTask:${data.id}`,
        `sprint-goals/goalTask/${data.id}`,
        "DELETE",
        undefined,
        removed
      ),
    handleToggleGoalTaskCompletion: (data: Partial<GoalTask>) =>
      run(
        `task:${data.id}`,
        `sprint-goals/goalTask/${data.id}`,
        "PATCH",
        { id: data.id, completed: !data.completed },
        entity("goalId", data.goalId, data.id)
      )
  };
};
