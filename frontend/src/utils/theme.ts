import { createTheme, type PaletteMode } from "@mui/material";
import { studioPalette } from "./studioPalette";
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

export const createAppTheme = (mode: PaletteMode) => {
  const c = studioPalette[mode];
  return createTheme({
    palette: {
      mode,
      primary: { main: c.blue, contrastText: c.onBlue, light: c.tint },
      secondary: {
        main: c.green,
        contrastText: mode === "light" ? "#fff" : "#17271d",
      },
      success: { main: c.green, light: c.greenTint },
      error: { main: c.red, light: c.redTint },
      warning: { main: c.amber, light: c.amberTint },
      info: { main: c.blue, light: c.tint },
      background: { default: c.background, paper: c.paper },
      text: { primary: c.ink, secondary: c.muted },
      divider: c.line,
      sidebar: {
        background: mode === "light" ? "#141d20" : "#101111",
        hover: "#283237",
        active: "#303b41",
        text: "#f2f2ef",
        textSecondary: "#bcbcb8",
        border: "#444440",
      },
      roleColors: {
        ADMIN: c.blue,
        PROJECT_MANAGER: c.green,
        PRODUCT_OWNER: c.amber,
        BUSINESS_ANALYST: c.green,
        DEVELOPER: c.blue,
        QUALITY_ASSURANCE: c.amber,
        default: c.muted,
      },
    },
    typography: {
      fontFamily: '"IBM Plex Sans", sans-serif',
      h1: {
        fontSize: "clamp(2.125rem, 3vw, 2.75rem)",
        fontWeight: 600,
        lineHeight: 1.15,
        letterSpacing: "-.035em",
      },
      h2: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.3 },
      h3: { fontSize: "1.25rem", fontWeight: 600 },
      h4: { fontSize: "1.125rem", fontWeight: 600 },
      h5: { fontSize: "1rem", fontWeight: 600 },
      h6: { fontSize: "1rem", fontWeight: 600 },
      body1: { fontSize: "1rem", lineHeight: 1.6 },
      body2: { fontSize: ".875rem", lineHeight: 1.6 },
      caption: { fontSize: ".8125rem", lineHeight: 1.5 },
      overline: {
        fontSize: ".6875rem",
        letterSpacing: ".16em",
        fontWeight: 500,
      },
      button: { fontSize: ".875rem", fontWeight: 500, textTransform: "none" },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          ":root": { "--studio-focus": c.blue, colorScheme: mode },
          body: { backgroundColor: c.background },
          "@media (prefers-reduced-motion: reduce)": {
            "*, *::before, *::after": {
              animationDuration: ".01ms !important",
              transitionDuration: ".01ms !important",
            },
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            minHeight: 44,
            borderRadius: 7,
            padding: "9px 16px",
            textTransform: "none",
          },
          outlined: { borderColor: c.control },
        },
      },
      MuiIconButton: {
        styleOverrides: { root: { minWidth: 44, minHeight: 44 } },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: { backgroundImage: "none" },
          outlined: { borderColor: c.line },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${c.line}`,
            borderRadius: 12,
            boxShadow: "0 2px 4px rgb(0 0 0 / .025)",
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: { backgroundColor: c.paper, minHeight: 44 },
          notchedOutline: { borderColor: c.control },
          input: { fontSize: "1rem" },
        },
      },
      MuiInputLabel: { styleOverrides: { root: { color: c.muted } } },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: c.line, fontSize: ".875rem" },
          head: { backgroundColor: c.soft, fontWeight: 500, color: c.muted },
        },
      },
      MuiTab: {
        styleOverrides: { root: { textTransform: "none", minHeight: 44 } },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            border: `1px solid ${c.line}`,
            backgroundImage: "none",
            borderRadius: 12,
          },
        },
      },
      MuiDialogActions: {
        styleOverrides: {
          root: {
            padding: 16,
            gap: 8,
            borderTop: `1px solid ${c.line}`,
            flexWrap: "wrap",
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: { root: { minHeight: 44, whiteSpace: "normal" } },
      },
      MuiChip: { styleOverrides: { root: { borderRadius: 5 } } },
      MuiLinearProgress: {
        styleOverrides: { root: { borderRadius: 4, backgroundColor: c.line } },
      },
      MuiAlert: {
        styleOverrides: {
          root: { border: `1px solid ${c.line}`, alignItems: "center" },
        },
      },
    },
  });
};
