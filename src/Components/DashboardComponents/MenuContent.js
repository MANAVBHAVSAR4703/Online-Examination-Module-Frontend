import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { useNavigate } from "react-router-dom";
import {
  Computer,
  Groups2,
  Person,
  QuestionAnswer,
  QuestionMark,
  Quiz,
} from "@mui/icons-material";
import { Chip, Divider } from "@mui/material";

const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, naviagteLink: "/dashboard" },
  {
    text: "Create Student",
    icon: <Person />,
    naviagteLink: "/dashboard/create-student",
    chip: "Student",
  },
  {
    text: "View Students",
    icon: <Groups2 />,
    naviagteLink: "/dashboard/view-students",
  },
  {
    text: "Add Questions",
    icon: <QuestionMark />,
    naviagteLink: "/dashboard/add-question",
    chip: "Question",
  },
  {
    text: "View Questions",
    icon: <QuestionAnswer />,
    naviagteLink: "/dashboard/view-questions",
  },
  {
    text: "View Programming Questions",
    icon: <Computer />,
    naviagteLink: "/dashboard/view-programmingQuestions",
  },
  {
    text: "Create Exam",
    icon: <AssignmentRoundedIcon />,
    naviagteLink: "/dashboard/create-exam",
    chip: "Exam",
  },
  {
    text: "View Exams",
    icon: <Quiz />,
    naviagteLink: "/dashboard/view-exams",
  },
  {
    text: "View Results",
    icon: <AssignmentRoundedIcon />,
    naviagteLink: "/dashboard/exam-results",
    chip: "Results",
  },
];

const secondaryListItems = [
  { text: "Settings", icon: <SettingsRoundedIcon /> },
  { text: "About", icon: <InfoRoundedIcon /> },
  { text: "Feedback", icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {
  const navigate = useNavigate();
  const [selectedIndex, setIndex] = React.useState(0);

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {mainListItems?.map((item, index) => (
          <>
            {" "}
            {item?.chip && (
              <Divider>
                <Chip label={item?.chip} size='small' sx={{fontWeight:'bold',color:"white",background:"black",p:'2px'}}/>
              </Divider>
            )}
            <ListItem
              key={index}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => {
                navigate(item?.naviagteLink);
                setIndex(index);
              }}>
              <ListItemButton selected={index === selectedIndex}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          </>
        ))}
      </List>

      <List dense>
        {secondaryListItems?.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
