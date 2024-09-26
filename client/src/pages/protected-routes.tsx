import { useAuth } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

export function ProtectedRoutes() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" replace />;
}
