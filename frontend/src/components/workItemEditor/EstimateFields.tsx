import { TextField } from "@mui/material";

const fields = [
  ["storyPoints", "Story Points"],
  ["estimatedHours", "Estimated Hours"],
  ["remainingHours", "Remaining Hours"],
  ["completedHours", "Completed Hours"],
] as const;
export type EstimateField = (typeof fields)[number][0];

export const EstimateFields = ({
  values,
  errors,
  disabled,
  includeStoryPoints = false,
  onChange,
}: {
  values: Partial<Record<EstimateField, number>>;
  errors: Record<string, string>;
  disabled: boolean;
  includeStoryPoints?: boolean;
  onChange: (field: EstimateField, value: number | undefined) => void;
}) => (
  <>
    {fields
      .filter(([field]) => includeStoryPoints || field !== "storyPoints")
      .map(([field, label]) => (
        <TextField
          key={field}
          name={field}
          label={label}
          type="number"
          value={values[field] ?? ""}
          onChange={(event) =>
            onChange(
              field,
              event.target.value === ""
                ? undefined
                : Number(event.target.value),
            )
          }
          fullWidth
          size="small"
          disabled={disabled}
          error={Boolean(errors[field])}
          helperText={errors[field]}
          inputProps={{ min: 0, step: field === "storyPoints" ? 1 : 0.5 }}
        />
      ))}
  </>
);
