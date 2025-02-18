import { ThemeProvider, CssBaseline } from "@mui/material";
import AppRoutes from "./routes";
import theme from "./utils/theme";
import { ApiProvider, ProjectProvider, SprintProvider } from "./context";
import { SnackbarProvider } from "./context/snackbarContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <ApiProvider>
          <ProjectProvider>
            <SprintProvider>
              <CssBaseline />
              <AppRoutes />
            </SprintProvider>
          </ProjectProvider>
        </ApiProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
