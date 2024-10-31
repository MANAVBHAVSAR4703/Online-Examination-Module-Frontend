import React, { useEffect, useState } from "react";
import roles from "../Constants/Roles";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";
import AdminProtectedRoute from "../Components/AdminProtectedRoute";
import StudentProtectedRoute from "../Components/StudentProtectedRoute";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loading from "../Components/Loading";

function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user !== undefined) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <Loading/>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to='/' />;
  }

  if (user?.role === roles.Admin) {
    return (
      <AdminProtectedRoute user={user}>
        <AdminDashboard user={user} />
      </AdminProtectedRoute>
    );
  }

  if (user?.role === roles.Student) {
    return (
      <StudentProtectedRoute user={user}>
        <StudentDashboard user={user} />
      </StudentProtectedRoute>
    );
  }

  return <Navigate to='/403' />;
}

export default Dashboard;
