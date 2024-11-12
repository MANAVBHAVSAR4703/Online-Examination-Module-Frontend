import { createTheme } from "@mui/material/styles";

const mode = localStorage.getItem("mode");

if (mode !== "dark" && mode !==  "light") {
  localStorage.setItem("mode","light");
}

const theme = createTheme({
  palette: {
    mode: localStorage.getItem("mode") || "dark",
    primary: {
      main: "#1FC9A4",
    },
    secondary: {
      main: "#1FC9A4",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export default theme;
