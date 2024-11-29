import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Paper, IconButton, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { OpenInNew } from "@mui/icons-material";

function ExamResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { exam } = location.state;

  const columns = [
    { field: "studentEmail", headerName: "Student Email", flex: 1 },
    {
      field: "correctAnswerTotal",
      headerName: "Correct Answers",
      flex: 0.5,
    },
    {
      field: "passed",
      headerName: "Passed",
      flex: 0.5,
      valueFormatter: (params) => (params ? "Yes" : "No"),
    },
    {
      field: "programmingResults",
      headerName: "Programming Code",
      flex: 0.5,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title='View Programming Results'>
          <IconButton
            onClick={() =>
              navigate("programming-results", {
                state: {
                  programmingResponses: params.row.programmingQuestionResponses,
                },
              })
            }>
            <OpenInNew color='success' />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const rows = exam?.studentResults?.map((student, index) => ({
    id: index,
    ...student,
  }));

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Typography variant='h4' gutterBottom>
        Results for {exam.examName}
      </Typography>
      <Typography variant='h6' gutterBottom>
        Total Passed: {exam.totalPassed}
      </Typography>
      <Paper sx={{ height: 400, mt: 3 }}>
        <DataGrid
          rows={rows || []}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          sx={{ border: 0 }}
        />
      </Paper>
    </Box>
  );
}

export default ExamResultPage;
