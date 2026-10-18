import { useAuth } from "../../../../context/authContext";
import { useProject } from "../../../../context/projectContext";
import { usePendingWorkItems } from "../../../../hooks/usePendingWorkItems";
import type { TeamMemberCapacity } from "../../../../types/models/TeamMemberCapacity";

export type CapacityDraft = {
  userId: string;
  capacity: number;
  daysOff: number;
  remainingWork: number;
};
const record = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

export const useCapacityPlanning = () => {
  const { request } = useAuth();
  const { project, sprint, reloadProject } = useProject();
  const { begin, finish, isPending } = usePendingWorkItems<string>();
  const save = async (
    current: TeamMemberCapacity | null,
    data: CapacityDraft,
  ) => {
    if (!sprint) throw new Error("Select a sprint before planning capacity.");
    if (
      !project?.users.some(
        (member) => member.id === (current?.userId ?? data.userId),
      )
    )
      throw new Error(
        "That person is no longer a member of this project. Close this draft and choose a current member.",
      );
    const key = `save:${current?.id ?? sprint.id}`;
    if (!begin(key)) return false;
    try {
      const result = await request<unknown>(
        `team-member-capacities${current ? `/${current.id}` : ""}`,
        {
          method: current ? "PATCH" : "POST",
          body: {
            capacity: data.capacity,
            daysOff: data.daysOff,
            remainingWork: data.remainingWork,
            ...(!current && { userId: data.userId, sprintId: sprint.id }),
          },
          errorMessage:
            "Could not save capacity. Your changes are kept. Please try again.",
        },
      );
      if (
        !record(result) ||
        typeof result.id !== "string" ||
        (current && result.id !== current.id) ||
        result.sprintId !== sprint.id ||
        result.userId !== (current?.userId ?? data.userId) ||
        !["capacity", "daysOff", "remainingWork"].every(
          (key) => typeof result[key] === "number",
        )
      )
        throw new Error(
          "The server did not confirm this capacity change. Please refresh and try again.",
        );
      await reloadProject();
      return true;
    } finally {
      finish(key);
    }
  };
  const remove = async (current: TeamMemberCapacity | null) => {
    if (!current) throw new Error("Select a capacity record to delete.");
    const key = `delete:${current.id}`;
    if (!begin(key)) return false;
    try {
      const result = await request<unknown>(
        `team-member-capacities/${current.id}`,
        {
          method: "DELETE",
          errorMessage: "Could not delete capacity. Please try again.",
        },
      );
      if (result !== true)
        throw new Error(
          "The server did not confirm deletion. Please refresh and try again.",
        );
      await reloadProject();
      return true;
    } finally {
      finish(key);
    }
  };
  return {
    project,
    sprint,
    // Membership is canonical; keep stored plans available if someone rejoins,
    // while current sprint reporting includes only the current project roster.
    teamMembers: (sprint?.teamMemberCapacities ?? []).filter((record) =>
      project?.users.some((member) => member.id === record.userId),
    ),
    save,
    remove,
    isSaving: (id?: string) => isPending(`save:${id ?? sprint?.id}`),
    isDeleting: (id?: string) => isPending(`delete:${id}`),
  };
};
