import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation } from "react-router-dom";

const StudentResults = () => {
  const location = useLocation();
  const { programmingResponses } = location?.state;
  console.log(programmingResponses);
  return (
    <Box
      sx={{
        padding: 3,
        minHeight: "100vh",
        width: "100%",
      }}>
      <Box sx={{ marginBottom: 4 }}>
        <Paper
          elevation={3}
          sx={{
            padding: 2,
            borderRadius: 2,
            marginBottom: 2,
          }}>
          {programmingResponses?.length > 0 ? (
            programmingResponses.map((response, idx) => (
              <Accordion key={idx} sx={{ marginBottom: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${idx}-content`}
                  id={`panel-${idx}-header`}>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                    }}>
                    Question {idx + 1} : {response?.question?.text}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant='subtitle1'
                        gutterBottom
                        sx={{ fontWeight: "bold" }}>
                        Student Code
                      </Typography>
                      <Box>{response?.code}</Box>
                    </Grid>
                    <Divider />
                    <Grid item xs={12} md={6}>
                      <Typography
                        variant='subtitle1'
                        gutterBottom
                        sx={{ fontWeight: "bold" }}>
                        Reference Code
                      </Typography>
                      <Box>{response?.refCode}</Box>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography
              sx={{
                fontWeight: "bold",
              }}>
              No Programming Questions
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default StudentResults;
