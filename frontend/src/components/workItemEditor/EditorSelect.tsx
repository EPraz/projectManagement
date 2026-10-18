import { useId, type ReactNode } from "react";
import { FormControl, FormHelperText, InputLabel, Select } from "@mui/material";
export default function EditorSelect({
  label,
  value,
  onChange,
  disabled,
  error,
  children,
  testId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  children: ReactNode;
  testId?: string;
}) {
  const id = useId();
  return (
    <FormControl
      fullWidth
      size="small"
      disabled={disabled}
      error={Boolean(error)}
    >
      <InputLabel id={id} shrink>
        {label}
      </InputLabel>
      <Select
        labelId={id}
        label={label}
        displayEmpty
        value={value}
        onChange={(event) => onChange(event.target.value)}
        data-testid={testId}
      >
        {children}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
