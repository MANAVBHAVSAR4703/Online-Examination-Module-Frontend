import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { DarkMode, LightMode } from "@mui/icons-material";

export default function ColorModeSelect(props) {
  const [mode, setMode] = React.useState(
    localStorage.getItem("mode") || "dark"
  );

  const handleChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);
    localStorage.setItem("mode", selectedMode);
    window.location.reload(); 
  };

  return (
    <Select
      value={mode}
      onChange={handleChange}
      size="small"
      SelectDisplayProps={{
        "data-screenshot": "toggle-mode",
      }}
      {...props}>
      <MenuItem value='light'><LightMode sx={{height:'15px',width:"15px"}}/></MenuItem>
      <MenuItem value='dark'><DarkMode sx={{height:'15px',width:"15px"}}/></MenuItem>
    </Select>
  );
}
