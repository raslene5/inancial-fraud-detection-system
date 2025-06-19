import { Box } from "@mui/material";
import { motion } from "framer-motion";

const AnimatedBox = ({ children, ...props }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default AnimatedBox;