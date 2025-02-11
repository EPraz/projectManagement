import { CircularProgress, Box, Typography } from "@mui/material";

const Loading = ({ message = "Cargando..." }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress size={50} />
      <Typography mt={2} variant="h6" color="textSecondary">
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
