import React from "react";
import StudentViewComponent from "../Components/StudentViewComponent";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import QuestionViewComponent from "../Components/QuestionViewComponent";

function ExamDetails() {
  const location = useLocation();
  const { examData } = location.state || {};
  return (
    <>
      <Typography variant='h4' component='h2' align='center' gutterBottom>
        {examData?.title}
      </Typography>
      <StudentViewComponent students={examData?.enrolledStudents} />
      <QuestionViewComponent questions={examData?.questions} />
    </>
  );
}

export default ExamDetails;
