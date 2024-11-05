import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import { Link, useNavigate } from "react-router-dom";

const mainListItems = [
  { text: "Home", icon: <HomeRoundedIcon />, naviagteLink: "/dashboard" },
  {
    text: "Create Student",
    icon: <PeopleRoundedIcon />,
    naviagteLink: "/dashboard/create-student",
  },
  {
    text: "Create Exam",
    icon: <AssignmentRoundedIcon />,
    naviagteLink: "/dashboard/create-exam",
  },
  {
    text: "Add Questions",
    icon: <PeopleRoundedIcon />,
    naviagteLink: "/dashboard/add-question",
  },
  {
    text: "View Students",
    icon: <PeopleRoundedIcon />,
    naviagteLink: "/dashboard/view-students",
  },
  {
    text: "View Exams",
    icon: <AssignmentRoundedIcon />,
    naviagteLink: "/dashboard/view-exams",
  },
  {
    text: "View Questions",
    icon: <AssignmentRoundedIcon />,
    naviagteLink: "/dashboard/view-questions",
  },
  {
    text: "View Results",
    icon: <AssignmentRoundedIcon />,
    naviagteLink: "/dashboard/exam-results",
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
        {mainListItems.map((item, index) => (
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
        ))}
      </List>

      <List dense>
        {secondaryListItems.map((item, index) => (
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
