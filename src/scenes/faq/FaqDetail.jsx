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
  Zoom,
  Slide,
  alpha,
  Avatar,
  Rating,
  Collapse,
  TextField,
  CircularProgress
} from "@mui/material";
import { tokens } from "../../theme";
import CloseIcon from "@mui/icons-material/Close";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";
import PrintIcon from "@mui/icons-material/Print";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CodeIcon from "@mui/icons-material/Code";
import LinkIcon from "@mui/icons-material/Link";
import DownloadIcon from "@mui/icons-material/Download";
import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-sql";
import "prismjs/plugins/line-numbers/prism-line-numbers";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";

const FaqDetail = ({ faq, onClose, isBookmarked, onBookmarkToggle, onShare, onPrint, relatedFaqs = [], onRelatedFaqClick }) => {
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

  // Syntax highlighting for code blocks
  useEffect(() => {
    if (open && contentRef.current) {
      Prism.highlightAllUnder(contentRef.current);
    }
  }, [open, faq]);

  useEffect(() => {
    setOpen(!!faq);
    if (faq) {
      // Simulate view count increment
      setViewCount(prev => prev + 1);
    }
  }, [faq]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(`${faq.question}\n\n${faq.answer}`);
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

  // Format answer with code blocks
  const formatAnswer = (text) => {
    if (!text) return "";
    
    // Replace code blocks with syntax highlighted versions
    return text.replace(/```(\w+)?\n([\s\S]*?)\n```/g, (match, language, code) => {
      const lang = language || 'javascript';
      return `<pre class="line-numbers"><code class="language-${lang}">${code}</code></pre>`;
    });
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
          borderRadius: "16px",
          backgroundColor: colors.primary[400],
          backgroundImage: `linear-gradient(135deg, ${colors.primary[400]} 0%, ${colors.primary[500]} 100%)`,
          boxShadow: `0 20px 80px -10px ${colors.grey[900]}80`,
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
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ bgcolor: `${colors.greenAccent[500]}20`, borderRadius: "50%", p: 1 }}>
            {faq.icon}
          </Box>
          <Typography variant="h4" fontWeight="bold">
            {faq.question}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider sx={{ borderColor: colors.grey[800] }} />
      
      <DialogContent>
        <Typography 
          variant="body1" 
          sx={{ 
            whiteSpace: "pre-wrap",
            lineHeight: 1.7,
            mb: 3
          }}
        >
          {faq.answer.replace(/\\n/g, '\n').replace(/\*\*/g, '')}
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color={colors.grey[400]} gutterBottom>
              Category
            </Typography>
            <Chip 
              label={faq.category.charAt(0).toUpperCase() + faq.category.slice(1)} 
              sx={{ bgcolor: colors.primary[600] }}
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
                  sx={{ bgcolor: `${colors.grey[700]}80` }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
        
        {/* Related FAQs Section */}
        {relatedFaqs && relatedFaqs.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ borderColor: colors.grey[800], mb: 2 }} />
            <Typography variant="h6" color={colors.grey[200]} gutterBottom>
              Related Questions
            </Typography>
            <Grid container spacing={2}>
              {relatedFaqs.map(relatedFaq => (
                <Grid item xs={12} key={relatedFaq.id}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      cursor: 'pointer',
                      bgcolor: colors.primary[500],
                      borderRadius: "10px",
                      border: `1px solid ${colors.grey[800]}`,
                      transition: 'all 0.3s ease',
                      '&:hover': { 
                        bgcolor: colors.primary[400],
                        transform: "translateY(-2px)",
                        boxShadow: `0 6px 12px -2px ${colors.grey[900]}50`
                      }
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
                          sx={{ bgcolor: colors.grey[700] }}
                        />
                      ))}
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 3 }}>
        <Button 
          variant="contained" 
          onClick={onClose}
          sx={{ 
            bgcolor: colors.grey[700],
            borderRadius: "8px",
            px: 3,
            boxShadow: "none",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: colors.grey[600],
              boxShadow: `0 4px 8px ${colors.grey[900]}40`
            }
          }}
        >
          Close
        </Button>
        
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title={copied ? "Copied!" : "Copy to clipboard"}>
            <IconButton 
              onClick={handleCopyToClipboard}
              sx={{ 
                bgcolor: copied ? `${colors.greenAccent[500]}20` : "transparent",
                transition: "all 0.2s ease",
                "&:hover": { bgcolor: `${colors.grey[700]}40` }
              }}
            >
              <ContentCopyIcon sx={{ color: copied ? colors.greenAccent[500] : colors.grey[300] }} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Print">
            <IconButton 
              onClick={() => onPrint(faq)}
              sx={{ 
                transition: "all 0.2s ease",
                "&:hover": { 
                  bgcolor: `${colors.grey[700]}40`,
                  transform: "translateY(-2px)"
                }
              }}
            >
              <PrintIcon sx={{ color: colors.grey[300] }} />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Share">
            <IconButton 
              onClick={() => onShare(faq)}
              sx={{ 
                transition: "all 0.2s ease",
                "&:hover": { 
                  bgcolor: `${colors.grey[700]}40`,
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
                bgcolor: isBookmarked ? `${colors.blueAccent[500]}20` : "transparent",
                transition: "all 0.2s ease",
                "&:hover": { 
                  bgcolor: isBookmarked ? `${colors.blueAccent[500]}30` : `${colors.grey[700]}40`,
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

export default FaqDetail;