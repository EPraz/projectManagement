import { ThemeProvider, CssBaseline } from "@mui/material";
import AppRoutes from "./routes";
import theme from "./utils/theme";
import { ApiProvider } from "./context";
import { SnackbarProvider } from "./context/snackbarContext";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <ApiProvider>
          <CssBaseline />
          <AppRoutes />
        </ApiProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
