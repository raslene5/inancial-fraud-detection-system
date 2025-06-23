import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  alpha,
  Button,
  Badge,
  Fade,
  Avatar,
  CircularProgress,
  Collapse,
  Zoom,
  Grid,
  Modal,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Backdrop,
  LinearProgress,
} from "@mui/material";
import { tokens } from "../theme";
import WarningIcon from "@mui/icons-material/Warning";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SecurityIcon from "@mui/icons-material/Security";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DeviceUnknownIcon from "@mui/icons-material/DeviceUnknown";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import BlockIcon from "@mui/icons-material/Block";
import FlagIcon from "@mui/icons-material/Flag";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

const RecentFraudList = ({ onViewDetails, maxItems = 5 }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [fraudHistory, setFraudHistory] = useState([]);
  const [newItemAdded, setNewItemAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null);
  const [animateAlert, setAnimateAlert] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isViewingAll, setIsViewingAll] = useState(false);
  const listRef = useRef(null);
  const controls = useAnimation();

  // Load fraud history from localStorage
  const loadFraudHistory = () => {
    setLoading(true);
    try {
      const history = JSON.parse(localStorage.getItem("fraudHistory") || "[]");
      setFraudHistory(history);
      
      // Check if new item was added
      if (history.length > 0 && (!fraudHistory.length || history[0].transactionId !== fraudHistory[0]?.transactionId)) {
        setNewItemAdded(true);
        setAnimateAlert(true);
        setTimeout(() => setNewItemAdded(false), 3000);
        setTimeout(() => setAnimateAlert(false), 5000);
      }
    } catch (error) {
      console.error("Error loading fraud history:", error);
      setFraudHistory([]);
    } finally {
      setTimeout(() => setLoading(false), 600); // Add slight delay for animation effect
    }
  };

  useEffect(() => {
    loadFraudHistory();

    // Set up event listener for storage changes
    const handleStorageChange = () => {
      loadFraudHistory();
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event for when new fraud is detected
    window.addEventListener("fraudDetected", handleStorageChange);
    
    // Pulse animation effect for list items
    const pulseAnimation = async () => {
      if (listRef.current && fraudHistory.length > 0) {
        await controls.start({
          scale: [1, 1.02, 1],
          transition: { duration: 2, ease: "easeInOut" }
        });
        setTimeout(pulseAnimation, 5000);
      }
    };
    
    if (fraudHistory.length > 0) {
      pulseAnimation();
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("fraudDetected", handleStorageChange);
    };
  }, [controls, fraudHistory.length]);

  const handleClearHistory = () => {
    localStorage.setItem("fraudHistory", "[]");
    setFraudHistory([]);
  };

  const handleDeleteItem = (transactionId) => {
    const updatedHistory = fraudHistory.filter(
      (item) => item.transactionId !== transactionId
    );
    localStorage.setItem("fraudHistory", JSON.stringify(updatedHistory));
    setFraudHistory(updatedHistory);
  };

  const getRiskColor = (score) => {
    if (score < 40) return colors.greenAccent[500];
    if (score < 70) return colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800";
    return colors.redAccent[500];
  };
  
  // Get risk gradient for background effects
  const getRiskGradient = (score) => {
    if (score < 40) return `linear-gradient(135deg, ${alpha(colors.greenAccent[500], 0.15)}, transparent)`;
    if (score < 70) return `linear-gradient(135deg, ${alpha(colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800", 0.15)}, transparent)`;
    return `linear-gradient(135deg, ${alpha(colors.redAccent[500], 0.15)}, transparent)`;
  };
  
  // Get transaction icon based on type
  const getTransactionIcon = (type) => {
    const iconMap = {
      "Card Not Present": <AccountBalanceWalletIcon />,
      "Account Takeover": <DeviceUnknownIcon />,
      "Identity Theft": <WarningIcon />,
      "Phishing": <SecurityIcon />,
    };
    return iconMap[type] || <WarningIcon />;
  };
  
  // Toggle expanded item
  const toggleExpandItem = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };
  
  // Handle view details
  const handleViewDetails = (transaction) => {
    if (transaction === "viewAll") {
      setIsViewingAll(true);
      setDetailsModalOpen(true);
    } else {
      setSelectedTransaction(transaction);
      setDetailsModalOpen(true);
    }
    
    // Call the parent component's handler if provided
    if (onViewDetails) {
      onViewDetails(transaction);
    }
  };
  
  // Close details modal
  const handleCloseModal = () => {
    setDetailsModalOpen(false);
    setTimeout(() => {
      setSelectedTransaction(null);
      setIsViewingAll(false);
    }, 300);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };
  
  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Paper
      elevation={3}
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        borderRadius: "15px",
        background: `linear-gradient(145deg, ${alpha(colors.primary[400], 0.9)}, ${alpha(colors.primary[500], 0.95)})`,
        backdropFilter: "blur(10px)",
        border: `1px solid ${alpha(colors.grey[800], 0.5)}`,
        boxShadow: `0 10px 30px -5px ${alpha(colors.grey[900], 0.3)}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "4px",
          background: `linear-gradient(90deg, ${colors.redAccent[500]}, ${colors.blueAccent[500]})`,
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.05,
          background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          pointerEvents: "none",
        }
      }}
    >
      <Box
        p={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderBottom={`1px solid ${alpha(colors.grey[700], 0.5)}`}
        position="relative"
        sx={{
          background: `linear-gradient(to right, ${alpha(colors.primary[400], 0.4)}, ${alpha(colors.primary[500], 0.8)})`,
          backdropFilter: "blur(8px)",
          zIndex: 2,
        }}
      >
        <Box display="flex" alignItems="center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <Avatar
              sx={{
                bgcolor: alpha(colors.redAccent[500], 0.8),
                width: 38,
                height: 38,
                mr: 2,
                boxShadow: `0 0 10px ${alpha(colors.redAccent[500], 0.5)}`,
                border: `2px solid ${alpha(colors.grey[100], 0.2)}`,
              }}
            >
              <motion.div
                animate={animateAlert ? "pulse" : ""}
                variants={pulseVariants}
              >
                <AnalyticsIcon />
              </motion.div>
            </Avatar>
          </motion.div>
          
          <Box>
            <Typography 
              variant="h5" 
              fontWeight="600" 
              color={colors.grey[100]}
              sx={{
                display: "flex",
                alignItems: "center",
                textShadow: `0 2px 4px ${alpha(colors.grey[900], 0.5)}`,
              }}
            >
              <Badge 
                color="error" 
                badgeContent={fraudHistory.length}
                max={999}
                sx={{ 
                  "& .MuiBadge-badge": {
                    animation: newItemAdded ? "pulse 1.5s infinite" : "none",
                    "@keyframes pulse": {
                      "0%": { transform: "scale(1)" },
                      "50%": { transform: "scale(1.2)" },
                      "100%": { transform: "scale(1)" }
                    },
                    minWidth: "22px",
                    height: "22px",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  }
                }}
              >
                Recent Analysed Transactions
              </Badge>
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: alpha(colors.grey[300], 0.8),
                display: "block",
                mt: 0.5,
                ml: 0.5,
              }}
            >
              {loading ? (
                <Box component="span" sx={{ display: "inline-flex", alignItems: "center" }}>
                  <CircularProgress size={10} sx={{ mr: 1 }} /> Loading data...
                </Box>
              ) : (
                <Box component="span" sx={{ display: "inline-flex", alignItems: "center" }}>
                  <AccessTimeIcon sx={{ fontSize: 12, mr: 0.5 }} /> 
                  Last updated: {new Date().toLocaleTimeString()}
                </Box>
              )}
            </Typography>
          </Box>
        </Box>
        
        {fraudHistory.length > 0 && (
          <Tooltip title="Clear History">
            <IconButton
              size="small"
              onClick={handleClearHistory}
              sx={{
                color: colors.grey[300],
                "&:hover": { 
                  color: colors.redAccent[400],
                  transform: "rotate(5deg) scale(1.1)",
                },
                transition: "all 0.2s ease",
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
        
        {/* Animated notification dot for new alerts */}
        {newItemAdded && (
          <Box
            component={motion.div}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: -1,
            }}
          >
            <Box
              component={motion.div}
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `radial-gradient(circle at top right, ${alpha(colors.redAccent[500], 0.3)}, transparent 70%)`,
              }}
            />
          </Box>
        )}
      </Box>

      <Box flex={1} overflow="auto" position="relative">
        {loading ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            p={3}
          >
            <CircularProgress 
              size={60}
              thickness={4}
              sx={{
                color: colors.blueAccent[400],
                mb: 2,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }}
            />
            <Typography variant="body1" color={colors.grey[300]} textAlign="center">
              Loading fraud alerts...
            </Typography>
          </Box>
        ) : fraudHistory.length === 0 ? (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            p={3}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                delay: 0.2 
              }}
            >
              <SecurityIcon
                sx={{ 
                  fontSize: 80, 
                  color: alpha(colors.grey[400], 0.6), 
                  mb: 2,
                  filter: "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.2))"
                }}
              />
            </motion.div>
            <Typography 
              variant="h6" 
              color={colors.grey[200]} 
              textAlign="center"
              sx={{ 
                textShadow: `0 2px 4px ${alpha(colors.grey[900], 0.3)}`,
                mb: 1
              }}
            >
              No fraud alerts detected yet
            </Typography>
            <Typography 
              variant="body2" 
              color={colors.grey[400]} 
              textAlign="center" 
              sx={{
                maxWidth: "80%",
                lineHeight: 1.6
              }}
            >
              Transactions flagged as suspicious or fraudulent will appear here with detailed risk analysis.
            </Typography>
            
            {/* Animated security shield */}
            <Box
              component={motion.div}
              animate={{
                y: [0, -5, 0],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              sx={{
                position: "absolute",
                width: "100%",
                height: "100%",
                top: 0,
                left: 0,
                opacity: 0.05,
                pointerEvents: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24'%3E%3Cpath fill='%23ffffff' d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center 40%",
                backgroundSize: "200px",
              }}
            />
          </Box>
        ) : (
          <AnimatePresence>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ height: "100%" }}
            >
              <List disablePadding ref={listRef}>
                {fraudHistory.slice(0, maxItems).map((transaction, index) => (
                  <motion.div 
                    key={transaction.transactionId} 
                    variants={itemVariants}
                    layoutId={`transaction-${transaction.transactionId}`}
                    whileHover={{ 
                      scale: 1.02,
                      transition: { duration: 0.2 }
                    }}
                    animate={controls}
                  >
                    <Box
                      sx={{
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                          content: '""',
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "4px",
                          background: getRiskColor(transaction.riskScore),
                          opacity: 0.8,
                          boxShadow: `0 0 8px ${getRiskColor(transaction.riskScore)}`,
                        }
                      }}
                    >
                      <ListItem
                        button
                        onClick={() => toggleExpandItem(transaction.transactionId)}
                        sx={{
                          py: 2,
                          px: 3,
                          transition: "all 0.3s ease",
                          background: getRiskGradient(transaction.riskScore),
                          "&:hover": {
                            bgcolor: alpha(colors.primary[600], 0.5),
                            transform: "translateY(-2px)",
                            boxShadow: `0 4px 12px ${alpha(colors.grey[900], 0.2)}`,
                          },
                        }}
                        secondaryAction={
                          <Box display="flex" alignItems="center">
                            <Chip
                              label={`${transaction.riskScore}%`}
                              size="small"
                              sx={{
                                bgcolor: alpha(getRiskColor(transaction.riskScore), 0.2),
                                color: getRiskColor(transaction.riskScore),
                                fontWeight: "bold",
                                mr: 1,
                                borderRadius: "4px",
                                height: "24px",
                                border: `1px solid ${alpha(getRiskColor(transaction.riskScore), 0.3)}`,
                                boxShadow: `0 2px 4px ${alpha(colors.grey[900], 0.2)}`,
                              }}
                            />
                            <Tooltip title="View Details" arrow>
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(transaction);
                                }}
                                sx={{
                                  color: colors.grey[300],
                                  "&:hover": { 
                                    color: colors.blueAccent[400],
                                    transform: "scale(1.1)"
                                  },
                                  transition: "all 0.2s ease"
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete" arrow>
                              <IconButton
                                edge="end"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteItem(transaction.transactionId);
                                }}
                                sx={{
                                  color: colors.grey[300],
                                  "&:hover": { 
                                    color: colors.redAccent[400],
                                    transform: "scale(1.1)"
                                  },
                                  ml: 1,
                                  transition: "all 0.2s ease"
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        }
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            minWidth: 0,
                            pr: 8, // Make room for the action buttons
                          }}
                        >
                          <Avatar
                            sx={{
                              bgcolor: alpha(getRiskColor(transaction.riskScore), 0.2),
                              color: getRiskColor(transaction.riskScore),
                              mr: 2,
                              width: 40,
                              height: 40,
                              border: `1px solid ${alpha(getRiskColor(transaction.riskScore), 0.3)}`,
                              boxShadow: `0 2px 8px ${alpha(colors.grey[900], 0.15)}`,
                            }}
                          >
                            <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                              {getTransactionIcon(transaction.type)}
                            </Zoom>
                          </Avatar>
                          
                          <ListItemText
                            primary={
                              <Typography
                                variant="body1"
                                color={colors.grey[100]}
                                noWrap
                                fontWeight="500"
                                sx={{ 
                                  textShadow: `0 1px 2px ${alpha(colors.grey[900], 0.3)}`,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {transaction.type} - {parseInt(transaction.amount)}
                                {transaction.riskScore > 80 && (
                                  <Box
                                    component={motion.div}
                                    animate={{
                                      scale: [1, 1.2, 1],
                                      opacity: [0.7, 1, 0.7],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    }}
                                    sx={{
                                      display: "inline-flex",
                                      ml: 1,
                                      color: colors.redAccent[500],
                                    }}
                                  >
                                    <WarningIcon fontSize="small" />
                                  </Box>
                                )}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="body2"
                                color={colors.grey[300]}
                                noWrap
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <Box 
                                  component={motion.span}
                                  initial={{ opacity: 0.7 }}
                                  whileHover={{ opacity: 1 }}
                                >
                                  {transaction.transactionId}
                                </Box>
                                <Box 
                                  component="span" 
                                  sx={{ 
                                    display: "inline-block", 
                                    width: "4px", 
                                    height: "4px", 
                                    borderRadius: "50%", 
                                    bgcolor: alpha(colors.grey[400], 0.5),
                                    mx: 0.5
                                  }} 
                                />
                                <AccessTimeIcon sx={{ fontSize: 12, opacity: 0.7, mr: 0.5 }} />
                                {new Date(transaction.timestamp).toLocaleString()}
                              </Typography>
                            }
                            sx={{ minWidth: 0 }}
                          />
                        </Box>
                      </ListItem>
                      
                      {/* Expandable details section */}
                      <Collapse in={expandedItem === transaction.transactionId}>
                        <Box 
                          sx={{ 
                            p: 2, 
                            bgcolor: alpha(colors.primary[700], 0.4),
                            borderLeft: `4px solid ${getRiskColor(transaction.riskScore)}`,
                          }}
                        >
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              {transaction.location && (
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                  <LocationOnIcon sx={{ fontSize: 16, mr: 1, color: alpha(colors.grey[300], 0.7) }} />
                                  <Typography variant="body2" color={colors.grey[300]}>
                                    {transaction.location}
                                  </Typography>
                                </Box>
                              )}
                              {transaction.deviceId && (
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <DeviceUnknownIcon sx={{ fontSize: 16, mr: 1, color: alpha(colors.grey[300], 0.7) }} />
                                  <Typography variant="body2" color={colors.grey[300]}>
                                    {transaction.deviceId}
                                  </Typography>
                                </Box>
                              )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              {transaction.cardNumber && (
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                  <AccountBalanceWalletIcon sx={{ fontSize: 16, mr: 1, color: alpha(colors.grey[300], 0.7) }} />
                                  <Typography variant="body2" color={colors.grey[300]}>
                                    {transaction.cardNumber}
                                  </Typography>
                                </Box>
                              )}
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography variant="body2" color={colors.grey[300]} sx={{ fontStyle: "italic" }}>
                                  {transaction.notes || ""}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                      
                      {index < fraudHistory.length - 1 && (
                        <Divider sx={{ borderColor: alpha(colors.grey[700], 0.3) }} />
                      )}
                    </Box>
                  </motion.div>
                ))}
              </List>
            </motion.div>
          </AnimatePresence>
        )}
      </Box>

      {!loading && fraudHistory.length > maxItems && (
        <Box 
          p={2} 
          borderTop={`1px solid ${alpha(colors.grey[700], 0.5)}`}
          sx={{
            background: `linear-gradient(to bottom, ${alpha(colors.primary[500], 0.4)}, ${alpha(colors.primary[600], 0.8)})`,
            backdropFilter: "blur(8px)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleViewDetails("viewAll")}
              startIcon={<VisibilityIcon />}
              sx={{
                background: `linear-gradient(45deg, ${alpha(colors.blueAccent[600], 0.8)}, ${alpha(colors.blueAccent[400], 0.9)})`,
                color: colors.grey[100],
                borderRadius: "8px",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: `0 4px 12px ${alpha(colors.grey[900], 0.3)}`,
                "&:hover": {
                  background: `linear-gradient(45deg, ${alpha(colors.blueAccent[500], 0.9)}, ${alpha(colors.blueAccent[300], 1)})`,
                  transform: "translateY(-2px)",
                  boxShadow: `0 6px 16px ${alpha(colors.grey[900], 0.4)}`,
                },
                transition: "all 0.3s ease",
                height: "44px",
                fontSize: "0.95rem",
              }}
            >
              View All Analysed Transactions ({fraudHistory.length})
            </Button>
          </motion.div>
          
          {/* Decorative elements */}
          <Box
            sx={{
              position: "absolute",
              top: -10,
              left: 0,
              right: 0,
              height: "10px",
              background: `linear-gradient(to bottom, transparent, ${alpha(colors.grey[900], 0.1)})`,
              pointerEvents: "none",
            }}
          />
        </Box>
      )}
      
      {/* Animated background elements */}
      <Box
        component={motion.div}
        animate={{
          opacity: [0.03, 0.06, 0.03],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 0,
          backgroundImage: `radial-gradient(circle at 20% 30%, ${alpha(colors.blueAccent[500], 0.4)} 0%, transparent 70%), 
                           radial-gradient(circle at 80% 70%, ${alpha(colors.redAccent[500], 0.4)} 0%, transparent 70%)`,
        }}
      />
      
      {/* Transaction Details Modal */}
      <Modal
        open={detailsModalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: {
            backgroundColor: alpha(colors.primary[900], 0.8),
            backdropFilter: "blur(5px)",
          }
        }}
      >
        <Fade in={detailsModalOpen}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: "80%", md: "70%", lg: "60%" },
              maxWidth: "800px",
              maxHeight: "90vh",
              overflow: "hidden",
              outline: "none",
            }}
          >
            <Card
              component={motion.div}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              sx={{
                borderRadius: 3,
                background: `linear-gradient(135deg, ${alpha(colors.primary[500], 0.95)}, ${alpha(colors.primary[700], 0.98)})`,
                backdropFilter: "blur(20px)",
                border: `1px solid ${alpha(colors.grey[100], 0.1)}`,
                boxShadow: `
                  0 20px 60px -10px ${alpha(colors.grey[900], 0.7)},
                  0 10px 20px -10px ${alpha(colors.grey[900], 0.5)},
                  inset 0 1px 0 0 ${alpha(colors.grey[100], 0.05)}
                `,
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Decorative elements */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "4px",
                  background: `linear-gradient(90deg, ${colors.redAccent[500]}, ${colors.blueAccent[500]})`,
                  zIndex: 2,
                }}
              />
              
              <Box
                component={motion.div}
                animate={{
                  opacity: [0.05, 0.1, 0.05],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: `radial-gradient(circle at 30% 20%, ${alpha(colors.blueAccent[500], 0.4)} 0%, transparent 50%), 
                                   radial-gradient(circle at 70% 80%, ${alpha(colors.redAccent[500], 0.4)} 0%, transparent 50%)`,
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: alpha(colors.redAccent[500], 0.2),
                          color: colors.redAccent[500],
                          width: 40,
                          height: 40,
                          mr: 2,
                          boxShadow: `0 0 10px ${alpha(colors.redAccent[500], 0.3)}`,
                        }}
                      >
                        {isViewingAll ? (
                          <SecurityIcon />
                        ) : selectedTransaction?.status === "fraud" ? (
                          <ErrorOutlineIcon />
                        ) : (
                          <WarningAmberIcon />
                        )}
                      </Avatar>
                    </motion.div>
                    <Typography variant="h5" fontWeight="bold" color={colors.grey[100]}>
                      {isViewingAll
                        ? "All Fraud Alerts"
                        : selectedTransaction?.status === "fraud"
                        ? "Fraud Transaction Details"
                        : "Suspicious Transaction Details"}
                    </Typography>
                  </Box>
                }
                action={
                  <IconButton 
                    onClick={handleCloseModal}
                    sx={{
                      color: colors.grey[300],
                      "&:hover": { 
                        color: colors.redAccent[400],
                        transform: "rotate(90deg)"
                      },
                      transition: "all 0.3s ease"
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                }
                sx={{
                  p: 3,
                  pb: 1,
                  "& .MuiCardHeader-action": { m: 0 },
                  borderBottom: `1px solid ${alpha(colors.grey[700], 0.5)}`,
                  position: "relative",
                  zIndex: 1,
                }}
              />
              
              <CardContent
                sx={{
                  p: 0,
                  maxHeight: "70vh",
                  overflow: "auto",
                  position: "relative",
                  zIndex: 1,
                  "&::-webkit-scrollbar": {
                    width: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: alpha(colors.primary[700], 0.5),
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: alpha(colors.grey[500], 0.3),
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    background: alpha(colors.grey[500], 0.5),
                  },
                }}
              >
                {isViewingAll ? (
                  <List disablePadding>
                    <AnimatePresence>
                      {fraudHistory.map((transaction, index) => (
                        <motion.div
                          key={transaction.transactionId}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <ListItem
                            sx={{
                              py: 2,
                              px: 3,
                              borderLeft: `4px solid ${getRiskColor(transaction.riskScore)}`,
                              background: getRiskGradient(transaction.riskScore),
                              "&:hover": {
                                bgcolor: alpha(colors.primary[600], 0.5),
                              },
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: alpha(getRiskColor(transaction.riskScore), 0.2),
                                  color: getRiskColor(transaction.riskScore),
                                  mr: 2,
                                }}
                              >
                                {getTransactionIcon(transaction.type)}
                              </Avatar>
                              
                              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                <Typography variant="body1" color={colors.grey[100]} fontWeight="500">
                                  {transaction.type} - {parseInt(transaction.amount)}
                                </Typography>
                                <Typography variant="body2" color={colors.grey[300]} noWrap>
                                  {transaction.transactionId} • {new Date(transaction.timestamp).toLocaleString()}
                                </Typography>
                              </Box>
                              
                              <Chip
                                label={`${transaction.riskScore}%`}
                                size="small"
                                sx={{
                                  bgcolor: alpha(getRiskColor(transaction.riskScore), 0.2),
                                  color: getRiskColor(transaction.riskScore),
                                  fontWeight: "bold",
                                  ml: 2,
                                }}
                              />
                            </Box>
                          </ListItem>
                          {index < fraudHistory.length - 1 && (
                            <Divider sx={{ borderColor: alpha(colors.grey[700], 0.3) }} />
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </List>
                ) : selectedTransaction ? (
                  <Box p={3}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: alpha(colors.primary[700], 0.4),
                              border: `1px solid ${alpha(colors.grey[700], 0.5)}`,
                              mb: 2,
                            }}
                          >
                            <Typography variant="subtitle2" color={colors.grey[300]} gutterBottom>
                              Transaction Details
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                              <AccountBalanceWalletIcon sx={{ fontSize: 18, mr: 1, color: colors.grey[400] }} />
                              <Typography variant="body2" color={colors.grey[100]}>
                                Amount: <Box component="span" fontWeight="bold">{parseInt(selectedTransaction.amount)}</Box>
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                              <AccessTimeIcon sx={{ fontSize: 18, mr: 1, color: colors.grey[400] }} />
                              <Typography variant="body2" color={colors.grey[100]}>
                                Time: {new Date(selectedTransaction.timestamp).toLocaleString()}
                              </Typography>
                            </Box>
                            {selectedTransaction.location && (
                              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                                <LocationOnIcon sx={{ fontSize: 18, mr: 1, color: colors.grey[400] }} />
                                <Typography variant="body2" color={colors.grey[100]}>
                                  Location: {selectedTransaction.location}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </motion.div>
                        

                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: alpha(getRiskColor(selectedTransaction.riskScore), 0.15),
                              border: `1px solid ${alpha(getRiskColor(selectedTransaction.riskScore), 0.3)}`,
                              mb: 2,
                            }}
                          >
                            <Typography variant="subtitle2" color={colors.grey[300]} gutterBottom>
                              Risk Assessment
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 1 }}>
                              <Typography variant="body2" color={colors.grey[100]}>
                                Risk Score:
                              </Typography>
                              <Chip
                                label={`${selectedTransaction.riskScore}%`}
                                size="small"
                                sx={{
                                  bgcolor: alpha(getRiskColor(selectedTransaction.riskScore), 0.2),
                                  color: getRiskColor(selectedTransaction.riskScore),
                                  fontWeight: "bold",
                                }}
                              />
                            </Box>
                            <Box sx={{ mt: 2, mb: 1 }}>
                              <LinearProgress
                                variant="determinate"
                                value={selectedTransaction.riskScore}
                                sx={{
                                  height: 10,
                                  borderRadius: 5,
                                  bgcolor: alpha(colors.grey[700], 0.5),
                                  '& .MuiLinearProgress-bar': {
                                    borderRadius: 5,
                                    background: `linear-gradient(90deg, ${alpha(colors.greenAccent[500], 0.7)}, ${alpha(colors.redAccent[500], 0.7)} ${selectedTransaction.riskScore}%)`,
                                  },
                                }}
                              />
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                              <Typography variant="caption" color={colors.greenAccent[500]}>Low</Typography>
                              <Typography variant="caption" color={colors.redAccent[500]}>High</Typography>
                            </Box>
                          </Box>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              bgcolor: alpha(colors.primary[700], 0.4),
                              border: `1px solid ${alpha(colors.grey[700], 0.5)}`,
                            }}
                          >
                            <Typography variant="subtitle2" color={colors.grey[300]} gutterBottom>
                              Notes
                            </Typography>
                            <Typography variant="body2" color={colors.grey[100]} sx={{ mt: 1 }}>
                              {selectedTransaction.notes || ""}
                            </Typography>
                          </Box>
                        </motion.div>
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  <Box p={3} textAlign="center">
                    <Typography variant="body1" color={colors.grey[300]}>
                      No transaction selected
                    </Typography>
                  </Box>
                )}
              </CardContent>
              
              <CardActions
                sx={{
                  p: 3,
                  borderTop: `1px solid ${alpha(colors.grey[700], 0.5)}`,
                  justifyContent: "space-between",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleCloseModal}
                  sx={{
                    borderColor: alpha(colors.grey[500], 0.3),
                    color: colors.grey[300],
                    "&:hover": {
                      borderColor: colors.grey[400],
                      bgcolor: alpha(colors.grey[700], 0.3),
                    },
                  }}
                >
                  Close
                </Button>
                

              </CardActions>
            </Card>
          </Box>
        </Fade>
      </Modal>
    </Paper>
  );
};



export default RecentFraudList;