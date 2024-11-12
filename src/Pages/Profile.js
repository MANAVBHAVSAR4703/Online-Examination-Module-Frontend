import * as React from "react";
import { Box, Avatar, Typography, Button, Paper } from "@mui/material";
import { styled } from "@mui/system";
import { useSelector } from "react-redux"; // Import useSelector from react-redux

const ProfileContainer = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(5),
  maxWidth: 700,
  margin: "auto",
  borderRadius: "20px",
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.paper,
}));

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

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return (
      <Typography variant='h6' color='error'>
        User not found
      </Typography>
    );
  }

  return (
    <ProfileContainer>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          mb: 2,
        }}
        {...stringAvatar(user?.fullName.toUpperCase())}
        alt={user?.fullName.toUpperCase()}></Avatar>

      <Typography
        variant='h5'
        component='h2'
        sx={{ fontWeight: "bold", px: 3, pt: 3 }}>
        {user?.fullName.toUpperCase()}
      </Typography>
      
      <Typography
        variant='body2'
        sx={{ fontWeight: "bold", color: "text.secondary", mb: 3 }}>
        {user?.email}
      </Typography>

      <Button variant='outlined' color='primary' fullWidth>
        Edit Profile
      </Button>
    </ProfileContainer>
  );
};

export default Profile;
