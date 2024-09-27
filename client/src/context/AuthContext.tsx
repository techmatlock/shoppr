import React, { createContext, useState, useContext, useEffect } from "react";
import { authKey } from "../lib/data";

interface AuthContextValue {
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localStorageToken = localStorage.getItem(authKey);
    setIsAuthenticated(!!localStorageToken);
    setLoading(false);
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
