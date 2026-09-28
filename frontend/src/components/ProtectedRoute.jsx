import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/api";

function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: {
            pathname: location.pathname,
            search: location.search,
          },
        }}
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;