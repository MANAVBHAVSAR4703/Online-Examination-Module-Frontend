import { Paper } from "@mui/material";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

function StudentViewComponent({ students }) {
  return (
    <Paper elevation={3} sx={{ padding: 3, margin: "20px auto", width: "80%" }}>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {students?.map((student) => (
              <TableRow key={student?.email}>
                <TableCell>{student?.email}</TableCell>
                <TableCell>{student?.fullName}</TableCell>
                <TableCell>{student?.enrollNo}</TableCell>
                <TableCell>{student?.college}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default StudentViewComponent;
