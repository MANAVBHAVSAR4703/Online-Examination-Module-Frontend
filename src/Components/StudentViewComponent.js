import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { Delete, EditNote } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";
import api from "../Constants/Api";
import { Box, IconButton, Tooltip } from "@mui/material";

export default function StudentViewComponent({ students }) {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  const AuthStr = `Bearer ${token}`;
  const navigate = useNavigate();
  
  const [studentList, setStudentList] = React.useState(students);

  const deleteStudent = async (studentData) => {
    try {
      const response = await axios.post(api.deleteStudent, studentData, {
        headers: {
          Authorization: AuthStr,
        },
      });
      if (response.data.success) {
        toast.success(response?.data?.message);
        setStudentList((prevStudents) =>
          prevStudents.filter((student) => student.email !== studentData.email)
        );
      } else {
        toast.error(response?.data?.message || "Failed to Delete Student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      toast.error(error?.response?.data?.message || "An Error Occurred!");
    }
  };

  const columns = [
    { field: "email", headerName: "Email", width: 350 },
    { field: "fullName", headerName: "Full Name", width: 200 },
    { field: "enrollNo", headerName: "Enrollment Number", width: 200 },
    { field: "college", headerName: "College", width: 250 },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <Box display="flex" alignItems="center">
            <Tooltip title="Edit Student">
              <IconButton
                onClick={() =>
                  navigate("/dashboard/edit-student", {
                    state: { student: params.row },
                  })
                }
              >
                <EditNote color="info" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Student">
              <IconButton onClick={() => deleteStudent(params.row)}>
                <Delete color="error" />
              </IconButton>
            </Tooltip>
          </Box>
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <Paper sx={{ width: "100%" }}>
      <ToastContainer />
      <DataGrid
        rows={studentList}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableSelectionOnClick
        getRowId={(row) => row.email}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
