import { ThemeProvider, CssBaseline } from "@mui/material";
import AppRoutes from "./routes";
import theme from "./utils/theme";
import { ApiProvider, SprintProvider } from "./context";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ApiProvider>
        <SprintProvider>
          <CssBaseline />
          <AppRoutes />
        </SprintProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}

export default App;
