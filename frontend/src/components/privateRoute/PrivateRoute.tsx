import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import Loading from "../loading/Loading";
import { Alert, Box, Button } from "@mui/material";

const PrivateRoute = () => {
  const { user, loading, restoring, closing, sessionError, retrySession } =
    useAuth();

  if (loading) {
    return <Loading />;
  }

  const recovery = sessionError && (
    <Alert
      severity="error"
      action={
        <Button
          color="inherit"
          disabled={restoring || closing}
          onClick={() => {
            void retrySession();
          }}
        >
          Retry session
        </Button>
      }
    >
      {sessionError}
    </Alert>
  );
  if (user)
    return (
      <>
        {recovery}
        <Outlet />
      </>
    );
  if (sessionError)
    return (
      <Box sx={{ p: 3, maxWidth: 640, mx: "auto", mt: 8 }}>{recovery}</Box>
    );
  return <Navigate to="/auth/instantLogin" replace />;
};

export default PrivateRoute;
