import { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  Check,
  DarkModeOutlined,
  LightModeOutlined,
  LogoutOutlined,
  SettingsBrightnessOutlined,
} from "@mui/icons-material";
import { useAuth } from "../../../context/authContext";
import { useTheme } from "../../../context/themeContext";
import { getInitials } from "../../../helpers";
export default function UserMenu({ rail = false }: { rail?: boolean }) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [error, setError] = useState("");
  const { user, logout, closing } = useAuth();
  const { mode, setMode, systemPreference, setSystemPreference } = useTheme();
  const close = () => setAnchor(null);
  const leave = async () => {
    setError("");
    try {
      await logout();
      close();
    } catch {
      setError("Could not sign out. Please try again.");
    }
  };
  return (
    <>
      <IconButton
        aria-label="Open user menu"
        aria-controls={anchor ? "user-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={anchor ? "true" : undefined}
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Avatar
          sx={{
            width: 28,
            height: 28,
            bgcolor: "primary.light",
            color: "primary.main",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {getInitials(user?.name)}
        </Avatar>
      </IconButton>
      <Menu
        id="user-menu"
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={
          rail
            ? { vertical: "bottom", horizontal: "left" }
            : { vertical: "top", horizontal: "right" }
        }
        slotProps={{
          paper: {
            sx: {
              width: 290,
              maxWidth: "calc(100vw - 24px)",
              mt: 1,
              border: "1px solid",
              borderColor: "divider",
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography fontWeight={600}>
            {user?.name || "Demo visitor"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Shared demo workspace
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Changes are visible to other visitors. Please use fictional
            information.
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => setMode(mode === "light" ? "dark" : "light")}>
          <ListItemIcon>
            {mode === "light" ? (
              <DarkModeOutlined fontSize="small" />
            ) : (
              <LightModeOutlined fontSize="small" />
            )}
          </ListItemIcon>
          Switch to {mode === "light" ? "dark" : "light"} theme
        </MenuItem>
        <MenuItem
          role="menuitemcheckbox"
          aria-checked={systemPreference}
          onClick={() => setSystemPreference(!systemPreference)}
        >
          <ListItemIcon>
            <SettingsBrightnessOutlined fontSize="small" />
          </ListItemIcon>
          Follow system appearance
          {systemPreference && <Check fontSize="small" sx={{ ml: "auto" }} />}
        </MenuItem>
        <Divider />
        {error && (
          <Typography role="alert" color="error" sx={{ px: 2 }}>
            {error}
          </Typography>
        )}
        <MenuItem
          onClick={leave}
          disabled={closing}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <LogoutOutlined fontSize="small" color="error" />
          </ListItemIcon>
          {closing ? "Signing out…" : "Logout"}
        </MenuItem>
      </Menu>
    </>
  );
}
