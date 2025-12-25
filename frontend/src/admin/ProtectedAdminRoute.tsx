import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedAdminRouteProps {
  children: React.ReactNode; // Use ReactNode instead of JSX.Element
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const isAdminLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
  return <>{isAdminLoggedIn ? children : <Navigate to="/admin-login" />}</>;
};

export default ProtectedAdminRoute;
