import { Box, MenuItem, TextField, Typography } from "@mui/material";
import { format } from "date-fns";
import type { Feature, Sprint } from "../../types";
import EditorSelect from "../workItemEditor/EditorSelect";
import { EstimateFields } from "../workItemEditor/EstimateFields";
import type { TicketFieldProps } from "./types";
export default function TicketPlanningFields({
  draft,
  errors,
  disabled,
  change,
  sprints = [],
  features = [],
}: TicketFieldProps & { sprints?: Sprint[]; features?: Feature[] }) {
  const dueDate =
    draft.dueDate && Number.isFinite(Date.parse(draft.dueDate))
      ? format(new Date(draft.dueDate), "yyyy-MM-dd")
      : "";
  return (
    <Box sx={{ display: "grid", gap: 3 }}>
      <EditorSelect
        label="Sprint"
        value={draft.sprintId ?? ""}
        onChange={(sprintId) => change({ sprintId })}
        disabled={disabled}
        error={errors.sprintId}
      >
        <MenuItem value="">
          <em>Unplanned</em>
        </MenuItem>
        {draft.sprintId &&
          !sprints.some((sprint) => sprint.id === draft.sprintId) && (
            <MenuItem value={draft.sprintId} disabled>
              Unavailable sprint
            </MenuItem>
          )}
        {sprints.map((sprint) => (
          <MenuItem key={sprint.id} value={sprint.id}>
            {sprint.name}
          </MenuItem>
        ))}
      </EditorSelect>
      <EditorSelect
        label="Feature"
        value={draft.featureId ?? ""}
        onChange={(featureId) => change({ featureId })}
        disabled={disabled}
        error={errors.featureId}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {draft.featureId &&
          !features.some((feature) => feature.id === draft.featureId) && (
            <MenuItem value={draft.featureId} disabled>
              Unavailable feature
            </MenuItem>
          )}
        {features.map((feature) => (
          <MenuItem key={feature.id} value={feature.id}>
            {feature.title}
          </MenuItem>
        ))}
      </EditorSelect>
      <TextField
        type="date"
        label="Due date"
        value={dueDate}
        onChange={(event) =>
          change({
            dueDate: event.target.value
              ? new Date(`${event.target.value}T23:59:59`).toISOString()
              : null,
          })
        }
        InputLabelProps={{ shrink: true }}
        disabled={disabled}
        fullWidth
        error={Boolean(errors.dueDate)}
        helperText={errors.dueDate}
      />
      <Typography component="h3" variant="h4">
        Story points & time
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "minmax(0,1fr)",
            sm: "repeat(2,minmax(0,1fr))",
          },
          gap: 2,
        }}
      >
        <EstimateFields
          values={draft}
          errors={errors}
          disabled={disabled}
          includeStoryPoints
          onChange={(field, value) => change({ [field]: value })}
        />
      </Box>
    </Box>
  );
}
