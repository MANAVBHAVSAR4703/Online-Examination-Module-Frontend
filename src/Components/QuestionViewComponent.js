import React, { useState } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
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

  let AuthStr = `Bearer ${token}`;

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
    <Box sx={{ padding: 3 }} style={{ width: "85%" }}>
      <ToastContainer />
      <Typography variant='h4' gutterBottom align='center'>
        Question List
      </Typography>
      {questionList.map((question) => (
        <Accordion key={question.id} sx={{ marginBottom: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Chip
              label={question.category}
              color='primary'
              variant='outlined'
              sx={{ marginRight: 1 }}
            />
            <Typography
              variant='h7'
              style={{
                marginLeft: "10px",
                marginRight: "10px",
                width: "90%",
                justifyContent: "start",
                display: "flex",
              }}>
              {question.text}
            </Typography>
            <div
              onClick={() =>
                navigate("/dashboard/edit-question", { state: { question } })
              }>
              <Box>
                <EditNote />
              </Box>
            </div>
            <div onClick={() => deleteQuestion(question)}>
              <Box>
                <Delete />
              </Box>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant='subtitle1' sx={{ marginBottom: 1 }}>
              Options:
            </Typography>
            {question.options.map((option, index) => (
              <Box
                key={option.id}
                sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant='body2' sx={{ marginRight: 1 }}>
                  {String.fromCharCode(65 + index)}.
                </Typography>
                <Typography variant='body2'>{option.text}</Typography>
              </Box>
            ))}
            <Typography variant='body2' sx={{ marginTop: 1, color: "green" }}>
              Correct Option:{" "}
              {String.fromCharCode(65 + question.correctOptionIndex)}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default QuestionViewComponent;
