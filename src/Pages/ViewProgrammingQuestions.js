import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../Constants/Api";
import Cookies from "js-cookie";
import Loading from "../Components/Loading";
import ProgrammingQuestionViewComponent from "../Components/ProgrammingQuestionViewComponent";

function ViewProgrammingQuestions() {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  let AuthStr = `Bearer ${token}`;
  const [programmingQuestions, setProgrammingQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgrammingQuestions = async () => {
      try {
        const response = await axios.get(api.GetProgrammingQuestions, {
          headers: {
            Authorization: AuthStr,
          },
        });
        setProgrammingQuestions(response?.data?.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching programming questions:", error);
      }
    };

    fetchProgrammingQuestions();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return <ProgrammingQuestionViewComponent questions={programmingQuestions} />;
}

export default ViewProgrammingQuestions;
