import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export function ProtectedRoutes() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {}, [isAuthenticated]); // Checks if isAuthenticated changes after sign-in POST request

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" replace />;
}
