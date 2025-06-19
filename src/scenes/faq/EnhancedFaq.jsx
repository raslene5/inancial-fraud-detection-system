import { useState, useRef, useCallback, useMemo } from "react";
import {
  Box,
  useTheme,
  Grid,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Button,
  Typography,
  Fade,
  Snackbar,
  Alert,
  alpha,
  Zoom
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import SecurityIcon from "@mui/icons-material/Security";
import WarningIcon from "@mui/icons-material/Warning";
import VerifiedIcon from "@mui/icons-material/Verified";
import ShieldIcon from "@mui/icons-material/Shield";
import BarChartIcon from "@mui/icons-material/BarChart";
import { tokens } from "../../theme";
import { motion } from "framer-motion";
import { debounce } from "lodash";
// Import components directly without circular dependencies
import FaqHeader from "./FaqHeader";
import React from "react";
const EnhancedFaqCard = React.lazy(() => import("./EnhancedFaqCard"));

const EnhancedFaq = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [bookmarkedFaqs, setBookmarkedFaqs] = useState([]);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info"
  });

  // Refs
  const searchInputRef = useRef(null);

  // Handle notifications
  const showNotification = useCallback((message, severity = "info") => {
    setNotification({
      open: true,
      message,
      severity
    });
  }, []);

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  // Bookmark handling
  const toggleBookmark = useCallback((id) => {
    setBookmarkedFaqs(prev => {
      const newBookmarks = prev.includes(id) 
        ? prev.filter(faqId => faqId !== id) 
        : [...prev, id];
      
      showNotification(
        prev.includes(id) ? "Removed from bookmarks" : "Added to bookmarks", 
        "success"
      );
      
      return newBookmarks;
    });
  }, [showNotification]);

  // Search handling
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  // FAQ Data
  const faqData = [
    {
      id: 1,
      question: "How does our hybrid fraud detection system work?",
      answer: "Our advanced Financial Fraud Detection System utilizes a state-of-the-art hybrid model architecture that combines traditional machine learning with deep learning techniques.\n\nThe system processes transactions in real-time through multiple layers of analysis:\n\n1. Random Forest (RF) and XGBoost (XGB) models work in parallel to analyze transaction features\n2. The outputs from RF and XGB are combined and fed into a Convolutional Neural Network (CNN)\n3. The CNN extracts higher-level patterns and relationships from the combined outputs\n4. Risk scoring aggregates signals from all detection methods for final decision making\n\nThis sophisticated ensemble approach significantly improves detection rates while reducing false positives by leveraging the strengths of both traditional machine learning and deep learning techniques.",
      category: "system",
      icon: <ShieldIcon />,
      tags: ["hybrid model", "machine learning", "CNN", "RF", "XGBoost"],
      isNew: true,
      featured: true
    },
    {
      id: 2,
      question: "What advantages does the hybrid model provide over traditional systems?",
      answer: "Our hybrid model offers several significant advantages including higher accuracy and reduced false positives. By combining Random Forest, XGBoost, and CNN in our ensemble architecture, we achieve:\n\n• 40% higher fraud detection rate\n• 60% reduction in false positives\n• Real-time processing capabilities\n• Adaptive learning from new fraud patterns\n• Explainable AI for regulatory compliance\n\nTraditional systems rely on simpler algorithms that can't capture complex patterns. Our RF+XGB+CNN approach leverages the strengths of each model type - RF for handling various data types, XGB for boosting accuracy on weak patterns, and CNN for extracting higher-level features from their combined outputs.",
      category: "system",
      icon: <VerifiedIcon />,
      tags: ["accuracy", "performance", "advantages", "RF", "XGBoost", "CNN"],
      premium: true
    },
    {
      id: 3,
      question: "How does the system visualize fraud patterns?",
      answer: "Our system employs intuitive visualization techniques to make complex fraud patterns understandable. Key visualization features include:\n\n• Bar charts displaying transaction frequency and risk scores by category\n• Pie charts showing distribution of fraud types and detection methods\n• Linear graphs tracking fraud patterns and anomalies over time\n• Interactive dashboards with drill-down capabilities\n• Customizable reports with exportable visualizations\n\nThese data visualizations transform complex patterns into clear, actionable insights, enabling analysts to quickly identify trends, spot outliers, and respond to emerging fraud patterns with confidence.",
      category: "visualization",
      icon: <BarChartIcon />,
      tags: ["visualization", "dashboard", "analytics", "charts", "graphs"]
    },
    {
      id: 4,
      question: "What should I do if I suspect fraudulent activity?",
      answer: "If you suspect fraud, take these immediate steps to report and secure your account:\n\n1. Document the suspicious activity with screenshots and notes\n2. Report the incident through the platform's alert system\n3. Flag the related transactions for immediate review\n4. Implement temporary restrictions on affected accounts\n5. Follow up with the security team for investigation status\n\nSpeed is critical when responding to potential fraud. Our system provides tools to quickly isolate and contain suspicious activities while investigation proceeds.",
      category: "security",
      icon: <WarningIcon />,
      tags: ["security", "response", "investigation"]
    },
    {
      id: 5,
      question: "How is my data protected in the system?",
      answer: "Your data security is our highest priority. Our system implements multiple layers of protection:\n\n• End-to-end encryption for all data in transit and at rest\n• Role-based access controls limiting data visibility\n• Regular security audits and penetration testing\n• Compliance with GDPR, PCI-DSS, and other regulations\n• Anonymization of sensitive personal information\n• Secure API gateways with strong authentication\n\nWe follow a zero-trust security model and employ defense-in-depth strategies to ensure your data remains protected at all times.",
      category: "security",
      icon: <SecurityIcon />,
      tags: ["encryption", "compliance", "privacy"]
    }
  ];

  // Categories configuration
  const categories = useMemo(() => [
    { value: "all", label: "All Categories", icon: <ShieldIcon />, color: colors.greenAccent[500] },
    { value: "system", label: "Hybrid Model", icon: <ShieldIcon />, color: colors.blueAccent[400] },
    { value: "security", label: "Security", icon: <SecurityIcon />, color: colors.redAccent[400] },
    { value: "visualization", label: "Visualizations", icon: <BarChartIcon />, color: colors.purpleAccent[400] }
  ], [colors]);

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    let results = faqData;
    
    // Filter by bookmarks if enabled
    if (showBookmarksOnly) {
      results = results.filter(faq => bookmarkedFaqs.includes(faq.id));
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      results = results.filter(faq => faq.category === selectedCategory);
    }
    
    // Search only in questions and tags
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(faq => 
        faq.question.toLowerCase().includes(searchLower) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return results;
  }, [searchTerm, selectedCategory, showBookmarksOnly, bookmarkedFaqs]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.1,
        duration: 0.5
      }
    }
  };

  return (
    <Box m="20px">
      {/* Custom Header */}
      <FaqHeader />
      
      {/* Search and Filter Section */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: "20px",
          background: `linear-gradient(145deg, ${alpha(colors.primary[400], 0.9)}, ${alpha(colors.primary[500], 0.95)})`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(colors.grey[800], 0.5)}`,
          boxShadow: `0 10px 30px -5px ${alpha(colors.grey[900], 0.3)}`
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={7}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={handleSearchChange}
              inputRef={searchInputRef}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.greenAccent[500] }} />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton 
                      size="small" 
                      onClick={() => setSearchTerm("")}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '12px',
                  background: alpha(colors.primary[600], 0.4),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(colors.grey[700], 0.5)}`,
                  '&:hover': {
                    border: `1px solid ${alpha(colors.grey[600], 0.8)}`
                  }
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'transparent'
                  },
                  '&:hover fieldset': {
                    borderColor: 'transparent'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: alpha(colors.greenAccent[500], 0.5)
                  }
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              {categories.map((category, index) => (
                <Chip
                  key={category.value}
                  icon={category.icon}
                  label={category.label}
                  onClick={() => {
                    setSelectedCategory(category.value);
                    setShowBookmarksOnly(false);
                  }}
                  sx={{
                    background: selectedCategory === category.value && !showBookmarksOnly
                      ? `linear-gradient(45deg, ${colors.greenAccent[600]}, ${colors.greenAccent[500]})`
                      : alpha(colors.primary[300], 0.5),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(colors.grey[700], 0.5)}`,
                    color: selectedCategory === category.value && !showBookmarksOnly ? colors.grey[900] : colors.grey[100],
                    fontWeight: selectedCategory === category.value && !showBookmarksOnly ? 'bold' : 'normal',
                    transition: 'all 0.3s ease',
                    boxShadow: selectedCategory === category.value && !showBookmarksOnly
                      ? `0 6px 12px ${alpha(colors.greenAccent[900], 0.3)}` 
                      : 'none',
                    '&:hover': {
                      boxShadow: `0 4px 12px ${alpha(colors.grey[900], 0.3)}`
                    }
                  }}
                />
              ))}
              
              <Chip
                icon={<BookmarkIcon />}
                label={`Bookmarks (${bookmarkedFaqs.length})`}
                onClick={() => {
                  setShowBookmarksOnly(!showBookmarksOnly);
                  if (!showBookmarksOnly) {
                    setSelectedCategory("all");
                  }
                }}
                sx={{
                  background: showBookmarksOnly
                    ? `linear-gradient(45deg, ${colors.blueAccent[600]}, ${colors.blueAccent[500]})`
                    : alpha(colors.primary[300], 0.5),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(colors.grey[700], 0.5)}`,
                  color: showBookmarksOnly ? colors.grey[900] : colors.grey[100],
                  fontWeight: showBookmarksOnly ? 'bold' : 'normal',
                  transition: 'all 0.3s ease',
                  boxShadow: showBookmarksOnly
                    ? `0 6px 12px ${alpha(colors.blueAccent[900], 0.3)}` 
                    : 'none',
                  '&:hover': {
                    boxShadow: `0 4px 12px ${alpha(colors.grey[900], 0.3)}`
                  }
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* FAQ Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          {filteredFaqs.map((faq) => (
            <Grid item xs={12} md={6} lg={4} key={faq.id}>
              <React.Suspense fallback={<Box sx={{ p: 3, bgcolor: alpha(colors.primary[500], 0.5), borderRadius: "20px" }}><Typography>Loading...</Typography></Box>}>
                <EnhancedFaqCard
                  faq={faq}
                  onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                  isExpanded={expandedId === faq.id}
                  isBookmarked={bookmarkedFaqs.includes(faq.id)}
                  onBookmarkToggle={toggleBookmark}
                />
              </React.Suspense>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {/* No Results Message */}
      {filteredFaqs.length === 0 && (
        <Fade in={true}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 4, 
              textAlign: "center",
              borderRadius: '20px',
              background: `linear-gradient(145deg, ${alpha(colors.primary[400], 0.9)}, ${alpha(colors.primary[500], 0.95)})`,
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(colors.grey[800], 0.5)}`,
              boxShadow: `0 10px 30px -5px ${alpha(colors.grey[900], 0.3)}`
            }}
          >
            <Box
              component={motion.div}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <Box
                sx={{ 
                  width: 80, 
                  height: 80, 
                  borderRadius: "50%",
                  bgcolor: alpha(colors.grey[700], 0.3),
                  color: colors.grey[400],
                  mx: 'auto',
                  mb: 2,
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 16px ${alpha(colors.grey[900], 0.2)}`
                }}
              >
                {showBookmarksOnly ? <BookmarkIcon sx={{ fontSize: 40 }} /> : <SearchIcon sx={{ fontSize: 40 }} />}
              </Box>
              <Box
                sx={{
                  background: `linear-gradient(90deg, ${colors.grey[100]}, ${colors.grey[300]})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  mb: 1
                }}
              >
                {showBookmarksOnly ? "No bookmarked FAQs" : "No FAQs match your search criteria"}
              </Box>
              <Box sx={{ color: colors.grey[400], mt: 1, mb: 3 }}>
                {searchTerm ? 
                  `No results found for "${searchTerm}"` : 
                  showBookmarksOnly ?
                    "Bookmark some FAQs to see them here" :
                    "Try selecting a different category"
                }
              </Box>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setShowBookmarksOnly(false);
                }}
                sx={{
                  borderColor: alpha(colors.grey[500], 0.5),
                  color: colors.grey[300],
                  '&:hover': {
                    borderColor: colors.grey[400],
                    background: alpha(colors.grey[700], 0.3)
                  }
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </Paper>
        </Fade>
      )}

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Zoom}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            variant="filled"
            sx={{
              boxShadow: `0 10px 20px ${alpha(colors.grey[900], 0.25)}`,
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(
                notification.severity === "success" ? colors.greenAccent[500] :
                notification.severity === "info" ? colors.blueAccent[500] :
                notification.severity === "warning" ? colors.orangeAccent[500] :
                colors.redAccent[500], 0.3
              )}`,
              background: alpha(
                notification.severity === "success" ? colors.greenAccent[600] :
                notification.severity === "info" ? colors.blueAccent[600] :
                notification.severity === "warning" ? colors.orangeAccent[600] :
                colors.redAccent[600], 0.9
              ),
              fontWeight: 500
            }}
          >
            {notification.message}
          </Alert>
        </motion.div>
      </Snackbar>
    </Box>
  );
};

export default EnhancedFaq;