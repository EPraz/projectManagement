import {
  createTheme,
  type PaletteMode,
  type ThemeOptions,
  type Theme,
} from "@mui/material";
import type { Components } from "@mui/material/styles";

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
    roleColors: {
      ADMIN: string;
      PROJECT_MANAGER: string;
      PRODUCT_OWNER: string;
      BUSINESS_ANALYST: string;
      DEVELOPER: string;
      QUALITY_ASSURANCE: string;
      default: string;
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
    roleColors?: {
      ADMIN: string;
      PROJECT_MANAGER: string;
      PRODUCT_OWNER: string;
      BUSINESS_ANALYST: string;
      DEVELOPER: string;
      QUALITY_ASSURANCE: string;
      default: string;
    };
  }
}

const getDesignTokens = (mode: PaletteMode): ThemeOptions => {
  // Primary color (60%)
  const primaryColor = "#8e2de2";
  const primaryDark = "#4a00e0";
  const primaryLight = "#a44cf6";

  // Secondary color (30%)
  const secondaryColor = "#2d9cdb";
  const secondaryDark = "#1a73e8";
  const secondaryLight = "#56ccf2";

  // Accent color (10%)
  const accentColor = "#f2994a";
  const accentDark = "#f2784b";
  const accentLight = "#f2c94c";

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
          backgroundColor: primaryColor,
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: primaryDark,
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
          backgroundColor: primaryColor,
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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          boxSizing: "border-box",
          fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale",
        },
        "*": {
          boxSizing: "border-box",
        },
      },
    },
  };

  return {
    palette: {
      mode,
      primary: {
        main: primaryColor,
        dark: primaryDark,
        light: primaryLight,
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: secondaryColor,
        dark: secondaryDark,
        light: secondaryLight,
        contrastText: "#FFFFFF",
      },
      warning: {
        main: accentColor,
        dark: accentDark,
        light: accentLight,
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
      roleColors: {
        ADMIN: "#8e2de2", // Primary - Admin gets primary color
        PROJECT_MANAGER: "#2d9cdb", // Secondary - Project managers get secondary color
        PRODUCT_OWNER: "#f2994a", // Accent - Product owners get accent color
        BUSINESS_ANALYST: "#27ae60", // Green for business analysts
        DEVELOPER: "#6366f1", // Indigo for developers
        QUALITY_ASSURANCE: "#9c5700", // Brown for QA
        default: "#64748b", // Default gray
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
