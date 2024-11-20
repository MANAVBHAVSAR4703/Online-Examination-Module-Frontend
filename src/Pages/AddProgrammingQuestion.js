import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  FormControlLabel,
  Select,
  MenuItem,
  useTheme,
  Card,
} from "@mui/material";
import axios from "axios";
import api from "../Constants/Api";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import MonacoEditor from "@monaco-editor/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddProgrammingQuestion() {
  const navigate = useNavigate();
  const theme = useTheme();
  const location = useLocation();
  const programmingQuestion = location?.state?.programmingQuestion;
  console.log(programmingQuestion);
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  const AuthStr = `Bearer ${token}`;

  const [questionText, setQuestionText] = useState(
    programmingQuestion?.text ?? ""
  );
  const [code, setCode] = useState(programmingQuestion?.code ?? "");
  const [difficulty, setDifficulty] = useState(
    programmingQuestion?.difficulty ?? "EASY"
  );
  const [language, setLanguage] = useState("plaintext");
  const [errors, setErrors] = useState({
    questionText: "",
    code: "",
    difficulty: "",
  });

  const validateFields = () => {
    let isValid = true;
    const newErrors = {
      questionText: "",
      code: "",
      difficulty: "",
    };

    if (!questionText) {
      newErrors.questionText = "Question text is required";
      isValid = false;
    }
    if (!code) {
      newErrors.code = "Code is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    const questionData = programmingQuestion
      ? {
          id: programmingQuestion.id,
          text: questionText,
          code,
          difficulty,
        }
      : {
          text: questionText,
          code,
          difficulty,
        };

    try {
      const response = await axios.post(
        programmingQuestion
          ? api.editProgrammingQuestion
          : api.createProgrammingQuestion,
        questionData,
        {
          headers: {
            Authorization: AuthStr,
          },
        }
      );

      if (response.data.success) {
        toast.success(response?.data?.message);
        setTimeout(() => {
          navigate("/dashboard/view-programmingQuestions");
        }, 1000);
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          code:
            response?.data?.message || programmingQuestion
              ? "Failed to edit programming question"
              : "Failed to submit programming question",
        }));
        toast.error(
          response?.data?.message || programmingQuestion
            ? "Failed to edit programming question"
            : "Failed to submit programming question"
        );
      }
    } catch (error) {
      console.error("Error adding programming question:", error);
      toast.error(error?.response?.data?.message || "An Error Occurred!");
      setErrors((prevErrors) => ({
        ...prevErrors,
        code: error?.response?.data?.message || "An Error Occurred!",
      }));
    }
  };

  return (
    <Card
      variant='outlined'
      sx={{ padding: "2%", width: "100%", maxWidth: "800px", margin: "auto" }}>
      <ToastContainer />
      <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
        <FormControl fullWidth margin='normal'>
          <FormLabel htmlFor='questionText'>Question</FormLabel>
          <TextField
            id='questionText'
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder='Enter the programming question text'
            multiline
            rows={2}
            fullWidth
            required
            error={!!errors.questionText}
            helperText={errors.questionText}
          />
        </FormControl>

        <FormControl fullWidth margin='normal'>
          <FormLabel htmlFor='language'>Language</FormLabel>
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

        <FormControl fullWidth margin='normal'>
          <FormLabel htmlFor='code'>Code</FormLabel>
          <MonacoEditor
            height='150px'
            language={language}
            theme={theme.palette.mode === "dark" ? "vs-dark" : "light"}
            value={code}
            onChange={(value) => setCode(value)}
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
          {errors.code && <Typography color='error'>{errors.code}</Typography>}
        </FormControl>

        <FormControl fullWidth margin='normal'>
          <FormLabel>Difficulty</FormLabel>
          <RadioGroup
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            row
            required>
            <FormControlLabel value='EASY' control={<Radio />} label='Easy' />
            <FormControlLabel
              value='MEDIUM'
              control={<Radio />}
              label='Medium'
            />
            <FormControlLabel value='HARD' control={<Radio />} label='Hard' />
          </RadioGroup>
        </FormControl>

        <Button
          type='submit'
          variant='contained'
          color='primary'
          fullWidth
          sx={{ fontWeight: "bold" }}>
          {programmingQuestion ? "Edit" : "Submit"} Programming Question
        </Button>
      </Box>
    </Card>
  );
}

export default AddProgrammingQuestion;
