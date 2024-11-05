import React from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
} from "@mui/material";

function ExamResultPage() {
  const location = useLocation();
  const { exam } = location.state;

  return (
    <Box sx={{ p: 3, width: "70%" }}>
      <Typography variant='h4' gutterBottom>
        Results for {exam.examName}
      </Typography>
      <Typography variant='h6'>Total Passed: {exam.totalPassed}</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Email</TableCell>
              <TableCell align='right'>Correct Answers</TableCell>
              <TableCell align='right'>Passed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exam?.studentResults?.length > 0 ? (
              exam?.studentResults?.map((student, index) => (
                <TableRow key={index}>
                  <TableCell component='th' scope='row'>
                    {student?.studentEmail}
                  </TableCell>
                  <TableCell align='right'>
                    {student?.correctAnswerTotal}
                  </TableCell>
                  <TableCell align='right'>
                    {student.passed ? "Yes" : "No"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align='center'>
                  <Typography>No results available for this exam.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ExamResultPage;
