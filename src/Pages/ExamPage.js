import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Loading from "../Components/Loading";
import axios from "axios";
import Cookies from "js-cookie";
import api from "../Constants/Api";

const ExamPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const examID = location.state?.exam;
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState();
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchExamById = async () => {
      try {
        const response = await axios.get(api.GetExamById + `/${examID.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExam(response?.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching exam data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamById();
  }, [token, navigate, examID.id]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (exam) {
      const examStartTime = new Date(exam.startTime).getTime();
      const examDuration = exam.duration * 60 * 1000; // Convert duration to milliseconds
      const endTime = examStartTime + examDuration;
      const currentTime = Date.now();
      setTimeLeft(Math.max(0, Math.floor((endTime - currentTime) / 1000))); // Time left in seconds

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => Math.max(0, prevTime - 1)); // Decrement the timer every second
      }, 1000);

      return () => clearInterval(timer); // Cleanup the timer on unmount
    }
  }, [exam]);

  const handleOptionSelect = (optionIndex) => {
    setSelectedAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = optionIndex;
      return newAnswers;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "row", p: 3 }}>
      {/* Left Side: Questions */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography variant='h4' gutterBottom>
          {exam.title}
        </Typography>
        <Typography variant='h6'>
          Time Left: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </Typography>

        <Paper elevation={3} sx={{ p: 2, my: 3 }}>
          <Typography variant='h6'>{`Q${currentQuestionIndex + 1}: ${
            exam.questions[currentQuestionIndex].text
          }`}</Typography>
          {exam.questions[currentQuestionIndex].options.map((option, index) => (
            <Button
              key={option.id}
              variant='outlined'
              onClick={() => handleOptionSelect(index)}
              sx={{
                display: "block",
                width: "100%",
                color: selectedAnswers[currentQuestionIndex] === index
                ? "white"
                : "black",
                mb: 1,
                textAlign: "left",
                backgroundColor:
                  selectedAnswers[currentQuestionIndex] === index
                    ? "black"
                    : "white",
              }}>
              {String.fromCharCode(97 + index) + ". " + option.text}{" "}
              {/* 'a', 'b', 'c', 'd' */}
            </Button>
          ))}
        </Paper>

        <Box sx={{ padding: 5 }}>
          <Button
            sx={{ mx: 2, px: 2 ,width:"10%" }}
            variant='contained'
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}>
            Previous
          </Button>
          <Button
            sx={{ mx: 2, px: 2 ,width:"10%" }}
            variant='contained'
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === exam.questions.length - 1}>
            Next
          </Button>
        </Box>
      </Box>

      {/* Right Side: Question Numbers */}
      <Box sx={{ width: 200, p: 2 }}>
        <Typography variant='h6'>Question Numbers</Typography>
        <List>
          {exam.questions.map((_, index) => (
            <ListItem
              key={index}
              button
              onClick={() => handleQuestionSelect(index)}>
              <ListItemText primary={`Q${index + 1}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default ExamPage;
