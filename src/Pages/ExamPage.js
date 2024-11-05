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
import { useSelector } from "react-redux";

const ExamPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const examID = location.state?.exam;
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState();
  const token = Cookies.get("token");
  const user = useSelector((state) => state.auth.user);
  const [timeOverMessage, setTimeOverMessage] = useState(""); 

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchExamById = async () => {
      try {
        const response = await axios.get(`${api.GetExamById}/${examID.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setExam(response?.data);
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
      const examDuration = exam.duration * 60 * 1000;
      const endTime = examStartTime + examDuration;
      const currentTime = Date.now();
      setTimeLeft(Math.max(0, Math.floor((endTime - currentTime) / 1000)));

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleSubmitExam(); 
            setTimeOverMessage("Time's up! Auto-submitting your exam."); 
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
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

  const handleSubmitExam = async () => {
    const responses = exam.questions.map((question, index) => ({
      questionId: question.id,
      selectedOption:
        selectedAnswers[index] !== undefined ? selectedAnswers[index] : null,
    }));

    try {
      await axios.post(
        api.SubmitExam,
        { examId: examID.id, studentEmail: user.email, responses },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Exam submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "row", p: 3 }}>
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography variant='h4' gutterBottom>
          {exam.title}
        </Typography>
        <Typography variant='h6'>
          Time Left: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </Typography>
        {timeOverMessage && (
          <Typography variant='h6' color='error'>
            {timeOverMessage}
          </Typography>
        )}
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
                color:
                  selectedAnswers[currentQuestionIndex] === index
                    ? "white"
                    : "black",
                mb: 1,
                textAlign: "left",
                backgroundColor:
                  selectedAnswers[currentQuestionIndex] === index
                    ? "black"
                    : "white",
              }}>
              {String.fromCharCode(97 + index) + ". " + option.text}
            </Button>
          ))}
        </Paper>
        <Box sx={{ padding: 5 }}>
          <Button
            sx={{ mx: 2, px: 2, width: "10%" }}
            variant='contained'
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}>
            Previous
          </Button>
          <Button
            sx={{ mx: 2, px: 2, width: "10%" }}
            variant='contained'
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === exam.questions.length - 1}>
            Next
          </Button>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Button
            variant='contained'
            color='primary'
            onClick={handleSubmitExam}>
            Submit Exam
          </Button>
        </Box>
      </Box>

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
