import { ThemeProvider, CssBaseline } from "@mui/material";
import AppRoutes from "./routes";
import theme from "./utils/theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
