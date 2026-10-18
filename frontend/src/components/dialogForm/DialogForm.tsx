import { useId, useLayoutEffect, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Tooltip,
  MenuItem,
  Select,
  Alert,
} from "@mui/material";
import {
  useForm,
  Controller,
  type Path,
  type FieldValues,
  type Resolver,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { DialogFormProps } from "../../types";
import {
  FieldError,
  FieldLabel,
  FormFieldContainer,
  StyledDatePicker,
} from "./DialogForm.styles";
import EditorShell from "../workItemEditor/EditorShell";
import EditorNavigationGuard from "../workItemEditor/EditorNavigationGuard";
import UnsavedChangesDialog from "../workItemEditor/UnsavedChangesDialog";
import { useEditorExit } from "../workItemEditor/useEditorExit";

const DialogForm = <T extends FieldValues>({
  open,
  onClose,
  onSubmit,
  onDelete,
  schema,
  defaultValues,
  title,
  context,
  disabled,
  fieldConfig = {},
  itemKey,
}: DialogFormProps<T>) => {
  const formId = useId();
  const generation = useRef(0);
  const active = useRef(false);
  const defaults = useRef(defaultValues);
  defaults.current = defaultValues;
  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<T>({
    // Yup makes generic keys optional in its inferred type; the schema prop
    // already constrains the validated values to this form's T.
    resolver: yupResolver(schema) as unknown as Resolver<T>,
    defaultValues,
  });

  useLayoutEffect(() => {
    generation.current += 1;
    active.current = false;
    reset(defaults.current);
    return () => {
      generation.current += 1;
    };
  }, [open, itemKey, reset]);
  const pending = disabled || isSubmitting;

  const handleDelete = () => {
    reset();
    onDelete?.();
  };

  const internalSubmit = async (data: T) => {
    if (active.current) return;
    active.current = true;
    const opened = generation.current;
    clearErrors("root");
    try {
      const result = await onSubmit(data);
      if (opened !== generation.current) return;
      if (result === false)
        throw new Error(
          "Could not save. Your changes are kept. Please try again.",
        );
      exit.finish();
    } catch (error) {
      if (opened === generation.current)
        setError("root", {
          message:
            error instanceof Error
              ? error.message
              : "Could not save. Please try again.",
        });
    } finally {
      if (opened === generation.current) active.current = false;
    }
  };

  const submit = handleSubmit(internalSubmit);
  const exit = useEditorExit({
    identity: `${open}:${itemKey ?? formId}`,
    dirty: open && isDirty,
    pending: Boolean(pending),
    onClose,
    onSave: () => {
      void submit();
    },
    failure: errors.root?.message ?? "",
  });

  // Función para obtener el campo correcto basado en fieldConfig
  const getFieldComponent = (key: Path<T>) => {
    const fieldOptions = fieldConfig[key];
    const label = fieldOptions?.label || key.replace(/([A-Z])/g, " $1").trim();
    const isSelectField = fieldOptions?.type === "select";
    const isDateField =
      fieldOptions?.label === "startDate" || fieldOptions?.label === "endDate";
    const fieldName = key;
    const inputId = `${formId}-${key}`;
    const isHidden = fieldOptions?.hidden;
    if (isHidden) return null;

    if (isDateField) {
      return (
        <FormFieldContainer key={key}>
          <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              <StyledDatePicker
                disabled={pending || fieldOptions?.disabled}
                value={field.value ? new Date(field.value) : null}
                onChange={(newValue) =>
                  field.onChange(
                    newValue && !Number.isNaN(newValue.getTime())
                      ? newValue.toISOString()
                      : null,
                  )
                }
                slotProps={{
                  textField: {
                    id: inputId,
                    fullWidth: true,
                    error: !!errors[fieldName],
                    size: "small",
                    placeholder: fieldOptions?.placeholder || "",
                    InputLabelProps: { shrink: false },
                    variant: "outlined",
                  },
                }}
              />
            )}
          />
          {errors[fieldName] && (
            <FieldError>{errors[fieldName]?.message as string}</FieldError>
          )}
        </FormFieldContainer>
      );
    }

    if (isSelectField) {
      return (
        <FormFieldContainer key={key}>
          <FieldLabel id={`${inputId}-label`}>{label}</FieldLabel>
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                labelId={`${inputId}-label`}
                fullWidth
                size="small"
                error={!!errors[fieldName]}
                disabled={pending || fieldOptions?.disabled}
                displayEmpty={fieldOptions?.placeholder !== undefined}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: 1,
                  },
                }}
              >
                {fieldOptions?.placeholder && (
                  <MenuItem value="" disabled>
                    {fieldOptions.placeholder}
                  </MenuItem>
                )}
                {fieldOptions?.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          {errors[fieldName] && (
            <FieldError>{errors[fieldName]?.message as string}</FieldError>
          )}
        </FormFieldContainer>
      );
    }

    return (
      <FormFieldContainer key={key}>
        <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
        <TextField
          id={inputId}
          {...control.register(fieldName)}
          fullWidth
          error={!!errors[fieldName]}
          disabled={pending || fieldOptions?.disabled}
          size="small"
          placeholder={fieldOptions?.placeholder || ""}
          multiline={fieldOptions?.multiline}
          rows={fieldOptions?.rows || 1}
          type={fieldOptions?.type || "text"}
          InputLabelProps={{ shrink: false }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1,
            },
            "& .MuiInputLabel-root": {
              display: "none",
            },
          }}
        />
        {errors[fieldName] && (
          <FieldError>{errors[fieldName]?.message as string}</FieldError>
        )}
      </FormFieldContainer>
    );
  };

  return (
    <>
      <EditorNavigationGuard {...exit.guardProps} />
      <EditorShell
        open={open}
        title={title}
        context={context}
        panelWidth={760}
        closeLabel="Close"
        pending={Boolean(pending)}
        onClose={exit.requestClose}
        actions={
          <>
            {onDelete && (
              <Button
                color="error"
                startIcon={<DeleteOutlineIcon />}
                onClick={handleDelete}
                disabled={pending}
              >
                Delete
              </Button>
            )}
            <Box sx={{ flex: 1 }} />
            <Button
              variant="outlined"
              onClick={exit.requestClose}
              disabled={pending}
            >
              Cancel
            </Button>
            <Tooltip title={!isDirty ? "No changes to save" : ""}>
              <span>
                <Button
                  variant="contained"
                  type="submit"
                  form={formId}
                  disabled={pending || !isDirty}
                >
                  {isSubmitting ? "Saving…" : "Save"}
                </Button>
              </span>
            </Tooltip>
          </>
        }
      >
        <Box
          component="form"
          id={formId}
          onSubmit={submit}
          sx={{ display: "grid", gap: 3, pt: 1, maxWidth: 720 }}
        >
          {errors.root?.message && (
            <Alert severity="error">{errors.root.message}</Alert>
          )}
          {Object.keys(defaultValues).map((key) =>
            getFieldComponent(key as Path<T>),
          )}
        </Box>
      </EditorShell>
      <UnsavedChangesDialog {...exit.warningProps} />
    </>
  );
};
export default DialogForm;
