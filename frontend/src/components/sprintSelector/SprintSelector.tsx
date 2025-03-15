import { memo } from "react";
import { Autocomplete, ListItemIcon } from "@mui/material";
import { LayoutContextProps } from "../../types";
import { useOutletContext } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import {
  DeleteButton,
  SelectorContainer,
  SprintIcon,
  SprintMenuItem,
  SprintNameContainer,
  StyledTextField,
} from "./SprintSelector.styles";

const SprintSelector = () => {
  const {
    loadingDeleteSprint,
    handleChangeSprint,
    listOfSprints,
    setSelectedSprint,
    setOpenCreateSprintDialog,
    setOpenDeleteSprintDialog,
    sprint,
  } = useOutletContext<LayoutContextProps>();

  return (
    <SelectorContainer>
      <SprintIcon />
      <Autocomplete
        value={sprint ? sprint : undefined}
        onChange={(_, newValue) => {
          if (newValue && newValue.id !== "new") {
            handleChangeSprint(newValue.id);
          }
        }}
        // onChange={(_, newValue) => handleChangeSprint(newValue.id)}
        options={[...(listOfSprints || []), { id: "new", name: "New Sprint" }]}
        getOptionLabel={(option) => option?.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        disableClearable
        disabled={!listOfSprints?.length}
        renderInput={(params) => (
          <StyledTextField
            {...params}
            placeholder={
              listOfSprints?.length ? "Select Sprint" : "No Sprints Available"
            }
            size="small"
          />
        )}
        renderOption={(props, option) => {
          if (option.id === "new") {
            return (
              <SprintMenuItem
                {...props}
                key={option.id}
                className="new-sprint"
                onClick={(e) => {
                  e.stopPropagation(); // Evita seleccionar la opción de "New Sprint"
                  setOpenCreateSprintDialog(true);
                }}
              >
                <ListItemIcon>
                  <AddIcon sx={{ fontSize: 18 }} />
                </ListItemIcon>
                New Sprint
              </SprintMenuItem>
            );
          }

          return (
            <SprintMenuItem {...props} key={`${option.id}_${option.name}`}>
              <SprintNameContainer>{option.name}</SprintNameContainer>
              {"projectId" in option && (
                <DeleteButton
                  size="small"
                  data-testid={"delete-button"}
                  onClick={(e) => {
                    e.stopPropagation(); // Evita cerrar el Autocomplete al eliminar un sprint
                    setSelectedSprint(option);
                    setOpenDeleteSprintDialog(true);
                  }}
                  disabled={loadingDeleteSprint}
                >
                  <DeleteIcon fontSize="small" color="error" />
                </DeleteButton>
              )}
            </SprintMenuItem>
          );
        }}
        sx={{
          width: 200,
          "& .MuiOutlinedInput-root": {
            height: 32,
            fontSize: "0.875rem",
            backgroundColor: "transparent",
            "& fieldset": {
              border: "none",
            },
            "&:hover fieldset": {
              border: "none",
            },
            "&.Mui-focused fieldset": {
              border: "none",
            },
            "& .MuiOutlinedInput-input": {
              padding: 1,
            },
          },
          "& .MuiAutocomplete-endAdornment": {
            display: "none",
          },
        }}
        slotProps={{
          paper: {
            elevation: 4,
            sx: {
              mt: 0.5,
              "& .MuiAutocomplete-listbox": {
                p: 0.5,
                "& .MuiAutocomplete-option": {
                  p: 0,
                },
              },
            },
          },
        }}
      />
    </SelectorContainer>
  );
};

export default memo(SprintSelector);
