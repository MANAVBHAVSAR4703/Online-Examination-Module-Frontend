import React, { useEffect, useState } from "react";
import { Box, Paper, Tooltip, IconButton, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { OpenInNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../Constants/Api";
import Cookies from "js-cookie";
import Loading from "../Components/Loading";

const ViewResultsPage = () => {
  const [examsData, setExamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = Cookies.get("token");

  if (!token) {
    throw new Error("JWT token not found in cookie");
  }

  const AuthStr = `Bearer ${token}`;

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
      } finally {
        setLoading(false);
      }
    };

    fetchExamResults();
  }, []);

  const handleViewResults = (exam) => {
    navigate("/dashboard/exam-results/" + exam.examId, {
      state: { exam },
    });
  };

  const columns = [
    { field: "examName", headerName: "Exam Name", width: 500 },
    {
      field: "examStartTime",
      headerName: "Exam Start Time",
      width: 250,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    { field: "examDuration", headerName: "Exam Duration", width: 250 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <Tooltip title='View Results'>
          <IconButton onClick={() => handleViewResults(params.row)}>
            <OpenInNew color='primary' />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Typography variant='h4' gutterBottom fontFamily={"cursive"}>
        Exam Results
      </Typography>
      <Paper sx={{ width: "100%", padding: 3 }}>
        <DataGrid
          rows={examsData}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10, 20]}
          disableSelectionOnClick
          getRowId={(row) => row.examId}
          sx={{ border: 0 }}
        />
      </Paper>
    </Box>
  );
};

export default ViewResultsPage;
