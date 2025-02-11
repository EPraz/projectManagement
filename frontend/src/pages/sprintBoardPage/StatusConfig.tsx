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

interface StatusConfigProps {
  selectedStatuses: TaskStatus[];
  setSelectedStatuses: (statuses: TaskStatus[]) => void;
}

const StatusConfig = ({
  selectedStatuses,
  setSelectedStatuses,
}: StatusConfigProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const toggleStatus = (status: TaskStatus) => {
    setSelectedStatuses(
      selectedStatuses.includes(status)
        ? selectedStatuses.filter((s) => s.id !== status.id)
        : [...selectedStatuses, status]
    );
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
        {selectedStatuses.map((status) => (
          <MenuItem key={status.id}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedStatuses.includes(status)}
                  onChange={() => toggleStatus(status)}
                />
              }
              label={status.name}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default StatusConfig;
