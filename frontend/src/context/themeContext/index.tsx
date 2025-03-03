import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { PaletteMode } from "@mui/material";
import { ThemeContextProps } from "../../types";

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>("light");
  const [systemPreference, setSystemPreference] = useState<boolean>(true);

  // 🔹 Cargar preferencias del tema desde localStorage
  useEffect(() => {
    if (typeof window === "undefined") return; // Evitar errores en SSR

    const savedMode = localStorage.getItem("theme-mode") as PaletteMode | null;
    const savedSystemPref = localStorage.getItem("theme-system-preference");

    if (savedSystemPref === "true") {
      setSystemPreference(true);
      const systemMode = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setMode(systemMode);
    } else if (savedMode) {
      setSystemPreference(false);
      setMode(savedMode);
    }
  }, []);

  // 🔹 Escuchar cambios en la preferencia del sistema
  useEffect(() => {
    if (!systemPreference) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) =>
      setMode(e.matches ? "dark" : "light");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [systemPreference]);

  // ✅ Cambiar manualmente el modo de tema
  const handleSetMode = useCallback((newMode: PaletteMode) => {
    setMode(newMode);
    localStorage.setItem("theme-mode", newMode);
    localStorage.setItem("theme-system-preference", "false");
    setSystemPreference(false);
  }, []);

  // ✅ Usar la preferencia del sistema
  const handleSetSystemPreference = useCallback((useSystem: boolean) => {
    setSystemPreference(useSystem);
    localStorage.setItem("theme-system-preference", String(useSystem));

    if (useSystem) {
      const systemMode = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setMode(systemMode);
    }
  }, []);

  // 🔹 Memorizar valores para evitar renders innecesarios
  const contextValue = useMemo(
    () => ({
      mode,
      setMode: handleSetMode,
      systemPreference,
      setSystemPreference: handleSetSystemPreference,
    }),
    [mode, handleSetMode, systemPreference, handleSetSystemPreference]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// 🔹 Hook personalizado para acceder al tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
