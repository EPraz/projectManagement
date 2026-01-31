import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context";
import Loading from "../loading/Loading";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  // return user ? <Outlet /> : <Navigate to="/auth/login" replace />;
  return user ? <Outlet /> : <Navigate to="/auth/instantLogin" replace />;
};

export default PrivateRoute;
