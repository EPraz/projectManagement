import React, { useState } from "react";
import { Button, IconButton, Menu, MenuItem, Box } from "@mui/material";
import { Save, ExpandMore } from "@mui/icons-material";

const SaveActions = ({
  onSave,
  onSaveAndClose,
  disabled,
}: {
  onSave: () => void;
  onSaveAndClose: () => void;
  disabled: boolean;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.2 }}>
      <Button
        variant="outlined"
        startIcon={<Save />}
        onClick={onSaveAndClose}
        disabled={disabled}
        sx={{
          textTransform: "none",
          borderColor: "#e0e0e0",
          color: "#333",
          "&:hover": {
            borderColor: "#0078d4",
            backgroundColor: "transparent",
          },
        }}
      >
        Save and Close
      </Button>

      <IconButton
        size="small"
        onClick={handleClick}
        disabled={disabled}
        sx={{
          height: "40px",
          width: "40px",
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
          "&:hover": {
            borderColor: "#0078d4",
            backgroundColor: "transparent",
          },
        }}
      >
        <ExpandMore fontSize="small" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={onSave}
          disabled={disabled}
          sx={{
            width: "100%",
            gap: "8px",
            borderRadius: "4px",
          }}
        >
          <Save /> Save
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SaveActions;
