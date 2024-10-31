import { alpha, Box, Stack } from "@mui/material";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppNavbar from "../Components/DashboardComponents/AppNavbar";
import SideMenu from "../Components/DashboardComponents/SideMenu";
import Header from "../Components/DashboardComponents/Header";
import MainGrid from "../Components/DashboardComponents/MainGrid";
import ViewStudents from "./ViewStudents";
import NoPage from "./NoPage";
import CreateStudent from "./CreateStudent";
import CreateExam from "./CreateExam";
import AddQuestion from "./AddQuestion";
import ViewExams from "./ViewExams";
import ExamDetails from "./ExamDetails";
import ViewQuestions from "./ViewQuestions";

function AdminDashboard({ user }) {
  return (
    <Box sx={{ display: "flex" }}>
      <SideMenu user={user} />
      <AppNavbar />
      {/* Main content */}
      <Box
        component='main'
        sx={(theme) => ({
          flexGrow: 1,
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          overflow: "auto",
        })}>
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}>
          <Header />
          <Routes>
            <Route exact path='/' element={<MainGrid />} />
            <Route exact path='/create-student' element={<CreateStudent />} />
            <Route exact path='/create-exam' element={<CreateExam />} />
            <Route exact path='/add-question' element={<AddQuestion />} />
            <Route exact path='/view-students' element={<ViewStudents />} />
            <Route exact path='/view-exams' element={<ViewExams />} />
            <Route
              exact
              path='/view-exams/:exam-title'
              element={<ExamDetails />}
            />
            <Route exact path='/view-questions' element={<ViewQuestions />} />
            <Route exact path='/403' element={<NoPage />} />
          </Routes>
        </Stack>
      </Box>
    </Box>
  );
}

export default AdminDashboard;
