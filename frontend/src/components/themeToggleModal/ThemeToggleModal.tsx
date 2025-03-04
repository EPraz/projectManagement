import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
} from "@mui/material";
import DesktopWindowsIcon from "@mui/icons-material/DesktopWindows";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useTheme } from "../../context";

interface ThemeToggleModalProps {
  open: boolean;
  onClose: () => void;
}

export const ThemeToggleModal: React.FC<ThemeToggleModalProps> = ({
  open,
  onClose,
}) => {
  const { mode, setMode, systemPreference, setSystemPreference } = useTheme();

  const handleSystemPreference = () => {
    setSystemPreference(true);
    onClose();
  };

  const handleModeChange = (newMode: "light" | "dark") => {
    setMode(newMode);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Choose theme</DialogTitle>
      <DialogContent>
        <List sx={{ pt: 0 }}>
          <ListItemButton onClick={handleSystemPreference}>
            <ListItemIcon>
              <DesktopWindowsIcon />
            </ListItemIcon>
            <ListItemText
              primary="System"
              secondary="Follow system appearance"
            />
            <Radio
              checked={systemPreference}
              onChange={handleSystemPreference}
              value="system"
              name="theme-radio"
            />
          </ListItemButton>
          <ListItemButton onClick={() => handleModeChange("light")}>
            <ListItemIcon>
              <LightModeIcon />
            </ListItemIcon>
            <ListItemText primary="Light" />
            <Radio
              checked={!systemPreference && mode === "light"}
              onChange={() => handleModeChange("light")}
              value="light"
              name="theme-radio"
            />
          </ListItemButton>
          <ListItemButton onClick={() => handleModeChange("dark")}>
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <ListItemText primary="Dark" />
            <Radio
              checked={!systemPreference && mode === "dark"}
              onChange={() => handleModeChange("dark")}
              value="dark"
              name="theme-radio"
            />
          </ListItemButton>
        </List>
      </DialogContent>
    </Dialog>
  );
};
