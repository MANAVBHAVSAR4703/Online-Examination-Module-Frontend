import React, { useState } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Delete, EditNote } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../Constants/Api";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";

function QuestionViewComponent({ questions }) {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }

  const [questionList, setQuestionList] = useState(questions);
  const AuthStr = `Bearer ${token}`;

  const deleteQuestion = async (questionData) => {
    try {
      const response = await axios.post(api.deleteQuestion, questionData, {
        headers: {
          Authorization: AuthStr,
        },
      });
      if (response.data.success) {
        toast.success(response?.data?.message);
        setQuestionList((prevQuestions) =>
          prevQuestions.filter((q) => q.id !== questionData.id)
        );
      } else {
        toast.error(response?.data?.message || "Failed to Delete Question");
      }
    } catch (error) {
      console.error("Error deleting Question:", error);
      toast.error(error?.response?.data?.message || "An Error Occurred!");
    }
  };

  return (
    <Box sx={{ padding: 3, width: "100%", margin: "0 auto" }}>
      <ToastContainer />
      <Typography
        variant='h4'
        gutterBottom
        align='center'
        fontFamily={"cursive"}>
        Question List
      </Typography>
      {questionList?.map((question) => (
        <Accordion key={question.id} sx={{ marginBottom: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Chip
              label={question.category.toUpperCase()}
              color={getCategoryColor(question.category)}
              sx={{ marginRight: 2 }}
            />
            <Chip
              label={question.difficulty}
              color={getDifficultyColor(question.difficulty)}
              sx={{ marginRight: 2 }}
            />
            <Typography
              variant='subtitle1'
              sx={{ flexGrow: 1, fontWeight: 500, color: "text.primary" }}>
              {question.text}
            </Typography>
            <Box display='flex' alignItems='center'>
              <Tooltip title='Edit Question'>
                <IconButton
                  onClick={() =>
                    navigate("/dashboard/edit-question", {
                      state: { question },
                    })
                  }>
                  <EditNote color='info' />
                </IconButton>
              </Tooltip>
              <Tooltip title='Delete Question'>
                <IconButton onClick={() => deleteQuestion(question)}>
                  <Delete color='error' />
                </IconButton>
              </Tooltip>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Divider sx={{ mb: 2 }} />
            {question?.imageData && (
              <>
                <Typography
                  variant='subtitle1'
                  sx={{ mb: 1, color: "text.secondary" }}>
                  Image :
                </Typography>
                <img
                  src={`data:${question.imageType};base64,${question.imageData}`}
                  alt={question?.imageName}
                  height={200}
                  width={300}
                />
              </>
            )}
            <Typography
              variant='subtitle1'
              sx={{ mb: 1, color: "text.secondary" }}>
              Options:
            </Typography>
            {question.options.map((option, index) => (
              <Box
                key={option.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  padding: "4px 0",
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}>
                <Typography variant='body2' sx={{ marginRight: 1 }}>
                  {String.fromCharCode(65 + index)}.
                </Typography>
                <Typography variant='body2' sx={{ color: "text.primary" }}>
                  {option.text}
                </Typography>
              </Box>
            ))}
            <Typography variant='body2' sx={{ mt: 2, color: "success.main" }}>
              Correct Option:{" "}
              <strong>
                {String.fromCharCode(65 + question.correctOptionIndex)}
              </strong>
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

function getCategoryColor(category) {
  switch (category) {
    case "LOGICAL":
      return "success";
    case "PROGRAMMING":
      return "warning";
    case "TECHNICAL":
      return "error";
    default:
      return "default";
  }
}

function getDifficultyColor(category) {
  switch (category) {
    case "EASY":
      return "success";
    case "MEDIUM":
      return "warning";
    case "HARD":
      return "error";
    default:
      return "default";
  }
}

export default QuestionViewComponent;
