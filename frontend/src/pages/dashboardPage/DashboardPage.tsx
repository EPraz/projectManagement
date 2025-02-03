import { Container, Typography } from "@mui/material";

const DashboardPage = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Bienvenido al Dashboard
      </Typography>
      <Typography variant="body1">
        Aquí verás un resumen de tus proyectos.
      </Typography>
    </Container>
  );
};

export default DashboardPage;
