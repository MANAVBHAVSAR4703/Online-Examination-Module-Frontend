import React, { useState } from "react";
import { Box, Tab, Card, Typography } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AddQuestion from "./AddQuestion";
import AddProgrammingQuestion from "./AddProgrammingQuestion"; 

export default function QuestionTabs() {
  const [tabValue, setTabValue] = useState("1");

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Card
      sx={{ padding: "2%", width: "100%", maxWidth: "800px", margin: "auto" }}>
      <Typography variant='h4' gutterBottom fontFamily={"cursive"}>
        Add Question
      </Typography>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleTabChange} aria-label='Question Tabs'>
              <Tab label='Add MCQ' value='1' />
              <Tab label='Add Programming Question' value='2' />
            </TabList>
          </Box>
          <TabPanel value='1'>
            <AddQuestion />
          </TabPanel>
          <TabPanel value='2'>
            <AddProgrammingQuestion />{" "}
          </TabPanel>
        </TabContext>
      </Box>
    </Card>
  );
}
