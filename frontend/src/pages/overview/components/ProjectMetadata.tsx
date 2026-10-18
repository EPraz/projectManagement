import { Box, Typography } from "@mui/material";
import type { Project } from "../../../types";
import OverviewPanel from "./OverviewPanel";
export default function ProjectMetadata({ project }: { project: Project }) {
  const date = (value?: string) =>
    value && Number.isFinite(Date.parse(value))
      ? new Date(value).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Not estimated yet";
  const fields = [
    ["Project type", project.type || "Not specified"],
    ["Start date", date(project.createdAt)],
    ["End date", date(project.endDate)],
    [
      "Project scope",
      `${project.tickets.length} tickets · ${project.sprints.length} sprints`,
    ],
    ["Created by", project.createdBy],
    ["Updated", date(project.updatedAt)],
    ["Updated by", project.updatedBy || "Not recorded"],
  ];
  return (
    <OverviewPanel title="Project details">
      <Box
        component="dl"
        sx={{
          m: 0,
          display: "grid",
          gridTemplateColumns: "minmax(80px,.8fr) minmax(0,1.2fr)",
          gap: 1.5,
        }}
      >
        {fields.map(([label, value]) => (
          <Box key={label} sx={{ display: "contents" }}>
            <Typography component="dt" variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography
              component="dd"
              variant="body2"
              sx={{ m: 0, overflowWrap: "anywhere" }}
            >
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
    </OverviewPanel>
  );
}
