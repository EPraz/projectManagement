import { useId, useLayoutEffect, useRef } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Tooltip,
  MenuItem,
  Select,
  Alert
} from "@mui/material";
import {
  useForm,
  Controller,
  type Path,
  type FieldValues,
  type Resolver
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import type { DialogFormProps } from "../../types";
import {
  CloseButton,
  DeleteButton,
  DialogHeader,
  FieldError,
  FieldLabel,
  FormFieldContainer,
  StyledDatePicker,
  StyledDialog,
  StyledDialogActions,
  StyledDialogContent
} from "./DialogForm.styles";

const DialogForm = <T extends FieldValues>({
  open,
  onClose,
  onSubmit,
  onDelete,
  schema,
  defaultValues,
  title,
  disabled,
  fieldConfig = {},
  itemKey
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
    formState: { errors, isDirty, isSubmitting }
  } = useForm<T>({
    // Yup makes generic keys optional in its inferred type; the schema prop
    // already constrains the validated values to this form's T.
    resolver: yupResolver(schema) as unknown as Resolver<T>,
    defaultValues
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

  const handleClose = () => {
    onClose();
  };

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
          "Could not save. Your changes are kept. Please try again."
        );
      handleClose();
    } catch (error) {
      if (opened === generation.current)
        setError("root", {
          message:
            error instanceof Error
              ? error.message
              : "Could not save. Please try again."
        });
    } finally {
      if (opened === generation.current) active.current = false;
    }
  };

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
                      : null
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
                    variant: "outlined"
                  }
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
                    borderRadius: 1
                  }
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
              borderRadius: 1
            },
            "& .MuiInputLabel-root": {
              display: "none"
            }
          }}
        />
        {errors[fieldName] && (
          <FieldError>{errors[fieldName]?.message as string}</FieldError>
        )}
      </FormFieldContainer>
    );
  };

  return (
    <StyledDialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick") return;
        if (!pending) onClose();
      }}
      maxWidth="sm"
      fullWidth
    >
      <DialogHeader>
        <Typography fontWeight="600" textTransform="uppercase">
          {title}
        </Typography>
        <Tooltip title="Close" arrow>
          <CloseButton
            onClick={handleClose}
            size="small"
            disabled={pending}
            aria-label="Close"
          >
            <CloseIcon fontSize="small" />
          </CloseButton>
        </Tooltip>
      </DialogHeader>

      {/* Envolvemos todo en un <form> para que el submit funcione correctamente */}
      <form onSubmit={handleSubmit(internalSubmit)}>
        <StyledDialogContent>
          {errors.root?.message && (
            <Alert severity="error">{errors.root.message}</Alert>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {Object.keys(defaultValues).map((key) =>
              getFieldComponent(key as Path<T>)
            )}
          </Box>
        </StyledDialogContent>

        <StyledDialogActions>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              width: "100%",
              justifyContent: "space-between"
            }}
          >
            {onDelete && (
              <Tooltip
                title={disabled ? "Cannot delete at this moment" : "Delete"}
                arrow
              >
                <Box>
                  <DeleteButton
                    variant="outlined"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={handleDelete}
                    disabled={pending}
                  >
                    Delete
                  </DeleteButton>
                </Box>
              </Tooltip>
            )}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={pending}
              >
                Cancel
              </Button>
              <Tooltip title={!isDirty ? "No changes to save" : ""} arrow>
                <span>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={pending || !isDirty}
                    sx={{ minWidth: 100 }}
                  >
                    Save
                  </Button>
                </span>
              </Tooltip>
            </Box>
          </Box>
        </StyledDialogActions>
      </form>
    </StyledDialog>
  );
};

export default DialogForm;
