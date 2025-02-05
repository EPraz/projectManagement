import { ThemeProvider, CssBaseline } from "@mui/material";
import AppRoutes from "./routes";
import theme from "./utils/theme";
import { SprintProvider } from "./context";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SprintProvider>
        <CssBaseline />
        <AppRoutes />
      </SprintProvider>
    </ThemeProvider>
  );
}

export default App;
