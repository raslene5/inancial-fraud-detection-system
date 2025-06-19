import { Box, Typography, useTheme, alpha } from "@mui/material";
import { tokens } from "../../theme";
import { motion } from "framer-motion";

const FaqHeader = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <Box sx={{ mb: 4, textAlign: "center" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography 
          variant="h1" 
          fontWeight="bold" 
          sx={{ 
            mb: 1,
            background: `linear-gradient(90deg, ${colors.grey[100]}, ${colors.greenAccent[500]}, ${colors.blueAccent[400]}, ${colors.grey[100]})`,
            backgroundSize: "200% auto",
            color: "transparent",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            animation: "gradient 6s linear infinite",
            "@keyframes gradient": {
              "0%": {
                backgroundPosition: "0% center"
              },
              "100%": {
                backgroundPosition: "200% center"
              }
            },
            textShadow: `0 5px 15px ${alpha(colors.primary[900], 0.2)}`
          }}
        >
          Knowledge Base
        </Typography>
        
        <Typography
          variant="h4"
          sx={{
            color: alpha(colors.grey[100], 0.8),
            fontWeight: 300,
            maxWidth: "800px",
            mx: "auto",
            lineHeight: 1.5,
            textShadow: `0 2px 10px ${alpha(colors.primary[900], 0.3)}`
          }}
        >
          Comprehensive guide to our advanced Fraud Detection System
        </Typography>
      </motion.div>
      
      <Box
        component={motion.div}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        sx={{
          width: "100px",
          height: "4px",
          background: `linear-gradient(90deg, ${colors.greenAccent[500]}, ${colors.blueAccent[400]})`,
          mx: "auto",
          mt: 2,
          borderRadius: "2px",
          boxShadow: `0 2px 8px ${alpha(colors.greenAccent[500], 0.5)}`
        }}
      />
    </Box>
  );
};

export default FaqHeader;