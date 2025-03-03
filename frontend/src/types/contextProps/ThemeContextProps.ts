import { PaletteMode } from "@mui/material";

export interface ThemeContextProps {
  mode: PaletteMode;
  setMode: (mode: PaletteMode) => void;
  systemPreference: boolean;
  setSystemPreference: (useSystem: boolean) => void;
}
