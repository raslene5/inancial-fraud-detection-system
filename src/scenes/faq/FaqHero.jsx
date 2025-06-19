import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  useTheme,
  alpha,
  Button
} from "@mui/material";
import { tokens } from "../../theme";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedIcon from "@mui/icons-material/Verified";
import BarChartIcon from "@mui/icons-material/BarChart";

const FaqHero = ({ onSearchClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const highlights = [
    {
      icon: <SecurityIcon sx={{ fontSize: 40 }} />,
      title: "Advanced Security",
      description: "Learn about our state-of-the-art security features",
      color: colors.redAccent[400]
    },
    {
      icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
      title: "Hybrid Model",
      description: "Discover how our hybrid detection system works",
      color: colors.blueAccent[400]
    },
    {
      icon: <BarChartIcon sx={{ fontSize: 40 }} />,
      title: "Visual Analytics",
      description: "Explore our powerful visualization tools",
      color: colors.purpleAccent[400]
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % highlights.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [highlights.length]);
  
  const currentHighlight = highlights[currentIndex];
  
  return (
    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        borderRadius: "24px",
        mb: 4,
        background: `linear-gradient(135deg, ${alpha(colors.primary[400], 0.9)}, ${alpha(colors.primary[500], 0.95)})`,
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(colors.grey[800], 0.5)}`,
        boxShadow: `0 20px 40px -10px ${alpha(colors.grey[900], 0.4)}`
      }}
    >
      {/* Background elements */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at top right, ${alpha(colors.greenAccent[500], 0.15)}, transparent 60%)`,
          zIndex: 1
        }}
      />
      
      {/* Animated particles */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          component={motion.div}
          animate={{
            x: [0, Math.random() * 20 - 10],
            y: [0, Math.random() * 20 - 10],
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
            width: Math.random() * 60 + 20,
            height: Math.random() * 60 + 20,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(colors.greenAccent[500], 0.2)}, transparent)`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: 1,
            pointerEvents: "none",
          }}
        />
      ))}
      
      {/* Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          p: { xs: 4, md: 6 },
          position: "relative",
          zIndex: 2
        }}
      >
        <Box sx={{ mb: { xs: 4, md: 0 }, maxWidth: { md: "60%" } }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h2"
              fontWeight="bold"
              sx={{
                mb: 2,
                background: `linear-gradient(90deg, ${colors.grey[100]}, ${colors.grey[300]})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: `0 5px 15px ${alpha(colors.primary[900], 0.5)}`
              }}
            >
              Find Answers to Your Questions
            </Typography>
            
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                color: alpha(colors.grey[100], 0.8),
                fontWeight: 300,
                lineHeight: 1.5
              }}
            >
              Explore our comprehensive knowledge base about the Financial Fraud Detection System
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              startIcon={<SearchIcon />}
              onClick={onSearchClick}
              sx={{
                background: `linear-gradient(45deg, ${colors.greenAccent[600]}, ${colors.greenAccent[500]})`,
                color: colors.grey[900],
                fontWeight: 'bold',
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                boxShadow: `0 8px 16px ${alpha(colors.greenAccent[900], 0.3)}`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.greenAccent[400]})`,
                  boxShadow: `0 12px 20px ${alpha(colors.greenAccent[900], 0.4)}`,
                  transform: "translateY(-2px)"
                },
                transition: "all 0.3s ease"
              }}
            >
              Search Knowledge Base
            </Button>
          </motion.div>
        </Box>
        
        <Box
          sx={{
            width: { xs: "100%", md: "35%" },
            height: { xs: 200, md: 280 },
            position: "relative"
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  borderRadius: "20px",
                  background: `linear-gradient(145deg, ${alpha(colors.primary[300], 0.4)}, ${alpha(colors.primary[400], 0.6)})`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(colors.grey[700], 0.5)}`,
                  boxShadow: `0 15px 25px ${alpha(colors.grey[900], 0.2)}`
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                    background: alpha(currentHighlight.color, 0.2),
                    color: currentHighlight.color,
                    boxShadow: `0 8px 16px ${alpha(colors.grey[900], 0.15)}`,
                    border: `1px solid ${alpha(currentHighlight.color, 0.3)}`
                  }}
                >
                  <motion.div
                    animate={{ 
                      rotate: [0, 10, 0, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 1,
                      delay: 0.5,
                      ease: "easeInOut"
                    }}
                  >
                    {currentHighlight.icon}
                  </motion.div>
                </Box>
                
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    mb: 1,
                    color: colors.grey[100]
                  }}
                >
                  {currentHighlight.title}
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: alpha(colors.grey[100], 0.7)
                  }}
                >
                  {currentHighlight.description}
                </Typography>
              </Paper>
            </motion.div>
          </AnimatePresence>
          
          {/* Indicator dots */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
              gap: 1
            }}
          >
            {highlights.map((_, index) => (
              <Box
                key={index}
                component={motion.span}
                animate={{
                  scale: index === currentIndex ? [1, 1.3, 1] : 1,
                }}
                transition={{
                  duration: 1,
                  repeat: index === currentIndex ? Infinity : 0,
                  repeatDelay: 1
                }}
                sx={{
                  width: index === currentIndex ? 10 : 8,
                  height: index === currentIndex ? 10 : 8,
                  borderRadius: "50%",
                  backgroundColor: index === currentIndex ? colors.greenAccent[500] : alpha(colors.grey[400], 0.5),
                  transition: "all 0.3s ease",
                  boxShadow: index === currentIndex ? `0 0 8px ${colors.greenAccent[500]}` : "none"
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default FaqHero;