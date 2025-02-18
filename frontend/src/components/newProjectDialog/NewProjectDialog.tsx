import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useCreateProject } from "../../hooks";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { projectSchema } from "../../validations";

type Props = {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
};

type FormData = {
  title: string;
  description?: string;
};

const NewProjectDialog: React.FC<Props> = ({ openDialog, setOpenDialog }) => {
  const { createProject, loading } = useCreateProject();

  // React Hook Form + Yup Resolver
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(projectSchema),
  });
  console.log(errors);
  const handleCreate = async (data: FormData) => {
    const newProject = await createProject(data.title, data?.description ?? "");
    if (newProject) {
      handleClose();
    }
  };

  const handleClose = () => {
    reset(); // Limpia el formulario después de crear el proyecto
    setOpenDialog(false);
    console.log(openDialog);
  };

  console.log("re");
  return (
    <Dialog open={openDialog} onClose={handleClose}>
      <DialogTitle>Create New Project</DialogTitle>
      <DialogContent>
        <TextField
          label="Project Title"
          {...register("title")}
          defaultValue={""}
          fullWidth
          error={!!errors.title}
          helperText={errors.title?.message}
          margin="dense"
        />
        <TextField
          label="Description"
          defaultValue={""}
          {...register("description")}
          fullWidth
          multiline
          rows={3}
          error={!!errors.description}
          helperText={errors.description?.message}
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit(handleCreate)} disabled={loading}>
          {loading ? "Creating..." : "Create Project"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(NewProjectDialog);
