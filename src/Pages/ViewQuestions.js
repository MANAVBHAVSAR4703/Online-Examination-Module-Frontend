import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../Constants/Api";
import Cookies from "js-cookie";
import Loading from "../Components/Loading";
import QuestionViewComponent from "../Components/QuestionViewComponent";

function ViewQuestions() {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  let AuthStr = `Bearer ${token}`;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(api.GetQuestions, {
          headers: {
            Authorization: AuthStr,
          },
        });
        setQuestions(response?.data?.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return <QuestionViewComponent questions={questions} />;
}

export default ViewQuestions;
