import { useState } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  useTheme,
  IconButton,
  Tooltip,
  alpha,
  Badge
} from "@mui/material";
import { tokens } from "../../theme";
import { motion } from "framer-motion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import StarIcon from "@mui/icons-material/Star";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

const EnhancedFaqCard = ({ faq, onClick, isExpanded, isBookmarked, onBookmarkToggle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isHovered, setIsHovered] = useState(false);

  // Handle bookmark click without triggering card click
  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    onBookmarkToggle(faq.id);
  };

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
    >
      <Paper
        elevation={isHovered ? 8 : 2}
        sx={{
          p: 3,
          height: "100%",
          borderRadius: "20px",
          cursor: "pointer",
          position: "relative",
          background: `linear-gradient(145deg, ${alpha(colors.primary[400], 0.9)} 0%, ${alpha(colors.primary[500], 0.95)} 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${isExpanded ? accentColor : alpha(colors.grey[800], 0.5)}`,
          boxShadow: isHovered 
            ? `0 20px 40px -10px ${alpha(colors.primary[900], 0.4)}, 0 8px 30px -5px ${alpha(accentColor, 0.5)}`
            : `0 8px 20px -8px ${alpha(colors.primary[900], 0.3)}`,
          transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${accentColor}, ${alpha(accentColor, 0.7)})`,
            zIndex: 2
          }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Glow effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: `radial-gradient(circle at top left, ${alpha(accentColor, 0.2)}, transparent 70%)`,
            opacity: isHovered || isExpanded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
        
        {/* Header with icon and badges */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "space-between", zIndex: 3 }}>
          <Box 
            sx={{ 
              p: 1.5, 
              borderRadius: '12px', 
              background: `linear-gradient(135deg, ${alpha(accentColor, 0.3)}, ${alpha(accentColor, 0.1)})`,
              boxShadow: `0 8px 16px ${alpha(colors.primary[900], 0.15)}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <motion.div
              animate={{ 
                rotate: isHovered ? [0, 10, -10, 0] : 0,
                scale: isHovered ? [1, 1.1, 1] : 1
              }}
              transition={{ duration: 0.5 }}
            >
              <Box sx={{ color: accentColor, transform: 'scale(1.2)' }}>
                {faq.icon}
              </Box>
            </motion.div>
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {faq.isNew && (
              <Badge
                color="error"
                variant="dot"
                overlap="circular"
                sx={{
                  "& .MuiBadge-badge": {
                    boxShadow: '0 0 0 2px rgba(0,0,0,0.2)'
                  }
                }}
              >
                <Chip 
                  icon={<NewReleasesIcon fontSize="small" />}
                  label="NEW" 
                  size="small"
                  sx={{ 
                    background: `linear-gradient(45deg, ${colors.redAccent[500]}, ${colors.redAccent[400]})`,
                    color: colors.grey[900],
                    fontWeight: 'bold',
                    fontSize: '0.65rem',
                    boxShadow: `0 4px 8px ${alpha(colors.redAccent[900], 0.3)}`
                  }}
                />
              </Badge>
            )}
            
            {faq.premium && (
              <Tooltip title="Premium content">
                <Chip
                  icon={<StarIcon fontSize="small" />}
                  label="PREMIUM"
                  size="small"
                  sx={{ 
                    background: `linear-gradient(45deg, ${colors.yellowAccent[600]}, ${colors.yellowAccent[400]})`,
                    color: colors.grey[900],
                    fontWeight: 'bold',
                    fontSize: '0.65rem',
                    boxShadow: `0 4px 8px ${alpha(colors.yellowAccent[900], 0.3)}`
                  }}
                />
              </Tooltip>
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
        <Box sx={{ position: 'relative', mb: 2, zIndex: 3 }}>
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

        {/* Preview of answer */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: alpha(colors.grey[100], 0.8),
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: isExpanded ? 'unset' : 2,
            WebkitBoxOrient: 'vertical',
            flex: 1,
            lineHeight: 1.6,
            fontSize: '0.9rem',
            fontWeight: 300,
            zIndex: 3
          }}
        >
          {faq.answer.replace(/\\n/g, ' ').replace(/\*\*/g, '')}
        </Typography>

        {/* Tags */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: "auto", zIndex: 3 }}>
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
                  boxShadow: `0 4px 8px ${alpha(colors.primary[900], 0.2)}`
                }
              }}
            />
          ))}
        </Box>

        {/* Expand indicator */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 2,
            position: 'relative',
            zIndex: 3
          }}
        >
          <motion.div
            animate={{ 
              y: isHovered ? [0, -3, 0] : 0 
            }}
            transition={{ 
              repeat: isHovered ? Infinity : 0, 
              repeatType: "reverse", 
              duration: 1 
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
                  `linear-gradient(135deg, ${alpha(accentColor, 0.3)}, ${alpha(accentColor, 0.1)})` : 
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
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default EnhancedFaqCard;