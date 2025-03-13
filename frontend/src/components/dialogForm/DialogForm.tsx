import { useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Tooltip,
  MenuItem,
  Select,
} from "@mui/material";
import { useForm, Controller, type Path } from "react-hook-form";
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
  StyledDialogContent,
} from "./DialogForm.styles";

const DialogForm = <T extends Record<string, any>>({
  open,
  onClose,
  onSubmit,
  onDelete,
  schema,
  defaultValues,
  title,
  disabled,
  fieldConfig = {},
}: DialogFormProps<T>) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<T>({
    resolver: yupResolver(schema) as any,
    defaultValues,
    disabled,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleClose = () => {
    onClose();
  };

  const handleDelete = () => {
    reset();
    onDelete && onDelete();
  };

  const internalSubmit = (data: T) => {
    onSubmit(data);
    handleClose();
  };

  // Función para obtener el campo correcto basado en fieldConfig
  const getFieldComponent = (key: Path<T>) => {
    const fieldOptions = fieldConfig[key];
    const label = fieldOptions?.label || key.replace(/([A-Z])/g, " $1").trim();
    const isSelectField = fieldOptions?.type === "select";
    const isDateField =
      fieldOptions?.label === "startDate" || fieldOptions?.label === "endDate";
    const fieldName = key;
    const isHidden = fieldOptions?.hidden;
    if (isHidden) return null;

    if (isDateField) {
      return (
        <FormFieldContainer key={key}>
          <FieldLabel>{label}</FieldLabel>
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              <StyledDatePicker
                value={field.value ? new Date(field.value) : null}
                onChange={(newValue) =>
                  field.onChange(newValue ? newValue.toISOString() : null)
                }
                slotProps={{
                  textField: {
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
          <FieldLabel>{label}</FieldLabel>
          <Controller
            name={fieldName}
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                fullWidth
                size="small"
                error={!!errors[fieldName]}
                disabled={disabled || fieldOptions?.disabled}
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
                {fieldOptions?.options?.map((option: any) => (
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
        <FieldLabel>{label}</FieldLabel>
        <TextField
          {...control.register(fieldName)}
          fullWidth
          error={!!errors[fieldName]}
          disabled={disabled || fieldOptions?.disabled}
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
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogHeader>
        <Typography fontWeight="600" textTransform="uppercase">
          {title}
        </Typography>
        <Tooltip title="Close" arrow>
          <CloseButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </CloseButton>
        </Tooltip>
      </DialogHeader>

      {/* Envolvemos todo en un <form> para que el submit funcione correctamente */}
      <form onSubmit={handleSubmit(internalSubmit)}>
        <StyledDialogContent>
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
              justifyContent: "space-between",
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
                    disabled={disabled}
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
                disabled={disabled}
              >
                Cancel
              </Button>
              <Tooltip title={!isDirty ? "No changes to save" : ""} arrow>
                <span>
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={disabled || !isDirty}
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
