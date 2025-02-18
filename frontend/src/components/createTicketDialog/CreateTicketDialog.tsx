import { FC, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormControl,
  Autocomplete,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ticketSchema } from "../../validations";
import { useSprint } from "../../context";
import { useCreateSprint } from "../../hooks";
import { Ticket } from "../../types";

type CreateTicketDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Ticket>) => Promise<void>;
};
const CreateTicketDialog: FC<CreateTicketDialogProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { listOfSprints, sprint } = useSprint(); // Obtener lista de Sprints
  const { createSprint } = useCreateSprint(); // Hook para crear Sprint
  const [creatingSprint, setCreatingSprint] = useState(false);
  console.log("ree");
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      createdBy: "test@test.com",
      sprintId: sprint ? sprint.id : "", // Seleccionar Sprint actual por defecto
    },
  });

  // 🔹 Crear Sprint y Refrescar Lista
  const handleCreateSprint = async () => {
    setCreatingSprint(true);
    // await createSprint("New Sprintk"); // Nombre por defecto
    setCreatingSprint(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Create Ticket</DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          {...register("title")}
          fullWidth
          error={!!errors.title}
          helperText={errors.title?.message}
          margin="dense"
        />
        <TextField
          label="Description"
          {...register("description")}
          fullWidth
          multiline
          rows={3}
          error={!!errors.description}
          helperText={errors.description?.message}
          margin="dense"
        />

        {/* 🔹 Select de Sprint */}
        <FormControl fullWidth margin="dense">
          <Controller
            name="sprintId"
            control={control}
            disabled={!listOfSprints || listOfSprints?.length === 0}
            render={({ field }) => (
              <Autocomplete
                options={listOfSprints || []} // Lista de sprints
                getOptionLabel={(option) => option.name} // Mostrar el nombre del Sprint
                isOptionEqualToValue={(option, value) =>
                  option.id === value?.id
                }
                value={listOfSprints?.find((s) => s.id === field.value) || null} // Convierte el ID en un objeto Sprint
                onChange={(_, newValue) => field.onChange(newValue?.id || "")}
                renderInput={(params) => (
                  <TextField {...params} label="Sprint" margin="dense" />
                )}
                disabled={listOfSprints?.length === 0}
              />
            )}
          />
        </FormControl>

        {/* Botón para Crear Sprint */}
        {(!listOfSprints || listOfSprints?.length === 0) && (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleCreateSprint}
            disabled={creatingSprint}
            sx={{ mt: 2 }}
          >
            {creatingSprint ? "Creating Sprint..." : "Create a Sprint First"}
          </Button>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={!listOfSprints || listOfSprints?.length === 0}
        >
          Create Ticket
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTicketDialog;
