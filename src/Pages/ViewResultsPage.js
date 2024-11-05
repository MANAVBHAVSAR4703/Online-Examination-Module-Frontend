import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";
import axios from "axios";
import api from "../Constants/Api";
import Cookies from "js-cookie";

const ViewResultsPage = () => {
  const [examsData, setExamsData] = useState([]);
  const navigate = useNavigate();
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  
  let AuthStr = `Bearer ${token}`;

  useEffect(() => {
    const fetchExamResults = async () => {
      try {
        const response = await axios.get(api.getExamResults, {
          headers: {
            Authorization: AuthStr,
          },
        });
        setExamsData(response.data);
      } catch (error) {
        console.error("Error fetching exam results", error);
      }
    };

    fetchExamResults();
  }, []);

  const handleViewResults = (exam) => {
    navigate("/dashboard/exam-results/" + exam.examId, {
      state: { exam },
    });
  };

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Typography variant="h4" gutterBottom>
        Exam Results
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Exam Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examsData.length > 0 ? (
              examsData.map((exam) => (
                <TableRow key={exam.examId}>
                  <TableCell component="th" scope="row">
                    {exam.examName}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      onClick={() => handleViewResults(exam)}
                    >
                      View Results
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <Typography>No exams found.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewResultsPage;
