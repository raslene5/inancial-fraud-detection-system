import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  alpha,
  CircularProgress,
  Divider,
  Paper
} from "@mui/material";
import { tokens } from "../../theme";
import { motion, AnimatePresence } from "framer-motion";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import PeopleIcon from "@mui/icons-material/People";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const AnimatedStat = ({ icon, title, value, color, index }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 1500;
    const interval = 15;
    const steps = duration / interval;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 12, 
        delay: index * 0.15 
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          borderRadius: "16px",
          background: `linear-gradient(145deg, ${alpha(colors.primary[400], 0.7)}, ${alpha(colors.primary[500], 0.8)})`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${alpha(colors.grey[700], 0.5)}`,
          boxShadow: `0 10px 20px ${alpha(colors.grey[900], 0.15)}`,
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at top left, ${alpha(color, 0.2)}, transparent 70%)`,
            zIndex: 0
          }}
        />
        
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            zIndex: 1
          }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mr: 2,
              background: `linear-gradient(135deg, ${alpha(color, 0.3)}, ${alpha(color, 0.2)})`,
              backdropFilter: "blur(8px)",
              border: `1px solid ${alpha(color, 0.4)}`,
              boxShadow: `0 8px 16px ${alpha(colors.grey[900], 0.15)}`,
              position: "relative",
              overflow: "hidden"
            }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 0.5,
                delay: 1 + index * 0.2,
                ease: "easeInOut"
              }}
            >
              {icon}
            </motion.div>
          </Box>
          
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                background: `linear-gradient(90deg, ${color}, ${alpha(color, 0.7)})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
                textShadow: `0 2px 4px ${alpha(colors.grey[900], 0.2)}`,
                mb: 0.5
              }}
            >
              {count.toLocaleString()}
            </Typography>
            
            <Typography
              variant="body2"
              sx={{
                color: alpha(colors.grey[100], 0.7),
                fontWeight: 500
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

const FaqStatistics = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setStats({
        views: 12568,
        helpful: 987,
        users: 3254,
        questions: 42
      });
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CircularProgress 
            sx={{ 
              color: colors.greenAccent[500],
              filter: `drop-shadow(0 0 8px ${alpha(colors.greenAccent[500], 0.5)})`
            }} 
          />
        </motion.div>
      </Box>
    );
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box 
          sx={{ 
            mb: 4,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 3,
            py: 2
          }}
        >
          <AnimatedStat
            icon={<VisibilityIcon sx={{ color: colors.purpleAccent[400], fontSize: 26 }} />}
            title="Total Views"
            value={stats.views}
            color={colors.purpleAccent[400]}
            index={0}
          />
          
          <AnimatedStat
            icon={<ThumbUpIcon sx={{ color: colors.greenAccent[400], fontSize: 26 }} />}
            title="Helpful Ratings"
            value={stats.helpful}
            color={colors.greenAccent[400]}
            index={1}
          />
          
          <AnimatedStat
            icon={<PeopleIcon sx={{ color: colors.blueAccent[400], fontSize: 26 }} />}
            title="Active Users"
            value={stats.users}
            color={colors.blueAccent[400]}
            index={2}
          />
          
          <AnimatedStat
            icon={<HelpOutlineIcon sx={{ color: colors.redAccent[400], fontSize: 26 }} />}
            title="FAQ Questions"
            value={stats.questions}
            color={colors.redAccent[400]}
            index={3}
          />
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default FaqStatistics;