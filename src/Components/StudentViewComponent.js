import { Paper } from "@mui/material";
import React from "react";
import { Delete, EditNoteRounded } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../Constants/Api";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";

function StudentViewComponent({ students }) {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  let AuthStr = `Bearer ${token}`;
  const navigate = useNavigate();
  const deleteStudent = async (studentData) => {
    try {
      const response = await axios.post(api.deleteStudent, studentData, {
        headers: {
          Authorization: AuthStr,
        },
      });
      if (response.data.success) {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message || "Failed to Delete Student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error(error?.response?.data?.message || "An Error Occured !");
    }
  };
  return (
    <Paper elevation={3} sx={{ padding: 3, margin: "20px auto", width: "80%" }}>
      <ToastContainer />
      <Typography variant='h4' component='h2' align='center' gutterBottom>
        Student Information
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Enrollment Number</TableCell>
              <TableCell>College</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students?.map((student) => (
              <TableRow key={student?.email}>
                <TableCell>{student?.email}</TableCell>
                <TableCell>{student?.fullName}</TableCell>
                <TableCell>{student?.enrollNo}</TableCell>
                <TableCell>{student?.college}</TableCell>
                <TableCell sx={{ display: "flex" }}>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate("/dashboard/edit-student", {
                        state: { student },
                      })
                    }>
                    <EditNoteRounded />
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => deleteStudent(student)}>
                    <Delete />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default StudentViewComponent;
