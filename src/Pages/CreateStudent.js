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
import { SitemarkIcon } from "../Utils/CustomIcons";
import axios from "axios";
import api from "../Constants/Api";
import Cookies from "js-cookie";

function CreateStudent() {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  let AuthStr = `Bearer ${token}`;
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [enrollNo, setEnrollNo] = useState("");
  const [college, setCollege] = useState("");

  const [emailError, setEmailError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [enrollNoError, setEnrollNoError] = useState("");
  const [collegeError, setCollegeError] = useState("");

  const validateFields = () => {
    let isValid = true;

    if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!fullName) {
      setFullNameError("Full name is required");
      isValid = false;
    } else {
      setFullNameError("");
    }

    if (!password || password.length < 4) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!enrollNo || isNaN(enrollNo)) {
      setEnrollNoError("Enrollment number must be a valid number");
      isValid = false;
    } else {
      setEnrollNoError("");
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

    const studentData = {
      email,
      fullName,
      password,
      enrollNo: parseInt(enrollNo, 10),
      college,
    };

    try {
      const response = await axios.post(api.CreateStudent, studentData, {
        headers: {
          Authorization: AuthStr,
        },
      });
      if (response.data.success) {
        toast.success(response?.data?.message);
        setEmail("");
        setFullName("");
        setPassword("");
        setEnrollNo("");
        setCollege("");
      } else {
        toast.error(response?.data?.message || "Failed to Create Student");
      }
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error(error?.response?.data?.message || "An Error Occured !");
    }
  };

  return (
    <Card variant='outlined' style={{ width: "50%", padding: "2%" }}>
      <Typography
        component='h1'
        variant='h4'
        sx={{ fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
        Create Student
      </Typography>
      {/* {message && <Typography color='error'>{message}</Typography>} */}
      <Box
        component='form'
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FormControl>
          <FormLabel htmlFor='email'>Email</FormLabel>
          <TextField
            id='email'
            type='email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            placeholder='your@email.com'
            autoComplete='email'
            fullWidth
            variant='outlined'
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor='fullName'>Full Name</FormLabel>
          <TextField
            id='fullName'
            name='fullName'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={!!fullNameError}
            helperText={fullNameError}
            placeholder='John Doe'
            fullWidth
            variant='outlined'
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor='password'>Password</FormLabel>
          <TextField
            id='password'
            type='password'
            name='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            placeholder='••••••'
            autoComplete='new-password'
            fullWidth
            variant='outlined'
            required
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor='enrollNo'>Enrollment Number</FormLabel>
          <TextField
            id='enrollNo'
            name='enrollNo'
            value={enrollNo}
            onChange={(e) => setEnrollNo(e.target.value)}
            error={!!enrollNoError}
            helperText={enrollNoError}
            placeholder='123456'
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
            placeholder='LJ University'
            fullWidth
            variant='outlined'
            required
          />
        </FormControl>

        <Button type='submit' fullWidth variant='contained'>
          Create Student
        </Button>

        <ToastContainer />
      </Box>
    </Card>
  );
}

export default CreateStudent;
