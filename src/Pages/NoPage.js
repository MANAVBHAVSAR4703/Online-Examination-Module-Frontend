import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
import {useNavigate } from "react-router-dom";

const FullPageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100%",
  position: "absolute", 
  top: 0,
  left: 0,
  backgroundImage: "url('https://images.unsplash.com/gifs/fail/fail-3.gif')", 
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "relative",
  color: "#fff",
  textAlign: "center",
  overflow: "hidden",
  fontFamily: "'Roboto', sans-serif",
}));

const Overlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.6)", 
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  zIndex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  maxWidth: "600px",
  background: "rgba(0, 0, 0, 0.3)", 
  borderRadius: "8px",
}));

const GraphicsText = styled(Typography)(({ theme }) => ({
  fontSize: "48px",
  fontWeight: "bold",
  letterSpacing: "2px",
  textTransform: "uppercase",
  animation: "fadeIn 2s ease-in-out",
}));

const ButtonStyled = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(2, 5),
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  borderRadius: "30px",
  fontSize: "18px",
  transition: "background-color 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  },
}));

const GlobalStyles = styled("style")`
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

function NoPage() {
  const navigate = useNavigate();
  
  const goBackHome = () => {
    navigate("/");
  };

  return (
    <FullPageContainer>
      <Overlay />
      <GlobalStyles />
      <ContentWrapper>
        <GraphicsText variant='h3'>403 - Forbidden</GraphicsText>
        <Typography variant='h5' sx={{ marginTop: 2 }}>
          Sorry, you don't have permission to access this page.
        </Typography>
        <ButtonStyled onClick={goBackHome}>Go Back Home</ButtonStyled>
      </ContentWrapper>
    </FullPageContainer>
  );
}

export default NoPage;
