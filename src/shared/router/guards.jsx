// "RequireGuards.jsx"
import React from "react";
import { Navigate, useLocation } from "react-router";
import useAuthStore from "@/features/Auth/api/loginRequest";

export function RequireAuth({ children }) {
  const finishedAuth   = useAuthStore((s) => s.finishedAuth);
  const isAuthenticated = useAuthStore((s) => !!s.sessionToken);
  const location       = useLocation();

  // Пока стор не гидрирован — ничего не решаем (можно показать лоадер)
  if (!finishedAuth) return null; // или <Spinner />

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }
  return children;
}

export function RequireRole({ roles = [], children }) {
  const finishedAuth = useAuthStore((s) => s.finishedAuth);
  const userRoles    = useAuthStore((s) => s.roles) || [];

  if (!finishedAuth) return null; // или <Spinner />

  const allowed = Array.isArray(userRoles) && userRoles.some((r) => {
    if (typeof r === "string") return roles.includes(r);
    if (r && typeof r === "object") {
      return roles.includes(r.name) || roles.includes(r.authority);
    }
    return false;
  });

  if (!allowed) return <Navigate to="/403" replace />;

  return children;
}
