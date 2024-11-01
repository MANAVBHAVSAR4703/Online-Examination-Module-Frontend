import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import ExamDetails from "../Components/StudentExamDetails";
import NoPage from "./NoPage";
import { useNavigate } from "react-router-dom";
import StudentExamsView from "../Components/StudentExamsView";
import ExamPage from "./ExamPage";

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
              Student Dashboard
            </Typography>
            <Button color='inherit' onClick={() => navigate("/profile")}>
              {user?.fullName}
            </Button>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route exact path='/' element={<StudentExamsView />} />
          <Route exact path='/exam-details' element={<ExamDetails />} />
          <Route exact path='/start-exam' element={<ExamPage/>}/>
          <Route exact path='/403' element={<NoPage />} />
        </Routes>
      </Box>
    </>
  );
}
