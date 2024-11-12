import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Delete, EditNote, OpenInNew } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import api from "../Constants/Api";
import { IconButton, Tooltip } from "@mui/material";
import Loading from "../Components/Loading";
import { format } from "date-fns";

function ExamTable() {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  const AuthStr = `Bearer ${token}`;
  const [exams, setExams] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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

  React.useEffect(() => {
    fetchExams();
  }, []);

  const handleViewDetails = (exam) => {
    navigate(`/dashboard/view-exams/${exam.id}`, {
      state: { examData: exam },
    });
  };

  const deleteExam = async (examData) => {
    try {
      const response = await axios.post(
        api.deleteExam + `/${examData?.id}`,
        null,
        {
          headers: {
            Authorization: AuthStr,
          },
        }
      );
      if (response.data.success) {
        toast.success(response?.data?.message);
        setExams((prevExams) =>
          prevExams.filter((exam) => exam.id !== examData.id)
        );
      } else {
        toast.error(response?.data?.message || "Failed to Delete Exam");
      }
    } catch (error) {
      console.error("Error deleting exam:", error);
      toast.error(error?.response?.data?.message || "An Error Occurred!");
    }
  };

  const columns = [
    { field: "title", headerName: "Title", width: 300 },
    {
      field: "startTime",
      headerName: "Start Time",
      width: 250,
      valueFormatter: (params) => {
        const date = new Date(params);
        if (isNaN(date.getTime())) {
          return "Invalid Date";
        }
        return format(date, "MM/dd/yyyy, HH:mm");
      },
    },
    { field: "duration", headerName: "Duration (min)", width: 150 },
    {
      field: "passingCriteria",
      headerName: "Passing Criteria (%)",
      width: 100,
    },
    {
      field: "completed",
      headerName: "Completed",
      width: 100,
      valueFormatter: (params) => (params ? "Yes" : "No"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Tooltip title='View Details'>
            <IconButton onClick={() => handleViewDetails(params.row)}>
              <OpenInNew color="success"/>
            </IconButton>
          </Tooltip>
          <Tooltip title='Edit Exam'>
            <IconButton
              onClick={() =>
                navigate("/dashboard/edit-exam", {
                  state: { exam: params.row },
                })
              }>
              <EditNote color='info' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete Exam'>
            <IconButton onClick={() => deleteExam(params.row)}>
              <Delete color='error' />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  if (loading) {
    return <Loading />;
  }

  return (
    <Paper sx={{ width: "100%", padding: 3 }}>
      <ToastContainer />
      <DataGrid
        rows={exams}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableSelectionOnClick
        getRowId={(row) => row.id}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}

export default ExamTable;
