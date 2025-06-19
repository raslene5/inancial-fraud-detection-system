import { lazy, Suspense } from "react";
import { Box, CircularProgress, useTheme, alpha } from "@mui/material";
import { tokens } from "../../theme";
import { motion } from "framer-motion";

// Lazy load the enhanced FAQ component for better performance
const EnhancedFaq = lazy(() => import("./EnhancedFaq"));

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  return (
    <Suspense fallback={
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="80vh"
        sx={{
          background: `radial-gradient(circle at 50% 50%, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Animated background particles */}
        {[...Array(8)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            animate={{
              x: [0, Math.random() * 40 - 20],
              y: [0, Math.random() * 40 - 20],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            sx={{
              position: "absolute",
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(colors.greenAccent[500], 0.2)}, transparent)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              zIndex: 1,
              pointerEvents: "none",
            }}
          />
        ))}
        
        <Box
          component={motion.div}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          sx={{
            position: "absolute",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: `4px solid ${alpha(colors.greenAccent[500], 0.3)}`,
            zIndex: 1
          }}
        />
        
        <CircularProgress 
          size={60}
          thickness={4}
          sx={{ 
            color: colors.greenAccent[500],
            filter: `drop-shadow(0 0 10px ${colors.greenAccent[500]}80)`,
            zIndex: 2
          }}
        />
      </Box>
    }>
      <EnhancedFaq />
    </Suspense>
  );
};

export default FAQ;