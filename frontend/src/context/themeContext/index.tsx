import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { PaletteMode } from "@mui/material";
import type { ThemeContextProps } from "../../types";

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);
const systemMode = (): PaletteMode =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
const readPreference = () => {
  const savedMode = localStorage.getItem("theme-mode");
  const system = localStorage.getItem("theme-system-preference") === "true";
  const mode: PaletteMode = system
    ? systemMode()
    : savedMode === "dark" || savedMode === "light"
      ? savedMode
      : "light";
  return { mode, system };
};
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [initial] = useState(readPreference);
  const [mode, setMode] = useState<PaletteMode>(initial.mode);
  const [systemPreference, setSystemPreference] = useState(initial.system);
  useEffect(() => {
    if (!systemPreference) return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setMode(media.matches ? "dark" : "light");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [systemPreference]);
  const handleSetMode = useCallback((value: PaletteMode) => {
    setMode(value);
    setSystemPreference(false);
    localStorage.setItem("theme-mode", value);
    localStorage.setItem("theme-system-preference", "false");
  }, []);
  const handleSetSystemPreference = useCallback(
    (value: boolean) => {
      setSystemPreference(value);
      localStorage.setItem("theme-system-preference", String(value));
      if (value) setMode(systemMode());
      else localStorage.setItem("theme-mode", mode);
    },
    [mode],
  );
  const value = useMemo(
    () => ({
      mode,
      setMode: handleSetMode,
      systemPreference,
      setSystemPreference: handleSetSystemPreference,
    }),
    [mode, handleSetMode, systemPreference, handleSetSystemPreference],
  );
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
export const useTheme = () => {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used within a ThemeProvider");
  return value;
};
