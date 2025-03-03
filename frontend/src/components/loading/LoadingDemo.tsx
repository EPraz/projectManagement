import { Box, Card, Typography } from "@mui/material";
import Loading from "./Loading";

export default function LoadingDemo() {
  return (
    <Box sx={{ p: 4, display: "flex", flexDirection: "column", gap: 4 }}>
      <Typography variant="h4" gutterBottom>
        Loading States
      </Typography>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Default Loading
        </Typography>
        <Box sx={{ height: 400 }}>
          <Loading
            message="Cargando datos"
            description="Estamos procesando su solicitud"
          />
        </Box>
      </Card>

      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Minimal Loading
        </Typography>
        <Loading variant="minimal" message="Actualizando..." />
      </Card>

      <Card sx={{ p: 3, height: "100vh" }}>
        <Typography variant="h6" gutterBottom>
          Fullscreen Loading
        </Typography>
        <Loading
          variant="fullscreen"
          message="Inicializando aplicación"
          description="Esto puede tomar unos momentos"
        />
      </Card>
    </Box>
  );
}
