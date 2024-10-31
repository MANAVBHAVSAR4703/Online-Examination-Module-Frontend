import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Link,
  Typography,
  Card,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import api from "../Constants/Api";
import Cookies from "js-cookie";

function CreateExam() {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  let AuthStr = `Bearer ${token}`;

  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [passingCriteria, setPassingCriteria] = useState("");
  const [logicalQuestionsCount, setLogicalQuestionsCount] = useState("");
  const [technicalQuestionsCount, setTechnicalQuestionsCount] = useState("");
  const [programmingQuestionsCount, setProgrammingQuestionsCount] =
    useState("");
  const [college, setCollege] = useState("");

  const [titleError, setTitleError] = useState("");
  const [startTimeError, setStartTimeError] = useState("");
  const [durationError, setDurationError] = useState("");
  const [passingCriteriaError, setPassingCriteriaError] = useState("");
  const [logicalQuestionsCountError, setLogicalQuestionsCountError] =
    useState("");
  const [technicalQuestionsCountError, setTechnicalQuestionsCountError] =
    useState("");
  const [programmingQuestionsCountError, setProgrammingQuestionsCountError] =
    useState("");
  const [collegeError, setCollegeError] = useState("");

  const validateFields = () => {
    let isValid = true;

    if (!title) {
      setTitleError("Exam title is required");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!startTime) {
      setStartTimeError("Start time is required");
      isValid = false;
    } else {
      setStartTimeError("");
    }

    if (!duration || isNaN(duration) || duration <= 0) {
      setDurationError("Duration must be a positive number");
      isValid = false;
    } else {
      setDurationError("");
    }

    if (
      !passingCriteria ||
      isNaN(passingCriteria) ||
      passingCriteria < 0 ||
      passingCriteria > 100
    ) {
      setPassingCriteriaError("Passing criteria must be between 0 and 100");
      isValid = false;
    } else {
      setPassingCriteriaError("");
    }

    if (
      !logicalQuestionsCount ||
      isNaN(logicalQuestionsCount) ||
      logicalQuestionsCount < 0
    ) {
      setLogicalQuestionsCountError(
        "Logical questions count must be a non-negative number"
      );
      isValid = false;
    } else {
      setLogicalQuestionsCountError("");
    }

    if (
      !technicalQuestionsCount ||
      isNaN(technicalQuestionsCount) ||
      technicalQuestionsCount < 0
    ) {
      setTechnicalQuestionsCountError(
        "Technical questions count must be a non-negative number"
      );
      isValid = false;
    } else {
      setTechnicalQuestionsCountError("");
    }

    if (
      !programmingQuestionsCount ||
      isNaN(programmingQuestionsCount) ||
      programmingQuestionsCount < 0
    ) {
      setProgrammingQuestionsCountError(
        "Programming questions count must be a non-negative number"
      );
      isValid = false;
    } else {
      setProgrammingQuestionsCountError("");
    }

    if (!college) {
      setCollegeError("College name is required");
      isValid = false;
    } else {
      setCollegeError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    const examData = {
      title,
      startTime,
      duration: parseInt(duration, 10),
      passingCriteria: parseFloat(passingCriteria),
      logicalQuestionsCount: parseInt(logicalQuestionsCount, 10),
      technicalQuestionsCount: parseInt(technicalQuestionsCount, 10),
      programmingQuestionsCount: parseInt(programmingQuestionsCount, 10),
      college,
    };

    try {
      const response = await axios.post(api.CreateExam, examData, {
        headers: {
          Authorization: AuthStr,
        },
      });
      if (response.data.success) {
        toast.success(response?.data?.message);
        setTitle("");
        setStartTime("");
        setDuration("");
        setPassingCriteria("");
        setLogicalQuestionsCount("");
        setTechnicalQuestionsCount("");
        setProgrammingQuestionsCount("");
        setCollege("");
      } else {
        toast.error(response?.data?.message || "Failed to Create Exam");
      }
    } catch (error) {
      console.error("Error creating exam:", error);
      toast.error(error?.response?.data?.message || "An Error Occurred!");
    }
  };

  return (
    <Card variant='outlined' style={{ width: "50%", padding: "2%" }}>
      <Typography
        component='h1'
        variant='h4'
        sx={{ fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
        Create Exam
      </Typography>
      <Box
        component='form'
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FormControl>
          <FormLabel htmlFor='title'>Exam Title</FormLabel>
          <TextField
            id='title'
            name='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!titleError}
            helperText={titleError}
            placeholder='Term1 exam'
            fullWidth
            variant='outlined'
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor='startTime'>Start Time</FormLabel>
          <TextField
            id='startTime'
            type='datetime-local'
            name='startTime'
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            error={!!startTimeError}
            helperText={startTimeError}
            fullWidth
            variant='outlined'
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor='duration'>Duration (in minutes)</FormLabel>
          <TextField
            id='duration'
            type='number'
            name='duration'
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            error={!!durationError}
            helperText={durationError}
            fullWidth
            variant='outlined'
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor='passingCriteria'>Passing Criteria (%)</FormLabel>
          <TextField
            id='passingCriteria'
            type='number'
            name='passingCriteria'
            value={passingCriteria}
            onChange={(e) => setPassingCriteria(e.target.value)}
            error={!!passingCriteriaError}
            helperText={passingCriteriaError}
            fullWidth
            variant='outlined'
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor='logicalQuestionsCount'>
            Logical Questions Count
          </FormLabel>
          <TextField
            id='logicalQuestionsCount'
            type='number'
            name='logicalQuestionsCount'
            value={logicalQuestionsCount}
            onChange={(e) => setLogicalQuestionsCount(e.target.value)}
            error={!!logicalQuestionsCountError}
            helperText={logicalQuestionsCountError}
            fullWidth
            variant='outlined'
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor='technicalQuestionsCount'>
            Technical Questions Count
          </FormLabel>
          <TextField
            id='technicalQuestionsCount'
            type='number'
            name='technicalQuestionsCount'
            value={technicalQuestionsCount}
            onChange={(e) => setTechnicalQuestionsCount(e.target.value)}
            error={!!technicalQuestionsCountError}
            helperText={technicalQuestionsCountError}
            fullWidth
            variant='outlined'
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor='programmingQuestionsCount'>
            Programming Questions Count
          </FormLabel>
          <TextField
            id='programmingQuestionsCount'
            type='number'
            name='programmingQuestionsCount'
            value={programmingQuestionsCount}
            onChange={(e) => setProgrammingQuestionsCount(e.target.value)}
            error={!!programmingQuestionsCountError}
            helperText={programmingQuestionsCountError}
            fullWidth
            variant='outlined'
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor='college'>College</FormLabel>
          <TextField
            id='college'
            name='college'
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            error={!!collegeError}
            helperText={collegeError}
            placeholder='XYZ University'
            fullWidth
            variant='outlined'
            required
          />
        </FormControl>

        <Button type='submit' fullWidth variant='contained'>
          Create Exam
        </Button>

        <ToastContainer />
      </Box>
    </Card>
  );
}

export default CreateExam;
