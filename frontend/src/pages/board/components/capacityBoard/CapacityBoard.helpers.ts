import { TeamMemberCapacity } from "../../../../types";

export const computeProgress = (member: TeamMemberCapacity) =>
  member.capacity > 0
    ? Math.min(
        100,
        Math.max(0, (computeCompletedWork(member) / member.capacity) * 100)
      )
    : 0;

export const computeCompletedWork = (member: TeamMemberCapacity) =>
  Math.max(0, member.capacity - member.remainingWork);
