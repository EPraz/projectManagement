import { CssBaseline } from "@mui/material";
import AppRoutes from "./routes";
import {
  ApiProvider,
  SnackbarProvider,
  ThemeProvider,
  useTheme,
} from "./context";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { createAppTheme } from "./utils";

function App() {
  return (
    <ThemeProvider>
      <MuiTheme />
    </ThemeProvider>
  );
}

function MuiTheme() {
  const { mode } = useTheme();
  const theme = createAppTheme(mode);

  return (
    <MuiThemeProvider theme={theme}>
      <StyledComponentsThemeProvider theme={theme}>
        <SnackbarProvider>
          <ApiProvider>
            <CssBaseline />
            <AppRoutes />
          </ApiProvider>
        </SnackbarProvider>
      </StyledComponentsThemeProvider>
    </MuiThemeProvider>
  );
}

export default App;
