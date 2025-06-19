import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  Button,
  Tooltip,
  alpha,
  Collapse,
  Fade,
  Zoom,
  Slider,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../theme";
import { motion, AnimatePresence } from "framer-motion";
import WarningIcon from "@mui/icons-material/Warning";
import SecurityIcon from "@mui/icons-material/Security";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import BlockIcon from "@mui/icons-material/Block";
import RefreshIcon from "@mui/icons-material/Refresh";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CategoryIcon from "@mui/icons-material/Category";
import FingerprintIcon from "@mui/icons-material/Fingerprint";

const AnalysisResult = ({ result, onReset }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [showDetails, setShowDetails] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);

  useEffect(() => {
    // Trigger score animation after component mounts
    const timer = setTimeout(() => {
      setAnimateScore(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (!result) return null;

  const getRiskColor = (score) => {
    if (score < 40) return colors.greenAccent[500];
    if (score < 70) return colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800";
    return colors.redAccent[500];
  };

  const getStatusIcon = () => {
    switch (result.status) {
      case "fraud":
        return (
          <Box
            component={motion.div}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatDelay: 1
            }}
            sx={{ 
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningIcon 
              sx={{ 
                fontSize: 60, 
                color: colors.redAccent[500],
                filter: `drop-shadow(0 0 10px ${alpha(colors.redAccent[500], 0.7)})`,
              }} 
            />
          </Box>
        );
      case "suspicious":
        return (
          <Box
            component={motion.div}
            animate={{ 
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity 
            }}
            sx={{ 
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SecurityIcon 
              sx={{ 
                fontSize: 60, 
                color: colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800",
                filter: `drop-shadow(0 0 8px ${alpha(colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800", 0.7)})`,
              }} 
            />
          </Box>
        );
      case "error":
        return (
          <Box
            component={motion.div}
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, -5, 5, 0],
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatDelay: 1
            }}
            sx={{ 
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ErrorOutlineIcon 
              sx={{ 
                fontSize: 60, 
                color: colors.grey[300],
                filter: `drop-shadow(0 0 10px ${alpha(colors.grey[300], 0.7)})`,
              }} 
            />
          </Box>
        );
      default:
        return (
          <Box
            component={motion.div}
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity 
            }}
            sx={{ 
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircleIcon 
              sx={{ 
                fontSize: 60, 
                color: colors.greenAccent[500],
                filter: `drop-shadow(0 0 8px ${alpha(colors.greenAccent[500], 0.7)})`,
              }} 
            />
          </Box>
        );
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case "fraud":
        return colors.redAccent[500];
      case "suspicious":
        return colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800";
      case "error":
        return colors.grey[500];
      default:
        return colors.greenAccent[500];
    }
  };

  const getStatusGradient = () => {
    switch (result.status) {
      case "fraud":
        return `linear-gradient(135deg, ${alpha(colors.redAccent[900], 0.8)}, ${alpha(colors.redAccent[700], 0.9)})`;
      case "suspicious":
        return `linear-gradient(135deg, ${alpha(colors.orangeAccent ? colors.orangeAccent[900] : "#E65100", 0.8)}, ${alpha(colors.orangeAccent ? colors.orangeAccent[700] : "#F57C00", 0.9)})`;
      case "error":
        return `linear-gradient(135deg, ${alpha(colors.grey[900], 0.8)}, ${alpha(colors.grey[700], 0.9)})`;
      default:
        return `linear-gradient(135deg, ${alpha(colors.greenAccent[900], 0.8)}, ${alpha(colors.greenAccent[700], 0.9)})`;
    }
  };

  const getActionButton = () => {
    switch (result.status) {
      case "fraud":
        return (
          <Button
            variant="contained"
            startIcon={<BlockIcon />}
            sx={{
              background: `linear-gradient(45deg, ${colors.redAccent[700]}, ${colors.redAccent[500]})`,
              color: colors.grey[100],
              fontWeight: "bold",
              px: 3,
              py: 1,
              borderRadius: "10px",
              boxShadow: `0 8px 20px -4px ${alpha(colors.redAccent[500], 0.6)}`,
              "&:hover": {
                background: `linear-gradient(45deg, ${colors.redAccent[600]}, ${colors.redAccent[400]})`,
                transform: "translateY(-2px)",
                boxShadow: `0 12px 25px -5px ${alpha(colors.redAccent[500], 0.7)}`,
              },
            }}
          >
            Block Transaction
          </Button>
        );
      case "suspicious":
        return (
          <Button
            variant="contained"
            startIcon={<VisibilityIcon />}
            sx={{
              background: `linear-gradient(45deg, ${colors.orangeAccent ? colors.orangeAccent[700] : "#E65100"}, ${colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800"})`,
              color: colors.grey[100],
              fontWeight: "bold",
              px: 3,
              py: 1,
              borderRadius: "10px",
              boxShadow: `0 8px 20px -4px ${alpha(colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800", 0.6)}`,
              "&:hover": {
                background: `linear-gradient(45deg, ${colors.orangeAccent ? colors.orangeAccent[600] : "#F57C00"}, ${colors.orangeAccent ? colors.orangeAccent[400] : "#FFA726"})`,
                transform: "translateY(-2px)",
                boxShadow: `0 12px 25px -5px ${alpha(colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800", 0.7)}`,
              },
            }}
          >
            Review Transaction
          </Button>
        );
      case "error":
        return (
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            sx={{
              background: `linear-gradient(45deg, ${colors.grey[700]}, ${colors.grey[500]})`,
              color: colors.grey[100],
              fontWeight: "bold",
              px: 3,
              py: 1,
              borderRadius: "10px",
              boxShadow: `0 8px 20px -4px ${alpha(colors.grey[500], 0.6)}`,
              "&:hover": {
                background: `linear-gradient(45deg, ${colors.grey[600]}, ${colors.grey[400]})`,
                transform: "translateY(-2px)",
                boxShadow: `0 12px 25px -5px ${alpha(colors.grey[500], 0.7)}`,
              },
            }}
          >
            Retry Transaction
          </Button>
        );
      default:
        return (
          <Button
            variant="contained"
            startIcon={<VerifiedUserIcon />}
            sx={{
              background: `linear-gradient(45deg, ${colors.greenAccent[700]}, ${colors.greenAccent[500]})`,
              color: colors.grey[100],
              fontWeight: "bold",
              px: 3,
              py: 1,
              borderRadius: "10px",
              boxShadow: `0 8px 20px -4px ${alpha(colors.greenAccent[500], 0.6)}`,
              "&:hover": {
                background: `linear-gradient(45deg, ${colors.greenAccent[600]}, ${colors.greenAccent[400]})`,
                transform: "translateY(-2px)",
                boxShadow: `0 12px 25px -5px ${alpha(colors.greenAccent[500], 0.7)}`,
              },
            }}
          >
            Approve Transaction
          </Button>
        );
    }
  };

  const getFactorIcon = (factor) => {
    if (factor.includes("amount")) return <AttachMoneyIcon />;
    if (factor.includes("time")) return <AccessTimeIcon />;
    if (factor.includes("Cash")) return <CategoryIcon />;
    if (factor.includes("pattern")) return <FingerprintIcon />;
    return <TrendingUpIcon />;
  };

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        width: "100%",
        borderRadius: "20px",
        background: `linear-gradient(135deg, ${alpha(colors.primary[400], 0.6)}, ${alpha(colors.primary[700], 0.8)})`,
        backdropFilter: "blur(20px)",
        border: `1px solid ${alpha(getStatusColor(), 0.5)}`,
        boxShadow: `0 20px 80px -10px ${alpha(colors.primary[900], 0.6)}, 
                   0 10px 30px -15px ${alpha(getStatusColor(), 0.6)}`,
        overflow: "hidden",
        position: "relative",
        p: 0,
      }}
    >
      {/* Status header */}
      <Box
        sx={{
          background: getStatusGradient(),
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${alpha(getStatusColor(), 0.5)}`,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: `radial-gradient(circle at 30% 50%, ${alpha(getStatusColor(), 0.4)} 0%, transparent 70%)`,
            zIndex: 0,
          }}
        />
        
        <Box sx={{ display: "flex", alignItems: "center", zIndex: 1 }}>
          {getStatusIcon()}
          <Box ml={2}>
            <Typography
              variant="h4"
              fontWeight="bold"
              color={colors.grey[100]}
              sx={{
                textShadow: `0 2px 10px ${alpha(colors.primary[900], 0.7)}`,
              }}
            >
              {result.status === "fraud"
                ? "Fraud Detected"
                : result.status === "suspicious"
                ? "Suspicious Activity"
                : result.status === "error"
                ? "Connection Error"
                : "Transaction Normal"}
            </Typography>
            <Typography
              variant="body1"
              color={alpha(colors.grey[100], 0.8)}
              sx={{ mt: 0.5 }}
            >
              Transaction ID: {result.transactionId}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ zIndex: 1 }}>
          <Chip
            label={`Risk Score: ${result.riskScore}%`}
            sx={{
              bgcolor: alpha(getStatusColor(), 0.2),
              color: colors.grey[100],
              border: `1px solid ${alpha(getStatusColor(), 0.5)}`,
              fontWeight: "bold",
              fontSize: "1rem",
              py: 2,
              px: 1,
              "& .MuiChip-label": {
                px: 2,
              },
              boxShadow: `0 5px 15px ${alpha(getStatusColor(), 0.3)}`,
            }}
          />
        </Box>
      </Box>

      {/* Risk score gauge */}
      <Box sx={{ p: 3, position: "relative" }}>
        <Box
          sx={{
            position: "relative",
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 10,
              borderRadius: 5,
              background: `linear-gradient(90deg, 
                ${colors.greenAccent[500]} 0%, 
                ${colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800"} 50%, 
                ${colors.redAccent[500]} 100%)`,
              transform: "translateY(-50%)",
              boxShadow: `0 2px 10px ${alpha(colors.primary[900], 0.3)}`,
            }}
          />
          
          {/* Risk level markers */}
          <Box
            sx={{
              position: "absolute",
              top: "calc(50% + 15px)",
              left: "0%",
              transform: "translateX(-50%)",
              color: colors.greenAccent[500],
              fontSize: "0.75rem",
              fontWeight: "bold",
            }}
          >
            0%
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "calc(50% + 15px)",
              left: "25%",
              transform: "translateX(-50%)",
              color: colors.greenAccent[300],
              fontSize: "0.75rem",
              fontWeight: "bold",
            }}
          >
            Low
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "calc(50% + 15px)",
              left: "50%",
              transform: "translateX(-50%)",
              color: colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800",
              fontSize: "0.75rem",
              fontWeight: "bold",
            }}
          >
            Medium
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "calc(50% + 15px)",
              left: "75%",
              transform: "translateX(-50%)",
              color: colors.redAccent[300],
              fontSize: "0.75rem",
              fontWeight: "bold",
            }}
          >
            High
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "calc(50% + 15px)",
              left: "100%",
              transform: "translateX(-50%)",
              color: colors.redAccent[500],
              fontSize: "0.75rem",
              fontWeight: "bold",
            }}
          >
            100%
          </Box>
          
          {/* Animated cursor */}
          <Box
            component={motion.div}
            initial={{ left: "0%" }}
            animate={animateScore ? { left: `${result.riskScore}%` } : { left: "0%" }}
            transition={{ 
              type: "spring", 
              stiffness: 50, 
              damping: 15,
              delay: 0.2
            }}
            sx={{
              position: "absolute",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                bgcolor: getRiskColor(result.riskScore),
                border: `3px solid ${colors.grey[900]}`,
                boxShadow: `0 0 15px ${alpha(getRiskColor(result.riskScore), 0.7)}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: colors.grey[900],
                fontWeight: "bold",
                fontSize: "0.75rem",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: -40,
                left: "50%",
                transform: "translateX(-50%)",
                bgcolor: getRiskColor(result.riskScore),
                color: colors.grey[900],
                fontWeight: "bold",
                px: 2,
                py: 0.5,
                borderRadius: 2,
                whiteSpace: "nowrap",
                boxShadow: `0 5px 15px ${alpha(getRiskColor(result.riskScore), 0.5)}`,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  border: "5px solid transparent",
                  borderTopColor: getRiskColor(result.riskScore),
                },
              }}
            >
              {result.riskScore}%
            </Box>
          </Box>
        </Box>

        {/* Transaction details */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                bgcolor: alpha(colors.primary[800], 0.4),
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha(colors.grey[700], 0.3)}`,
                borderRadius: "12px",
                height: "100%",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color={colors.grey[100]} mb={2}>
                  Transaction Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color={colors.grey[400]}>
                      Amount
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color={colors.grey[100]}>
                      ${parseInt(result.amount)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color={colors.grey[400]}>
                      Type
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color={colors.grey[100]}>
                      {result.type}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color={colors.grey[400]}>
                      Time of Day
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color={colors.grey[100]}>
                      {result.part_of_the_day.charAt(0).toUpperCase() + result.part_of_the_day.slice(1)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color={colors.grey[400]}>
                      Day
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color={colors.grey[100]}>
                      {result.day}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                bgcolor: alpha(colors.primary[800], 0.4),
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha(colors.grey[700], 0.3)}`,
                borderRadius: "12px",
                height: "100%",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold" color={colors.grey[100]} mb={2}>
                  Risk Factors
                </Typography>
                {result.factors && result.factors.length > 0 ? (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {result.factors.map((factor, index) => (
                      <Chip
                        key={index}
                        icon={getFactorIcon(factor)}
                        label={factor}
                        sx={{
                          bgcolor: alpha(getStatusColor(), 0.15),
                          color: colors.grey[100],
                          borderLeft: `3px solid ${getStatusColor()}`,
                          borderRadius: "4px",
                          justifyContent: "flex-start",
                          "& .MuiChip-icon": {
                            color: getStatusColor(),
                            ml: 1,
                          },
                          py: 1,
                          fontWeight: "medium",
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body1" color={colors.grey[300]}>
                    No risk factors identified
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onReset}
            sx={{
              borderColor: alpha(colors.blueAccent[400], 0.5),
              color: colors.blueAccent[300],
              borderRadius: "10px",
              borderWidth: 2,
              px: 3,
              py: 1,
              "&:hover": {
                borderColor: colors.blueAccent[400],
                bgcolor: alpha(colors.blueAccent[900], 0.2),
                transform: "translateY(-2px)",
              },
            }}
          >
            New Analysis
          </Button>
          {getActionButton()}
        </Box>
      </Box>
    </Paper>
  );
};

export default AnalysisResult;