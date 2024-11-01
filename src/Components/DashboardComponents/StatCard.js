import React from "react";
import { Paper, Typography, Box } from "@mui/material";

function StatCard({ title, value }) {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        textAlign: "center",
        minHeight: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5"
      }}
    >
      <Typography variant="h6" color="textSecondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4" color="primary">
        {value}
      </Typography>
    </Paper>
  );
}

export default StatCard;
