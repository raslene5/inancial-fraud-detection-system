import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Box, Button, Typography, useTheme, Grid, Paper, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, InputAdornment,
  Snackbar, Alert, Card, CardContent, Tooltip, Avatar, Badge, Tabs, Tab,
  CircularProgress, LinearProgress, Fade, Grow, Popover, List, ListItem,
  ListItemText, ListItemIcon, Divider
} from "@mui/material";
import { tokens } from "../../theme";
import { alpha } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "@mui/icons-material/Search";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DashboardIcon from "@mui/icons-material/Dashboard";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SecurityIcon from "@mui/icons-material/Security";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import TimelineIcon from "@mui/icons-material/Timeline";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ViewCompactIcon from "@mui/icons-material/ViewCompact";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import SettingsIcon from "@mui/icons-material/Settings";
import FilterListIcon from "@mui/icons-material/FilterList";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CountUp from "react-countup";
import Header from "../../components/Header";
import TransactionFormHorizontal from "../../components/TransactionFormHorizontal";
import RecentFraudList from "../../components/RecentFraudList";
import FraudChart from "../../components/FraudChart";
import AnimatedBox from "../../components/AnimatedBox";
import SystemStatus from "../../components/SystemStatus";
import { getFraudHistory, getFraudStatistics, generateFraudReport, getDashboardData, clearLocalData, addSampleFraudData } from "../../FraudService";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const notificationRef = React.useRef(null);
  
  // Core state
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("info");
  const [activeTab, setActiveTab] = useState(0);
  const [notificationCount, setNotificationCount] = useState(3);
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [insightDialogOpen, setInsightDialogOpen] = useState(false);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChartItem, setSelectedChartItem] = useState(null);
  const [activeChartType, setActiveChartType] = useState("pie");
  
  // Fraud data state
  const [fraudStats, setFraudStats] = useState({
    totalTransactions: 0,
    fraudCount: 0,
    suspiciousCount: 0,
    fraudAmount: 0
  });
  
  // UI and Dashboard layout state
  const [compactView, setCompactView] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const initialChartData = useMemo(() => ({
    statusData: { 
      labels: ["Normal", "Suspicious", "Fraud"], 
      values: [0, 0, 0] 
    },
    typeData: { 
      labels: [], 
      values: [] 
    },
    timelineData: { 
      labels: [], 
      values: [], 
      secondaryValues: [] 
    }
  }), []);
  
  const [chartData, setChartData] = useState(initialChartData);
  const [recentFraudTransaction, setRecentFraudTransaction] = useState(null);

  // Load fraud statistics
  const loadFraudStatistics = useCallback(async () => {
    try {
      // Try to get data from backend first
      const backendData = await getDashboardData();
      
      if (backendData) {
        // Use backend data if available
        console.log("Backend data received:", backendData);
        console.log("Fraud amount from backend:", backendData.fraudAmount);
        setFraudStats({
          totalTransactions: backendData.totalTransactions || 0,
          fraudCount: backendData.fraudCount || 0,
          suspiciousCount: backendData.suspiciousCount || 0,
          fraudAmount: backendData.fraudAmount || 0
        });
      } else {
        // Fallback to local storage data
        const fraudHistory = getFraudHistory();
        
        const { fraudCount, suspiciousCount, fraudAmount, mostRecentFraud } = fraudHistory.reduce(
          (acc, item) => {
            if (item.status === "fraud") {
              acc.fraudCount++;
              // Parse amount properly - remove currency symbols and convert to number
              const amount = typeof item.amount === 'string' 
                ? parseFloat(item.amount.replace(/[^0-9.-]/g, '')) 
                : parseFloat(item.amount || 0);
              console.log(`Processing fraud transaction: ${item.transactionId}, amount: ${item.amount}, parsed: ${amount}`);
              acc.fraudAmount += isNaN(amount) ? 0 : amount;
              if (!acc.mostRecentFraud || new Date(item.timestamp) > new Date(acc.mostRecentFraud.timestamp)) {
                acc.mostRecentFraud = item;
              }
            } else if (item.status === "suspicious") {
              acc.suspiciousCount++;
            }
            return acc;
          },
          { fraudCount: 0, suspiciousCount: 0, fraudAmount: 0, mostRecentFraud: null }
        );
        
        console.log(`Final fraud stats - Count: ${fraudCount}, Amount: ${fraudAmount}`);
        setFraudStats({
          totalTransactions: fraudHistory.length,
          fraudCount,
          suspiciousCount,
          fraudAmount
        });
      }
    } catch (error) {
      console.error("Error loading fraud statistics:", error);
      // Fallback to local storage on error
      const fraudHistory = getFraudHistory();
      const stats = getFraudStatistics();
      
      const { fraudCount, suspiciousCount, fraudAmount, mostRecentFraud } = fraudHistory.reduce(
        (acc, item) => {
          if (item.status === "fraud") {
            acc.fraudCount++;
            const amount = typeof item.amount === 'string' 
              ? parseFloat(item.amount.replace(/[^0-9.-]/g, '')) 
              : parseFloat(item.amount || 0);
            acc.fraudAmount += isNaN(amount) ? 0 : amount;
            if (!acc.mostRecentFraud || new Date(item.timestamp) > new Date(acc.mostRecentFraud.timestamp)) {
              acc.mostRecentFraud = item;
            }
          } else if (item.status === "suspicious") {
            acc.suspiciousCount++;
          }
          return acc;
        },
        { fraudCount: 0, suspiciousCount: 0, fraudAmount: 0, mostRecentFraud: null }
      );
      
      setFraudStats({
        totalTransactions: fraudHistory.length,
        fraudCount,
        suspiciousCount,
        fraudAmount
      });
    }
    
    // Get chart data from local storage for now
    const fraudHistory = getFraudHistory();
    const stats = getFraudStatistics();
    
    // Always update the status data to ensure chart reflects current state
    const normalCount = fraudHistory.length - (fraudStats.fraudCount || 0) - (fraudStats.suspiciousCount || 0);
    
    // Use real timeline data from fraud history
    const realTimelineData = generateTimelineFromHistory(fraudHistory);
    
    // Create updated stats object
    const updatedStats = {
      ...stats,
      statusData: {
        labels: ["Normal", "Suspicious", "Fraud"],
        values: [normalCount, fraudStats.suspiciousCount || 0, fraudStats.fraudCount || 0]
      },
      timelineData: realTimelineData
    };
    
    console.log("Updated chart data:", updatedStats);
    
    // Update chart data with the latest values
    setChartData(updatedStats);
    
    // Get most recent fraud from local storage for display
    const mostRecentFraud = fraudHistory.find(item => item.status === "fraud");
    if (mostRecentFraud) {
      setRecentFraudTransaction(mostRecentFraud);
    }
  }, [fraudStats]);
  
  // Generate timeline data from actual fraud history
  const generateTimelineFromHistory = (fraudHistory) => {
    const today = new Date();
    const dayData = {};
    
    // Initialize last 7 days with zero values
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayKey = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      dayData[dayKey] = { fraud: 0, suspicious: 0 };
    }
    
    // Count actual transactions by day
    fraudHistory.forEach(transaction => {
      const date = new Date(transaction.timestamp);
      const dayKey = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
      
      if (dayData[dayKey]) {
        if (transaction.status === "fraud") {
          dayData[dayKey].fraud++;
        } else if (transaction.status === "suspicious") {
          dayData[dayKey].suspicious++;
        }
      }
    });
    
    const sortedDays = Object.keys(dayData).sort();
    return {
      labels: sortedDays,
      values: sortedDays.map(day => dayData[day].fraud),
      secondaryValues: sortedDays.map(day => dayData[day].suspicious)
    };
  };

  useEffect(() => {
    loadFraudStatistics();
  }, []);

  // Core handlers
  const showAlert = useCallback((message, severity = "info") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setAlertOpen(true);
  }, []);

  const handleAlertClose = () => setAlertOpen(false);
  
  const handleTransactionDetection = useCallback((result) => {
    if (!result) return;
    
    // Always load fraud statistics first to ensure chart updates for all transaction types
    loadFraudStatistics();
    
    switch (result.status) {
      case "fraud":
        showAlert(`Fraud detected! Risk score: ${result.riskScore || 0}%`, "error");
        // Add to notifications
        setNotifications(prev => [
          {
            id: Date.now(),
            type: "fraud",
            message: `Fraud detected! Risk score: ${result.riskScore || 0}%`,
            time: new Date().toLocaleTimeString(),
            transactionId: result.transactionId || "Unknown",
            riskScore: result.riskScore || 0
          },
          ...prev.slice(0, 9) // Keep only 10 most recent notifications
        ]);
        setNotificationCount(prev => prev + 1);
        setNotificationOpen(true);
        break;
      case "suspicious":
        showAlert(`Suspicious activity detected. Risk score: ${result.riskScore || 0}%`, "warning");
        // Add to notifications
        setNotifications(prev => [
          {
            id: Date.now(),
            type: "suspicious",
            message: `Suspicious activity detected. Risk score: ${result.riskScore || 0}%`,
            time: new Date().toLocaleTimeString(),
            transactionId: result.transactionId || "Unknown",
            riskScore: result.riskScore || 0
          },
          ...prev.slice(0, 9) // Keep only 10 most recent notifications
        ]);
        setNotificationCount(prev => prev + 1);
        setNotificationOpen(true);
        break;
      case "normal":
        showAlert(`Transaction processed normally. Risk score: ${result.riskScore || 0}%`, "success");
        break;
      default:
        break;
    }
    
    // Minimal chart update
    if (result.status === "fraud" || result.status === "suspicious") {
      setTimeout(() => loadFraudStatistics(), 1000);
    }
  }, [showAlert, loadFraudStatistics]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadFraudStatistics();
    setTimeout(() => setRefreshing(false), 500);
  }, [loadFraudStatistics]);
  
  const handleDownloadReport = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const fraudHistory = getFraudHistory();
      
      // Show a loading message
      showAlert("Generating report with charts...", "info");
      
      // Wait a moment to ensure charts are rendered
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate the report with chart data and fraud stats
      const reportUrl = await generateFraudReport(fraudHistory, chartData, fraudStats);
      
      if (!reportUrl) {
        throw new Error("Failed to generate report");
      }
      
      const link = document.createElement("a");
      link.href = reportUrl;
      link.download = `fraud_report_${new Date().toISOString().split("T")[0]}.pdf`;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => document.body.removeChild(link), 100);
      
      showAlert("Report downloaded successfully", "success");
    } catch (error) {
      console.error("Error downloading report:", error);
      showAlert("Failed to download report", "error");
    } finally {
      setLoading(false);
    }
  }, [loading, showAlert, chartData, fraudStats]);

  const handleViewFraudDetails = useCallback((transaction) => {
    if (!transaction) return;
    
    if (transaction === "viewAll") {
      showAlert("Viewing all fraud transactions", "info");
    } else if (transaction?.transactionId) {
      showAlert(`Viewing details for transaction ${transaction.transactionId}`, "info");
    }
  }, [showAlert]);

  const handleChartItemClick = useCallback((item, index) => {
    if (item && index !== undefined && index >= 0) {
      showAlert(`Selected ${item}: ${chartData.statusData.values[index]} transactions`, "info");
    } else if (item === "Total") {
      showAlert(`Total transactions: ${index}`, "info");
    }
  }, [chartData.statusData.values, showAlert]);

  // Get icon based on stat type
  const getStatIcon = (title) => {
    switch (title) {
      case "Total Transactions":
        return <ReceiptLongIcon fontSize="large" />;
      case "Fraud Detected":
        return <ErrorOutlineIcon fontSize="large" />;
      case "Suspicious Activity":
        return <WarningAmberIcon fontSize="large" />;
      case "Fraud Amount":
        return <AttachMoneyIcon fontSize="large" />;
      default:
        return <DashboardIcon fontSize="large" />;
    }
  };

  // Get progress value based on stat type
  const getProgressValue = (title) => {
    const total = fraudStats.totalTransactions || 1;
    switch (title) {
      case "Total Transactions":
        return 100;
      case "Fraud Detected":
        return (fraudStats.fraudCount / total) * 100;
      case "Suspicious Activity":
        return (fraudStats.suspiciousCount / total) * 100;
      case "Fraud Amount":
        // Arbitrary scale - assume 10k is 100%
        return Math.min((fraudStats.fraudAmount / 10000) * 100, 100);
      default:
        return 0;
    }
  };

  // Render enhanced stat card
  const renderStatCard = (title, value, color, description, delay = 0) => {
    const icon = getStatIcon(title);
    const progressValue = getProgressValue(title);
    const isValueNumber = typeof value === 'string' && !value.includes('$');
    const numericValue = isValueNumber ? parseInt(value.replace(/,/g, ''), 10) : 0;
    
    return (
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ 
          y: -5,
          boxShadow: `0 10px 30px 0 ${alpha(color, 0.3)}`
        }}
        transition={{ 
          duration: 0.3, 
          delay,
          type: "spring",
          stiffness: 300
        }}
        sx={{
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(colors.primary[400], 0.05)} 0%, ${alpha(colors.primary[800], 0.15)} 100%)`,
          backdropFilter: "blur(10px)",
          border: `1px solid ${alpha(colors.grey[100], 0.1)}`,
          boxShadow: `
            0 10px 25px -5px ${alpha(color, 0.2)},
            0 8px 10px -8px ${alpha(colors.primary[900], 0.2)},
            inset 0 1px 0 0 ${alpha(colors.grey[100], 0.05)}
          `,
          height: "100%",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Glowing background effect */}
        <Box
          sx={{
            position: "absolute",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            background: alpha(color, 0.15),
            filter: "blur(40px)",
            top: "-50px",
            right: "-50px",
            zIndex: 0
          }}
        />
        
        <CardContent sx={{ position: "relative", zIndex: 1, p: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography 
              variant="subtitle1" 
              fontWeight="bold"
              color={colors.grey[200]}
              sx={{ 
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                fontSize: "0.85rem"
              }}
            >
              {title}
            </Typography>
            
            <Avatar
              sx={{ 
                bgcolor: alpha(color, 0.2),
                color: color,
                width: 45,
                height: 45
              }}
            >
              {icon}
            </Avatar>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              color={color} 
              sx={{ 
                mb: 0.5,
                display: "flex",
                alignItems: "baseline"
              }}
            >
              {value.includes('$') ? '$' : ''}
              <AnimatePresence mode="wait">
                <motion.span
                  key={value}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {isValueNumber ? (
                    <CountUp 
                      end={numericValue} 
                      duration={2} 
                      separator="," 
                    />
                  ) : (
                    value.replace('$', '')
                  )}
                </motion.span>
              </AnimatePresence>
            </Typography>
            
            <Typography 
              variant="body2" 
              color={colors.grey[400]}
              sx={{ mb: 2 }}
            >
              {description}
            </Typography>
          </Box>
          
          <Box sx={{ position: "relative", pt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(colors.grey[800], 0.4),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  backgroundColor: color,
                  backgroundImage: `linear-gradient(90deg, ${alpha(color, 0.7)}, ${color})`,
                  boxShadow: `0 0 10px ${alpha(color, 0.5)}`
                }
              }}
            />
            <Box 
              sx={{ 
                display: "flex", 
                justifyContent: "space-between",
                mt: 0.5
              }}
            >
              <Typography variant="caption" color={colors.grey[500]}>
                0%
              </Typography>
              <Typography variant="caption" color={color} fontWeight="bold">
                {Math.round(progressValue)}%
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <AnimatedBox className={compactView ? "compact-view" : "standard-view"}>
      {/* Header */}
      <Paper
        elevation={0}
        component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          mb: 3,
          p: 3,
          borderRadius: "20px",
          background: `linear-gradient(135deg, ${alpha(colors.primary[400], 0.9)}, ${alpha(colors.primary[600], 0.95)})`,
          backdropFilter: "blur(20px)",
          boxShadow: `
            0 15px 50px -10px ${alpha(colors.primary[900], 0.6)},
            0 8px 25px -5px ${alpha(colors.primary[900], 0.4)},
            inset 0 1px 0 0 ${alpha(colors.grey[100], 0.15)}
          `,
          border: `1px solid ${alpha(colors.grey[100], 0.15)}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Enhanced decorative background elements */}
        <Box
          sx={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(colors.greenAccent[500], 0.25)} 0%, transparent 70%)`,
            filter: "blur(15px)",
            zIndex: 0,
          }}
        />
        
        <Box
          sx={{
            position: "absolute",
            bottom: -100,
            left: -100,
            width: 250,
            height: 250,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(colors.blueAccent[500], 0.2)} 0%, transparent 70%)`,
            filter: "blur(15px)",
            zIndex: 0,
          }}
        />
        
        <Box
          component={motion.div}
          animate={{
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          sx={{
            position: "absolute",
            top: "50%",
            right: "10%",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(colors.redAccent[500], 0.15)} 0%, transparent 70%)`,
            filter: "blur(20px)",
            zIndex: 0,
          }}
        />
        
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
          <Box display="flex" alignItems="center">
            <Avatar 
              component={motion.div}
              whileHover={{ 
                scale: 1.1,
                boxShadow: `0 0 30px ${alpha(colors.greenAccent[500], 0.6)}`,
              }}
              sx={{ 
                bgcolor: alpha(colors.greenAccent[500], 0.25), 
                mr: 2.5,
                width: 64,
                height: 64,
                boxShadow: `0 0 25px ${alpha(colors.greenAccent[500], 0.5)}`,
                border: `2px solid ${alpha(colors.grey[100], 0.25)}`,
              }}
            >
              <DashboardIcon sx={{ fontSize: 34 }} />
            </Avatar>
            <Box>
              <Typography 
                variant="h2" 
                color={colors.grey[100]} 
                fontWeight="bold"
                sx={{ 
                  textShadow: `0 2px 15px ${alpha(colors.primary[900], 0.6)}`,
                  letterSpacing: "2px",
                  background: `linear-gradient(90deg, ${colors.grey[100]}, ${alpha(colors.grey[300], 0.8)})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                DASHBOARD
              </Typography>
              <Typography 
                variant="h5" 
                component={motion.div}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                sx={{ 
                  color: alpha(colors.grey[100], 0.9),
                  textShadow: `0 2px 8px ${alpha(colors.primary[900], 0.4)}`,
                  fontWeight: 500,
                  mt: 0.5,
                  letterSpacing: "0.5px"
                }}
              >
                Financial Fraud Detection System
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1.5}>
            <Tooltip title={compactView ? "Standard view" : "Compact view"}>
              <IconButton 
                onClick={() => setCompactView(!compactView)}
                sx={{
                  bgcolor: compactView ? 
                    alpha(colors.blueAccent[500], 0.15) : 
                    alpha(colors.grey[100], 0.1),
                  backdropFilter: "blur(10px)",
                  border: compactView ? 
                    `1px solid ${alpha(colors.blueAccent[500], 0.3)}` : 
                    `1px solid ${alpha(colors.grey[100], 0.1)}`,
                  boxShadow: compactView ?
                    `0 4px 15px ${alpha(colors.blueAccent[500], 0.3)}` :
                    `0 4px 10px ${alpha(colors.primary[900], 0.2)}`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: compactView ? 
                      alpha(colors.blueAccent[500], 0.2) : 
                      alpha(colors.grey[100], 0.15),
                    transform: "translateY(-2px)",
                    boxShadow: compactView ?
                      `0 6px 20px ${alpha(colors.blueAccent[500], 0.4)}` :
                      `0 6px 15px ${alpha(colors.primary[900], 0.3)}`,
                  }
                }}
              >
                {compactView ? <ViewComfyIcon /> : <ViewCompactIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh data">
              <IconButton 
                onClick={handleRefresh}
                disabled={refreshing}
                sx={{
                  bgcolor: alpha(colors.grey[100], 0.1),
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${alpha(colors.grey[100], 0.1)}`,
                  boxShadow: `0 4px 10px ${alpha(colors.primary[900], 0.2)}`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: alpha(colors.grey[100], 0.15),
                    transform: "translateY(-2px)",
                    boxShadow: `0 6px 15px ${alpha(colors.primary[900], 0.3)}`,
                  }
                }}
              >
                <RefreshIcon 
                  sx={{ 
                    animation: refreshing ? "spin 1s infinite linear" : "none" 
                  }} 
                />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <IconButton 
                onClick={(event) => {
                  setNotificationOpen(true);
                }}
                ref={notificationRef}
                sx={{
                  bgcolor: notificationCount > 0 ? alpha(colors.redAccent[500], 0.15) : alpha(colors.grey[100], 0.1),
                  backdropFilter: "blur(10px)",
                  border: notificationCount > 0 ? 
                    `1px solid ${alpha(colors.redAccent[500], 0.3)}` : 
                    `1px solid ${alpha(colors.grey[100], 0.1)}`,
                  boxShadow: notificationCount > 0 ?
                    `0 4px 15px ${alpha(colors.redAccent[500], 0.3)}` :
                    `0 4px 10px ${alpha(colors.primary[900], 0.2)}`,
                  transition: "all 0.2s ease",
                  animation: notificationCount > 0 ? "pulse 2s infinite" : "none",
                  "&:hover": {
                    bgcolor: notificationCount > 0 ? 
                      alpha(colors.redAccent[500], 0.2) : 
                      alpha(colors.grey[100], 0.15),
                    transform: "translateY(-2px)",
                    boxShadow: notificationCount > 0 ?
                      `0 6px 20px ${alpha(colors.redAccent[500], 0.4)}` :
                      `0 6px 15px ${alpha(colors.primary[900], 0.3)}`,
                  }
                }}
              >
                <Badge 
                  badgeContent={notificationCount} 
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.3)",
                      animation: notificationCount > 0 ? "pulse 1s infinite" : "none",
                    }
                  }}
                >
                  <NotificationsActiveIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            

            
            <Button
              variant="contained"
              startIcon={<LightbulbOutlinedIcon />}
              disabled={true}
              sx={{
                background: (theme) => {
                  // Calculate color based on risk factors
                  const riskRatio = fraudStats.fraudCount / (fraudStats.totalTransactions || 1);
                  const highRisk = riskRatio > 0.3 || fraudStats.fraudCount > 5;
                  const mediumRisk = riskRatio > 0.1 || fraudStats.fraudCount > 2;
                  
                  if (highRisk) {
                    return `linear-gradient(135deg, ${alpha(colors.redAccent[600], 0.9)}, ${alpha(colors.redAccent[800], 0.95)})`;
                  } else if (mediumRisk) {
                    return `linear-gradient(135deg, ${alpha(colors.orangeAccent[600], 0.9)}, ${alpha(colors.orangeAccent[800], 0.95)})`;
                  } else {
                    return `linear-gradient(135deg, ${alpha(colors.blueAccent[600], 0.9)}, ${alpha(colors.blueAccent[800], 0.95)})`;
                  }
                },
                backdropFilter: "blur(10px)",
                boxShadow: (theme) => {
                  const riskRatio = fraudStats.fraudCount / (fraudStats.totalTransactions || 1);
                  const highRisk = riskRatio > 0.3 || fraudStats.fraudCount > 5;
                  const mediumRisk = riskRatio > 0.1 || fraudStats.fraudCount > 2;
                  
                  if (highRisk) {
                    return `0 4px 15px ${alpha(colors.redAccent[900], 0.4)}`;
                  } else if (mediumRisk) {
                    return `0 4px 15px ${alpha(colors.orangeAccent[900], 0.4)}`;
                  } else {
                    return `0 4px 15px ${alpha(colors.blueAccent[900], 0.4)}`;
                  }
                },
                border: `1px solid ${alpha(colors.grey[100], 0.1)}`,
                borderRadius: "10px",
                px: 2,
                py: 1,
                fontWeight: "bold",
                transition: "all 0.2s ease",
                animation: fraudStats.fraudCount > 5 ? "pulse 2s infinite" : "none",
                "&:hover": {
                  background: (theme) => {
                    const riskRatio = fraudStats.fraudCount / (fraudStats.totalTransactions || 1);
                    const highRisk = riskRatio > 0.3 || fraudStats.fraudCount > 5;
                    const mediumRisk = riskRatio > 0.1 || fraudStats.fraudCount > 2;
                    
                    if (highRisk) {
                      return `linear-gradient(135deg, ${alpha(colors.redAccent[500], 0.9)}, ${alpha(colors.redAccent[700], 0.95)})`;
                    } else if (mediumRisk) {
                      return `linear-gradient(135deg, ${alpha(colors.orangeAccent[500], 0.9)}, ${alpha(colors.orangeAccent[700], 0.95)})`;
                    } else {
                      return `linear-gradient(135deg, ${alpha(colors.blueAccent[500], 0.9)}, ${alpha(colors.blueAccent[700], 0.95)})`;
                    }
                  },
                  transform: "translateY(-2px)",
                  boxShadow: (theme) => {
                    const riskRatio = fraudStats.fraudCount / (fraudStats.totalTransactions || 1);
                    const highRisk = riskRatio > 0.3 || fraudStats.fraudCount > 5;
                    const mediumRisk = riskRatio > 0.1 || fraudStats.fraudCount > 2;
                    
                    if (highRisk) {
                      return `0 6px 20px ${alpha(colors.redAccent[900], 0.5)}`;
                    } else if (mediumRisk) {
                      return `0 6px 20px ${alpha(colors.orangeAccent[900], 0.5)}`;
                    } else {
                      return `0 6px 20px ${alpha(colors.blueAccent[900], 0.5)}`;
                    }
                  },
                }
              }}
            >
              {fraudStats.fraudCount > 5 ? "Critical Insights" : fraudStats.fraudCount > 2 ? "Risk Insights" : "AI Insights"}
            </Button>
            
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DownloadOutlinedIcon />}
              onClick={handleDownloadReport}
              disabled={loading}
              sx={{
                background: `linear-gradient(135deg, ${alpha(colors.greenAccent[600], 0.9)}, ${alpha(colors.greenAccent[800], 0.95)})`,
                backdropFilter: "blur(10px)",
                boxShadow: `0 4px 15px ${alpha(colors.greenAccent[900], 0.4)}`,
                border: `1px solid ${alpha(colors.grey[100], 0.1)}`,
                borderRadius: "10px",
                px: 2,
                py: 1,
                fontWeight: "bold",
                transition: "all 0.2s ease",
                "&:hover": {
                  background: `linear-gradient(135deg, ${alpha(colors.greenAccent[500], 0.9)}, ${alpha(colors.greenAccent[700], 0.95)})`,
                  transform: "translateY(-2px)",
                  boxShadow: `0 6px 20px ${alpha(colors.greenAccent[900], 0.5)}`,
                },
                "&.Mui-disabled": {
                  background: `linear-gradient(135deg, ${alpha(colors.grey[500], 0.7)}, ${alpha(colors.grey[700], 0.8)})`,
                  color: alpha(colors.grey[100], 0.7)
                }
              }}
            >
              {loading ? "Generating..." : "Export Report"}
            </Button>
            
            <Button
              variant="outlined"
              onClick={() => {
                addSampleFraudData();
                loadFraudStatistics();
                showAlert("Sample fraud data added and refreshed", "success");
              }}
              sx={{
                borderColor: alpha(colors.orangeAccent[500], 0.5),
                color: colors.orangeAccent[500],
                "&:hover": {
                  borderColor: colors.orangeAccent[500],
                  backgroundColor: alpha(colors.orangeAccent[500], 0.1)
                }
              }}
            >
              Add Test Data
            </Button>
          </Box>
        </Box>
        
        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            mt: 4,
            position: "relative",
            zIndex: 1,
            "& .MuiTabs-indicator": {
              backgroundColor: colors.greenAccent[400],
              height: 5,
              borderRadius: "5px 5px 0 0",
              boxShadow: `0 0 15px ${alpha(colors.greenAccent[500], 0.8)}`,
            },
            "& .MuiTab-root": {
              textTransform: "none",
              fontWeight: "bold",
              minWidth: 160,
              fontSize: "1.1rem",
              color: alpha(colors.grey[100], 0.8),
              transition: "all 0.3s ease",
              mx: 1,
              py: 1.5,
              "&.Mui-selected": {
                color: colors.grey[100],
                textShadow: `0 0 10px ${alpha(colors.grey[100], 0.5)}`,
              },
              "&:hover": {
                color: colors.grey[100],
                backgroundColor: alpha(colors.grey[100], 0.15),
                borderRadius: "10px 10px 0 0",
                transform: "translateY(-3px)",
              }
            },
            "& .MuiTabs-flexContainer": {
              gap: 2,
            }
          }}
        >
          <Tab 
            icon={<DashboardIcon sx={{ fontSize: 24 }} />} 
            iconPosition="start" 
            label="Overview" 
            sx={{ 
              borderRadius: "12px 12px 0 0",
              backdropFilter: "blur(15px)",
              border: `1px solid ${alpha(colors.grey[100], 0.15)}`,
              borderBottom: "none",
              boxShadow: `0 -5px 15px ${alpha(colors.primary[900], 0.2)}`,
            }}
          />
        </Tabs>
      </Paper>

      {/* Main Content */}
      <Box sx={{ mt: 3, position: "relative" }}>
        {/* Overview Tab */}
        {activeTab === 0 && (
          <Grid container spacing={compactView ? 2 : 3}>
            {/* Stats Row */}
            <Grid item xs={12}>
              <Grid container spacing={compactView ? 2 : 3}>
                {/* Total Transactions */}
                <Grid item xs={12} sm={6} md={3}>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    {renderStatCard(
                      "Total Transactions",
                      fraudStats.totalTransactions.toLocaleString(),
                      colors.greenAccent[500],
                      "All processed transactions"
                    )}
                  </motion.div>
                </Grid>

                {/* Fraud Count */}
                <Grid item xs={12} sm={6} md={3}>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.1, type: "spring" }}
                  >
                    {renderStatCard(
                      "Fraud Detected",
                      fraudStats.fraudCount.toLocaleString(),
                      colors.redAccent[500],
                      "Confirmed fraud transactions",
                      0.1
                    )}
                  </motion.div>
                </Grid>

                {/* Suspicious Count */}
                <Grid item xs={12} sm={6} md={3}>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                  >
                    {renderStatCard(
                      "Suspicious Activity",
                      fraudStats.suspiciousCount.toLocaleString(),
                      colors.orangeAccent[500],
                      "Requires further review",
                      0.2
                    )}
                  </motion.div>
                </Grid>

                {/* Fraud Amount */}
                <Grid item xs={12} sm={6} md={3}>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                  >
                    {renderStatCard(
                      "Fraud Amount",
                      `$${fraudStats.fraudAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                      colors.redAccent[400],
                      "Total value of fraud transactions",
                      0.3
                    )}
                  </motion.div>
                </Grid>
              </Grid>
            </Grid>
            
            {/* Transaction Form */}
            <Grid item xs={12} sx={{ mx: "auto" }}>
              <Card 
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: `
                    0 25px 50px -12px ${alpha(colors.primary[900], 0.4)},
                    0 10px 20px -8px ${alpha(colors.primary[900], 0.3)},
                    inset 0 1px 0 0 ${alpha(colors.grey[100], 0.07)}
                  `
                }}
                transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
                sx={{ 
                  borderRadius: 4, 
                  height: "100%",
                  background: `linear-gradient(135deg, ${alpha(colors.primary[400], 0.07)} 0%, ${alpha(colors.primary[800], 0.17)} 100%)`,
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${alpha(colors.grey[100], 0.12)}`,
                  boxShadow: `
                    0 20px 40px -5px ${alpha(colors.primary[900], 0.3)},
                    0 8px 16px -8px ${alpha(colors.primary[900], 0.2)},
                    inset 0 1px 0 0 ${alpha(colors.grey[100], 0.05)}
                  `,
                  transition: "all 0.3s ease",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
                    zIndex: 1,
                    borderRadius: "4px 4px 0 0",
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                    <Avatar
                      sx={{ 
                        bgcolor: alpha(colors.blueAccent[500], 0.2),
                        color: colors.blueAccent[500],
                        mr: 2,
                        width: 40,
                        height: 40,
                        boxShadow: `0 0 10px ${alpha(colors.blueAccent[500], 0.3)}`,
                      }}
                    >
                      <ReceiptLongIcon />
                    </Avatar>
                    <Typography 
                      variant="h5" 
                      fontWeight="bold" 
                      sx={{ 
                        background: `linear-gradient(90deg, ${colors.grey[100]}, ${alpha(colors.grey[300], 0.8)})`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        textShadow: `0 2px 5px ${alpha(colors.primary[900], 0.3)}`,
                      }}
                    >
                      Test Transaction
                    </Typography>
                  </Box>
                  <TransactionFormHorizontal onDetection={handleTransactionDetection} />
                </CardContent>
              </Card>
            </Grid>

            {/* Charts Row */}
            <Grid item xs={12} container spacing={compactView ? 2 : 3}>
              {/* Pie Chart */}
              <Grid item xs={12} md={compactView ? 12 : 6}>
                <Card 
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: `
                      0 25px 50px -12px ${alpha(colors.primary[900], 0.4)},
                      0 10px 20px -8px ${alpha(colors.primary[900], 0.3)},
                      inset 0 1px 0 0 ${alpha(colors.grey[100], 0.07)}
                    `
                  }}
                  transition={{ duration: 0.5 }}
                  sx={{ 
                    borderRadius: 4, 
                    height: "100%", 
                    minHeight: 400,
                    background: `linear-gradient(135deg, ${alpha(colors.primary[400], 0.07)} 0%, ${alpha(colors.primary[800], 0.17)} 100%)`,
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(colors.grey[100], 0.12)}`,
                    boxShadow: `
                      0 20px 40px -5px ${alpha(colors.primary[900], 0.3)},
                      0 8px 16px -8px ${alpha(colors.primary[900], 0.2)},
                      inset 0 1px 0 0 ${alpha(colors.grey[100], 0.05)}
                    `,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: `linear-gradient(90deg, ${colors.redAccent[500]}, ${colors.blueAccent[500]})`,
                      zIndex: 1,
                      borderRadius: "4px 4px 0 0",
                    }
                  }}
                >
                  <CardContent sx={{ height: "100%", p: 0 }}>
                    <FraudChart 
                      data={chartData} 
                      chartType="pie"
                      title="Fraud by Status"
                      onItemClick={handleChartItemClick}
                      key="fraud-status-chart"
                      id="fraud-status-chart"
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Timeline Chart */}
              <Grid item xs={12} md={compactView ? 12 : 6}>
                <Card 
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: `
                      0 25px 50px -12px ${alpha(colors.primary[900], 0.4)},
                      0 10px 20px -8px ${alpha(colors.primary[900], 0.3)},
                      inset 0 1px 0 0 ${alpha(colors.grey[100], 0.07)}
                    `
                  }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  sx={{ 
                    borderRadius: 4, 
                    height: "100%", 
                    minHeight: 400,
                    background: `linear-gradient(135deg, ${alpha(colors.primary[400], 0.07)} 0%, ${alpha(colors.primary[800], 0.17)} 100%)`,
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${alpha(colors.grey[100], 0.12)}`,
                    boxShadow: `
                      0 20px 40px -5px ${alpha(colors.primary[900], 0.3)},
                      0 8px 16px -8px ${alpha(colors.primary[900], 0.2)},
                      inset 0 1px 0 0 ${alpha(colors.grey[100], 0.05)}
                    `,
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background: `linear-gradient(90deg, ${colors.blueAccent[500]}, ${colors.greenAccent[500]})`,
                      zIndex: 1,
                      borderRadius: "4px 4px 0 0",
                    }
                  }}
                >
                  <CardContent sx={{ height: "100%", p: 0 }}>
                    <FraudChart 
                      data={chartData} 
                      chartType="line"
                      title="Fraud Timeline"
                      onItemClick={handleChartItemClick}
                      key="fraud-timeline-chart-fixed"
                      id="fraud-timeline-chart"
                    />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recent Fraud List */}
            <Grid item xs={12}>
              <Card 
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: `
                    0 25px 50px -12px ${alpha(colors.primary[900], 0.4)},
                    0 10px 20px -8px ${alpha(colors.primary[900], 0.3)},
                    inset 0 1px 0 0 ${alpha(colors.grey[100], 0.07)}
                  `
                }}
                transition={{ duration: 0.5, delay: 0.3 }}
                sx={{ 
                  borderRadius: 4, 
                  height: "100%", 
                  minHeight: 300,
                  background: `linear-gradient(135deg, ${alpha(colors.primary[400], 0.07)} 0%, ${alpha(colors.primary[800], 0.17)} 100%)`,
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${alpha(colors.grey[100], 0.12)}`,
                  boxShadow: `
                    0 20px 40px -5px ${alpha(colors.primary[900], 0.3)},
                    0 8px 16px -8px ${alpha(colors.primary[900], 0.2)},
                    inset 0 1px 0 0 ${alpha(colors.grey[100], 0.05)}
                  `,
                  transition: "all 0.3s ease",
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: `linear-gradient(90deg, ${colors.redAccent[500]}, ${colors.orangeAccent[500]})`,
                    zIndex: 1,
                    borderRadius: "4px 4px 0 0",
                  }
                }}
              >
                <CardContent sx={{ height: "100%", p: 0 }}>
                  <RecentFraudList onViewDetails={handleViewFraudDetails} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}


      </Box>

      {/* Dialogs */}
      {/* Search Dialog */}
      <Dialog
        open={searchDialogOpen}
        onClose={() => setSearchDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Search Transactions</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search by ID, amount, or type"
            type="text"
            fullWidth
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSearchDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained"
            onClick={() => {
              showAlert(`Searching for: ${searchQuery}`, "info");
              setSearchDialogOpen(false);
            }}
          >
            Search
          </Button>
        </DialogActions>
      </Dialog>

      {/* AI Insights Dialog */}
      <Dialog
        open={insightDialogOpen}
        onClose={() => setInsightDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>AI Fraud Insights</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Based on the current fraud patterns, the system has identified the following insights:
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" color={colors.greenAccent[500]}>
              Key Findings:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  {fraudStats.fraudCount > 5 
                    ? "High number of fraud transactions detected. Consider reviewing security protocols."
                    : "Normal fraud activity levels detected."}
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Most common fraud type: Credit Card Transactions
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Peak fraud time: Weekends between 1-3 AM
                </Typography>
              </li>
            </ul>
          </Box>
          
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" color={colors.greenAccent[500]}>
              Recommendations:
            </Typography>
            <ul>
              <li>
                <Typography variant="body2">
                  Implement additional verification for high-value transactions
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Review and update fraud detection rules for international transactions
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  Consider implementing two-factor authentication for all users
                </Typography>
              </li>
            </ul>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInsightDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained"
            onClick={() => {
              showAlert("AI insights report generated", "success");
              setInsightDialogOpen(false);
            }}
          >
            Generate Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert Snackbar */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
        sx={{ mb: 2, mr: 2 }}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertSeverity}
          variant="filled"
          sx={{ 
            width: "100%",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
            borderRadius: 2,
            "& .MuiAlert-icon": {
              fontSize: "1.5rem"
            },
            "& .MuiAlert-message": {
              fontSize: "0.95rem",
              fontWeight: 500
            }
          }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      
      {/* Notifications Popover */}
      <Popover
        open={notificationOpen}
        anchorEl={notificationRef.current}
        onClose={() => setNotificationOpen(false)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            width: 360,
            maxHeight: 400,
            overflow: 'auto',
            borderRadius: 2,
            boxShadow: `
              0 10px 40px ${alpha(colors.primary[900], 0.3)},
              0 5px 20px ${alpha(colors.primary[900], 0.2)}
            `,
            border: `1px solid ${alpha(colors.grey[100], 0.1)}`,
            background: `linear-gradient(135deg, ${alpha(colors.primary[800], 0.95)}, ${alpha(colors.primary[900], 0.97)})`,
            backdropFilter: 'blur(10px)',
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color={colors.grey[100]} fontWeight="bold">
            Fraud Alerts
          </Typography>
          <Box>
            <IconButton 
              size="small" 
              onClick={() => {
                setNotifications([]);
                setNotificationCount(0);
                setNotificationOpen(false);
                showAlert("All notifications cleared", "success");
              }}
              sx={{ 
                color: alpha(colors.grey[100], 0.7),
                '&:hover': { color: colors.grey[100] }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <Divider sx={{ borderColor: alpha(colors.grey[100], 0.1) }} />
        
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body2" color={colors.grey[300]}>
              No new alerts
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <React.Fragment key={notification.id}>
                <ListItem 
                  sx={{ 
                    py: 1.5,
                    px: 2,
                    transition: 'all 0.2s',
                    '&:hover': { 
                      bgcolor: alpha(colors.grey[100], 0.05),
                      backdropFilter: 'blur(10px)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {notification.type === 'fraud' ? (
                      <ErrorIcon sx={{ color: colors.redAccent[500] }} />
                    ) : (
                      <WarningAmberIcon sx={{ color: colors.orangeAccent[500] }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="bold" color={colors.grey[100]}>
                        {notification.type === 'fraud' ? 'Fraud Detected' : 'Suspicious Activity'}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" color={colors.grey[400]} component="div">
                          Risk Score: <span style={{ 
                            color: notification.type === 'fraud' ? colors.redAccent[400] : colors.orangeAccent[400],
                            fontWeight: 'bold'
                          }}>
                            {notification.riskScore}%
                          </span>
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 12, color: colors.grey[500], mr: 0.5 }} />
                          <Typography variant="caption" color={colors.grey[500]}>
                            {notification.time}
                          </Typography>
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider sx={{ borderColor: alpha(colors.grey[100], 0.1) }} />
              </React.Fragment>
            ))}
          </List>
        )}
      </Popover>
    </AnimatedBox>
  );
};

export default Dashboard;