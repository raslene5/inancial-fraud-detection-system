import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const AnimatedGradientText = ({ children, fontSize, fontWeight }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <Box
      component="span"
      sx={{
        background: `linear-gradient(90deg, 
          ${colors.grey[100]}, 
          ${colors.greenAccent[500]}, 
          ${colors.blueAccent[400]}, 
          ${colors.purpleAccent[400]}, 
          ${colors.grey[100]})`,
        backgroundSize: "200% auto",
        color: "transparent",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        fontSize: fontSize,
        fontWeight: fontWeight,
        animation: "gradient 6s linear infinite",
        display: "inline-block",
        "@keyframes gradient": {
          "0%": {
            backgroundPosition: "0% center"
          },
          "100%": {
            backgroundPosition: "200% center"
          }
        }
      }}
    >
      {children}
    </Box>
  );
};

export default AnimatedGradientText;