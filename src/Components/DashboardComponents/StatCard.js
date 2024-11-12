import React from "react";
import { Paper, Typography, Box, useTheme } from "@mui/material";

function StatCard({ title, value, icon }) {
  const theme = useTheme();
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        minWidth: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#f9fafc",
      }}>
      <Box display='flex' alignItems='center' mb={1}>
        <Box
          sx={{
            bgcolor:  theme?.palette?.mode==="dark"?"black":"white",
            borderRadius: "50%",
            p: 1,
            border: "2px solid black",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
          }}>
          {icon}
        </Box>
        <Typography variant='subtitle2' color='black'>
          {title}
        </Typography>
      </Box>
      <Typography variant='h5' color='primary'>
        {value}
      </Typography>
    </Paper>
  );
}

export default StatCard;
