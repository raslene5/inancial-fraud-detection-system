import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { motion, useAnimation } from "framer-motion";

const SearchAnimation = ({ isSearching }) => {
  const controls = useAnimation();
  
  useEffect(() => {
    if (isSearching) {
      controls.start({
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
        transition: { 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut" 
        }
      });
    } else {
      controls.stop();
      controls.set({ scale: 1, opacity: 0.7 });
    }
  }, [isSearching, controls]);

  return (
    <Box
      component={motion.div}
      animate={controls}
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: "10px",
        pointerEvents: "none",
        border: "2px solid",
        borderColor: "primary.light",
        zIndex: 0
      }}
    />
  );
};

export default SearchAnimation;