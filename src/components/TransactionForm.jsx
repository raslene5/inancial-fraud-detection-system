import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Divider,
  CircularProgress,
  alpha,
  Alert,
  Slide,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  IconButton,
  Zoom,
  Collapse,
} from "@mui/material";
import { tokens } from "../theme";
import SendIcon from "@mui/icons-material/Send";
import SecurityIcon from "@mui/icons-material/Security";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RefreshIcon from "@mui/icons-material/Refresh";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { motion } from "framer-motion";
import { predictFraud, saveFraudTransaction } from "../FraudService";

const TransactionForm = ({ onSubmit, onDetection }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [animateResult, setAnimateResult] = useState(false);

  // Initialize form data with exactly the fields required by predict.py
  const [formData, setFormData] = useState({
    amount: "",
    day: new Date().getDate(),
    type: "PAYMENT",
    transaction_pair_code: "cc",
    part_of_the_day: "morning"
  });
  
  // Define steps for the transaction test process
  const steps = [
    'Enter Transaction Details', 
    'Analysis in Progress', 
    'View Results'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);
    setActiveStep(1); // Move to analysis step

    try {
      // Prepare data for backend API - exactly matching predict.py requirements
      const apiData = {
        amount: parseInt(formData.amount),
        day: parseInt(formData.day),
        type: formData.type,
        transaction_pair_code: formData.transaction_pair_code,
        part_of_the_day: formData.part_of_the_day
      };

      // Call backend API
      const apiResult = await predictFraud(apiData);
      
      if (!apiResult) {
        throw new Error("Failed to get prediction result");
      }

      // Create transaction result object
      const result = {
        transactionId: "TX" + Math.floor(Math.random() * 1000000),
        timestamp: new Date().toISOString(),
        amount: parseInt(formData.amount),
        type: formData.type,
        status: apiResult.isFraud ? "fraud" : apiResult.probability > 0.3 ? "suspicious" : "normal",
        riskScore: Math.round(apiResult.probability * 100),
        factors: [],
        day: formData.day,
        transaction_pair_code: formData.transaction_pair_code,
        part_of_the_day: formData.part_of_the_day
      };

      // Add risk factors based on model probability
      if (parseFloat(formData.amount) > 1000) result.factors.push("High transaction amount");
      if (formData.part_of_the_day === "night") result.factors.push("Unusual transaction time");
      if (formData.type === "CASH_OUT") result.factors.push("Cash out transaction");
      if (apiResult.probability > 0.7) result.factors.push("High fraud probability score");
      if (apiResult.probability > 0.5) result.factors.push("Unusual transaction pattern");

      setResult(result);
      
      // Pass the result to parent components
      if (onSubmit) onSubmit(formData);
      if (onDetection) onDetection(result);
      
      // If fraud or suspicious, add to history
      if (result.status === "fraud" || result.status === "suspicious") {
        saveFraudTransaction(result);
      }
      
      // Move to results step after a short delay for animation effect
      setTimeout(() => {
        setActiveStep(2);
        setAnimateResult(true);
      }, 800);
    } catch (err) {
      console.error("Error during fraud detection:", err);
      setError("Failed to process transaction. Please try again.");
      setActiveStep(0); // Return to form step on error
    } finally {
      setLoading(false);
    }
  };
  
  // Reset the form and start a new test
  const handleReset = () => {
    setResult(null);
    setError(null);
    setActiveStep(0);
    setAnimateResult(false);
    setFormData({
      amount: "",
      day: new Date().getDate(),
      type: "PAYMENT",
      transaction_pair_code: "cc",
      part_of_the_day: "morning"
    });
  };

  const getRiskColor = (score) => {
    if (score < 40) return colors.greenAccent[500];
    if (score < 70) return colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800";
    return colors.redAccent[500];
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const resultVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        delay: 0.2
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
        p: 3,
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        borderRadius: "20px",
        background: `linear-gradient(135deg, ${alpha(colors.primary[400], 0.85)}, ${alpha(colors.primary[600], 0.95)})`,
        backdropFilter: "blur(20px)",
        border: `1px solid ${alpha(colors.grey[800], 0.5)}`,
        boxShadow: `0 20px 80px -10px ${alpha(colors.grey[900], 0.5)}, 
                   0 10px 30px -15px ${alpha(colors.blueAccent[700], 0.5)}`,
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "6px",
          background: `linear-gradient(90deg, 
            ${colors.greenAccent[500]}, 
            ${colors.blueAccent[500]}, 
            ${colors.redAccent[500]}, 
            ${colors.greenAccent[500]})`,
          backgroundSize: "300% 100%",
          animation: "gradient 8s ease infinite",
          "@keyframes gradient": {
            "0%": { backgroundPosition: "0% 50%" },
            "50%": { backgroundPosition: "100% 50%" },
            "100%": { backgroundPosition: "0% 50%" }
          }
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
      <Box display="flex" justifyContent="flex-end" alignItems="center" mb={3}>
        <Box>
          <Tooltip title="View Tips" arrow>
            <IconButton 
              size="small" 
              onClick={() => setShowTips(!showTips)}
              sx={{
                color: colors.grey[300],
                "&:hover": { color: colors.blueAccent[400] },
                transform: "scale(1.2)",
                transition: "all 0.3s ease",
              }}
            >
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Collapse in={showTips}>
        <Box 
          mb={3} 
          p={3} 
          borderRadius="16px"
          sx={{ 
            background: `linear-gradient(145deg, ${alpha(colors.primary[600], 0.6)}, ${alpha(colors.primary[700], 0.8)})`,
            backdropFilter: "blur(8px)",
            border: `1px solid ${alpha(colors.blueAccent[500], 0.3)}`,
            boxShadow: `0 10px 20px -5px ${alpha(colors.grey[900], 0.3)}`,
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
              background: `linear-gradient(90deg, transparent, ${alpha(colors.blueAccent[500], 0.1)}, transparent)`,
              animation: "tipsScan 3s infinite",
              "@keyframes tipsScan": {
                "0%": { transform: "translateX(-100%)" },
                "100%": { transform: "translateX(100%)" }
              }
            }}
          />
          
          <Typography 
            variant="subtitle1" 
            color={colors.grey[100]} 
            fontWeight="bold" 
            mb={2}
            sx={{
              display: "flex",
              alignItems: "center",
              "&::before": {
                content: '""',
                display: "inline-block",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: colors.blueAccent[500],
                marginRight: "10px",
                boxShadow: `0 0 10px ${colors.blueAccent[500]}`
              }
            }}
          >
            Analysis Tips
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: "12px", 
                  bgcolor: alpha(colors.primary[800], 0.5),
                  border: `1px solid ${alpha(colors.grey[700], 0.5)}`,
                  height: "100%",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Typography variant="body2" color={colors.grey[300]}>
                  • High amounts (>1000) increase fraud risk
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: "12px", 
                  bgcolor: alpha(colors.primary[800], 0.5),
                  border: `1px solid ${alpha(colors.grey[700], 0.5)}`,
                  height: "100%",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Typography variant="body2" color={colors.grey[300]}>
                  • Night transactions are considered more suspicious
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box 
                sx={{ 
                  p: 2, 
                  borderRadius: "12px", 
                  bgcolor: alpha(colors.primary[800], 0.5),
                  border: `1px solid ${alpha(colors.grey[700], 0.5)}`,
                  height: "100%",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <Typography variant="body2" color={colors.grey[300]}>
                  • Cash Out transactions have higher fraud probability
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Collapse>
      
      <Box 
        sx={{ 
          background: alpha(colors.primary[600], 0.3),
          borderRadius: "16px",
          p: 2,
          mb: 4,
          mt: 1,
          boxShadow: `inset 0 0 15px ${alpha(colors.grey[900], 0.2)}`,
          border: `1px solid ${alpha(colors.grey[700], 0.3)}`,
        }}
      >
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          sx={{ 
            "& .MuiStepLabel-root .Mui-completed": {
              color: colors.greenAccent[500],
            },
            "& .MuiStepLabel-root .Mui-active": {
              color: colors.blueAccent[400],
            },
            "& .MuiStepLabel-label": {
              color: colors.grey[300],
              marginTop: 1,
              fontWeight: "bold",
              textShadow: `0 2px 4px ${alpha(colors.grey[900], 0.3)}`,
            },
            "& .MuiStepIcon-root": {
              boxShadow: `0 0 10px ${alpha(colors.blueAccent[500], 0.5)}`,
              borderRadius: "50%",
              transition: "all 0.3s ease",
              "&.Mui-active": {
                transform: "scale(1.2)",
                filter: `drop-shadow(0 0 8px ${alpha(colors.blueAccent[500], 0.7)})`,
              },
              "&.Mui-completed": {
                filter: `drop-shadow(0 0 5px ${alpha(colors.greenAccent[500], 0.7)})`,
              }
            },
            "& .MuiStepConnector-line": {
              borderColor: alpha(colors.grey[600], 0.3),
              borderTopWidth: 3,
              borderRadius: 4,
            },
            "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
              borderColor: alpha(colors.blueAccent[400], 0.5),
              borderTopWidth: 3,
            },
            "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
              borderColor: alpha(colors.greenAccent[500], 0.5),
              borderTopWidth: 3,
            }
          }}
      >
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                {label}
              </motion.div>
            </StepLabel>
          </Step>
        ))}
        </Stepper>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            animation: "pulse 1.5s infinite",
            "@keyframes pulse": {
              "0%": { boxShadow: "0 0 0 0 rgba(211, 47, 47, 0.4)" },
              "70%": { boxShadow: "0 0 0 10px rgba(211, 47, 47, 0)" },
              "100%": { boxShadow: "0 0 0 0 rgba(211, 47, 47, 0)" }
            }
          }}
        >
          {error}
        </Alert>
      )}
      
      {/* Step 1: Transaction Form */}
      <Collapse in={activeStep === 0}>
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <form onSubmit={handleSubmit}>
          <Box 
            sx={{
              background: alpha(colors.primary[600], 0.3),
              borderRadius: "16px",
              p: 3,
              boxShadow: `inset 0 0 15px ${alpha(colors.grey[900], 0.2)}`,
              border: `1px solid ${alpha(colors.grey[700], 0.3)}`,
              mb: 3
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={2.4}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      color: colors.grey[100],
                      "& fieldset": {
                        borderColor: alpha(colors.blueAccent[400], 0.4),
                        borderRadius: "12px",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: alpha(colors.blueAccent[300], 0.6),
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.greenAccent[500],
                      },
                      height: "56px",
                    },
                    "& .MuiInputLabel-root": {
                      color: colors.grey[300],
                      "&.Mui-focused": {
                        color: colors.greenAccent[500],
                      },
                    },
                  }}
                />

                <FormControl
                  fullWidth
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      color: colors.grey[100],
                      "& fieldset": {
                        borderColor: alpha(colors.blueAccent[400], 0.4),
                        borderRadius: "12px",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: alpha(colors.blueAccent[300], 0.6),
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.greenAccent[500],
                      },
                      height: "56px",
                    },
                    "& .MuiInputLabel-root": {
                      color: colors.grey[300],
                      "&.Mui-focused": {
                        color: colors.greenAccent[500],
                      },
                    },
                  }}
                >
                  <InputLabel>Day of Month</InputLabel>
                  <Select
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    label="Day of Month"
                  >
                    {[...Array(31)].map((_, i) => (
                      <MenuItem key={i+1} value={i+1}>{i+1}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      color: colors.grey[100],
                      "& fieldset": {
                        borderColor: alpha(colors.blueAccent[400], 0.4),
                        borderRadius: "12px",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: alpha(colors.blueAccent[300], 0.6),
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.greenAccent[500],
                      },
                      height: "56px",
                    },
                    "& .MuiInputLabel-root": {
                      color: colors.grey[300],
                      "&.Mui-focused": {
                        color: colors.greenAccent[500],
                      },
                    },
                  }}
                >
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Type"
                  >
                    <MenuItem value="CASH_OUT">Cash Out</MenuItem>
                    <MenuItem value="TRANSFER">Transfer</MenuItem>
                    <MenuItem value="PAYMENT">Payment</MenuItem>
                    <MenuItem value="CASH_IN">Cash In</MenuItem>
                    <MenuItem value="DEBIT">Debit</MenuItem>
                  </Select>
                </FormControl>

                <FormControl
                  fullWidth
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      color: colors.grey[100],
                      "& fieldset": {
                        borderColor: alpha(colors.blueAccent[400], 0.4),
                        borderRadius: "12px",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: alpha(colors.blueAccent[300], 0.6),
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.greenAccent[500],
                      },
                      height: "56px",
                    },
                    "& .MuiInputLabel-root": {
                      color: colors.grey[300],
                      "&.Mui-focused": {
                        color: colors.greenAccent[500],
                      },
                    },
                  }}
                >
                  <InputLabel>Pair Code</InputLabel>
                  <Select
                    name="transaction_pair_code"
                    value={formData.transaction_pair_code}
                    onChange={handleChange}
                    label="Pair Code"
                  >
                    <MenuItem value="cc">Customer to Customer (cc)</MenuItem>
                    <MenuItem value="cm">Customer to Merchant (cm)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6} sx={{ mx: "auto" }}>
                <FormControl
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: colors.grey[100],
                      "& fieldset": {
                        borderColor: alpha(colors.blueAccent[400], 0.4),
                        borderRadius: "12px",
                        borderWidth: "2px",
                      },
                      "&:hover fieldset": {
                        borderColor: alpha(colors.blueAccent[300], 0.6),
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: colors.greenAccent[500],
                      },
                      height: "56px",
                    },
                    "& .MuiInputLabel-root": {
                      color: colors.grey[300],
                      "&.Mui-focused": {
                        color: colors.greenAccent[500],
                      },
                    },
                  }}
                >
                  <InputLabel>Time of Day</InputLabel>
                  <Select
                    name="part_of_the_day"
                    value={formData.part_of_the_day}
                    onChange={handleChange}
                    label="Time of Day"
                  >
                    <MenuItem value="morning">Morning</MenuItem>
                    <MenuItem value="afternoon">Afternoon</MenuItem>
                    <MenuItem value="evening">Evening</MenuItem>
                    <MenuItem value="night">Night</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Box display="flex" justifyContent="center" mt={4}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              sx={{
                background: `linear-gradient(45deg, ${colors.greenAccent[600]}, ${colors.greenAccent[400]})`,
                color: colors.grey[900],
                fontWeight: "bold",
                px: 6,
                py: 1.5,
                borderRadius: "30px",
                fontSize: "1rem",
                letterSpacing: "0.5px",
                boxShadow: `0 8px 20px -4px ${alpha(colors.greenAccent[500], 0.6)}`,
                minWidth: "180px",
                "&:hover": {
                  background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.greenAccent[300]})`,
                  transform: "translateY(-3px) scale(1.02)",
                  boxShadow: `0 12px 25px -5px ${alpha(colors.greenAccent[500], 0.7)}`,
                  transition: "all 0.3s ease"
                },
                "&.Mui-disabled": {
                  background: `linear-gradient(45deg, ${alpha(colors.grey[700], 0.8)}, ${alpha(colors.grey[600], 0.8)})`,
                  color: colors.grey[400],
                },
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(120deg, ${alpha(colors.greenAccent[700], 0)}, ${alpha(colors.greenAccent[300], 0.3)}, ${alpha(colors.greenAccent[700], 0)})`,
                  transform: "translateX(-100%)",
                  transition: "transform 0.6s ease",
                },
                "&:hover::after": {
                  transform: "translateX(100%)",
                }
              }}
            >
              {loading ? "Processing..." : "Analyze"}
            </Button>
          </Box>
        </form>
      </motion.div>
      </Collapse>
      
      {/* Step 2: Analysis in Progress */}
      <Collapse in={activeStep === 1}>
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          py={6}
          position="relative"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Box position="relative" sx={{ mb: 3 }}>
              <CircularProgress 
                size={100} 
                thickness={3}
                sx={{ 
                  color: colors.blueAccent[400],
                  opacity: 0.7,
                }} 
              />
              <CircularProgress 
                size={100} 
                thickness={3}
                sx={{ 
                  color: colors.greenAccent[400],
                  position: "absolute",
                  left: 0,
                  animationDuration: "3s",
                  opacity: 0.5,
                }} 
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 70,
                  height: 70,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${alpha(colors.blueAccent[500], 0.2)} 0%, ${alpha(colors.primary[600], 0.8)} 70%)`,
                  boxShadow: `0 0 20px ${alpha(colors.blueAccent[500], 0.5)}`,
                  animation: "pulse 2s infinite",
                  "@keyframes pulse": {
                    "0%": { boxShadow: `0 0 0 0 ${alpha(colors.blueAccent[500], 0.7)}` },
                    "70%": { boxShadow: `0 0 0 15px ${alpha(colors.blueAccent[500], 0)}` },
                    "100%": { boxShadow: `0 0 0 0 ${alpha(colors.blueAccent[500], 0)}` }
                  }
                }}
              >
                <SecurityIcon sx={{ fontSize: 36, color: colors.grey[100] }} />
              </Box>
            </Box>
          </motion.div>
          
          <Typography 
            variant="h4" 
            color={colors.grey[100]} 
            fontWeight="bold"
            textAlign="center"
            mb={2}
            sx={{ 
              textShadow: `0 2px 10px ${alpha(colors.grey[900], 0.5)}`,
              background: `linear-gradient(90deg, ${colors.grey[100]}, ${colors.blueAccent[200]}, ${colors.grey[100]})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundSize: "200% auto",
              animation: "shine 3s linear infinite",
              "@keyframes shine": {
                "0%": { backgroundPosition: "0% 50%" },
                "100%": { backgroundPosition: "200% 50%" }
              }
            }}
          >
            Analysis in Progress
          </Typography>
          
          <Typography 
            variant="body1" 
            color={colors.grey[300]} 
            textAlign="center"
            maxWidth="80%"
            sx={{ mb: 3 }}
          >
            AI model scanning for potential fraud patterns...
          </Typography>
          
          <Box 
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            mt={2} 
            p={3} 
            borderRadius="15px" 
            sx={{ 
              background: `linear-gradient(145deg, ${alpha(colors.primary[600], 0.4)}, ${alpha(colors.primary[700], 0.6)})`,
              backdropFilter: "blur(8px)",
              border: `1px solid ${alpha(colors.grey[700], 0.5)}`,
              maxWidth: "80%",
              boxShadow: `0 10px 30px -5px ${alpha(colors.grey[900], 0.3)}`,
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
                background: `linear-gradient(90deg, transparent, ${alpha(colors.blueAccent[500], 0.1)}, transparent)`,
                animation: "scan 2s infinite",
                "@keyframes scan": {
                  "0%": { transform: "translateX(-100%)" },
                  "100%": { transform: "translateX(100%)" }
                }
              }}
            />
            <Typography variant="body2" color={colors.grey[300]} textAlign="center" fontStyle="italic">
              Checking transaction amount, time patterns, and behavior anomalies
            </Typography>
          </Box>
          
          {/* Animated particles */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: "hidden",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            {[...Array(6)].map((_, i) => (
              <Box
                key={i}
                component={motion.div}
                animate={{
                  y: ["-10%", "110%"],
                  x: ["0%", `${(Math.random() * 20) - 10}%`],
                  opacity: [0, 1, 0],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  delay: i * 0.8,
                  ease: "easeInOut",
                }}
                sx={{
                  position: "absolute",
                  left: `${10 + (i * 15)}%`,
                  top: "-10%",
                  width: i % 2 === 0 ? "12px" : "8px",
                  height: i % 2 === 0 ? "12px" : "8px",
                  borderRadius: "50%",
                  background: i % 3 === 0 
                    ? colors.blueAccent[500] 
                    : i % 3 === 1 
                    ? colors.greenAccent[500] 
                    : colors.redAccent[500],
                  boxShadow: i % 3 === 0 
                    ? `0 0 10px ${colors.blueAccent[500]}` 
                    : i % 3 === 1 
                    ? `0 0 10px ${colors.greenAccent[500]}` 
                    : `0 0 10px ${colors.redAccent[500]}`,
                  opacity: 0.6,
                }}
              />
            ))}
          </Box>
        </Box>
      </Collapse>

      {/* Step 3: Results */}
      <Collapse in={activeStep === 2 && !!result}>
        <Box mt={2}>
          <motion.div
            variants={resultVariants}
            initial="hidden"
            animate={animateResult ? "visible" : "hidden"}
          >
              <Box
                p={3}
                borderRadius="15px"
                sx={{
                  background: `linear-gradient(145deg, ${alpha(
                    result && result.status === "fraud"
                      ? colors.redAccent[700]
                      : result && result.status === "suspicious"
                      ? colors.orangeAccent
                        ? colors.orangeAccent[700]
                        : "#F57C00"
                      : colors.greenAccent[700],
                    0.2
                  )}, ${alpha(
                    result && result.status === "fraud"
                      ? colors.redAccent[900]
                      : result && result.status === "suspicious"
                      ? colors.orangeAccent
                        ? colors.orangeAccent[900]
                        : "#E65100"
                      : colors.greenAccent[900],
                    0.3
                  )})`,
                  border: `1px solid ${alpha(
                    result && result.status === "fraud"
                      ? colors.redAccent[500]
                      : result && result.status === "suspicious"
                      ? colors.orangeAccent
                        ? colors.orangeAccent[500]
                        : "#FF9800"
                      : colors.greenAccent[500],
                    0.5
                  )}`,
                  boxShadow: `0 10px 30px -5px ${alpha(
                    result && result.status === "fraud"
                      ? colors.redAccent[900]
                      : result && result.status === "suspicious"
                      ? "#E65100"
                      : colors.greenAccent[900],
                    0.2
                  )}`,
                }}
              >
                <Box display="flex" alignItems="center" mb={2}>
                  {result && result.status === "fraud" ? (
                    <WarningIcon
                      sx={{ 
                        color: colors.redAccent[500], 
                        fontSize: 40, 
                        mr: 2,
                        animation: "pulse 2s infinite",
                        "@keyframes pulse": {
                          "0%": { opacity: 1 },
                          "50%": { opacity: 0.6 },
                          "100%": { opacity: 1 }
                        }
                      }}
                    />
                  ) : result && result.status === "suspicious" ? (
                    <SecurityIcon
                      sx={{
                        color: colors.orangeAccent
                          ? colors.orangeAccent[500]
                          : "#FF9800",
                        fontSize: 40,
                        mr: 2,
                      }}
                    />
                  ) : (
                    <CheckCircleIcon
                      sx={{ color: colors.greenAccent[500], fontSize: 40, mr: 2 }}
                    />
                  )}
                  <Typography 
                    variant="h4" 
                    fontWeight="bold" 
                    color={colors.grey[100]}
                    sx={{
                      textShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)"
                    }}
                  >
                    {result && result.status === "fraud"
                      ? "Fraud Detected"
                      : result && result.status === "suspicious"
                      ? "Suspicious Activity"
                      : "Transaction Normal"}
                  </Typography>
                </Box>

                {result && (
                  <Grid container spacing={2} mb={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color={colors.grey[300]}>
                        Transaction ID
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color={colors.grey[100]}>
                        {result.transactionId}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color={colors.grey[300]}>
                        Amount
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color={colors.grey[100]}>
                        {parseInt(result.amount)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color={colors.grey[300]}>
                        Type
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color={colors.grey[100]}>
                        {result.type}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color={colors.grey[300]}>
                        Timestamp
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" color={colors.grey[100]}>
                        {new Date(result.timestamp).toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {result && (
                  <Box mb={2}>
                    <Typography variant="body2" color={colors.grey[300]} mb={1}>
                      Risk Score
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="h3"
                        fontWeight="bold"
                        color={getRiskColor(result.riskScore)}
                        sx={{
                          textShadow: `0px 0px 10px ${getRiskColor(result.riskScore)}80`,
                        }}
                      >
                        {result.riskScore}%
                      </Typography>
                      <Box
                        ml={2}
                        flex={1}
                        height={10}
                        borderRadius={5}
                        sx={{
                          background: `linear-gradient(90deg, ${colors.greenAccent[500]} 0%, ${
                            colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800"
                          } 50%, ${colors.redAccent[500]} 100%)`,
                          position: "relative",
                          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
                        }}
                      >
                        <Box
                          position="absolute"
                          top="-10px"
                          sx={{
                            left: `${result.riskScore}%`,
                            transform: "translateX(-50%)",
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            bgcolor: getRiskColor(result.riskScore),
                            border: `3px solid ${colors.grey[900]}`,
                            boxShadow: `0 0 10px ${getRiskColor(result.riskScore)}`,
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                )}

                {result && result.factors && result.factors.length > 0 && (
                  <Box>
                    <Typography variant="body2" color={colors.grey[300]} mb={1}>
                      Risk Factors
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {result.factors.map((factor, index) => (
                        <Chip
                          key={index}
                          label={factor}
                          sx={{
                            bgcolor: alpha(colors.grey[700], 0.7),
                            color: colors.grey[100],
                            borderLeft:
                              result.status === "fraud"
                                ? `3px solid ${colors.redAccent[500]}`
                                : result.status === "suspicious"
                                ? `3px solid ${
                                    colors.orangeAccent
                                      ? colors.orangeAccent[500]
                                      : "#FF9800"
                                  }`
                                : `3px solid ${colors.greenAccent[500]}`,
                            borderRadius: "4px",
                            padding: "4px",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              bgcolor: alpha(colors.grey[600], 0.7),
                              transform: "translateY(-2px)"
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Box>
              
              {/* Action buttons */}
              <Box display="flex" justifyContent="center" mt={4} gap={2}>
                <Button
                  variant="outlined"
                  onClick={handleReset}
                  startIcon={
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <RefreshIcon />
                    </motion.div>
                  }
                  sx={{
                    borderColor: alpha(colors.blueAccent[400], 0.5),
                    color: colors.blueAccent[300],
                    borderRadius: "12px",
                    borderWidth: 2,
                    px: 3,
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: `linear-gradient(120deg, ${alpha(colors.blueAccent[700], 0)}, ${alpha(colors.blueAccent[500], 0.3)}, ${alpha(colors.blueAccent[700], 0)})`,
                      transform: "translateX(-100%)",
                      transition: "transform 0.6s ease",
                    },
                    "&:hover": {
                      borderColor: colors.blueAccent[400],
                      bgcolor: alpha(colors.blueAccent[900], 0.2),
                      transform: "translateY(-3px)",
                      boxShadow: `0 8px 15px -5px ${alpha(colors.blueAccent[700], 0.5)}`,
                      "&::after": {
                        transform: "translateX(100%)",
                      }
                    },
                  }}
                >
                  New Analysis
                </Button>
                
                <Button
                  variant="contained"
                  startIcon={<VerifiedUserIcon />}
                  sx={{
                    background: result && result.status === "fraud"
                      ? `linear-gradient(45deg, ${colors.redAccent[700]}, ${colors.redAccent[500]})`
                      : result && result.status === "suspicious"
                      ? `linear-gradient(45deg, ${colors.orangeAccent ? colors.orangeAccent[700] : "#F57C00"}, ${colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800"})`
                      : `linear-gradient(45deg, ${colors.greenAccent[700]}, ${colors.greenAccent[500]})`,
                    color: colors.grey[900],
                    fontWeight: "bold",
                    px: 4,
                    py: 1.5,
                    borderRadius: "12px",
                    boxShadow: result && result.status === "fraud"
                      ? `0 8px 20px -4px ${alpha(colors.redAccent[500], 0.6)}`
                      : result && result.status === "suspicious"
                      ? `0 8px 20px -4px ${alpha(colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800", 0.6)}`
                      : `0 8px 20px -4px ${alpha(colors.greenAccent[500], 0.6)}`,
                    textTransform: "none",
                    fontSize: "1rem",
                    letterSpacing: 0.5,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "rgba(255, 255, 255, 0.1)",
                      clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
                      transition: "all 0.4s ease",
                    },
                    "&:hover": {
                      transform: "translateY(-3px) scale(1.02)",
                      boxShadow: result && result.status === "fraud"
                        ? `0 12px 25px -5px ${alpha(colors.redAccent[500], 0.7)}`
                        : result && result.status === "suspicious"
                        ? `0 12px 25px -5px ${alpha(colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800", 0.7)}`
                        : `0 12px 25px -5px ${alpha(colors.greenAccent[500], 0.7)}`,
                      "&::before": {
                        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                      }
                    },
                    "&:active": {
                      transform: "translateY(-1px)",
                    }
                  }}
                >
                  {result && result.status === "fraud" 
                    ? "Block Transaction" 
                    : result && result.status === "suspicious"
                    ? "Review Transaction"
                    : "Approve Transaction"}
                </Button>
              </Box>
            </motion.div>
          </Box>
        </Collapse>
      
      {/* Animated background elements */}
      <Box
        component={motion.div}
        animate={{
          opacity: [0.03, 0.08, 0.03],
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
          backgroundImage: `
            radial-gradient(circle at 20% 30%, ${alpha(colors.blueAccent[500], 0.5)} 0%, transparent 50%), 
            radial-gradient(circle at 80% 70%, ${alpha(colors.greenAccent[500], 0.5)} 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, ${alpha(colors.redAccent[500], 0.2)} 0%, transparent 70%)
          `,
        }}
      />
      
      {/* Animated grid lines */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.05,
          backgroundImage: `
            linear-gradient(0deg, ${colors.grey[100]} 1px, transparent 1px),
            linear-gradient(90deg, ${colors.grey[100]} 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          animation: "gridMove 20s linear infinite",
          "@keyframes gridMove": {
            "0%": { backgroundPosition: "0px 0px" },
            "100%": { backgroundPosition: "40px 40px" }
          }
        }}
      />
      
      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <Box
          key={i}
          component={motion.div}
          initial={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`,
            opacity: 0
          }}
          animate={{
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            opacity: [0, 0.7, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut",
          }}
          sx={{
            position: "absolute",
            width: 4 + (i % 3) * 2,
            height: 4 + (i % 3) * 2,
            borderRadius: "50%",
            background: i % 3 === 0 
              ? colors.blueAccent[400] 
              : i % 3 === 1 
              ? colors.greenAccent[400] 
              : colors.redAccent[400],
            filter: `blur(${i % 2 === 0 ? 1 : 2}px)`,
            boxShadow: i % 3 === 0 
              ? `0 0 8px ${colors.blueAccent[400]}` 
              : i % 3 === 1 
              ? `0 0 8px ${colors.greenAccent[400]}` 
              : `0 0 8px ${colors.redAccent[400]}`,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      ))}
    </Paper>
  );
};

export default TransactionForm;