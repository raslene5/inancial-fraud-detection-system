import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { motion } from "framer-motion";

const StatBox = ({ title, subtitle, icon, progress, increase, description }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      width="100%"
      m="0 30px"
      sx={{
        background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
        borderRadius: "12px",
        boxShadow: `0px 8px 24px rgba(0, 0, 0, 0.15)`,
        border: `1px solid ${colors.primary[600]}`,
        overflow: "hidden",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "5px",
          background: `linear-gradient(90deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
        }
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p="15px 20px"
      >
        <Box>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{ color: colors.grey[100], mb: "4px" }}
          >
            {title}
          </Typography>
          <Typography variant="h3" fontWeight="bold" sx={{ color: colors.grey[100] }}>
            {subtitle}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: colors.primary[600],
            borderRadius: "50%",
            p: "10px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
          }}
        >
          {icon}
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        p="15px 20px"
        sx={{
          backgroundColor: colors.primary[600],
          borderTop: `1px solid ${colors.primary[700]}`,
        }}
      >
        <Typography variant="body2" sx={{ color: colors.grey[300] }}>
          {description}
        </Typography>
        <Typography
          variant="body2"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[500], fontWeight: "bold" }}
        >
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;