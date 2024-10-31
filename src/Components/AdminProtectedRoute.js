import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";
import roles from "../Constants/Roles";

const AdminProtectedRoute = ({ children, user }) => {
  if (user?.role !== roles.Admin) {
    return <Navigate to='/403' />;
  }

  return children;
};

export default AdminProtectedRoute;
