import * as React from "react";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StatCard from "./StatCard";
import Loading from "../Loading";
import axios from "axios";
import api from "../../Constants/Api";
import Cookies from "js-cookie";

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
    { title: "Students", value: overview?.studentCount },
    { title: "Exams", value: overview?.examCount },
    {
      title: "Total Questions",
      value:
        overview?.programmingQuestionsCount +
        overview?.logicalQuestionsCount +
        overview?.technicalQuestionsCount,
    },
    { title: "Colleges", value: overview?.collegesCount },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
        mx: "auto",
      }}>
      <Typography
        component='h2'
        variant='h6'
        sx={{ mb: 4, textAlign: "center" }}>
        Overview
      </Typography>
      <Grid container spacing={4} justifyContent='center'>
        {data.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} size={3}>
            <StatCard {...card} />
          </Grid>
        ))}
      </Grid>
      <Typography
        component='h2'
        variant='h6'
        sx={{ my: 6, textAlign: "center" }}>
        Question Categories
      </Typography>
      <Grid container spacing={4} justifyContent='center'>
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          key={"programmingQuestionsCount"}
          size={4}>
          <StatCard
            title={"Programming Questions"}
            value={overview?.programmingQuestionsCount}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          key={"technicalQuestionsCount"}
          size={4}>
          <StatCard
            title={"Technical Questions"}
            value={overview?.technicalQuestionsCount}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3} key={"logicalQuestionsCount"} size={4}>
          <StatCard
            title={"Logical Questions"}
            value={overview?.logicalQuestionsCount}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
