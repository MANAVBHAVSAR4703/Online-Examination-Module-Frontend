import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  Typography,
  Card,
  CardContent,
  Box,
  IconButton,
} from "@mui/material";
import { ExpandMore, Delete, EditNote } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../Constants/Api";
import Cookies from "js-cookie";

function ProgrammingQuestionViewComponent({ questions }) {
  const [questionsList, setQuestionList] = useState(questions);
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  const AuthStr = `Bearer ${token}`;
  const onDelete = async (id) => {
    try {
      const response = await axios.post(
        api.deleteProgrammingQuestion + `/${id}`,
        null,
        {
          headers: {
            Authorization: AuthStr,
          },
        }
      );

      if (response.data.success) {
        toast.success(response?.data?.message);
        setQuestionList((prevQuestions) =>
          prevQuestions.filter((q) => q.id !== id)
        );
      } else {
        toast.error(
          response?.data?.message || "Failed to edit programming question"
        );
      }
    } catch (error) {
      console.error("Error adding programming question:", error);
      toast.error(error?.response?.data?.message || "An Error Occurred!");
    }
  };
  const navigate = useNavigate();
  return (
    <Box sx={{ width: "100%", margin: "0 auto", padding: 3 }}>
      <ToastContainer />
      <Typography
        variant='h4'
        gutterBottom
        align='center'
        fontFamily={"cursive"}>
        Programming Question List
      </Typography>
      {questionsList.length > 0 ? (
        questionsList.map((question) => (
          <Accordion
            key={question.id}
            sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
              aria-controls={`panel-${question.id}-content`}
              id={`panel-${question.id}-header`}>
              <Chip
                label={question.difficulty}
                color={getDifficultyColor(question.difficulty)}
                sx={{ mr: 2 }}
              />

              <Typography
                variant='subtitle1'
                sx={{ flexGrow: 1, fontWeight: 500, color: "text.primary" }}>
                {question.text}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton
                  color='info'
                  onClick={() =>
                    navigate("/dashboard/edit-programmingQuestion", {
                      state: { programmingQuestion: question },
                    })
                  }
                  sx={{ mr: 0, "&:hover": { backgroundColor: "#e0f7fa" } }}>
                  <EditNote />
                </IconButton>
                <IconButton
                  color='error'
                  onClick={() => onDelete(question.id)}
                  sx={{ "&:hover": { backgroundColor: "#ffebee" } }}>
                  <Delete />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant='body1' sx={{ mb: 2 }}>
                    <strong>Pseudo Code:</strong>
                  </Typography>
                  <pre>
                    <code>{question.code}</code>
                  </pre>
                </CardContent>
              </Card>
            </AccordionDetails>
          </Accordion>
        ))
      ) : (
        <Typography variant='subtitle1' gutterBottom align='center'>
          No Programming Question
        </Typography>
      )}
    </Box>
  );
}

function getDifficultyColor(difficulty) {
  switch (difficulty) {
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

export default ProgrammingQuestionViewComponent;
