import * as React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StatCard from "./StatCard";
import Loading from "../Loading";
import axios from "axios";
import api from "../../Constants/Api";
import Cookies from "js-cookie";
import {
  ArticleOutlined,
  Computer,
  PersonOutline,
  QuizOutlined,
  SchoolOutlined,
  TungstenOutlined,
} from "@mui/icons-material";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";

export default function MainGrid() {
  const token = Cookies.get("token");
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }
  let AuthStr = `Bearer ${token}`;

  const [overview, setOverview] = React.useState();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await axios.get(api.GetOverview, {
          headers: {
            Authorization: AuthStr,
          },
        });
        setOverview(response?.data?.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching overview:", error);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const data = [
    {
      title: "Students",
      value: overview?.studentCount??0,
      icon: <PersonOutline />,
    },
    {
      title: "Exams",
      value: overview?.examCount??0,
      icon: <ArticleOutlined />,
    },
    {
      title: "Questions",
      value:
        (overview?.programmingQuestionsCount +
        overview?.technicalQuestionsCount+
        overview?.logicalQuestionsCount),
      icon: <QuizOutlined />,
    },
    {
      title: "Colleges",
      value: overview?.collegesCount??0,
      icon: <SchoolOutlined />,
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        mx: "auto",
        padding: "20px", 
      }}>
      <Typography
        component='h2'
        variant='h6'
        sx={{ mb: 4, textAlign: "center", fontFamily: "cursive" }}>
        Overview
      </Typography>

      <Grid container spacing={4} justifyContent='center'>
        {data?.map((item, index) => (
          <Grid
            item
            xs={12} 
            sm={6} 
            md={3} 
            key={index}>
            <StatCard title={item.title} value={item.value} icon={item.icon} />
          </Grid>
        ))}
      </Grid>

      <Typography
        component='h2'
        variant='h6'
        sx={{ my: 6, textAlign: "center", fontFamily: "cursive" }}>
        Question Bank
      </Typography>

      <Grid container spacing={4} justifyContent='center'>
        <Grid item xs={12} sm={6} md={3} key={"programmingQuestionsCount"}>
          <StatCard
            title={"Programming Questions"}
            value={overview?.programmingQuestionsCount??0}
            icon={<Computer />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} key={"technicalQuestionsCount"}>
          <StatCard
            title={"Technical Questions"}
            value={overview?.technicalQuestionsCount??0}
            icon={<TungstenOutlined />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} key={"logicalQuestionsCount"}>
          <StatCard
            title={"Logical Questions"}
            value={overview?.logicalQuestionsCount??0}
            icon={<PsychologyOutlinedIcon />}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
