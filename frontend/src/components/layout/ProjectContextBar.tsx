import { Box, Typography } from "@mui/material";
import SprintSelector, {
  type SprintControls,
} from "../sprintSelector/SprintSelector";
export default function ProjectContextBar({
  controls,
  scope,
}: {
  controls: SprintControls;
  scope: "sprint" | "team" | "hierarchy";
}) {
  const { sprint } = controls;
  const date = (value?: string | Date | null) =>
    value && !Number.isNaN(new Date(value).getTime())
      ? new Date(value).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })
      : null;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      {scope === "sprint" ? (
        <>
          <SprintSelector controls={controls} />
          <Typography variant="body2" color="text.secondary">
            {sprint
              ? [date(sprint.startDate), date(sprint.endDate)]
                  .filter(Boolean)
                  .join(" – ") || "Sprint dates not set"
              : "Create a sprint to plan work."}
          </Typography>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          {scope === "team" ? "Project-wide team" : "Project-wide hierarchy"}
        </Typography>
      )}
    </Box>
  );
}
