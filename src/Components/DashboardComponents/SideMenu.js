import * as React from "react";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuContent from "./MenuContent";
import OptionsMenu from "./OptionsMenu";
import { SitemarkIcon } from "../../Utils/CustomIcons";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

function stringToColor(string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string?.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value?.toString(16)}`.slice(-2);
  }
  return color;
}

function stringAvatar(name) {
  if (!name) return {}; 

  const nameParts = name.split(" ");
  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : nameParts[0][0];

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: initials.toUpperCase(),
  };
}

export default function SideMenu({ user }) {
  return (
    <Drawer
      variant='permanent'
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "calc(var(--template-frame-height, 0px) + 4px)",
          p: 1.5,
        }}>
        <SitemarkIcon />
      </Box>
      <Divider />
      <MenuContent />
      <Stack
        direction='row'
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}>
        <Avatar
          sx={{ width: 36, height: 36 }}
          sizes='small'
          {...stringAvatar(user?.fullName.toUpperCase())}
          alt={user?.fullName.toUpperCase()}
        />
        <Box sx={{ mr: "auto" }}>
          <Typography
            variant='body2'
            sx={{ fontWeight: 500, lineHeight: "16px" }}>
            {user?.fullName.toUpperCase()}
          </Typography>
          <Typography variant='caption' sx={{ color: "text.secondary" }}>
            {user?.email}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
