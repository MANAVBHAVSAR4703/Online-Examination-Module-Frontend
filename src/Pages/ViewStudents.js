import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../Constants/Api";
import Cookies from "js-cookie";
import Loading from "../Components/Loading";
import StudentViewComponent from "../Components/StudentViewComponent";

function StudentTable() {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  let AuthStr = `Bearer ${token}`;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(api.GetStudents, {
          headers: {
            Authorization: AuthStr,
          },
        });
        setStudents(response?.data?.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return <StudentViewComponent students={students} />;
}

export default StudentTable;
