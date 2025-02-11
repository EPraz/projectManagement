import { ThemeProvider, CssBaseline } from "@mui/material";
import AppRoutes from "./routes";
import theme from "./utils/theme";
import { ApiProvider, ProjectProvider, SprintProvider } from "./context";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ApiProvider>
        <ProjectProvider>
          <SprintProvider>
            <CssBaseline />
            <AppRoutes />
          </SprintProvider>
        </ProjectProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}

export default App;
