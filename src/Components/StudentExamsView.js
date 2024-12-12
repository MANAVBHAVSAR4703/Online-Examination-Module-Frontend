import {
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import api from "../Constants/Api";

function StudentExamsView() {
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const [enrolledExams, setEnrolledExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleViewDetails = (exam) => {
    navigate("/dashboard/exam-details", { state: { exam } });
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchEnrolledExams = async () => {
      try {
        const response = await axios.get(api.GetEnrolledExams, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnrolledExams(response?.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching enrolled exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledExams();
  }, [token, navigate]);

  return (
    <Container sx={{ my: 4, flex: 1 }}>
      <Typography variant='h4' gutterBottom>
        Enrolled Exams
      </Typography>
      {loading ? (
        <Loading />
      ) : enrolledExams.length > 0 ? (
        <Paper elevation={3} sx={{ p: 2 }}>
          <List>
            {enrolledExams?.map((exam) => (
              <ListItem key={exam.id} divider>
                <ListItemText
                  primary={exam.title}
                  secondary={`Start Time: ${new Date(
                    exam.startTime
                  ).toLocaleString()}`}
                />
                <Button
                  variant='outlined'
                  onClick={() => handleViewDetails(exam)}>
                  View Details
                </Button>
              </ListItem>
            ))}
          </List>
        </Paper>
      ) : (
        <Typography variant='body1'>No exams enrolled yet.</Typography>
      )}
    </Container>
  );
}

export default StudentExamsView;
