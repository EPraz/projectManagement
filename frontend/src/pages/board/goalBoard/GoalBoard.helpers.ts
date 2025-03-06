import { SprintGoalStatus } from "../../../constants";
import { Sprint } from "../../../types";

export const statusConfig = {
  [SprintGoalStatus.COMPLETED]: { color: "success", label: "Completed" },
  [SprintGoalStatus.IN_PROGRESS]: { color: "info", label: "In Progress" },
  [SprintGoalStatus.AT_RISK]: { color: "error", label: "At Risk" },
} as const;

///
export const formatDateRange = (sprint: Sprint | null) => {
  if (!sprint?.startDate || !sprint?.endDate) return "";
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return `${formatDate(startDate)} - ${formatDate(endDate)} · ${sprint.name}`;
};
