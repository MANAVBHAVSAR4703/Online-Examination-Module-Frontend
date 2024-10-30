import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import Cookies from "js-cookie";
import axios from "axios";
import api from '../Constants/Api.js'
import { SitemarkIcon } from "../Utils/CustomIcons.js";
import ColorModeSelect from "../Theme/ColorModeSelect.js";
import { setUser } from "../reducers/authSlice.js"; 

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignIn(props) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [message, setMessage] = React.useState("");

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    try {
      const response = await axios.post(
        `${api.Login}`,
        { email, password }
      );
      const { token, data, success, message } = response.data;
      if (success) {
        dispatch(setUser(data));
        Cookies.set("token", token);
        setMessage("");
        navigate("/dashboard");
      } else {
        setMessage(message);
      }
    } catch (error) {
      setMessage(error?.response?.data?.message || "Something went wrong");
    }
  };

  const validateInputs = () => {
    let isValid = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password || password.length < 4) {
      setPasswordError("Password must be at least 4 characters long.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  return (
    <SignInContainer direction='column' justifyContent='space-between'>
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
      <Card variant='outlined'>
        <SitemarkIcon />
        <Typography
          component='h1'
          variant='h4'
          sx={{ fontSize: "clamp(2rem, 10vw, 2.15rem)" }}>
          Sign in
        </Typography>
        {message && <Typography color='error'>{message}</Typography>}
        <Box
          component='form'
          onSubmit={handleSubmit}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <TextField
              id='email'
              type='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              placeholder='your@email.com'
              autoComplete='email'
              fullWidth
              variant='outlined'
              required
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='password'>Password</FormLabel>
            <TextField
              id='password'
              type='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              placeholder='••••••'
              autoComplete='current-password'
              fullWidth
              variant='outlined'
              required
            />
          </FormControl>
          <Button type='submit' fullWidth variant='contained'>
            Sign in
          </Button>
          <Link
            component='button'
            onClick={() => alert("Forgot Password Clicked")}>
            Forgot your password?
          </Link>
        </Box>
      </Card>
    </SignInContainer>
  );
}
