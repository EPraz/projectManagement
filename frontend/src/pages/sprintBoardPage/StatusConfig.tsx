import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { TASK_STATUSES } from "../../constants";

interface StatusConfigProps {
  selectedStatuses: string[];
  setSelectedStatuses: (statuses: string[]) => void;
}

const StatusConfig = ({
  selectedStatuses,
  setSelectedStatuses,
}: StatusConfigProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const toggleStatus = (status: string) => {
    setSelectedStatuses(
      selectedStatuses.includes(status)
        ? selectedStatuses.filter((s) => s !== status)
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
        {TASK_STATUSES.map((status) => (
          <MenuItem key={status}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedStatuses.includes(status)}
                  onChange={() => toggleStatus(status)}
                />
              }
              label={status}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default StatusConfig;
