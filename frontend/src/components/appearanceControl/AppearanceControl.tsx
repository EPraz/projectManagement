import { IconButton, Tooltip } from "@mui/material";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { useTheme } from "../../context/themeContext";
export default function AppearanceControl() {
  const { mode, setMode } = useTheme();
  const label =
    mode === "dark" ? "Switch to light theme" : "Switch to dark theme";
  return (
    <Tooltip title={label}>
      <IconButton
        aria-label={label}
        onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        {mode === "dark" ? (
          <LightModeOutlined fontSize="small" />
        ) : (
          <DarkModeOutlined fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
}
