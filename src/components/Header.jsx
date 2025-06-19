import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <Box mb="30px">
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ 
          mb: "5px",
          textShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
          background: `linear-gradient(90deg, ${colors.grey[100]} 0%, ${colors.grey[300]} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: "0.5px"
        }}
      >
        {title}
      </Typography>
      <Typography 
        variant="h5" 
        color={colors.greenAccent[400]}
        sx={{ 
          fontWeight: "500",
          letterSpacing: "0.5px"
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;