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
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import api from "../Constants/Api";
import Cookies from "js-cookie";

function AddQuestion() {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  let AuthStr = `Bearer ${token}`;
  const [questionText, setQuestionText] = useState("");
  const [category, setCategory] = useState("Logical");
  const [options, setOptions] = useState(["", ""]);
  const [correctOptionIndex, setCorrectOptionIndex] = useState(null);

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    } else {
      toast.warn("You can only add up to 4 options");
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
    // If the correct option index is being removed, reset it
    if (correctOptionIndex === index) {
      setCorrectOptionIndex(null);
    }
  };

  const validateFields = () => {
    if (!questionText) {
      toast.error("Question text is required");
      return false;
    }
    if (options.some((option) => option.trim() === "")) {
      toast.error("All options must be filled in");
      return false;
    }
    if (correctOptionIndex === null) {
      toast.error("Please select the correct option");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    const questionData = {
      text: questionText,
      category,
      correctOptionIndex,
      options,
    };

    try {
      const response = await axios.post(api.AddQuestion, questionData, {
        headers: {
          Authorization: AuthStr,
        },
      });
      if (response.data.success) {
        toast.success(response?.data?.message);
        setQuestionText("");
        setOptions(["", ""]);
        setCorrectOptionIndex(null);
      } else {
        toast.error(response?.data?.message || "Failed to Add Question");
      }
    } catch (error) {
      console.error("Error adding question:", error);
      toast.error(error?.response?.data?.message || "An Error Occurred!");
    }
  };

  return (
    <Card variant='outlined' style={{ padding: "2%", width: "60%" }}>
      <Typography variant='h4' gutterBottom>
        Add Question
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
          />
        </FormControl>
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

        <FormControl fullWidth margin='normal'>
          <FormLabel>Correct Answer</FormLabel>
          <RadioGroup
            value={correctOptionIndex}
            onChange={(e) => setCorrectOptionIndex(parseInt(e.target.value))}>
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

        <Button type='submit' variant='contained' color='primary' fullWidth>
          Submit Question
        </Button>

        <ToastContainer />
      </Box>
    </Card>
  );
}

export default AddQuestion;
