import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  Button,
  ListItemText,
} from "@mui/material";

export default function ExamDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExamStarted, setIsExamStarted] = useState(false);
  const exam = location.state?.exam;

  useEffect(() => {
    const checkExamStart = () => {
      const currentTime = Date.now();
      const examStartTime = new Date(exam.startTime).getTime();
      setIsExamStarted(currentTime >= examStartTime);
    };

    checkExamStart();

    const intervalId = setInterval(checkExamStart, 1000);

    return () => clearInterval(intervalId);
  }, [exam.startTime]);

  if (!exam) {
    return <Typography>No exam data available.</Typography>;
  }

  const instructions = [
    "The examination will comprise of Objective type Multiple Choice Questions (MCQs).",
    "All questions are compulsory and each carries One mark.",
    "The total number of questions, duration of examination, will be different based on the course; the detail is available on your screen.",
    "The Subjects or topics covered in the exam will be as per the Syllabus.",
    "There will be NO NEGATIVE MARKING for the wrong answers.",
    "The examination does not require using any paper, pen, pencil, and calculator.",
    "Every student will take the examination on a Laptop/Desktop/Smart Phone.",
    "On the computer screen, every student will be given objective type Multiple Choice Questions (MCQs).",
    "Each student will get questions and answers in different order selected randomly from a fixed Question Databank.",
    "The students just need to click on the Right Choice / Correct option from the multiple choices/options given with each question. For Multiple Choice Questions, each question has four options, and the candidate has to click the appropriate option.",
  ];

  return (
    <>
      <Box
        sx={{
          p: 3,
          width: "100%",
          display: "flex",
          justifyContent: "flex-start",
          flexDirection: "column",
        }}>
        <Box sx={{ display: "flex" }}>
          <Typography variant='h4' gutterBottom width={"90%"} paddingLeft={17}>
            <b>{exam.title.toUpperCase()}</b>
          </Typography>
          <Button
            variant='contained'
            disabled={!isExamStarted}
            onClick={() =>
              navigate("/dashboard/start-exam", { state: { exam } })
            }
            sx={{ mb: 2 }}>
            Start Exam
          </Button>
        </Box>
        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Typography variant='h6' py={2}>
            Details
          </Typography>
          <Typography variant='subtitle1'>
            Start Time: <b>{new Date(exam.startTime).toLocaleString()}</b>
          </Typography>
          <Typography variant='subtitle1'>
            Duration: <b>{exam.duration} minutes</b>
          </Typography>
          <Typography variant='subtitle1'>
            Passing Criteria: <b>{exam.passingCriteria}%</b>
          </Typography>
          <Typography variant='subtitle1'>
            Status: <b>{exam.completed ? "Completed" : "Pending"}</b>
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
          <Typography variant='h6' py={2}>
            Instructions
          </Typography>
          <List>
            {instructions.map((instruction, index) => (
              <ListItem key={index}>
                <ListItemText primary={`${index + 1}) ${instruction}`} />
              </ListItem>
            ))}
          </List>
        </Paper>

        <Button variant='outlined' onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          Back to Exams
        </Button>
      </Box>
    </>
  );
}
