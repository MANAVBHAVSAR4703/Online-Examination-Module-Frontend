import React from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function QuestionViewComponent({ questions }) {
  return (
    <Box sx={{ padding: 3 }} style={{width:'85%'}}>
      <Typography variant='h4' gutterBottom align='center'>
        Question List
      </Typography>
      {questions.map((question) => (
        <Accordion key={question.id} sx={{ marginBottom: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Chip
              label={question.category}
              color='primary'
              variant='outlined'
              sx={{ marginRight: 1 }}
            />
            <Typography variant='h7' style={{ marginLeft: "10px" }}>
              {question.text}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant='subtitle1' sx={{ marginBottom: 1 }}>
              Options:
            </Typography>
            {question.options.map((option, index) => (
              <Box
                key={option.id}
                sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant='body2' sx={{ marginRight: 1 }}>
                  {String.fromCharCode(65 + index)}.
                </Typography>
                <Typography variant='body2'>{option.text}</Typography>
              </Box>
            ))}
            <Typography variant='body2' sx={{ marginTop: 1, color: "green" }}>
              Correct Option:{" "}
              {String.fromCharCode(65 + question.correctOptionIndex)}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default QuestionViewComponent;
