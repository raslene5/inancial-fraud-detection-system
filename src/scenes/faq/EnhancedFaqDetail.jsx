import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Chip,
  Button,
  useTheme,
  Divider,
  Tooltip,
  Grid,
  Paper,
  Tabs,
  Tab,
  Rating,
  TextField,
  CircularProgress,
  alpha
} from "@mui/material";
import { tokens } from "../../theme";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@mui/icons-material/Close";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import LinkIcon from "@mui/icons-material/Link";
import DownloadIcon from "@mui/icons-material/Download";
import SendIcon from "@mui/icons-material/Send";
import ForumIcon from "@mui/icons-material/Forum";
import HistoryIcon from "@mui/icons-material/History";

const EnhancedFaqDetail = ({ faq, onClose, isBookmarked, onBookmarkToggle, onShare, onPrint, relatedFaqs = [], onRelatedFaqClick }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [viewCount, setViewCount] = useState(Math.floor(Math.random() * 100) + 50);
  const contentRef = useRef(null);

  useEffect(() => {
    setOpen(!!faq);
    if (faq) {
      // Simulate view count increment
      setViewCount(prev => prev + 1);
    }
  }, [faq]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${faq.question}\\n\\n${faq.answer}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleFeedbackSubmit = () => {
    setSubmittingFeedback(true);
    // Simulate API call
    setTimeout(() => {
      setSubmittingFeedback(false);
      setFeedbackSubmitted(true);
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackSubmitted(false);
        setFeedbackRating(0);
        setFeedbackComment("");
      }, 2000);
    }, 1000);
  };

  if (!faq) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          background: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
          boxShadow: `0 20px 80px -10px ${alpha(colors.grey[900], 0.8)}`,
          border: `1px solid ${colors.grey[800]}`,
          overflow: "hidden",
          position: "relative",
          "&:before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: `linear-gradient(90deg, ${colors.greenAccent[500]}, ${colors.blueAccent[400]})`,
            zIndex: 1
          }
        }
      }}
      TransitionComponent={motion.Component}
      TransitionProps={{
        initial: { opacity: 0, y: 20, scale: 0.98 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.98 },
        transition: { duration: 0.4, type: "spring", stiffness: 300, damping: 25 }
      }}
    >
      <DialogTitle sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        background: `linear-gradient(to right, ${alpha(colors.primary[400], 0.9)}, ${alpha(colors.primary[500], 0.95)})`,
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${alpha(colors.grey[800], 0.5)}`,
        py: 2
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ 
            bgcolor: `${alpha(faq.category === 'system' ? colors.blueAccent[400] : 
                          faq.category === 'security' ? colors.redAccent[400] :
                          faq.category === 'visualization' ? colors.purpleAccent[400] :
                          colors.greenAccent[500], 0.2)}`, 
            borderRadius: "12px", 
            p: 1.5,
            boxShadow: `0 4px 12px ${alpha(colors.primary[900], 0.1)}`
          }}>
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
              {faq.icon}
            </motion.div>
          </Box>
          <Typography variant="h4" fontWeight="bold" sx={{
            background: `linear-gradient(90deg, ${colors.grey[100]}, ${colors.grey[300]})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}>
            {faq.question}
          </Typography>
        </Box>
        <IconButton 
          onClick={onClose}
          sx={{
            background: alpha(colors.grey[800], 0.3),
            backdropFilter: "blur(10px)",
            '&:hover': {
              background: alpha(colors.grey[700], 0.5),
              transform: "rotate(90deg)",
              transition: "transform 0.3s ease"
            },
            transition: "all 0.3s ease"
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => setActiveTab(newValue)}
        variant="fullWidth"
        sx={{
          borderBottom: `1px solid ${alpha(colors.grey[800], 0.5)}`,
          '& .MuiTabs-indicator': {
            backgroundColor: colors.greenAccent[500],
            height: 3,
            borderRadius: "3px"
          },
          '& .MuiTab-root': {
            color: colors.grey[300],
            '&.Mui-selected': {
              color: colors.greenAccent[400],
              fontWeight: 'bold'
            },
            '&:hover': {
              color: colors.grey[100],
              backgroundColor: alpha(colors.grey[800], 0.3)
            },
            transition: "all 0.3s ease"
          }
        }}
      >
        <Tab label="Content" value="content" icon={<VisibilityIcon fontSize="small" />} iconPosition="start" />
        <Tab label="Discussion" value="discussion" icon={<ForumIcon fontSize="small" />} iconPosition="start" />
        <Tab label="Related" value="related" icon={<LinkIcon fontSize="small" />} iconPosition="start" />
      </Tabs>
      
      <DialogContent sx={{ p: 3 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "content" && (
              <Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1, 
                  mb: 2,
                  color: colors.grey[400],
                  fontSize: '0.85rem',
                  p: 1,
                  borderRadius: "8px",
                  background: alpha(colors.grey[800], 0.3),
                  backdropFilter: "blur(5px)"
                }}>
                  <VisibilityIcon fontSize="small" />
                  <Typography variant="body2">{viewCount} views</Typography>
                  <Box sx={{ width: '1px', height: '16px', bgcolor: colors.grey[700], mx: 1 }} />
                  <HistoryIcon fontSize="small" />
                  <Typography variant="body2">Updated 2 days ago</Typography>
                </Box>
                
                <Typography 
                  ref={contentRef}
                  variant="body1" 
                  sx={{ 
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.7,
                    mb: 3,
                    color: alpha(colors.grey[100], 0.9),
                    p: 2,
                    borderRadius: "12px",
                    background: alpha(colors.primary[600], 0.3),
                    backdropFilter: "blur(5px)",
                    border: `1px solid ${alpha(colors.grey[700], 0.3)}`,
                    fontSize: "1.05rem"
                  }}
                >
                  {faq.answer.replace(/\\n/g, '\n').replace(/\*\*/g, '')}
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 3 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color={colors.grey[400]} gutterBottom>
                      Category
                    </Typography>
                    <Chip 
                      label={faq.category.charAt(0).toUpperCase() + faq.category.slice(1)} 
                      sx={{ 
                        background: `linear-gradient(145deg, ${alpha(colors.primary[600], 0.8)}, ${alpha(colors.primary[700], 0.9)})`,
                        backdropFilter: 'blur(5px)',
                        border: `1px solid ${alpha(colors.grey[700], 0.5)}`,
                        color: colors.grey[100],
                        fontWeight: "500"
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color={colors.grey[400]} gutterBottom>
                      Tags
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {faq.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{ 
                            background: `linear-gradient(145deg, ${alpha(colors.grey[700], 0.6)}, ${alpha(colors.grey[800], 0.8)})`,
                            backdropFilter: 'blur(5px)',
                            color: colors.grey[100],
                            border: `1px solid ${alpha(colors.grey[600], 0.1)}`,
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: `0 4px 8px ${alpha(colors.primary[900], 0.2)}`
                            },
                            transition: "all 0.3s ease"
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                </Grid>
                
                {!showFeedback ? (
                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      startIcon={<ThumbUpIcon />}
                      onClick={() => setShowFeedback(true)}
                      sx={{
                        borderColor: alpha(colors.greenAccent[500], 0.5),
                        color: colors.greenAccent[400],
                        mr: 2,
                        '&:hover': {
                          borderColor: colors.greenAccent[400],
                          background: alpha(colors.greenAccent[700], 0.1),
                          transform: "translateY(-2px)",
                          boxShadow: `0 4px 12px ${alpha(colors.greenAccent[900], 0.3)}`
                        },
                        transition: "all 0.3s ease"
                      }}
                    >
                      Helpful
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ThumbDownIcon />}
                      onClick={() => setShowFeedback(true)}
                      sx={{
                        borderColor: alpha(colors.grey[500], 0.5),
                        color: colors.grey[400],
                        '&:hover': {
                          borderColor: colors.grey[400],
                          background: alpha(colors.grey[700], 0.1),
                          transform: "translateY(-2px)"
                        },
                        transition: "all 0.3s ease"
                      }}
                    >
                      Not Helpful
                    </Button>
                  </Box>
                ) : (
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 4,
                      p: 3,
                      background: alpha(colors.primary[600], 0.5),
                      backdropFilter: 'blur(10px)',
                      borderRadius: '12px',
                      border: `1px solid ${alpha(colors.grey[700], 0.5)}`
                    }}
                  >
                    {!feedbackSubmitted ? (
                      <>
                        <Typography variant="h6" gutterBottom>
                          Your feedback helps us improve
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Typography variant="body2" sx={{ mr: 2 }}>
                            Rate this answer:
                          </Typography>
                          <Rating
                            value={feedbackRating}
                            onChange={(e, newValue) => setFeedbackRating(newValue)}
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: colors.greenAccent[400]
                              },
                              '& .MuiRating-iconHover': {
                                color: colors.greenAccent[300]
                              }
                            }}
                          />
                        </Box>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          placeholder="Tell us what you think about this answer..."
                          value={feedbackComment}
                          onChange={(e) => setFeedbackComment(e.target.value)}
                          variant="outlined"
                          sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: alpha(colors.primary[700], 0.4),
                              '& fieldset': {
                                borderColor: alpha(colors.grey[600], 0.5)
                              },
                              '&:hover fieldset': {
                                borderColor: alpha(colors.grey[500], 0.8)
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: colors.greenAccent[500]
                              }
                            }
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                          <Button
                            variant="text"
                            onClick={() => setShowFeedback(false)}
                            sx={{ color: colors.grey[400] }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            startIcon={submittingFeedback ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                            onClick={handleFeedbackSubmit}
                            disabled={submittingFeedback || feedbackRating === 0}
                            sx={{
                              background: `linear-gradient(45deg, ${colors.greenAccent[600]}, ${colors.greenAccent[500]})`,
                              color: colors.grey[900],
                              fontWeight: 'bold',
                              '&:hover': {
                                background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.greenAccent[400]})`,
                                transform: "translateY(-2px)",
                                boxShadow: `0 4px 12px ${alpha(colors.greenAccent[900], 0.3)}`
                              },
                              '&.Mui-disabled': {
                                background: alpha(colors.grey[700], 0.7),
                                color: colors.grey[500]
                              },
                              transition: "all 0.3s ease"
                            }}
                          >
                            {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 2 }}>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <Box
                            sx={{
                              width: 60,
                              height: 60,
                              borderRadius: "50%",
                              background: alpha(colors.greenAccent[500], 0.2),
                              color: colors.greenAccent[400],
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mx: "auto",
                              mb: 2,
                              fontSize: "2rem"
                            }}
                          >
                            ✓
                          </Box>
                        </motion.div>
                        <Typography variant="h6" color={colors.greenAccent[400]} gutterBottom>
                          Thank you for your feedback!
                        </Typography>
                        <Typography variant="body2" color={colors.grey[300]}>
                          Your input helps us improve our knowledge base.
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                )}
              </Box>
            )}
            
            {activeTab === "discussion" && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ForumIcon sx={{ fontSize: 60, color: alpha(colors.grey[400], 0.6), mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Discussion Board
                </Typography>
                <Typography variant="body2" color={colors.grey[400]} sx={{ mb: 3 }}>
                  Join the conversation about this topic
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: colors.greenAccent[500],
                    color: colors.greenAccent[400],
                    '&:hover': {
                      borderColor: colors.greenAccent[400],
                      background: alpha(colors.greenAccent[700], 0.1),
                      transform: "translateY(-2px)",
                      boxShadow: `0 4px 12px ${alpha(colors.greenAccent[900], 0.3)}`
                    },
                    transition: "all 0.3s ease"
                  }}
                >
                  Start Discussion
                </Button>
              </Box>
            )}
            
            {activeTab === "related" && (
              <Box>
                <Typography variant="h6" color={colors.grey[200]} gutterBottom sx={{ mb: 2 }}>
                  Related Questions
                </Typography>
                <Grid container spacing={2}>
                  {relatedFaqs.map(relatedFaq => (
                    <Grid item xs={12} key={relatedFaq.id}>
                      <Paper 
                        component={motion.div}
                        whileHover={{ 
                          y: -5,
                          boxShadow: `0 10px 20px -5px ${alpha(colors.grey[900], 0.5)}`
                        }}
                        sx={{ 
                          p: 2, 
                          cursor: 'pointer',
                          background: `linear-gradient(145deg, ${alpha(colors.primary[500], 0.9)}, ${alpha(colors.primary[600], 0.95)})`,
                          backdropFilter: 'blur(10px)',
                          borderRadius: "12px",
                          border: `1px solid ${alpha(colors.grey[700], 0.5)}`,
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => onRelatedFaqClick(relatedFaq.id)}
                      >
                        <Typography variant="subtitle1" fontWeight="500">
                          {relatedFaq.question}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          {relatedFaq.tags.slice(0, 2).map((tag, i) => (
                            <Chip 
                              key={i} 
                              label={tag} 
                              size="small" 
                              sx={{ 
                                background: `linear-gradient(145deg, ${alpha(colors.grey[700], 0.6)}, ${alpha(colors.grey[800], 0.8)})`,
                                color: colors.grey[100],
                                border: `1px solid ${alpha(colors.grey[600], 0.1)}`
                              }}
                            />
                          ))}
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
      
      <DialogActions sx={{ 
        justifyContent: "space-between", 
        px: 3, 
        py: 2,
        borderTop: `1px solid ${alpha(colors.grey[800], 0.5)}`,
        background: `linear-gradient(to right, ${alpha(colors.primary[500], 0.9)}, ${alpha(colors.primary[600], 0.95)})`,
        backdropFilter: "blur(10px)"
      }}>
        <Button 
          variant="contained" 
          onClick={onClose}
          sx={{ 
            background: `linear-gradient(45deg, ${alpha(colors.grey[700], 0.9)}, ${alpha(colors.grey[800], 0.95)})`,
            backdropFilter: 'blur(5px)',
            borderRadius: "8px",
            px: 3,
            color: colors.grey[100],
            border: `1px solid ${alpha(colors.grey[600], 0.3)}`,
            boxShadow: `0 4px 12px ${alpha(colors.grey[900], 0.2)}`,
            '&:hover': {
              background: `linear-gradient(45deg, ${alpha(colors.grey[600], 0.9)}, ${alpha(colors.grey[700], 0.95)})`,
              transform: "translateY(-2px)"
            },
            transition: "all 0.3s ease"
          }}
        >
          Close
        </Button>
        
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
            <IconButton 
              onClick={handleCopyToClipboard}
              sx={{ 
                bgcolor: copied ? alpha(colors.greenAccent[500], 0.2) : "transparent",
                transition: "all 0.2s ease",
                "&:hover": { 
                  bgcolor: alpha(colors.grey[700], 0.4),
                  transform: "translateY(-2px)"
                }
              }}
            >
              <ContentCopyIcon sx={{ color: copied ? colors.greenAccent[500] : colors.grey[300] }} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Download as PDF">
            <IconButton 
              onClick={() => onPrint(faq)}
              sx={{ 
                transition: "all 0.2s ease",
                "&:hover": { 
                  bgcolor: alpha(colors.grey[700], 0.4),
                  transform: "translateY(-2px)"
                }
              }}
            >
              <DownloadIcon sx={{ color: colors.grey[300] }} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Share">
            <IconButton 
              onClick={() => onShare(faq)}
              sx={{ 
                transition: "all 0.2s ease",
                "&:hover": { 
                  bgcolor: alpha(colors.grey[700], 0.4),
                  transform: "translateY(-2px)"
                }
              }}
            >
              <ShareIcon sx={{ color: colors.grey[300] }} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={isBookmarked ? "Remove bookmark" : "Bookmark"}>
            <IconButton 
              onClick={() => onBookmarkToggle(faq.id)}
              sx={{ 
                bgcolor: isBookmarked ? alpha(colors.blueAccent[500], 0.2) : "transparent",
                transition: "all 0.2s ease",
                "&:hover": { 
                  bgcolor: isBookmarked ? alpha(colors.blueAccent[500], 0.3) : alpha(colors.grey[700], 0.4),
                  transform: "translateY(-2px)"
                }
              }}
            >
              {isBookmarked ? 
                <BookmarkIcon sx={{ color: colors.blueAccent[400] }} /> : 
                <BookmarkBorderIcon sx={{ color: colors.grey[300] }} />
              }
            </IconButton>
          </Tooltip>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EnhancedFaqDetail;