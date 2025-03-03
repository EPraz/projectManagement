import {
  createTheme,
  type PaletteMode,
  type ThemeOptions,
  Theme,
} from "@mui/material";
import {
  type Components,
  ComponentsProps,
  ComponentsOverrides,
  ComponentsVariants,
} from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    sidebar: {
      background: string;
      hover: string;
      active: string;
      text: string;
      textSecondary: string;
      border: string;
    };
  }
  interface PaletteOptions {
    sidebar?: {
      background: string;
      hover: string;
      active: string;
      text: string;
      textSecondary: string;
      border: string;
    };
  }
}

const getDesignTokens = (mode: PaletteMode): ThemeOptions => {
  const components: Components<Omit<Theme, "components">> = {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 500,
          padding: "8px 16px",
        }),
        contained: ({ theme }: { theme: Theme }) => ({
          backgroundColor:
            theme.palette.mode === "light" ? "#FFFFFF" : "#1E2A2A",
          color: theme.palette.mode === "light" ? "#1F2937" : "#FFFFFF",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "light" ? "#F9FAFB" : "#2A3A3A",
          },
        }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }: { theme: Theme }) => ({
          backgroundColor:
            theme.palette.mode === "light" ? "#FFFFFF" : "#0F1A1A",
          color: theme.palette.mode === "light" ? "#1F2937" : "#FFFFFF",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
              : "0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.2)",
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          backgroundColor:
            theme.palette.mode === "light" ? "#FFFFFF" : "#0F1A1A",
          borderRadius: "12px",
          boxShadow:
            theme.palette.mode === "light"
              ? "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
              : "0 1px 3px 0 rgb(0 0 0 / 0.2), 0 1px 2px -1px rgb(0 0 0 / 0.2)",
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          backgroundColor:
            theme.palette.mode === "light" ? "#FFFFFF" : "#0F1A1A",
          backgroundImage: "none",
        }),
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          borderColor:
            theme.palette.mode === "light"
              ? "#E5E7EB"
              : "rgba(255, 255, 255, 0.1)",
        }),
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          borderRadius: "8px",
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "light"
                ? "rgba(0, 0, 0, 0.04)"
                : "rgba(255, 255, 255, 0.08)",
          },
          "&.Mui-selected": {
            backgroundColor:
              theme.palette.mode === "light"
                ? "rgba(0, 0, 0, 0.08)"
                : "rgba(255, 255, 255, 0.12)",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "light"
                  ? "rgba(0, 0, 0, 0.12)"
                  : "rgba(255, 255, 255, 0.16)",
            },
          },
        }),
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          borderBottom: `1px solid ${
            theme.palette.mode === "light"
              ? "#E5E7EB"
              : "rgba(255, 255, 255, 0.1)"
          }`,
        }),
        indicator: {
          backgroundColor: "#1E8E3E",
          height: 3,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }: { theme: Theme }) => ({
          textTransform: "none",
          fontWeight: 500,
          color: theme.palette.mode === "light" ? "#6B7280" : "#9CA3AF",
          "&.Mui-selected": {
            color: theme.palette.mode === "light" ? "#1F2937" : "#FFFFFF",
          },
        }),
      },
    },
  };

  return {
    palette: {
      mode,
      primary: {
        main: "#1E8E3E",
        dark: "#167F30",
        light: "#2EA350",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: "#1A73E8",
        dark: "#1557B0",
        light: "#4285F4",
        contrastText: "#FFFFFF",
      },
      background: {
        default: mode === "light" ? "#F9FAFB" : "#0A1014",
        paper: mode === "light" ? "#FFFFFF" : "#0F1A1A",
      },
      text: {
        primary: mode === "light" ? "#1F2937" : "#FFFFFF",
        secondary: mode === "light" ? "#6B7280" : "#9CA3AF",
      },
      divider: mode === "light" ? "#E5E7EB" : "rgba(255, 255, 255, 0.1)",
      sidebar: {
        background: mode === "light" ? "#0F1A1A" : "#fff",
        hover:
          mode === "light"
            ? "rgba(0, 0, 0, 0.04)"
            : "rgba(255, 255, 255, 0.08)",
        active:
          mode === "light"
            ? "rgba(0, 0, 0, 0.08)"
            : "rgba(255, 255, 255, 0.12)",
        text: mode === "light" ? "#fff" : "#1F2937",
        textSecondary: mode === "light" ? "#6B7280" : "#9CA3AF",
        border: mode === "light" ? "#E5E7EB" : "rgba(255, 255, 255, 0.1)",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 600,
        fontSize: "1.875rem",
      },
      h2: {
        fontWeight: 600,
        fontSize: "1.5rem",
      },
      h3: {
        fontWeight: 600,
        fontSize: "1.25rem",
      },
      h4: {
        fontWeight: 600,
        fontSize: "1.125rem",
      },
      h5: {
        fontWeight: 600,
        fontSize: "1rem",
      },
      h6: {
        fontWeight: 600,
        fontSize: "0.875rem",
      },
      subtitle1: {
        fontSize: "1rem",
        fontWeight: 500,
      },
      subtitle2: {
        fontSize: "0.875rem",
        fontWeight: 500,
      },
      body1: {
        fontSize: "1rem",
      },
      body2: {
        fontSize: "0.875rem",
      },
      button: {
        fontWeight: 500,
      },
      caption: {
        fontSize: "0.75rem",
      },
      overline: {
        fontSize: "0.75rem",
        textTransform: "uppercase",
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components,
  };
};

export const createAppTheme = (mode: PaletteMode) =>
  createTheme(getDesignTokens(mode));
