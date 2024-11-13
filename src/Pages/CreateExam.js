import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  Card,
  Grid,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import api from "../Constants/Api";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";

function CreateExam() {
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const location = useLocation();
  const { exam } = location.state || {};

  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  let AuthStr = `Bearer ${token}`;
  console.log(exam);
  const [title, setTitle] = useState(exam?.title ?? "");
  const [startTime, setStartTime] = useState(exam?.startTime ?? "");
  const [duration, setDuration] = useState(exam?.duration ?? "");
  const [passingCriteria, setPassingCriteria] = useState(
    exam?.passingCriteria ?? ""
  );
  const [logicalQuestionsCount, setLogicalQuestionsCount] = useState("");
  const [technicalQuestionsCount, setTechnicalQuestionsCount] = useState("");
  const [programmingQuestionsCount, setProgrammingQuestionsCount] =
    useState("");
  const [
    programmingSectionQuestionsCount,
    setProgrammingSectionQuestionsCount,
  ] = useState("");
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
  const [
    programmingSectionQuestionsCountError,
    setProgrammingSectionQuestionsCountError,
  ] = useState("");
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

    if (
      !programmingSectionQuestionsCount ||
      isNaN(programmingSectionQuestionsCount) ||
      programmingSectionQuestionsCount < 0
    ) {
      setProgrammingQuestionsCountError(
        "Programming Section questions count must be a non-negative number"
      );
      isValid = false;
    } else {
      setProgrammingSectionQuestionsCountError("");
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

    if (!exam && !validateFields()) {
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
      programmingSectionQuestionsCount: parseInt(
        programmingSectionQuestionsCount,
        10
      ),
      college,
    };

    const updateExamData = {
      id: exam ? exam.id : null,
      title,
      startTime,
      duration: parseInt(duration, 10),
      passingCriteria: parseFloat(passingCriteria),
    };

    try {
      const response = await axios.post(
        exam ? api.editExam : api.CreateExam,
        exam ? updateExamData : examData,
        {
          headers: {
            Authorization: AuthStr,
          },
        }
      );
      if (response.data.success) {
        toast.success(response?.data?.message);
        setTimeout(() => {
          navigate("/dashboard/view-exams");
        }, 2000);
        setTitle("");
        setStartTime("");
        setDuration("");
        setPassingCriteria("");
        setLogicalQuestionsCount("");
        setTechnicalQuestionsCount("");
        setProgrammingQuestionsCount("");
        setProgrammingSectionQuestionsCount("");
        setCollege("");
      } else {
        toast.error(response?.data?.message || "Failed to Create/Update Exam");
      }
    } catch (error) {
      console.error("Error creating exam:", error);
      toast.error(error?.response?.data?.message || "An Error Occurred!");
    }
  };

  return (
    <Card
      variant='outlined'
      sx={{
        width: "100%",
        padding: "2%",
        boxShadow: 3,
        borderRadius: 2,
      }}>
      <Typography
        component='h1'
        variant='h4'
        sx={{
          fontSize: "clamp(2rem, 10vw, 2.15rem)",
          fontFamily: "cursive",
          marginBottom: 3,
          textAlign: "center",
        }}>
        {exam ? "Edit Exam" : "Create Exam"}
      </Typography>
      <Box
        component='form'
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel htmlFor='title'>Exam Title</FormLabel>
              <TextField
                id='title'
                name='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={!!titleError}
                helperText={titleError}
                placeholder='Term1 exam'
                variant='outlined'
                required
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel htmlFor='startTime'>Start Time</FormLabel>
              <TextField
                id='startTime'
                type='datetime-local'
                name='startTime'
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                error={!!startTimeError}
                helperText={startTimeError}
                variant='outlined'
                required
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel htmlFor='duration'>Duration (in minutes)</FormLabel>
              <TextField
                id='duration'
                type='number'
                name='duration'
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                error={!!durationError}
                helperText={durationError}
                variant='outlined'
                required
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel htmlFor='passingCriteria'>
                Passing Criteria (%)
              </FormLabel>
              <TextField
                id='passingCriteria'
                type='number'
                name='passingCriteria'
                value={passingCriteria}
                onChange={(e) => setPassingCriteria(e.target.value)}
                error={!!passingCriteriaError}
                helperText={passingCriteriaError}
                variant='outlined'
                required
              />
            </FormControl>
          </Grid>

          {!exam && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
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
                    variant='outlined'
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
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
                    variant='outlined'
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormLabel htmlFor='programmingQuestionsCount'>
                    Programming Questions Count
                  </FormLabel>
                  <TextField
                    id='programmingQuestionsCount'
                    type='number'
                    name='programmingQuestionsCount'
                    value={programmingQuestionsCount}
                    onChange={(e) =>
                      setProgrammingQuestionsCount(e.target.value)
                    }
                    error={!!programmingQuestionsCountError}
                    helperText={programmingQuestionsCountError}
                    variant='outlined'
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <FormLabel htmlFor='programmingQuestionsCount'>
                    Programming Section Questions Count
                  </FormLabel>
                  <TextField
                    id='programmingQuestionsCount'
                    type='number'
                    name='programmingQuestionsCount'
                    value={programmingSectionQuestionsCount}
                    onChange={(e) =>
                      setProgrammingSectionQuestionsCount(e.target.value)
                    }
                    error={!!programmingSectionQuestionsCountError}
                    helperText={programmingSectionQuestionsCountError}
                    variant='outlined'
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel htmlFor='college'>College</FormLabel>
                  <TextField
                    id='college'
                    name='college'
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    error={!!collegeError}
                    helperText={collegeError}
                    variant='outlined'
                    required
                  />
                </FormControl>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              fullWidth
              sx={{
                backgroundColor: "primary.main",
                ":hover": {
                  backgroundColor: "primary.dark",
                },
              }}>
              {exam ? "Update Exam" : "Create Exam"}
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer />
    </Card>
  );
}

export default CreateExam;
