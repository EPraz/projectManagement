import { Menu, MenuItem, Typography } from "@mui/material";
import {
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  Work as WorkIcon,
  PowerSettingsNew as PowerIcon,
} from "@mui/icons-material";
import { TeamMembersMenuProps } from "../../../types";

const TeamMembersMenu = ({
  anchorEl,
  handleMenuClose,
  selectedMember,
}: TeamMembersMenuProps) => {
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      elevation={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem onClick={handleMenuClose} disabled>
        <EditIcon fontSize="small" sx={{ mr: 1 }} />
        <Typography>Edit Member</Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose} disabled>
        <PersonAddIcon fontSize="small" sx={{ mr: 1 }} />
        <Typography>Change Role</Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose} disabled>
        <WorkIcon fontSize="small" sx={{ mr: 1 }} />
        <Typography>Manage Projects</Typography>
      </MenuItem>
      <MenuItem
        onClick={handleMenuClose}
        sx={{
          color: selectedMember && "success.main",
        }}
        disabled
      >
        <PowerIcon fontSize="small" sx={{ mr: 1 }} />
        <Typography>{selectedMember && "Activate"}</Typography>
      </MenuItem>
    </Menu>
  );
};

export default TeamMembersMenu;
