import React, { useState } from "react";
import { IconButton, Switch, Typography, Box, Tooltip } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import type { StatusConfigProps, TaskStatus } from "../../types";
import { useSnackbar } from "../../context";
import { formatStatusName } from "../../helpers";
import {
  MenuHeader,
  StatusDot,
  StyledMenu,
  StyledMenuItem,
} from "./StatusConfig.styles";

const StatusConfig: React.FC<StatusConfigProps> = ({
  selectedStatuses,
  setSelectedStatuses,
  items,
}) => {
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
        showSnackbarMessage("You cannot disable all statuses at once", "info");
      }
    }
  };

  return (
    <>
      <Tooltip title="Configure Columns" arrow>
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          size="small"
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1,
            border: "1px solid",
            borderColor: "divider",
            "&:hover": {
              borderColor: "primary.main",
              backgroundColor: "transparent",
            },
          }}
        >
          <SettingsIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>

      <StyledMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuHeader>
          <Typography variant="subtitle2">Column Visibility</Typography>
        </MenuHeader>

        {items &&
          items
            .slice()
            .sort((a: TaskStatus, b: TaskStatus) => a.position - b.position)
            .map((status) => (
              <StyledMenuItem
                key={status.id}
                onClick={(e) => {
                  e.preventDefault();
                  toggleStatus(status);
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <StatusDot color={status.color || "#9E9E9E"} />
                  <Typography variant="body2">
                    {formatStatusName(status.name)}
                  </Typography>
                </Box>
                <Switch
                  size="small"
                  checked={selectedStatuses?.some((s) => s.id === status.id)}
                  onChange={() => toggleStatus(status)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "primary.main",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "primary.main",
                    },
                  }}
                />
              </StyledMenuItem>
            ))}
      </StyledMenu>
    </>
  );
};

export default StatusConfig;
