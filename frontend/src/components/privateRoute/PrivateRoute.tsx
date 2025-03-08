import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context";
import Loading from "../loading/Loading";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />; // O un spinner
  }

  return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
};

export default PrivateRoute;
