
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import {
  getMe,
  isAuthenticated,
  logout,
} from "../services/api";

function AdminRoute() {
  const location = useLocation();
  const [accessState, setAccessState] = useState("checking");

  useEffect(() => {
    let isMounted = true;

    async function verifyAdminAccess() {
      if (!isAuthenticated()) {
        if (isMounted) {
          setAccessState("unauthenticated");
        }
        return;
      }

      try {
        const currentUser = await getMe();

        if (isMounted) {
          setAccessState(
            currentUser?.role === "admin"
              ? "authorized"
              : "forbidden"
          );
        }
      } catch {
        logout();

        if (isMounted) {
          setAccessState("unauthenticated");
        }
      }
    }

    verifyAdminAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  if (accessState === "checking") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#faf9f7] px-5">
        <p className="text-sm text-zinc-500">
          Verifying administrator access...
        </p>
      </main>
    );
  }

  if (accessState === "unauthenticated") {
    return (
      <Navigate
        to="/admin/login"
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

  if (accessState === "forbidden") {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}

export default AdminRoute;
