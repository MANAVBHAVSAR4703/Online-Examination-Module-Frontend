import React, { useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Card,
  Grid,
} from "@mui/material";
import axios from "axios";
import api from "../Constants/Api";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

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
  const [difficulty, setDifficulty] = useState(question?.difficulty ?? "EASY");
  const [imageUpdate, setImageUpdate] = useState(false);
  const [image, setImage] = useState(
    question && question.imageData
      ? `data:${question.imageType};base64,${question.imageData}`
      : null
  );
  const [options, setOptions] = useState(
    question?.options?.map((option) => option.text) ?? ["", ""]
  );
  const [correctOptionIndex, setCorrectOptionIndex] = useState(
    question?.correctOptionIndex ?? null
  );
  const fileInputRef = useRef(null);
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

  const handleRemoveImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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

  const handleImageChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
    setImageUpdate(true);
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
          difficulty,
        }
      : {
          text: questionText,
          category,
          correctOptionIndex,
          options,
          difficulty,
        };

    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "question",
      new Blob([JSON.stringify(questionData)], { type: "application/json" })
    );
    console.log(formData);
    try {
      const response = await axios.post(
        question ? api.editQuestion : api.AddQuestion,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: AuthStr,
          },
        }
      );

      if (response.data.success) {
        toast.success(response?.data?.message);
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
        toast.error(response?.data?.message || "Failed to process request");
        setErrors((prevErrors) => ({
          ...prevErrors,
          options: response?.data?.message || "Failed to submit question",
        }));
      }
    } catch (error) {
      console.error("Error adding/editing question:", error);
      toast.error(error?.response?.data?.message || "An Error Occurred!");
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
      <ToastContainer />
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
        <FormControl fullWidth margin='normal'>
          <FormLabel>Image</FormLabel>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            <Button
              type='button'
              variant='outlined'
              color='primary'
              size='small'
              onClick={() => handleRemoveImage()}
              sx={{ fontWeight: "bold" }}>
              Remove Image
            </Button>
          </Box>
        </FormControl>
        {image &&
          (question && !imageUpdate ? (
            <img src={image} height={100} width={100}></img>
          ) : (
            <img
              src={URL.createObjectURL(image)}
              height={100}
              width={100}></img>
          ))}
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
