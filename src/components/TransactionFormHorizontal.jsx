import { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  alpha,
  Alert,
  Snackbar,
} from "@mui/material";
import { tokens } from "../theme";
import SendIcon from "@mui/icons-material/Send";
import { motion } from "framer-motion";
import { predictFraud, saveFraudTransaction, checkApiHealth } from "../FraudService";
import AnalysisResult from "./AnalysisResult";

const TransactionFormHorizontal = ({ onSubmit, onDetection }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiStatus, setApiStatus] = useState({ status: "UNKNOWN" });
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    day: new Date().getDate(),
    type: "PAYMENT",
    transaction_pair_code: "cc",
    part_of_the_day: "morning"
  });
  
  // Check API health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      const health = await checkApiHealth();
      setApiStatus(health);
      
      if (health.status !== "UP") {
        setAlertMessage("Backend service is not available. Some features may not work properly.");
        setAlertOpen(true);
      }
    };
    
    checkHealth();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check API health before submitting
    const health = await checkApiHealth();
    setApiStatus(health);
    
    if (health.status !== "UP") {
      setAlertMessage("Backend service is not available. Using fallback mode.");
      setAlertOpen(true);
    }

    try {
      const apiData = {
        amount: parseInt(formData.amount),
        day: parseInt(formData.day),
        type: formData.type,
        transaction_pair_code: formData.transaction_pair_code,
        part_of_the_day: formData.part_of_the_day
      };

      const apiResult = await predictFraud(apiData);
      
      if (!apiResult) {
        throw new Error("Failed to get prediction result");
      }
      
      // Use the response directly from the backend
      const analysisResult = {
        transactionId: apiResult.transactionId || "TX" + Math.floor(Math.random() * 1000000),
        timestamp: apiResult.timestamp || new Date().toISOString(),
        amount: apiResult.amount || parseInt(formData.amount),
        type: apiResult.type || formData.type,
        status: apiResult.status || (apiResult.isFraud ? "fraud" : apiResult.probability > 0.3 ? "suspicious" : "normal"),
        riskScore: apiResult.riskScore || Math.round(apiResult.probability * 100),
        factors: apiResult.factors || [],
        day: apiResult.day || formData.day,
        transaction_pair_code: apiResult.transaction_pair_code || formData.transaction_pair_code,
        part_of_the_day: apiResult.part_of_the_day || formData.part_of_the_day
      };
      
      // If no factors were returned from the backend, generate them locally
      if (!apiResult.factors || apiResult.factors.length === 0) {
        // Add risk factors based on input and model prediction
        if (parseFloat(formData.amount) > 1000) analysisResult.factors.push("High transaction amount");
        if (formData.part_of_the_day === "night") analysisResult.factors.push("Unusual transaction time");
        if (formData.type === "CASH_OUT") analysisResult.factors.push("Cash out transaction");
        if (apiResult.probability > 0.7) analysisResult.factors.push("High fraud probability score");
        if (apiResult.probability > 0.5) analysisResult.factors.push("Unusual transaction pattern");
        
        // Add more detailed risk factors based on transaction type
        if (formData.type === "TRANSFER" && parseFloat(formData.amount) > 500) {
          analysisResult.factors.push("Large transfer amount");
        }
        if (formData.transaction_pair_code === "cm" && formData.part_of_the_day === "night") {
          analysisResult.factors.push("Unusual merchant transaction time");
        }
      }
      
      // Set the result in component state
      setResult(analysisResult);
      
      if (onSubmit) onSubmit(formData);
      if (onDetection) onDetection(analysisResult);
      
      if (analysisResult.status === "fraud" || analysisResult.status === "suspicious") {
        saveFraudTransaction(analysisResult);
      }
    } catch (err) {
      console.error("Error during fraud detection:", err);
      
      // Create an error result to display to the user
      const errorResult = {
        transactionId: "ERROR_" + Date.now(),
        timestamp: new Date().toISOString(),
        amount: parseInt(formData.amount),
        type: formData.type,
        status: "error",
        riskScore: 0,
        factors: ["Connection error", "Could not process transaction"],
        day: formData.day,
        transaction_pair_code: formData.transaction_pair_code,
        part_of_the_day: formData.part_of_the_day,
        error: err.message
      };
      
      setResult(errorResult);
      
      if (onDetection) onDetection(errorResult);
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      color: colors.grey[100],
      "& fieldset": {
        borderColor: alpha(colors.blueAccent[400], 0.6),
        borderRadius: "12px",
        borderWidth: "2px",
      },
      "&:hover fieldset": {
        borderColor: alpha(colors.blueAccent[300], 0.8),
      },
      "&.Mui-focused fieldset": {
        borderColor: colors.greenAccent[500],
      },
      height: "45px",
      backgroundColor: alpha(colors.primary[800], 0.3),
      zIndex: 2,
    },
    "& .MuiInputLabel-root": {
      color: colors.grey[100],
      fontWeight: "bold",
      "&.Mui-focused": {
        color: colors.greenAccent[500],
      },
    },
    "& input": {
      color: colors.grey[100],
      zIndex: 2,
    },
    zIndex: 2,
  };

  // Handle alert close
  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  return (
    <Box>
      {/* API Status Alert */}
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          onClose={handleAlertClose} 
          severity="warning" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      
      {!result ? (
        <Paper
          elevation={3}
          component={motion.div}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
          sx={{
            p: 2,
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto",
            borderRadius: "20px",
            background: `linear-gradient(135deg, ${alpha(colors.primary[400], 0.6)}, ${alpha(colors.blueAccent[700], 0.7)})`,
            backdropFilter: "blur(20px)",
            border: `1px solid ${alpha(colors.blueAccent[400], 0.6)}`,
            boxShadow: `0 20px 80px -10px ${alpha(colors.blueAccent[700], 0.6)}, 
                      0 10px 30px -15px ${alpha(colors.blueAccent[700], 0.7)}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Typography 
            variant="h5" 
            color={colors.grey[100]} 
            fontWeight="bold" 
            mb={2}
            sx={{
              textShadow: `0 0 10px ${alpha(colors.blueAccent[400], 0.7)}`,
            }}
          >
            Test Transaction
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Box 
              sx={{
                background: `linear-gradient(90deg, ${alpha(colors.primary[800], 0.3)}, ${alpha(colors.blueAccent[900], 0.4)})`,
                borderRadius: "16px",
                p: 2,
                boxShadow: `inset 0 0 20px ${alpha(colors.blueAccent[500], 0.3)}`,
                border: `1px solid ${alpha(colors.blueAccent[400], 0.4)}`,
                mb: 2,
                position: "relative",
                overflow: "visible",
              }}
            >
              <Box display="flex" flexDirection="row" flexWrap="nowrap" gap={3} sx={{ position: "relative", zIndex: 10 }}>
                <TextField
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  sx={fieldStyle}
                />

                <FormControl sx={fieldStyle}>
                  <InputLabel>Day</InputLabel>
                  <Select
                    name="day"
                    value={formData.day}
                    onChange={handleChange}
                    label="Day"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: alpha(colors.primary[700], 0.95),
                          '& .MuiMenuItem-root': {
                            color: colors.grey[100],
                          }
                        }
                      }
                    }}
                  >
                    {[...Array(31)].map((_, i) => (
                      <MenuItem key={i+1} value={i+1}>{i+1}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl sx={fieldStyle}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    label="Type"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: alpha(colors.primary[700], 0.95),
                          '& .MuiMenuItem-root': {
                            color: colors.grey[100],
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="CASH_OUT">Cash Out</MenuItem>
                    <MenuItem value="TRANSFER">Transfer</MenuItem>
                    <MenuItem value="PAYMENT">Payment</MenuItem>
                    <MenuItem value="CASH_IN">Cash In</MenuItem>
                    <MenuItem value="DEBIT">Debit</MenuItem>
                  </Select>
                </FormControl>

                <FormControl sx={fieldStyle}>
                  <InputLabel>Pair Code</InputLabel>
                  <Select
                    name="transaction_pair_code"
                    value={formData.transaction_pair_code}
                    onChange={handleChange}
                    label="Pair Code"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: alpha(colors.primary[700], 0.95),
                          '& .MuiMenuItem-root': {
                            color: colors.grey[100],
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="cc">CC</MenuItem>
                    <MenuItem value="cm">CM</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl sx={fieldStyle}>
                  <InputLabel>Time</InputLabel>
                  <Select
                    name="part_of_the_day"
                    value={formData.part_of_the_day}
                    onChange={handleChange}
                    label="Time"
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: alpha(colors.primary[700], 0.95),
                          '& .MuiMenuItem-root': {
                            color: colors.grey[100],
                          }
                        }
                      }
                    }}
                  >
                    <MenuItem value="morning">Morning</MenuItem>
                    <MenuItem value="afternoon">Afternoon</MenuItem>
                    <MenuItem value="evening">Evening</MenuItem>
                    <MenuItem value="night">Night</MenuItem>
                  </Select>
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                  sx={{
                    background: `linear-gradient(45deg, ${colors.greenAccent[600]}, ${colors.greenAccent[400]})`,
                    color: colors.grey[900],
                    fontWeight: "bold",
                    height: "45px",
                    borderRadius: "12px",
                    boxShadow: `0 8px 20px -4px ${alpha(colors.greenAccent[500], 0.6)}`,
                    zIndex: 5,
                    "&:hover": {
                      background: `linear-gradient(45deg, ${colors.greenAccent[500]}, ${colors.greenAccent[300]})`,
                      transform: "translateY(-2px)",
                      boxShadow: `0 12px 25px -5px ${alpha(colors.greenAccent[500], 0.7)}`,
                    }
                  }}
                >
                  {loading ? "Processing..." : "Analyze"}
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      ) : (
        <AnalysisResult 
          result={result} 
          onReset={() => {
            setResult(null);
            setFormData({
              amount: "",
              day: new Date().getDate(),
              type: "PAYMENT",
              transaction_pair_code: "cc",
              part_of_the_day: "morning"
            });
          }} 
        />
      )}
    </Box>
  );
};

export default TransactionFormHorizontal;