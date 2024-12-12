import React, { useState } from "react";
import { Box, Tab, Card, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AddQuestion from "./AddQuestion";
import AddProgrammingQuestion from "./AddProgrammingQuestion";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import api from "../Constants/Api";
import { UploadFile } from "@mui/icons-material";

export default function QuestionTabs() {
  const [tabValue, setTabValue] = useState("1");
  const [file, setFile] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const token = Cookies.get("token");
  
  if (!token) {
    throw new Error("JWT token not found in cookie");
  }

  let AuthStr = `Bearer ${token}`;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];

    if (uploadedFile) {
      const fileType = uploadedFile.type;
      if (!fileType.includes("excel") && !uploadedFile.name.endsWith(".xlsx")) {
        toast.error("Please upload a valid Excel file.");
        return;
      }

      setFile(uploadedFile);
      setOpenModal(true); 
    }
  };

  const handleFileSubmit = () => {
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(api.uploadQuestion, formData, {
        headers: {
          Authorization: AuthStr,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        toast.success(response.data);
        setOpenModal(false); 
      })
      .catch((error) => {
        toast.error("Error uploading file.");
        setOpenModal(false); 
      });
  };

  return (
    <>
      <Box mt={3} display="flex" sx={{ justifyContent: "end",width:'100%' }}>
        <input
          accept=".xlsx, .xls"
          style={{ display: "none" }}
          id="upload-excel-file"
          type="file"
          onChange={handleFileUpload}
        />
        <label htmlFor="upload-excel-file" style={{width:'20%'}}>
          <Button variant="contained" component="span" size="small">
          <IconButton><UploadFile fontSize="small"/></IconButton> Import Excel Sheet
          </Button>
        </label>
      </Box>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Confirm File Upload</DialogTitle>
        <DialogContent>
          <Typography variant="body1">File: {file ? file.name : "No file selected"}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleFileSubmit} color="primary">
            Upload File
          </Button>
        </DialogActions>
      </Dialog>

      <Card sx={{ padding: "2%", width: "100%", maxWidth: "800px", margin: "auto" }}>
        <Typography variant="h4" gutterBottom fontFamily={"cursive"}>
          Add Question
        </Typography>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleTabChange} aria-label="Question Tabs">
                <Tab label="Add MCQ" value="1" />
                <Tab label="Add Programming Question" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <AddQuestion />
            </TabPanel>
            <TabPanel value="2">
              <AddProgrammingQuestion />
            </TabPanel>
          </TabContext>
        </Box>
      </Card>
    </>
  );
}
