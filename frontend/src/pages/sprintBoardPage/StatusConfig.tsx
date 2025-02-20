import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { TaskStatus } from "../../types";
import { useSnackbar } from "../../context";
import { formatStatusName } from "../../helpers";

interface StatusConfigProps {
  selectedStatuses: TaskStatus[] | undefined;
  setSelectedStatuses: (statuses: TaskStatus[]) => void;
  items: TaskStatus[] | undefined;
}

const StatusConfig = ({
  selectedStatuses,
  setSelectedStatuses,
  items,
}: StatusConfigProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { showSnackbarMessage } = useSnackbar();

  const toggleStatus = (status: TaskStatus) => {
    if (selectedStatuses) {
      const updated = selectedStatuses.some((s) => s.id === status.id)
        ? selectedStatuses.filter((s) => s.id !== status.id)
        : [...selectedStatuses, status];

      if (updated.length > 0) {
        setSelectedStatuses(updated);
      } else {
        showSnackbarMessage(
          "No puedes deshabilitar todos los Status a la vez",
          "info"
        );
      }
    }
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <SettingsIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {items &&
          items
            .slice()
            .sort((a: TaskStatus, b: TaskStatus) => a.position - b.position)
            .map((status) => (
              <MenuItem key={status.id}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedStatuses?.includes(status)}
                      onChange={() => toggleStatus(status)}
                    />
                  }
                  label={formatStatusName(status.name)}
                />
              </MenuItem>
            ))}
      </Menu>
    </>
  );
};

export default StatusConfig;
