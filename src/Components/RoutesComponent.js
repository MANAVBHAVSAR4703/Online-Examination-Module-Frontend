import SignIn from "../Pages/SignIn.js";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { fetchUserDetails } from "../Utils/UserApi.js";
import { setUser } from "../reducers/authSlice.js";
import NoPage from "../Pages/NoPage.js";
import Dashboard from "../Pages/Dashboard.js";
import ProtectedRoute from "./ProtectedRoutes.js";
import Loading from "./Loading.js";

function RoutesComponent() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await fetchUserDetails();
        dispatch(setUser(user));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch]);

  if (loading) {
    return <Loading/>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<SignIn />} />
        <Route exact path='/403' element={<NoPage />} />
        <Route exact path='/*' element={<NoPage />} />
        <Route
          path='/dashboard/*'
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default RoutesComponent;
