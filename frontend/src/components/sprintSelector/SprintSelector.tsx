import { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useSprint } from "../../context";
import { sprintSchema } from "../../validations";
import { useCreateSprint } from "../../hooks";
import DialogForm from "../dialogForm/DialogForm";
import { Sprint } from "../../types";
import { useParams } from "react-router-dom";

const SprintSelector = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { sprint, setSprint, listOfSprints } = useSprint();
  const { createSprint, loading: loadingCreateSprint } = useCreateSprint();
  const [openDialog, setOpenDialog] = useState(false);

  const handleCreateSprint = async (data: Partial<Sprint>) => {
    console.log("he");
    const newSprint = await createSprint({ ...data, projectId: projectId });
    if (newSprint) {
      setSprint(newSprint);
      setOpenDialog(false);
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
      <Typography variant="h6" sx={{ marginRight: 2 }}>
        Active Sprint:
      </Typography>
      <Autocomplete
        value={sprint ? sprint : undefined}
        onChange={(_, newValue) => newValue && setSprint(newValue)}
        options={listOfSprints || []}
        getOptionLabel={(option) => option?.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        disableClearable
        renderInput={(params) => (
          <TextField {...params} label="Select Sprint" />
        )}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.name}
          </li>
        )}
        slotProps={{
          paper: {
            sx: {
              "& .MuiAutocomplete-listbox": {
                "& .MuiAutocomplete-option": {
                  maxHeight: "200px", // ✅ Permite mostrar hasta 6 elementos con scroll
                  overflowY: "auto",
                },
              },
            },
          },
        }}
        // ListboxProps={{
        //   style: {
        //     maxHeight: "200px", // ✅ Permite mostrar hasta 6 elementos con scroll
        //     overflowY: "auto",
        //   },
        // }}
        sx={{ width: 250, backgroundColor: "white" }}
        popupIcon={null} // ❌ Oculta el icono de dropdown para un diseño más limpio
      />
      <Button
        variant="contained"
        sx={{ marginLeft: 2 }}
        onClick={() => setOpenDialog(true)}
      >
        Add New Sprint
      </Button>

      {/* 🔹 DialogForm para crear Sprint */}
      {openDialog && (
        <DialogForm
          open={openDialog}
          title="Create Sprint"
          onClose={() => setOpenDialog(false)}
          onSubmit={handleCreateSprint}
          schema={sprintSchema}
          disabled={loadingCreateSprint}
          defaultValues={{ name: "", startDate: null, endDate: null }}
        />
      )}
    </Box>
  );
};

export default SprintSelector;
