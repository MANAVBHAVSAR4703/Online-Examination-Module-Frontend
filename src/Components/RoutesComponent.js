import SignIn from "../Pages/SignIn.js";
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchUserDetails } from "../Utils/UserApi.js";
import { setUser } from "../reducers/authSlice.js";
import { useDispatch } from "react-redux";
function RoutesComponent() {
    const dispatch = useDispatch();
  
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const user = await fetchUserDetails();
          dispatch(setUser(user));
        } catch (error) {
          // const errorMessage = error?.message || error?.response?.data?.message;
          // if (errorMessage === "JWT token not found in cookie") {
          //   redirect('/')
          // } else {
          //   console.error("Error fetching user data:", errorMessage);
          // }
          console.error(error);
        }
      };
  
      fetchUserData();
    }, [dispatch]);
    return (
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    );
  }
  
  export default RoutesComponent;
  