import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Tooltip,
  Chip,
} from "@mui/material";
import {
  ArrowForward,
  ArrowBack,
  QuestionAnswer,
  Computer,
} from "@mui/icons-material";
import Loading from "../Components/Loading";
import axios from "axios";
import Cookies from "js-cookie";
import api from "../Constants/Api";
import { useSelector } from "react-redux";
import CodeEditor from "@monaco-editor/react"; 
import { useTheme } from "@emotion/react";

const ExamPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("plaintext");
  const theme = useTheme();
  const examID = location.state?.exam;
  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState();
  const token = Cookies.get("token");
  const user = useSelector((state) => state.auth.user);
  const [timeOverMessage, setTimeOverMessage] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]); 
  const [programmingAnswers, setProgrammingAnswers] = useState([]); 
  const [timeLeft, setTimeLeft] = useState(0);

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

  const handleCodeChange = (value) => {
    setProgrammingAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex - exam.questions.length] = value;
      return newAnswers;
    });
  };

  const handleNextQuestion = () => {
    if (
      currentQuestionIndex <
      exam.questions.length + exam.programmingQuestions.length - 1
    ) {
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

    const programmingQuestionResponses = exam.programmingQuestions.map(
      (question, index) => ({
        questionId: question.id,
        refCode: programmingAnswers[index] || "",
      })
    );

    try {
      await axios.post(
        api.SubmitExam,
        {
          examId: examID.id,
          studentEmail: user.email,
          responses,
          programmingQuestionResponses,
        },
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        p: 3,
        backgroundColor: "#f7f9fc",
      }}>
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography
          variant='h3'
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "bold", mb: 2 }}>
          {exam.title}
        </Typography>
        <Typography
          variant='h6'
          sx={{ textAlign: "center", fontSize: "1.2rem", mb: 3 }}>
          Time Left: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </Typography>
        {timeOverMessage && (
          <Typography
            variant='h6'
            color='error'
            sx={{ textAlign: "center", mb: 2, fontWeight: "bold" }}>
            {timeOverMessage}
          </Typography>
        )}

        <Paper
          elevation={4}
          sx={{
            p: 3,
            my: 3,
            borderRadius: "16px",
            backgroundColor: "#ffffff",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}>
          <Typography variant='h5' sx={{ fontWeight: "bold", mb: 2 }}>
            {currentQuestionIndex < exam.questions.length
              ? `Q${currentQuestionIndex + 1}: ${
                  exam.questions[currentQuestionIndex].text
                }`
              : `P${currentQuestionIndex - exam.questions.length + 1}: ${
                  exam.programmingQuestions[
                    currentQuestionIndex - exam.questions.length
                  ].text
                }`}
          </Typography>

          {/* MCQ Options */}
          {currentQuestionIndex < exam.questions.length &&
            exam.questions[currentQuestionIndex].options.map(
              (option, index) => (
                <Button
                  key={option.id}
                  variant={
                    selectedAnswers[currentQuestionIndex] === index
                      ? "contained"
                      : "outlined"
                  }
                  onClick={() => handleOptionSelect(index)}
                  sx={{
                    display: "block",
                    width: "100%",
                    mb: 1,
                    borderRadius: "8px",
                    textAlign: "left",
                    fontWeight: "bold",
                    padding: "12px 16px",
                    backgroundColor:
                      selectedAnswers[currentQuestionIndex] === index
                        ? "primary.main"
                        : "white",
                    color:
                      selectedAnswers[currentQuestionIndex] === index
                        ? "white"
                        : "primary.main",
                    border: "2px solid",
                    borderColor: "primary.main",
                    "&:hover": {
                      backgroundColor:
                        selectedAnswers[currentQuestionIndex] === index
                          ? "primary.dark"
                          : "#f0f0f0",
                    },
                  }}>
                  {String.fromCharCode(65 + index) + ". " + option.text}
                </Button>
              )
            )}

          {/* Programming Question */}
          {currentQuestionIndex >= exam.questions.length && (
            <>
              <FormControl size='small' sx={{ mb: 2, width: "150px" }}>
                <Select
                  id='language'
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}>
                  <MenuItem value='plaintext'>No Language</MenuItem>
                  <MenuItem value='javascript'>JavaScript</MenuItem>
                  <MenuItem value='python'>Python</MenuItem>
                  <MenuItem value='java'>Java</MenuItem>
                  <MenuItem value='csharp'>C#</MenuItem>
                  <MenuItem value='cpp'>C++</MenuItem>
                  <MenuItem value='sql'>SQL</MenuItem>
                </Select>
              </FormControl>
              <CodeEditor
                height='200px'
                theme={theme.palette.mode === "dark" ? "vs-dark" : "light"}
                defaultLanguage={language}
                value={
                  programmingAnswers[
                    currentQuestionIndex - exam.questions.length
                  ] || ""
                }
                onChange={handleCodeChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  contextmenu: true,
                }}
              />
            </>
          )}
        </Paper>

        {/* Navigation Buttons */}
        {/* Navigation Buttons for MCQs and Programming */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 3,
            position: "fixed",
            bottom: "3vh",
            width: "80%",
          }}>
          {currentQuestionIndex < exam.questions.length ? (
            <>
              <IconButton
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "primary.main",
                  },
                }}>
                <ArrowBack />
              </IconButton>
              <IconButton
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === exam.questions.length - 1}
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "primary.main",
                  },
                }}>
                <ArrowForward />
              </IconButton>
            </>
          ) : (
            <>
              <IconButton
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === exam.questions.length}
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "primary.main",
                  },
                }}>
                <ArrowBack />
              </IconButton>
              <IconButton
                onClick={handleNextQuestion}
                disabled={
                  currentQuestionIndex ===
                  exam.questions.length + exam.programmingQuestions.length - 1
                }
                sx={{
                  backgroundColor: "primary.main",
                  color: "white",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "white",
                    color: "primary.main",
                  },
                }}>
                <ArrowForward />
              </IconButton>
            </>
          )}
          <Button
            variant='outlined'
            color='primary'
            onClick={handleSubmitExam}
            sx={{
              px: 4,
              borderRadius: "8px",
              "&:hover": { backgroundColor: "primary.dark", color: "white" },
            }}>
            Submit Exam
          </Button>
        </Box>
      </Box>

      {/* Right-Side Navigation with Legend */}
      <Box
        sx={{
          width: "250px",
          ml: 4,
          p: 2,
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          position: "sticky",
          top: "80px",
        }}>
        {/* Legend */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              sx={{
                width: "20px",
                height: "20px",
                backgroundColor: "primary.main",
                borderRadius: "50%",
                mr: 2,
              }}
            />
            <Typography>Current Question</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              sx={{
                width: "20px",
                height: "20px",
                backgroundColor: "success.main",
                borderRadius: "50%",
                mr: 2,
              }}
            />
            <Typography>Answered</Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Box
              sx={{
                width: "20px",
                height: "20px",
                backgroundColor: "#f0f0f0",
                borderRadius: "50%",
                mr: 2,
              }}
            />
            <Typography>Unanswered</Typography>
          </Box>
        </Box>

        {/* Question Navigation */}
        {/* Question Navigation */}
        <Box>
          {/* MCQ Navigation */}
          <Box sx={{ mb: 4 }}>
            <Typography variant='h6' sx={{ mb: 2 }}>
              <Chip icon={<QuestionAnswer />} label='MCQs' variant='outlined' />
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {exam.questions.map((_, index) => (
                <Tooltip title={`Go to MCQ ${index + 1}`} key={index}>
                  <Box
                    onClick={() => handleQuestionSelect(index)}
                    sx={{
                      backgroundColor:
                        currentQuestionIndex === index
                          ? "primary.main"
                          : selectedAnswers[index] !== undefined
                          ? "success.main"
                          : "#f0f0f0",
                      color:
                        currentQuestionIndex === index
                          ? "black"
                          : selectedAnswers[index] !== undefined
                          ? "white"
                          : "black",
                      width: "40px",
                      height: "40px",
                      lineHeight: "40px",
                      textAlign: "center",
                      borderRadius: "50%",
                      cursor: "pointer",
                      fontWeight: "bold",
                      "&:hover": {
                        backgroundColor:
                          currentQuestionIndex === index
                            ? "primary.dark"
                            : selectedAnswers[index] !== undefined
                            ? "success.dark"
                            : "#e0e0e0",
                      },
                    }}>
                    {index + 1}
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>

          {/* Programming Questions Navigation */}
          <Box>
            <Typography variant='h6' sx={{ mb: 2 }}>
              <Chip
                icon={<Computer />}
                label='Programming Questions'
                variant='outlined'
              />
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {exam.programmingQuestions.map((_, index) => {
                const programmingIndex = index + exam.questions.length;
                return (
                  <Tooltip
                    title={`Go to Programming Question ${index + 1}`}
                    key={programmingIndex}>
                    <Box
                      onClick={() => handleQuestionSelect(programmingIndex)}
                      sx={{
                        backgroundColor:
                          currentQuestionIndex === programmingIndex
                            ? "primary.main"
                            : programmingAnswers[index]
                            ? "success.main"
                            : "#f0f0f0",
                        color:
                          currentQuestionIndex === index
                            ? "black"
                            : selectedAnswers[index] !== undefined
                            ? "white"
                            : "black",
                        width: "40px",
                        height: "40px",
                        lineHeight: "40px",
                        textAlign: "center",
                        borderRadius: "50%",
                        cursor: "pointer",
                        fontWeight: "bold",
                        "&:hover": {
                          backgroundColor:
                            currentQuestionIndex === programmingIndex
                              ? "primary.dark"
                              : programmingAnswers[index]
                              ? "success.dark"
                              : "#e0e0e0",
                        },
                      }}>
                      {index + 1}
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ExamPage;
