import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!user && !isAuthenticated) {
    return <Navigate to='/' />;
  }

  return children;
};

export default ProtectedRoute;
