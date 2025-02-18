import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import { useForm, Controller, DefaultValues, Path } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DatePicker } from "@mui/x-date-pickers";

interface DialogFormProps<T extends Record<string, any>> {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  schema: yup.ObjectSchema<T>;
  defaultValues: DefaultValues<T>;
  title: string;
  disabled: boolean;
}

const DialogForm = <T extends Record<string, any>>({
  open,
  onClose,
  onSubmit,
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
    formState: { errors },
  } = useForm<T>({
    resolver: yupResolver(schema) as any,
    defaultValues,
    disabled,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  console.log(errors);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {Object.keys(defaultValues).map((key) => {
          const fieldName = key as Path<T>;

          if (fieldName === "startDate" || fieldName === "endDate") {
            return (
              <Controller
                key={key}
                name={fieldName}
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    value={field.value ? new Date(field.value) : null} // ✅ Usa Date en lugar de dayjs
                    onChange={(newValue) => field.onChange(newValue)}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        margin: "dense",
                        error: !!errors[fieldName],
                        helperText:
                          (errors[fieldName]?.message as string) || "",
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
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              {...register(fieldName)}
              fullWidth
              error={!!errors[fieldName]}
              helperText={(errors[fieldName]?.message as string) || ""}
              margin="dense"
              disabled={disabled}
            />
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={disabled}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(onSubmit)} disabled={disabled}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogForm;
