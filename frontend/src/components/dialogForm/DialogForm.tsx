import { TextField, Button, Box, Typography, Tooltip } from "@mui/material";
import { useForm, Controller, type Path } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { DialogFormProps } from "../../types";
import {
  CloseButton,
  DeleteButton,
  DialogHeader,
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
}: DialogFormProps<T>) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<T>({
    resolver: yupResolver(schema) as any,
    defaultValues,
    disabled,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDelete = () => {
    reset();
    onDelete && onDelete();
  };

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogHeader>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <Tooltip title="Close" arrow>
          <CloseButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </CloseButton>
        </Tooltip>
      </DialogHeader>

      <StyledDialogContent>
        <Box
          component="form"
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {Object.entries(defaultValues).map(([key]) => {
            const fieldName = key as Path<T>;
            const label = key
              .split(/(?=[A-Z])|_/)
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ");

            if (fieldName === "startDate" || fieldName === "endDate") {
              return (
                <Controller
                  key={key}
                  name={fieldName}
                  control={control}
                  render={({ field }) => (
                    <StyledDatePicker
                      label={label}
                      value={field.value ? new Date(field.value) : null}
                      onChange={(newValue) =>
                        field.onChange(newValue ? newValue.toISOString() : null)
                      }
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors[fieldName],
                          helperText:
                            (errors[fieldName]?.message as string) || "",
                          size: "small",
                        },
                      }}
                    />
                  )}
                />
              );
            }

            return (
              <TextField
                key={key}
                label={label}
                {...register(fieldName)}
                fullWidth
                error={!!errors[fieldName]}
                helperText={(errors[fieldName]?.message as string) || ""}
                disabled={disabled}
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                  },
                }}
              />
            );
          })}
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
                  onClick={handleSubmit(onSubmit)}
                  disabled={disabled || !isDirty}
                  sx={{
                    minWidth: 100,
                  }}
                >
                  Save
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default DialogForm;
