import "styled-components";
import { Theme } from "@mui/material/styles";

// Extendemos el theme para agregar la propiedad `sidebar`
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

// Para styled-components también necesitamos extender el tema
declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
