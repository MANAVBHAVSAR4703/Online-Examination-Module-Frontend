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
import {  Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import api from "../Constants/Api";
import Cookies from "js-cookie";
import { useLocation, useNavigate } from "react-router-dom";
import { UploadFile } from "@mui/icons-material";

function CreateStudent() {
  const token = Cookies.get("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { student } = location.state || {};
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  let AuthStr = `Bearer ${token}`;
  const [email, setEmail] = useState(student?.email ?? "");
  const [fullName, setFullName] = useState(student?.fullName ?? "");
  const [password, setPassword] = useState(student?.password ?? "");
  const [enrollNo, setEnrollNo] = useState(student?.enrollNo ?? "");
  const [college, setCollege] = useState(student?.college ?? "");

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

    if (!password || password.length < 6) {
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
      const response = await axios.post(
        student ? api.editStudent : api.CreateStudent,
        studentData,
        {
          headers: {
            Authorization: AuthStr,
          },
        }
      );
      if (response.data.success) {
        toast.success(response?.data?.message);
        if (student) {
          setTimeout(() => {
            navigate("/dashboard/view-students");
          }, 1000);
        }
        setEmail("");
        setFullName("");
        setPassword("");
        setEnrollNo("");
        setCollege("");
      } else {
        toast.error(response?.data?.message || "Failed to process request");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error?.response?.data?.message || "An Error Occurred!");
    }
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      const fileType = uploadedFile.type;
      if (!fileType.includes("excel") && !uploadedFile.name.endsWith(".xlsx")) {
        toast.error("Please upload a valid Excel file.");
        return;
      }

      setFile(uploadedFile);
      setOpenModal(true);
    }
  };

  const handleFileSubmit = () => {
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(api.uploadStudent, formData, {
        headers: {
          Authorization: AuthStr,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success(response.data);
        setOpenModal(false);
      })
      .catch((error) => {
        toast.error("Error uploading file.");
        setOpenModal(false);
      });
  };

  return (
    <>
      <Box mt={3} display='flex' sx={{ justifyContent: "end", width: "100%" }}>
        <input
          accept='.xlsx, .xls'
          style={{ display: "none" }}
          id='upload-excel-file'
          type='file'
          onChange={handleFileUpload}
        />
        <label htmlFor='upload-excel-file' style={{ width: "20%" }}>
          <Button variant='contained' component='span' size='small'>
            <IconButton>
              <UploadFile fontSize='small' />
            </IconButton>{" "}
            Import Excel Sheet
          </Button>
        </label>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Confirm File Upload</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>
            File: {file ? file.name : "No file selected"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleFileSubmit} color='primary'>
            Upload File
          </Button>
        </DialogActions>
      </Dialog>
      <Card
        variant='outlined'
        sx={{
          width: { xs: "90%", sm: "75%", md: "60%" },
          padding: "2rem",
          margin: "auto",
          borderRadius: "12px",
          boxShadow: 3,
        }}>
        <Typography
          component='h1'
          variant='h4'
          sx={{
            fontSize: "clamp(2rem, 10vw, 2.15rem)",
            textAlign: "center",
            mb: 3,
            fontFamily: "cursive",
          }}>
          {student ? "Edit Student" : "Create Student"}
        </Typography>
        <Box component='form' onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor='email'>Email</FormLabel>
                <TextField
                  id='email'
                  type='email'
                  name='email'
                  disabled={!!student}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  placeholder='your@email.com'
                  autoComplete='email'
                  variant='outlined'
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor='fullName'>Full Name</FormLabel>
                <TextField
                  id='fullName'
                  name='fullName'
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={!!fullNameError}
                  helperText={fullNameError}
                  placeholder='John Doe'
                  variant='outlined'
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
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
                  variant='outlined'
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor='enrollNo'>Enrollment Number</FormLabel>
                <TextField
                  id='enrollNo'
                  name='enrollNo'
                  value={enrollNo}
                  onChange={(e) => setEnrollNo(e.target.value)}
                  error={!!enrollNoError}
                  helperText={enrollNoError}
                  placeholder='123456'
                  variant='outlined'
                  required
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
                  placeholder='LJ University'
                  variant='outlined'
                  required
                />
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{
              mt: 3,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              backgroundColor: "#1FC9A4",
            }}>
            {student ? "Edit Student" : "Create Student"}
          </Button>
          <ToastContainer />
        </Box>
      </Card>
    </>
  );
}

export default CreateStudent;
