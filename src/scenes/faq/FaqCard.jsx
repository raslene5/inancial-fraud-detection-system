import { useState, useRef, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  useTheme,
  Badge,
  IconButton,
  Tooltip,
  alpha
} from "@mui/material";
import { tokens } from "../../theme";
import { motion } from "framer-motion";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import StarIcon from "@mui/icons-material/Star";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import Lottie from "lottie-react";
import { useSpring, animated } from "react-spring";

// Simulated import for animation data
const pulseAnimation = {
  v: "5.7.8",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Pulse",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Circle",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [100], e: [50] },
            { t: 30, s: [50], e: [100] },
            { t: 60, s: [100] }
          ]
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100], e: [120, 120] },
            { t: 30, s: [120, 120], e: [100, 100] },
            { t: 60, s: [100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [80, 80] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.3, 0.8, 0.6, 1] }
            }
          ]
        }
      ]
    }
  ]
};

const AnimatedBox = animated(Box);

const FaqCard = ({ faq, onClick, isExpanded, isBookmarked, onBookmarkToggle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isHovered, setIsHovered] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const cardRef = useRef(null);
  
  // Animation for card hover effect
  const springProps = useSpring({
    transform: isHovered ? 'translateY(-8px)' : 'translateY(0px)',
    boxShadow: isHovered 
      ? `0 16px 30px -10px ${alpha(colors.primary[900], 0.3)}, 0 4px 25px -5px ${alpha(colors.greenAccent[500], 0.4)}`
      : `0 6px 16px -8px ${alpha(colors.primary[900], 0.2)}`,
    config: { tension: 300, friction: 20 }
  });

  // Glow effect animation
  const glowAnimation = useSpring({
    opacity: isHovered || isExpanded ? 1 : 0,
    config: { duration: 300 }
  });

  // Handle bookmark click without triggering card click
  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    onBookmarkToggle(faq.id);
    setShowAnimation(true);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  // Intersection observer for entrance animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  // Determine card accent color based on category
  const getCategoryColor = () => {
    switch(faq.category) {
      case 'system': return colors.blueAccent[400];
      case 'security': return colors.redAccent[400];
      case 'visualization': return colors.purpleAccent[400];
      default: return colors.greenAccent[500];
    }
  };

  const accentColor = getCategoryColor();

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="faq-card"
      style={{ position: 'relative' }}
    >
      {showAnimation && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          <Box sx={{ width: 80, height: 80 }}>
            <Lottie 
              animationData={pulseAnimation} 
              loop={false} 
              autoplay={true}
            />
          </Box>
        </Box>
      )}
      
      <AnimatedBox
        style={springProps}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
          borderRadius: '20px',
          background: `linear-gradient(145deg, ${alpha(colors.primary[400], 0.9)} 0%, ${alpha(colors.primary[500], 0.95)} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isExpanded ? accentColor : alpha(colors.grey[800], 0.5)}`,
        }}
      >
        {/* Glow effect */}
        <AnimatedBox
          style={glowAnimation}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: `radial-gradient(circle at top left, ${alpha(accentColor, 0.15)}, transparent 70%)`,
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
        
        {/* Top accent bar */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${accentColor}, ${alpha(accentColor, 0.7)})`,
            zIndex: 2
          }}
        />
        
        <Paper
          elevation={0}
          sx={{
            p: 3,
            height: '100%',
            cursor: 'pointer',
            position: 'relative',
            backgroundColor: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 3
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={onClick}
        >
          {/* Header with icon and badges */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
            <Box 
              sx={{ 
                p: 1.5, 
                borderRadius: '12px', 
                background: `linear-gradient(135deg, ${alpha(accentColor, 0.2)}, ${alpha(accentColor, 0.1)})`,
                boxShadow: `0 4px 12px ${alpha(colors.primary[900], 0.1)}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Box sx={{ color: accentColor, transform: 'scale(1.2)' }}>
                {faq.icon}
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {faq.premium && (
                <Tooltip title="Premium content">
                  <StarIcon 
                    sx={{ 
                      color: colors.yellowAccent[400],
                      filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))'
                    }} 
                  />
                </Tooltip>
              )}
              
              {faq.restricted && (
                <Tooltip title={faq.restricted ? "Restricted content" : "Public content"}>
                  {faq.restricted ? (
                    <LockIcon sx={{ color: colors.grey[400] }} />
                  ) : (
                    <LockOpenIcon sx={{ color: colors.greenAccent[400] }} />
                  )}
                </Tooltip>
              )}
              
              {faq.isNew && (
                <Chip 
                  label="NEW" 
                  size="small"
                  sx={{ 
                    background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.greenAccent[400]})`,
                    color: colors.primary[900],
                    fontWeight: 'bold',
                    boxShadow: `0 2px 8px ${alpha(colors.greenAccent[500], 0.5)}`,
                    fontSize: '0.65rem',
                    height: '20px',
                    '& .MuiChip-label': {
                      px: 1
                    }
                  }}
                />
              )}
              
              {faq.featured && (
                <Badge 
                  color="warning"
                  overlap="circular"
                  badgeContent=" "
                  variant="dot"
                  sx={{
                    "& .MuiBadge-badge": {
                      boxShadow: '0 0 0 2px rgba(0,0,0,0.2)',
                      animation: 'pulse 2s infinite'
                    }
                  }}
                >
                  <TipsAndUpdatesIcon 
                    sx={{ 
                      color: colors.yellowAccent[400],
                      filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.3))'
                    }} 
                  />
                </Badge>
              )}
              
              <Tooltip title={isBookmarked ? "Remove bookmark" : "Add bookmark"}>
                <IconButton 
                  size="small" 
                  onClick={handleBookmarkClick}
                  sx={{
                    color: isBookmarked ? colors.blueAccent[400] : colors.grey[400],
                    '&:hover': {
                      color: isBookmarked ? colors.blueAccent[300] : colors.blueAccent[400],
                      backgroundColor: alpha(colors.blueAccent[700], 0.15)
                    }
                  }}
                >
                  {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Question with animated underline on hover */}
          <Box sx={{ position: 'relative', mb: 2 }}>
            <Typography 
              variant="h5" 
              fontWeight="600" 
              sx={{ 
                mb: 0.5,
                background: isHovered ? 
                  `linear-gradient(90deg, ${colors.grey[100]}, ${colors.grey[200]})` : 
                  'transparent',
                backgroundClip: isHovered ? 'text' : 'none',
                WebkitBackgroundClip: 'text',
                color: isHovered ? 'transparent' : colors.grey[100],
                transition: 'all 0.3s ease'
              }}
            >
              {faq.question}
            </Typography>
            
            <Box 
              sx={{
                height: '2px',
                width: isHovered ? '100%' : '0%',
                background: `linear-gradient(90deg, ${accentColor}, transparent)`,
                transition: 'width 0.3s ease-out',
                mt: 0.5
              }}
            />
          </Box>

          {/* Preview of answer with improved styling */}
          <Typography 
            variant="body2" 
            sx={{ 
              color: alpha(colors.grey[100], 0.7),
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              flex: 1,
              lineHeight: 1.6,
              fontSize: '0.9rem',
              fontWeight: 300
            }}
          >
            {faq.answer.replace(/\\n/g, ' ').replace(/\*\*/g, '')}
          </Typography>

          {/* Tags with improved styling */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto' }}>
            {faq.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  background: `linear-gradient(145deg, ${alpha(colors.grey[700], 0.6)}, ${alpha(colors.grey[800], 0.8)})`,
                  backdropFilter: 'blur(5px)',
                  color: colors.grey[100],
                  fontSize: '0.7rem',
                  fontWeight: 300,
                  transition: 'all 0.3s ease',
                  border: `1px solid ${alpha(colors.grey[600], 0.1)}`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 4px 8px ${alpha(colors.primary[900], 0.2)}`,
                    background: `linear-gradient(145deg, ${alpha(colors.grey[600], 0.6)}, ${alpha(colors.grey[700], 0.8)})`
                  }
                }}
              />
            ))}
          </Box>

          {/* Expand indicator with animation */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 2,
              position: 'relative'
            }}
          >
            <Box 
              sx={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isHovered ? 
                  `linear-gradient(135deg, ${alpha(accentColor, 0.2)}, ${alpha(accentColor, 0.1)})` : 
                  'transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <ExpandMoreIcon 
                sx={{ 
                  color: isHovered ? accentColor : colors.grey[400],
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease, color 0.3s ease',
                  fontSize: '1.2rem'
                }}
              />
            </Box>
          </Box>
        </Paper>
      </AnimatedBox>
    </motion.div>
  );
};

export default FaqCard;