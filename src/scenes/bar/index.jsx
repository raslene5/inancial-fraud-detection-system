import { useState, useEffect } from "react";
import { 
  Box, 
  Paper, 
  Typography, 
  useTheme, 
  Divider, 
  List, 
  ListItem, 
  ListItemText, 
  Chip, 
  IconButton, 
  Tooltip,
  Button,
  Grid,
  Card,
  CardContent,
  alpha
} from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";
import { tokens } from "../../theme";
import { InfoOutlined, DeleteOutlined, VisibilityOutlined, FileDownloadOutlined } from "@mui/icons-material";
import { mockFraudStatistics } from "../../data/mockFraudData";

const FraudHistory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [fraudTransactions, setFraudTransactions] = useState([]);
  const [fraudStats, setFraudStats] = useState(mockFraudStatistics);

  // Load fraud transactions from localStorage
  const loadFraudHistory = () => {
    try {
      const storedTransactions = JSON.parse(localStorage.getItem("fraudHistory") || "[]");
      
      // Map the stored transactions to the format we need
      const formattedTransactions = storedTransactions.map(transaction => ({
        id: transaction.transactionId,
        date: new Date(transaction.timestamp).toLocaleString(),
        amount: `€${parseFloat(transaction.amount).toFixed(2)}`,
        type: transaction.type || "Card Payment",
        reason: transaction.factors && transaction.factors.length > 0 ? transaction.factors[0] : "Suspicious Activity",
        severity: transaction.status === "fraud" ? "high" : "medium",
        status: transaction.status === "fraud" ? "Confirmed Fraud" : "Under Investigation",
        riskScore: transaction.riskScore,
        merchant: transaction.merchant,
        location: transaction.location
      }));
      
      setFraudTransactions(formattedTransactions);
      
      // Calculate statistics
      if (storedTransactions.length > 0) {
        const fraudCount = storedTransactions.filter(t => t.status === "fraud").length;
        const suspiciousCount = storedTransactions.filter(t => t.status === "suspicious").length;
        const normalCount = storedTransactions.filter(t => t.status === "normal").length;
        const totalCount = fraudCount + suspiciousCount + normalCount;
        
        // Calculate amount saved (sum of fraud transaction amounts)
        const amountSaved = storedTransactions
          .filter(t => t.status === "fraud")
          .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        
        setFraudStats({
          totalTransactions: totalCount,
          fraudCount,
          suspiciousCount,
          normalCount,
          amountSaved,
          labels: ["Normal", "Suspicious", "Fraud"],
          values: [normalCount, suspiciousCount, fraudCount]
        });
      }
    } catch (error) {
      console.error("Error loading fraud history:", error);
      setFraudTransactions([]);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadFraudHistory();
    
    // Set up event listener for fraud detection
    const handleFraudDetected = () => {
      loadFraudHistory();
    };
    
    window.addEventListener("fraudDetected", handleFraudDetected);
    
    return () => {
      window.removeEventListener("fraudDetected", handleFraudDetected);
    };
  }, []);

  // Delete a transaction
  const handleDeleteTransaction = (id) => {
    try {
      const storedTransactions = JSON.parse(localStorage.getItem("fraudHistory") || "[]");
      const updatedTransactions = storedTransactions.filter(t => t.transactionId !== id);
      localStorage.setItem("fraudHistory", JSON.stringify(updatedTransactions));
      loadFraudHistory();
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  // Download a transaction report
  const handleDownloadReport = (transaction) => {
    // In a real application, this would generate a PDF
    // For now, we'll create a text representation
    const content = `
FRAUD TRANSACTION REPORT
=======================

Transaction ID: ${transaction.id}
Date: ${transaction.date}

TRANSACTION DETAILS
------------------
Amount: ${transaction.amount}
Merchant: ${transaction.merchant || "Unknown"}
Type: ${transaction.type}
Risk Score: ${transaction.riskScore || "N/A"}
Status: ${transaction.status.toUpperCase()}
Location: ${transaction.location || "Unknown"}

RISK FACTORS
-----------
${transaction.reason}

ANALYSIS
-------
This transaction was flagged as ${transaction.status === "Confirmed Fraud" ? "fraudulent" : "suspicious"} 
based on the risk factors listed above.

Generated: ${new Date().toLocaleString()}
FFDS - Financial Fraud Detection System
`;
    
    // Create a Blob from the content
    const blob = new Blob([content], { type: 'text/plain' });
    
    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = `Fraud_Report_${transaction.id}.txt`;
    
    // Append the link to the body
    document.body.appendChild(link);
    
    // Click the link to trigger the download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return colors.redAccent[500];
      case "medium":
        return colors.orangeAccent ? colors.orangeAccent[500] : "#FF9800";
      default:
        return colors.greenAccent[500];
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed Fraud":
        return colors.redAccent[500];
      case "Under Investigation":
        return colors.blueAccent[400];
      case "False Positive":
        return colors.greenAccent[500];
      default:
        return colors.grey[500];
    }
  };

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Header
          title="Fraud History"
          subtitle="Record of transactions flagged as potentially fraudulent"
        />
        <Button
          variant="outlined"
          startIcon={<FileDownloadOutlined />}
          onClick={() => {
            // Download full report
            const content = `
FRAUD STATISTICS REPORT
======================

SUMMARY
-------
Total Transactions Analyzed: ${fraudStats.totalTransactions}
Fraud Detected: ${fraudStats.fraudCount}
Suspicious Activity: ${fraudStats.suspiciousCount}
Normal Transactions: ${fraudStats.normalCount}

FINANCIAL IMPACT
--------------
Amount Saved from Fraud Prevention: €${fraudStats.amountSaved.toFixed(2)}

Generated: ${new Date().toLocaleString()}
FFDS - Financial Fraud Detection System
`;
            
            // Create a Blob from the content
            const blob = new Blob([content], { type: 'text/plain' });
            
            // Create a URL for the Blob
            const url = URL.createObjectURL(blob);
            
            // Create a link element
            const link = document.createElement('a');
            link.href = url;
            link.download = `Fraud_Statistics_Report.txt`;
            
            // Append the link to the body
            document.body.appendChild(link);
            
            // Click the link to trigger the download
            link.click();
            
            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }}
          sx={{
            borderColor: colors.grey[400],
            color: colors.grey[100],
            "&:hover": {
              borderColor: colors.grey[100],
              backgroundColor: "rgba(255, 255, 255, 0.1)"
            }
          }}
        >
          Download Report
        </Button>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap="20px"
      >
        {/* Fraud Statistics */}
        <Box
          gridColumn="span 4"
          sx={{
            backgroundColor: colors.primary[400],
            borderRadius: "15px",
            boxShadow: `0 8px 24px ${colors.primary[900]}20`,
            padding: "20px",
          }}
        >
          <Typography variant="h5" fontWeight="600" sx={{ marginBottom: "15px" }}>
            Fraud Statistics
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <BarChart isDashboard={true} data={fraudStats} />
            <Typography variant="body2" sx={{ mt: 2, color: colors.grey[300], textAlign: "center" }}>
              Distribution of fraud cases by transaction type
            </Typography>
          </Box>
          
          <Grid container spacing={2} mt={3}>
            <Grid item xs={6}>
              <Card sx={{ backgroundColor: colors.primary[500], height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle2" color={colors.grey[300]}>
                    Fraud Detected
                  </Typography>
                  <Typography variant="h4" color={colors.redAccent[500]} mt={1}>
                    {fraudStats.fraudCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card sx={{ backgroundColor: colors.primary[500], height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle2" color={colors.grey[300]}>
                    Amount Saved
                  </Typography>
                  <Typography variant="h4" color={colors.greenAccent[500]} mt={1}>
                    €{fraudStats.amountSaved.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Fraud Transactions List */}
        <Box
          gridColumn="span 8"
          sx={{
            backgroundColor: colors.primary[400],
            borderRadius: "15px",
            boxShadow: `0 8px 24px ${colors.primary[900]}20`,
            padding: "20px",
            overflow: "auto",
            maxHeight: "75vh"
          }}
        >
          <Typography variant="h5" fontWeight="600" sx={{ marginBottom: "15px" }}>
            Flagged Transactions
          </Typography>
          <Divider sx={{ mb: 2, opacity: 0.2 }} />
          
          {fraudTransactions.length === 0 ? (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={5}>
              <Typography variant="body1" color={colors.grey[300]}>
                No fraud transactions found.
              </Typography>
              <Typography variant="body2" color={colors.grey[400]} mt={1}>
                Transactions flagged as suspicious or fraudulent will appear here.
              </Typography>
            </Box>
          ) : (
            <List sx={{ width: '100%' }}>
              {fraudTransactions.map((transaction) => (
                <Box key={transaction.id} mb={2}>
                  <Paper
                    sx={{
                      backgroundColor: colors.primary[500],
                      borderRadius: "10px",
                      overflow: "hidden",
                      borderLeft: `4px solid ${getSeverityColor(transaction.severity)}`,
                    }}
                  >
                    <ListItem
                      secondaryAction={
                        <Box>
                          <Tooltip title="Download Report">
                            <IconButton 
                              edge="end" 
                              aria-label="download" 
                              sx={{ color: colors.grey[100] }}
                              onClick={() => handleDownloadReport(transaction)}
                            >
                              <FileDownloadOutlined />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton 
                              edge="end" 
                              aria-label="delete" 
                              sx={{ color: colors.grey[100], ml: 1 }}
                              onClick={() => handleDeleteTransaction(transaction.id)}
                            >
                              <DeleteOutlined />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                    >
                      <ListItemText
                        primary={
                          <Box display="flex" alignItems="center">
                            <Typography variant="h6" color={colors.grey[100]}>
                              {transaction.id}
                            </Typography>
                            <Chip 
                              label={transaction.status} 
                              size="small"
                              sx={{ 
                                ml: 2,
                                bgcolor: getStatusColor(transaction.status),
                                color: colors.grey[900],
                                fontWeight: "bold",
                                fontSize: "0.7rem"
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box mt={1}>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                              <Typography variant="body2" color={colors.grey[300]}>
                                {transaction.date}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold" color={colors.grey[100]}>
                                {transaction.amount}
                              </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="body2" color={colors.grey[300]}>
                                {transaction.type}
                              </Typography>
                              <Tooltip title={transaction.reason}>
                                <Box display="flex" alignItems="center">
                                  <Typography variant="body2" color={colors.grey[300]} mr={0.5}>
                                    {transaction.reason}
                                  </Typography>
                                  <InfoOutlined sx={{ fontSize: 16, color: colors.grey[300] }} />
                                </Box>
                              </Tooltip>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  </Paper>
                </Box>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FraudHistory;