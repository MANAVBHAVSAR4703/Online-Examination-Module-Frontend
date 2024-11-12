import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Card,
  Grid,
} from "@mui/material";
import axios from "axios";
import api from "../Constants/Api";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

function AddQuestion() {
  const location = useLocation();
  const navigate = useNavigate();
  const { question } = location.state || {};
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  let AuthStr = `Bearer ${token}`;

  const [questionText, setQuestionText] = useState(question?.text ?? "");
  const [category, setCategory] = useState(question?.category ?? "Logical");
  const [options, setOptions] = useState(
    question?.options?.map((option) => option.text) ?? ["", ""]
  );
  const [correctOptionIndex, setCorrectOptionIndex] = useState(
    question?.correctOptionIndex ?? null
  );

  const [errors, setErrors] = useState({
    questionText: "",
    options: "",
    correctOption: "",
  });

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        options: "You can only add up to 4 options",
      }));
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
    if (correctOptionIndex === index) {
      setCorrectOptionIndex(null);
    }
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = {
      questionText: "",
      options: "",
      correctOption: "",
    };

    if (!questionText) {
      newErrors.questionText = "Question text is required";
      isValid = false;
    }
    if (options.some((option) => option.trim() === "")) {
      newErrors.options = "All options must be filled in";
      isValid = false;
    }
    if (correctOptionIndex === null) {
      newErrors.correctOption = "Please select the correct option";
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

    const questionData = question
      ? {
          id: question.id,
          text: questionText,
          category,
          correctOptionIndex,
          options: options.map((optionText, index) => ({
            id: question.options[index]?.id,
            text: optionText,
          })),
        }
      : {
          text: questionText,
          category,
          correctOptionIndex,
          options,
        };

    try {
      const response = await axios.post(
        question ? api.editQuestion : api.AddQuestion,
        questionData,
        {
          headers: {
            Authorization: AuthStr,
          },
        }
      );

      if (response.data.success) {
        setTimeout(() => {
          navigate("/dashboard/view-questions");
        }, 1000);
        setQuestionText("");
        setOptions(["", ""]);
        setCorrectOptionIndex(null);
        setErrors({
          questionText: "",
          options: "",
          correctOption: "",
        });
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          options: response?.data?.message || "Failed to submit question",
        }));
      }
    } catch (error) {
      console.error("Error adding/editing question:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        options: error?.response?.data?.message || "An Error Occurred!",
      }));
    }
  };

  return (
    <Card
      variant='outlined'
      sx={{ padding: "2%", width: "100%", maxWidth: "800px", margin: "auto" }}>
      <Typography variant='h4' gutterBottom fontFamily={"cursive"}>
        {question ? "Edit Question" : "Add Question"}
      </Typography>
      <Box component='form' onSubmit={handleSubmit} noValidate>
        <FormControl fullWidth margin='normal'>
          <FormLabel htmlFor='questionText'>Question</FormLabel>
          <TextField
            id='questionText'
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder='Enter the question text'
            multiline
            rows={2}
            fullWidth
            required
            error={!!errors.questionText}
            helperText={errors.questionText}
          />
        </FormControl>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin='normal'>
              <FormLabel htmlFor='category'>Category</FormLabel>
              <RadioGroup
                id='category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                row
                required>
                <FormControlLabel
                  value='Logical'
                  control={<Radio />}
                  label='Logical'
                />
                <FormControlLabel
                  value='Technical'
                  control={<Radio />}
                  label='Technical'
                />
                <FormControlLabel
                  value='Programming'
                  control={<Radio />}
                  label='Programming'
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin='normal'>
              <FormLabel>Options</FormLabel>
              {options.map((option, index) => (
                <Box key={index} display='flex' alignItems='center' mb={1}>
                  <TextField
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    fullWidth
                    required
                    error={!!errors.options}
                    helperText={
                      errors.options && index === 0 ? errors.options : ""
                    }
                  />
                  {index >= 2 && (
                    <Button
                      onClick={() => handleRemoveOption(index)}
                      color='secondary'
                      sx={{ ml: 1 }}>
                      Remove
                    </Button>
                  )}
                </Box>
              ))}

              {options.length < 4 && (
                <Button
                  onClick={handleAddOption}
                  variant='contained'
                  color='primary'
                  fullWidth
                  sx={{ mt: 1 }}>
                  Add Option
                </Button>
              )}
            </FormControl>
          </Grid>
        </Grid>

        <FormControl fullWidth margin='normal'>
          <FormLabel>Correct Answer</FormLabel>
          <RadioGroup
            value={correctOptionIndex}
            onChange={(e) => setCorrectOptionIndex(parseInt(e.target.value))}
            error={!!errors.correctOption}
            helperText={errors.correctOption}>
            {options.map((_, index) => (
              <FormControlLabel
                key={index}
                value={index}
                control={<Radio required />}
                label={`Option ${index + 1}`}
              />
            ))}
          </RadioGroup>
        </FormControl>

        <Button
          type='submit'
          variant='contained'
          color='primary'
          sx={{ fontWeight: "bold" }}
          fullWidth>
          {question ? "Edit Question" : "Submit Question"}
        </Button>
      </Box>
    </Card>
  );
}

export default AddQuestion;
