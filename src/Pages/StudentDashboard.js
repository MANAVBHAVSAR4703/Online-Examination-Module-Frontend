import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import ExamDetails from "../Components/StudentExamDetails";
import NoPage from "./NoPage";
import { useNavigate } from "react-router-dom";
import StudentExamsView from "../Components/StudentExamsView";
import ExamPage from "./ExamPage";
import ColorModeSelect from "../Theme/ColorModeSelect";
import Profile from "./Profile";
import { SitemarkIcon } from "../Utils/CustomIcons.js";

export default function StudentDashboard({ user }) {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Navbar */}
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='h6' sx={{ flexGrow: 1 }} align='left'>
              <span
                onClick={() => navigate("/dashboard")}
                style={{ cursor: "pointer" }}>
                {" "}
                <SitemarkIcon />
              </span>
            </Typography>
            <Button
              color='inherit'
              sx={{ mr: "20px", border: "1px solid", borderRadius: "5%" }}
              onClick={() => navigate("/dashboard/profile")}>
              {user?.fullName}
            </Button>
            <ColorModeSelect />
          </Toolbar>
        </AppBar>
        <Routes>
          <Route exact path='/' element={<StudentExamsView />} />
          <Route exact path='/profile' element={<Profile />} />
          <Route exact path='/exam-details' element={<ExamDetails />} />
          <Route exact path='/start-exam' element={<ExamPage />} />
          <Route exact path='/403' element={<NoPage />} />
        </Routes>
      </Box>
    </>
  );
}
