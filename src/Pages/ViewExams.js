import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  IconButton,
  Collapse,
} from "@mui/material";
// import { ExpandMore, ExpandLess } from "@mui/icons-material";
import axios from "axios";
import api from "../Constants/Api";
import Loading from "../Components/Loading";
import Cookies from "js-cookie";
import { LinkRounded } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function ExamTable() {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  let AuthStr = `Bearer ${token}`;
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(api.GetExams, {
          headers: {
            Authorization: AuthStr,
          },
        });
        setExams(response?.data?.data);
      } catch (error) {
        console.error("Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleViewDetails = (exam) => {
    navigate(`/dashboard/view-exams/${exam.title.replace(" ", "_")}`, {
      state: { examData: exam },
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Paper elevation={3} sx={{ padding: 3, margin: "20px auto", width: "80%" }}>
      <Typography variant='h4' component='h2' align='center' gutterBottom>
        Exam List
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Start Time</TableCell>
              <TableCell>Duration (minutes)</TableCell>
              <TableCell>Passing Criteria (%)</TableCell>
              <TableCell>Details</TableCell>
              <TableCell>Completed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exams.map((exam) => (
              <React.Fragment key={exam.title}>
                <TableRow>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>
                    {new Date(exam.startTime).toLocaleString()}
                  </TableCell>
                  <TableCell>{exam.duration}</TableCell>
                  <TableCell>{exam.passingCriteria}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleViewDetails(exam)}>
                      <LinkRounded />
                    </IconButton>
                  </TableCell>
                  <TableCell>{exam.completed ? "Yes" : "No"}</TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ExamTable;
