import { Box, Typography, useTheme, Chip, IconButton, Tooltip, Divider, Button, Dialog, 
  DialogTitle, DialogContent, DialogActions, Avatar, LinearProgress, Grid, Paper, Card, 
  CardContent, Fade, Zoom, Badge, Stack, Alert, Snackbar, useMediaQuery, Backdrop } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { getFraudHistory } from "../../FraudService";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SecurityIcon from "@mui/icons-material/Security";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import RefreshIcon from "@mui/icons-material/Refresh";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FilterListIcon from "@mui/icons-material/FilterList";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DevicesIcon from "@mui/icons-material/Devices";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ShieldIcon from "@mui/icons-material/Shield";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import Header from "../../components/Header";
import { useState, useEffect } from "react";

const FraudHistory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fraudData, setFraudData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Load fraud history data and set up real-time updates
  useEffect(() => {
    // Load fraud history from local storage
    const loadFraudHistory = () => {
      const history = getFraudHistory();
      
      // Map the fraud history data to match the expected format
      const formattedData = history.map((item, index) => ({
        id: item.transactionId || `TX${index}`,
        timestamp: item.timestamp || new Date().toISOString(),
        amount: parseInt(item.amount) || 0,
        merchantName: "Online Merchant",
        cardholderName: "Card User",
        fraudType: item.status === "fraud" ? "Suspicious Pattern" : "Unusual Activity",
        fraudScore: item.riskScore ? item.riskScore / 100 : 0.5,
        status: item.status === "fraud" ? "Confirmed" : "Under Review",
        cardNumber: "XXXX-XXXX-XXXX-4321",
        location: "Online",
        ipAddress: "192.168.1.1",
        deviceId: "Mobile-" + Math.floor(Math.random() * 1000),
        notes: item.factors ? item.factors.join(", ") : "No additional notes",
        reviewedBy: "AI System"
      }));
      
      setFraudData(formattedData);
    };
    
    // Initial load
    loadFraudHistory();
    
    // Set up event listener for fraud detection
    const handleFraudDetected = () => {
      loadFraudHistory();
    };
    
    // Add event listener
    window.addEventListener("fraudDetected", handleFraudDetected);
    
    return () => {
      window.removeEventListener("fraudDetected", handleFraudDetected);
    };
  }, []);
  
  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Reload fraud history data
    const history = getFraudHistory();
    
    // Map the fraud history data to match the expected format
    const formattedData = history.map((item, index) => ({
      id: item.transactionId || `TX${index}`,
      timestamp: item.timestamp || new Date().toISOString(),
      amount: parseInt(item.amount) || 0,
      merchantName: "Online Merchant",
      cardholderName: "Card User",
      fraudType: item.status === "fraud" ? "Suspicious Pattern" : "Unusual Activity",
      fraudScore: item.riskScore ? item.riskScore / 100 : 0.5,
      status: item.status === "fraud" ? "Confirmed" : "Under Review",
      cardNumber: "XXXX-XXXX-XXXX-4321",
      location: "Online",
      ipAddress: "192.168.1.1",
      deviceId: "Mobile-" + Math.floor(Math.random() * 1000),
      notes: item.factors ? item.factors.join(", ") : "No additional notes",
      reviewedBy: "AI System"
    }));
    
    setFraudData(formattedData);
    
    setTimeout(() => {
      setIsLoading(false);
      setSnackbarMessage("Fraud data refreshed successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    }, 1000);
  };
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  const toggleFilterPanel = () => {
    setFilterPanelOpen(!filterPanelOpen);
  };

  const handleExportCSV = () => {
    if (fraudData.length === 0) {
      return; // Don't export if no data
    }
    
    const headers = Object.keys(fraudData[0]).join(',');
    const rows = fraudData.map(item => Object.values(item).join(',')).join('\n');
    const csvContent = `${headers}\n${rows}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fraud_history.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFraudSeverityColor = (score) => {
    if (score >= 0.95) return colors.redAccent[500];
    if (score >= 0.9) return colors.redAccent[400];
    if (score >= 0.85) return colors.redAccent[300];
    return colors.yellowAccent[400];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return colors.redAccent[500];
      case "Under Review":
        return colors.yellowAccent[500];
      default:
        return colors.grey[500];
    }
  };

  const columns = [
    { 
      field: "id", 
      headerName: "Transaction ID",
      flex: 1,
    },
    {
      field: "timestamp",
      headerName: "Date & Time",
      flex: 1,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        return date.toLocaleString();
      }
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.7,
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          {parseInt(params.value)}
        </Typography>
      ),
    },
    {
      field: "fraudType",
      headerName: "Fraud Type",
      flex: 1,
      renderCell: ({ row }) => {
        return (
          <Chip
            icon={<ReportProblemIcon />}
            label={row.fraudType}
            sx={{
              bgcolor: `${colors.blueAccent[700]} !important`,
              color: colors.grey[100],
            }}
          />
        );
      },
    },
    {
      field: "fraudScore",
      headerName: "Risk Score",
      flex: 0.7,
      renderCell: ({ row }) => {
        return (
          <Box
            width="80%"
            display="flex"
            alignItems="center"
          >
            <Box
              width="100%"
              height="10px"
              borderRadius="5px"
              bgcolor={colors.grey[800]}
              mr="10px"
            >
              <Box
                height="100%"
                borderRadius="5px"
                bgcolor={getFraudSeverityColor(row.fraudScore)}
                width={`${row.fraudScore * 100}%`}
              />
            </Box>
            <Typography color={getFraudSeverityColor(row.fraudScore)}>
              {Math.round(row.fraudScore * 100)}%
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      renderCell: ({ row }) => {
        return (
          <Chip
            icon={row.status === "Confirmed" ? <VerifiedUserIcon /> : <SecurityIcon />}
            label={row.status}
            sx={{
              bgcolor: `${getStatusColor(row.status)} !important`,
              color: colors.grey[100],
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: ({ row }) => {
        return (
          <Box display="flex" justifyContent="center">
            <Tooltip title="View Details">
              <IconButton onClick={() => handleViewDetails(row)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box m="5px">
      <Box 
        display="flex" 
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between" 
        alignItems={isMobile ? "flex-start" : "center"}
        sx={{
          background: `linear-gradient(135deg, rgba(26, 32, 51, 0.9) 0%, rgba(20, 25, 41, 0.95) 100%)`,
          borderRadius: "16px",
          padding: isMobile ? "16px" : "20px 24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          mb: 1,
          position: "relative",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(90deg, ${colors.blueAccent[500]}, ${colors.blueAccent[300]})`,
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at top right, rgba(54, 162, 235, 0.1), transparent 70%)",
            zIndex: 0,
            pointerEvents: "none"
          }
        }}
      >
        <Box sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
            <ShieldIcon sx={{ 
              fontSize: 28, 
              color: colors.blueAccent[400],
              filter: "drop-shadow(0 0 8px rgba(54, 162, 235, 0.5))"
            }} />
            <Typography 
              variant="h4" 
              fontWeight="bold"
              sx={{
                background: `linear-gradient(90deg, ${colors.grey[100]}, ${colors.blueAccent[300]})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "0.5px"
              }}
            >
              SENTINEL SHIELD
            </Typography>
          </Box>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              color: colors.grey[400], 
              ml: 0.5, 
              fontStyle: "italic",
              letterSpacing: "0.3px"
            }}
          >
            Real-time monitoring of suspicious transactions
          </Typography>
          {fraudData.length > 0 && (
            <Box sx={{ mt: 1.5, display: "flex", alignItems: "center" }}>
              <Badge 
                badgeContent={fraudData.length} 
                color="error"
                sx={{ 
                  '& .MuiBadge-badge': {
                    fontSize: '0.9rem',
                    height: '24px',
                    minWidth: '24px',
                    padding: '0 8px',
                    fontWeight: 'bold',
                    boxShadow: '0 0 15px rgba(0,0,0,0.3)',
                    background: `linear-gradient(45deg, ${colors.redAccent[500]}, ${colors.redAccent[400]})`,
                  }
                }}
              >
                <Box 
                  sx={{ 
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    bgcolor: "rgba(255, 99, 99, 0.1)",
                    borderRadius: "8px",
                    padding: "4px 10px",
                    border: `1px solid ${colors.redAccent[500]}40`
                  }}
                >
                  <WarningAmberIcon sx={{ color: colors.redAccent[400], fontSize: "1rem" }} />
                  <Typography 
                    variant="subtitle2" 
                    color={colors.grey[300]} 
                    fontWeight="medium"
                  >
                    Active Alerts
                  </Typography>
                </Box>
              </Badge>
            </Box>
          )}
        </Box>
        <Box 
          display="flex" 
          gap={2} 
          mt={isMobile ? 2 : 0}
          flexWrap={isMobile ? "wrap" : "nowrap"}
          justifyContent={isMobile ? "flex-start" : "flex-end"}
        >
          <Tooltip title="Filter Transactions" placement="top">
            <IconButton 
              onClick={toggleFilterPanel}
              sx={{
                bgcolor: filterPanelOpen ? colors.blueAccent[600] : "rgba(255, 255, 255, 0.05)",
                color: colors.grey[100],
                width: "42px",
                height: "42px",
                backdropFilter: "blur(10px)",
                '&:hover': {
                  bgcolor: filterPanelOpen ? colors.blueAccent[700] : "rgba(255, 255, 255, 0.1)",
                  transform: "scale(1.05)",
                },
                transition: 'all 0.3s ease',
                boxShadow: filterPanelOpen ? "0 0 15px rgba(0,0,0,0.2)" : "none"
              }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh Data" placement="top">
            <IconButton 
              onClick={handleRefresh}
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.05)",
                color: colors.grey[100],
                width: "42px",
                height: "42px",
                backdropFilter: "blur(10px)",
                '&:hover': {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  transform: "scale(1.05) rotate(30deg)",
                },
                transition: 'all 0.3s ease'
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExportCSV}
            sx={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              '&:hover': {
                background: "rgba(255, 255, 255, 0.15)",
                transform: 'translateY(-3px)',
                boxShadow: "0 12px 25px rgba(0,0,0,0.2)",
              },
              transition: 'all 0.3s ease'
            }}
          >
            Export to CSV
          </Button>
        </Box>
      </Box>
      
      {/* Filter Panel */}
      <Fade in={filterPanelOpen} timeout={400}>
        <Box 
          sx={{
            bgcolor: "rgba(26, 32, 51, 0.7)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            p: 2,
            mb: 1,
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at top right, ${colors.primary[300]}10, transparent 70%)`,
              zIndex: 0,
              pointerEvents: "none"
            }
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} position="relative" zIndex={1}>
            <Typography variant="h5" fontWeight="bold" sx={{ 
              background: `linear-gradient(90deg, ${colors.grey[100]}, ${colors.grey[300]})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Filter Transactions
            </Typography>
            <IconButton 
              onClick={toggleFilterPanel} 
              size="small"
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.05)",
                color: colors.grey[100],
                '&:hover': {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  transform: "rotate(90deg)"
                },
                transition: "all 0.3s ease"
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Grid container spacing={2} position="relative" zIndex={1}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                bgcolor: "rgba(255, 255, 255, 0.03)", 
                height: '100%',
                borderRadius: "12px",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                }
              }}>
                <CardContent>
                  <Typography variant="subtitle2" color={colors.grey[300]} sx={{ mb: 1.5, fontWeight: "bold" }}>
                    Status
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" gap={1}>
                    <Chip 
                      label="Confirmed" 
                      onClick={() => setActiveFilter("confirmed")}
                      sx={{ 
                        bgcolor: activeFilter === "confirmed" ? colors.redAccent[500] : "rgba(255, 99, 99, 0.2)",
                        color: colors.grey[100],
                        border: `1px solid ${colors.redAccent[500]}`,
                        '&:hover': { 
                          bgcolor: colors.redAccent[500],
                          transform: "scale(1.05)"
                        },
                        cursor: 'pointer',
                        transition: "all 0.2s ease",
                        fontWeight: "bold",
                        backdropFilter: "blur(5px)"
                      }} 
                    />
                    <Chip 
                      label="Under Review" 
                      onClick={() => setActiveFilter("review")}
                      sx={{ 
                        bgcolor: activeFilter === "review" ? colors.yellowAccent[500] : "rgba(255, 205, 86, 0.2)",
                        color: colors.grey[100],
                        border: `1px solid ${colors.yellowAccent[500]}`,
                        '&:hover': { 
                          bgcolor: colors.yellowAccent[500],
                          transform: "scale(1.05)"
                        },
                        cursor: 'pointer',
                        transition: "all 0.2s ease",
                        fontWeight: "bold",
                        backdropFilter: "blur(5px)"
                      }} 
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                bgcolor: "rgba(255, 255, 255, 0.03)", 
                height: '100%',
                borderRadius: "12px",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                }
              }}>
                <CardContent>
                  <Typography variant="subtitle2" color={colors.grey[300]} sx={{ mb: 1.5, fontWeight: "bold" }}>
                    Risk Score
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" gap={1}>
                    <Chip 
                      label="High" 
                      onClick={() => setActiveFilter("high")}
                      sx={{ 
                        bgcolor: activeFilter === "high" ? colors.redAccent[500] : "rgba(255, 99, 99, 0.2)",
                        color: colors.grey[100],
                        border: `1px solid ${colors.redAccent[500]}`,
                        '&:hover': { 
                          bgcolor: colors.redAccent[500],
                          transform: "scale(1.05)"
                        },
                        cursor: 'pointer',
                        transition: "all 0.2s ease",
                        fontWeight: "bold",
                        backdropFilter: "blur(5px)"
                      }} 
                    />
                    <Chip 
                      label="Medium" 
                      onClick={() => setActiveFilter("medium")}
                      sx={{ 
                        bgcolor: activeFilter === "medium" ? colors.yellowAccent[500] : "rgba(255, 205, 86, 0.2)",
                        color: colors.grey[100],
                        border: `1px solid ${colors.yellowAccent[500]}`,
                        '&:hover': { 
                          bgcolor: colors.yellowAccent[500],
                          transform: "scale(1.05)"
                        },
                        cursor: 'pointer',
                        transition: "all 0.2s ease",
                        fontWeight: "bold",
                        backdropFilter: "blur(5px)"
                      }} 
                    />
                    <Chip 
                      label="Low" 
                      onClick={() => setActiveFilter("low")}
                      sx={{ 
                        bgcolor: activeFilter === "low" ? colors.greenAccent[500] : "rgba(75, 192, 192, 0.2)",
                        color: colors.grey[100],
                        border: `1px solid ${colors.greenAccent[500]}`,
                        '&:hover': { 
                          bgcolor: colors.greenAccent[500],
                          transform: "scale(1.05)"
                        },
                        cursor: 'pointer',
                        transition: "all 0.2s ease",
                        fontWeight: "bold",
                        backdropFilter: "blur(5px)"
                      }} 
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                bgcolor: "rgba(255, 255, 255, 0.03)", 
                height: '100%',
                borderRadius: "12px",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                }
              }}>
                <CardContent>
                  <Typography variant="subtitle2" color={colors.grey[300]} sx={{ mb: 1.5, fontWeight: "bold" }}>
                    Fraud Type
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" gap={1}>
                    <Chip 
                      label="Suspicious Pattern" 
                      onClick={() => setActiveFilter("suspicious")}
                      sx={{ 
                        bgcolor: activeFilter === "suspicious" ? colors.blueAccent[600] : "rgba(54, 162, 235, 0.2)",
                        color: colors.grey[100],
                        border: `1px solid ${colors.blueAccent[600]}`,
                        '&:hover': { 
                          bgcolor: colors.blueAccent[600],
                          transform: "scale(1.05)"
                        },
                        cursor: 'pointer',
                        transition: "all 0.2s ease",
                        fontWeight: "bold",
                        backdropFilter: "blur(5px)"
                      }} 
                    />
                    <Chip 
                      label="Unusual Activity" 
                      onClick={() => setActiveFilter("unusual")}
                      sx={{ 
                        bgcolor: activeFilter === "unusual" ? colors.blueAccent[400] : "rgba(54, 162, 235, 0.1)",
                        color: colors.grey[100],
                        border: `1px solid ${colors.blueAccent[400]}`,
                        '&:hover': { 
                          bgcolor: colors.blueAccent[400],
                          transform: "scale(1.05)"
                        },
                        cursor: 'pointer',
                        transition: "all 0.2s ease",
                        fontWeight: "bold",
                        backdropFilter: "blur(5px)"
                      }} 
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ 
                bgcolor: "rgba(255, 255, 255, 0.03)", 
                height: '100%',
                borderRadius: "12px",
                backdropFilter: "blur(5px)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                }
              }}>
                <CardContent>
                  <Typography variant="subtitle2" color={colors.grey[300]} sx={{ mb: 1.5, fontWeight: "bold" }}>
                    Date Range
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1} flexWrap="wrap" gap={1}>
                    <Chip 
                      label="Today" 
                      onClick={() => setActiveFilter("today")}
                      sx={{ 
                        bgcolor: activeFilter === "today" ? colors.blueAccent[600] : "rgba(54, 162, 235, 0.2)",
                        color: colors.grey[100],
                        border: `1px solid ${colors.blueAccent[600]}`,
                        '&:hover': { 
                          bgcolor: colors.blueAccent[600],
                          transform: "scale(1.05)"
                        },
                        cursor: 'pointer',
                        transition: "all 0.2s ease",
                        fontWeight: "bold",
                        backdropFilter: "blur(5px)"
                      }} 
                    />
                    <Chip 
                      label="This Week" 
                      onClick={() => setActiveFilter("week")}
                      sx={{ 
                        bgcolor: activeFilter === "week" ? colors.blueAccent[400] : "rgba(54, 162, 235, 0.1)",
                        color: colors.grey[100],
                        border: `1px solid ${colors.blueAccent[400]}`,
                        '&:hover': { 
                          bgcolor: colors.blueAccent[400],
                          transform: "scale(1.05)"
                        },
                        cursor: 'pointer',
                        transition: "all 0.2s ease",
                        fontWeight: "bold",
                        backdropFilter: "blur(5px)"
                      }} 
                    />
                    <Chip 
                      label="All" 
                      onClick={() => setActiveFilter("all")}
                      sx={{ 
                        bgcolor: activeFilter === "all" ? colors.grey[500] : "rgba(201, 203, 207, 0.2)",
                        color: colors.grey[100],
                        border: `1px solid ${colors.grey[500]}`,
                        '&:hover': { 
                          bgcolor: colors.grey[500],
                          transform: "scale(1.05)"
                        },
                        cursor: 'pointer',
                        transition: "all 0.2s ease",
                        fontWeight: "bold",
                        backdropFilter: "blur(5px)"
                      }} 
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Fade>
      
      {/* Loading Indicator */}
      {isLoading && (
        <Box position="relative" mb={0.5}>
          <LinearProgress 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              bgcolor: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(5px)",
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${colors.greenAccent[500]}, ${colors.blueAccent[400]})`,
                boxShadow: `0 0 10px ${colors.greenAccent[500]}80`,
              }
            }} 
          />
          <Typography 
            variant="caption" 
            color={colors.grey[300]} 
            sx={{ 
              position: "absolute", 
              right: 0, 
              top: "10px", 
              fontStyle: "italic",
              animation: "pulse 1.5s infinite",
              "@keyframes pulse": {
                "0%": { opacity: 0.6 },
                "50%": { opacity: 1 },
                "100%": { opacity: 0.6 }
              }
            }}
          >
            Loading data...
          </Typography>
        </Box>
      )}
      
      {/* Summary Cards */}
      {!isLoading && fraudData.length > 0 && (
        <Box mb={0.5}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: "rgba(26, 32, 51, 0.7)",
                  backdropFilter: "blur(10px)",
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  transition: 'all 0.4s ease',
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  position: "relative",
                  overflow: "hidden",
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                    "& .card-glow": {
                      opacity: 1,
                    }
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "4px",
                    background: `linear-gradient(90deg, ${colors.redAccent[500]}, ${colors.redAccent[300]})`,
                  }
                }}
              >
                <Box 
                  className="card-glow"
                  sx={{
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    width: "200%",
                    height: "200%",
                    background: `radial-gradient(circle, ${colors.redAccent[500]}20 0%, transparent 50%)`,
                    opacity: 0.3,
                    transition: "opacity 0.4s ease",
                    pointerEvents: "none",
                  }}
                />
                <CardContent sx={{ position: "relative", zIndex: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        color={colors.grey[300]} 
                        sx={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 0.5,
                          mb: 1,
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          fontSize: "0.7rem"
                        }}
                      >
                        <TrendingUpIcon fontSize="small" /> High Risk
                      </Typography>
                      <Typography 
                        variant="h3" 
                        fontWeight="bold" 
                        sx={{
                          background: `linear-gradient(90deg, ${colors.redAccent[500]}, ${colors.redAccent[300]})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {fraudData.filter(item => item.fraudScore >= 0.9).length}
                      </Typography>
                    </Box>
                    <Avatar 
                      sx={{ 
                        bgcolor: "rgba(255, 99, 99, 0.2)", 
                        width: 56, 
                        height: 56,
                        border: `2px solid ${colors.redAccent[500]}`,
                        boxShadow: `0 0 15px ${colors.redAccent[500]}40`
                      }}
                    >
                      <WarningAmberIcon sx={{ color: colors.redAccent[500], fontSize: 30 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: "rgba(26, 32, 51, 0.7)",
                  backdropFilter: "blur(10px)",
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  transition: 'all 0.4s ease',
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  position: "relative",
                  overflow: "hidden",
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                    "& .card-glow": {
                      opacity: 1,
                    }
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "4px",
                    background: `linear-gradient(90deg, ${colors.redAccent[400]}, ${colors.redAccent[200]})`,
                  }
                }}
              >
                <Box 
                  className="card-glow"
                  sx={{
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    width: "200%",
                    height: "200%",
                    background: `radial-gradient(circle, ${colors.redAccent[400]}20 0%, transparent 50%)`,
                    opacity: 0.3,
                    transition: "opacity 0.4s ease",
                    pointerEvents: "none",
                  }}
                />
                <CardContent sx={{ position: "relative", zIndex: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        color={colors.grey[300]} 
                        sx={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 0.5,
                          mb: 1,
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          fontSize: "0.7rem"
                        }}
                      >
                        <VerifiedUserIcon fontSize="small" /> Confirmed Fraud
                      </Typography>
                      <Typography 
                        variant="h3" 
                        fontWeight="bold" 
                        sx={{
                          background: `linear-gradient(90deg, ${colors.redAccent[400]}, ${colors.redAccent[200]})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {fraudData.filter(item => item.status === "Confirmed").length}
                      </Typography>
                    </Box>
                    <Avatar 
                      sx={{ 
                        bgcolor: "rgba(255, 99, 99, 0.15)", 
                        width: 56, 
                        height: 56,
                        border: `2px solid ${colors.redAccent[400]}`,
                        boxShadow: `0 0 15px ${colors.redAccent[400]}40`
                      }}
                    >
                      <VerifiedUserIcon sx={{ color: colors.redAccent[400], fontSize: 30 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: "rgba(26, 32, 51, 0.7)",
                  backdropFilter: "blur(10px)",
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  transition: 'all 0.4s ease',
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  position: "relative",
                  overflow: "hidden",
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                    "& .card-glow": {
                      opacity: 1,
                    }
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "4px",
                    background: `linear-gradient(90deg, ${colors.yellowAccent[500]}, ${colors.yellowAccent[300]})`,
                  }
                }}
              >
                <Box 
                  className="card-glow"
                  sx={{
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    width: "200%",
                    height: "200%",
                    background: `radial-gradient(circle, ${colors.yellowAccent[500]}20 0%, transparent 50%)`,
                    opacity: 0.3,
                    transition: "opacity 0.4s ease",
                    pointerEvents: "none",
                  }}
                />
                <CardContent sx={{ position: "relative", zIndex: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        color={colors.grey[300]} 
                        sx={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 0.5,
                          mb: 1,
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          fontSize: "0.7rem"
                        }}
                      >
                        <SecurityIcon fontSize="small" /> Under Review
                      </Typography>
                      <Typography 
                        variant="h3" 
                        fontWeight="bold" 
                        sx={{
                          background: `linear-gradient(90deg, ${colors.yellowAccent[500]}, ${colors.yellowAccent[300]})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {fraudData.filter(item => item.status === "Under Review").length}
                      </Typography>
                    </Box>
                    <Avatar 
                      sx={{ 
                        bgcolor: "rgba(255, 205, 86, 0.15)", 
                        width: 56, 
                        height: 56,
                        border: `2px solid ${colors.yellowAccent[500]}`,
                        boxShadow: `0 0 15px ${colors.yellowAccent[500]}40`
                      }}
                    >
                      <SecurityIcon sx={{ color: colors.yellowAccent[500], fontSize: 30 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  background: "rgba(26, 32, 51, 0.7)",
                  backdropFilter: "blur(10px)",
                  borderRadius: '16px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  transition: 'all 0.4s ease',
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  position: "relative",
                  overflow: "hidden",
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                    "& .card-glow": {
                      opacity: 1,
                    }
                  },
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "4px",
                    background: `linear-gradient(90deg, ${colors.greenAccent[500]}, ${colors.greenAccent[300]})`,
                  }
                }}
              >
                <Box 
                  className="card-glow"
                  sx={{
                    position: "absolute",
                    top: "-50%",
                    left: "-50%",
                    width: "200%",
                    height: "200%",
                    background: `radial-gradient(circle, ${colors.greenAccent[500]}20 0%, transparent 50%)`,
                    opacity: 0.3,
                    transition: "opacity 0.4s ease",
                    pointerEvents: "none",
                  }}
                />
                <CardContent sx={{ position: "relative", zIndex: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        color={colors.grey[300]} 
                        sx={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: 0.5,
                          mb: 1,
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          fontSize: "0.7rem"
                        }}
                      >
                        <CreditCardIcon fontSize="small" /> Total Amount
                      </Typography>
                      <Typography 
                        variant="h3" 
                        fontWeight="bold" 
                        sx={{
                          background: `linear-gradient(90deg, ${colors.greenAccent[500]}, ${colors.greenAccent[300]})`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {parseInt(fraudData.reduce((sum, item) => sum + item.amount, 0))}
                      </Typography>
                    </Box>
                    <Avatar 
                      sx={{ 
                        bgcolor: "rgba(75, 192, 192, 0.15)", 
                        width: 56, 
                        height: 56,
                        border: `2px solid ${colors.greenAccent[500]}`,
                        boxShadow: `0 0 15px ${colors.greenAccent[500]}40`
                      }}
                    >
                      <CreditCardIcon sx={{ color: colors.greenAccent[500], fontSize: 30 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}
      
      {/* DATA GRID */}
      <Box
        height="calc(100vh - 140px)"
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
          background: "rgba(26, 32, 51, 0.7)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at bottom right, ${colors.primary[300]}10, transparent 70%)`,
            zIndex: 0,
            pointerEvents: "none"
          },
          "& .MuiDataGrid-root": {
            border: "none",
            position: "relative",
            zIndex: 1,
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            fontSize: "14px",
            padding: "16px",
            color: colors.grey[100],
          },
          "& .MuiDataGrid-row": {
            "&:nth-of-type(odd)": {
              backgroundColor: "rgba(255, 255, 255, 0.02)",
            },
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              cursor: "pointer",
              transform: "translateY(-2px)",
              boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
            },
            transition: "all 0.3s ease",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderBottom: "none",
            padding: "16px 0",
            backdropFilter: "blur(10px)",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "transparent",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer": {
            padding: "16px 24px",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
            "& .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
              fontSize: "12px",
              fontWeight: "bold",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            },
            "& .MuiSvgIcon-root": {
              color: `${colors.grey[300]} !important`,
            }
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
            fontSize: "14px",
            letterSpacing: "0.5px",
            color: colors.grey[100],
          },
          "& .MuiDataGrid-cellContent": {
            fontWeight: "500",
          },
          "& .MuiTablePagination-root": {
            color: colors.grey[300],
          },
          "& .MuiTablePagination-selectIcon": {
            color: colors.grey[300],
          },
          "& .MuiTablePagination-actions button": {
            color: colors.grey[300],
          }
        }}
      >
        {fraudData.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            height="100%"
            sx={{ 
              position: "relative",
              zIndex: 1,
              p: 5
            }}
          >
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: "rgba(255, 99, 99, 0.1)",
                mb: 3,
                border: `2px solid ${colors.redAccent[500]}`,
                boxShadow: `0 0 30px ${colors.redAccent[500]}30`
              }}
            >
              <WarningAmberIcon sx={{ fontSize: 40, color: colors.redAccent[500] }} />
            </Avatar>
            <Typography 
              variant="h4" 
              fontWeight="bold"
              sx={{
                background: `linear-gradient(90deg, ${colors.grey[100]}, ${colors.grey[300]})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1
              }}
            >
              No Fraud Transactions Found
            </Typography>
            <Typography 
              variant="body1" 
              color={colors.grey[400]} 
              textAlign="center" 
              sx={{ 
                maxWidth: "500px",
                mb: 4,
                opacity: 0.8
              }}
            >
              There are currently no fraud transactions to display. The system will automatically update when new suspicious activities are detected.
            </Typography>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              sx={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                color: colors.grey[100],
                fontWeight: "bold",
                padding: "12px 24px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                '&:hover': {
                  background: "rgba(255, 255, 255, 0.15)",
                  transform: 'translateY(-3px)',
                  boxShadow: "0 12px 25px rgba(0,0,0,0.2)",
                },
                transition: 'all 0.3s ease'
              }}
            >
              Refresh Data
            </Button>
          </Box>
        ) : (
          <DataGrid
            rows={fraudData}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            initialState={{
              sorting: {
                sortModel: [{ field: 'timestamp', sort: 'desc' }],
              },
              pagination: {
                pageSize: 10,
              },
            }}
            getRowClassName={(params) => 
              params.row.fraudScore >= 0.9 ? "high-risk-row" : ""
            }
            sx={{
              "& .high-risk-row": {
                position: "relative",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "4px",
                  background: `linear-gradient(to bottom, ${colors.redAccent[500]}, ${colors.redAccent[300]})`,
                  boxShadow: `0 0 10px ${colors.redAccent[500]}80`,
                },
                backgroundColor: "rgba(255, 99, 99, 0.05) !important",
              }
            }}
          />
        )}
      </Box>

      {/* TRANSACTION DETAILS DIALOG */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: "rgba(26, 32, 51, 0.9)",
            color: colors.grey[100],
            borderRadius: '16px',
            backdropFilter: "blur(20px)",
            boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
            border: "1px solid rgba(255, 255, 255, 0.05)",
            overflow: "hidden"
          },
        }}
        TransitionComponent={Zoom}
        TransitionProps={{
          timeout: 400
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(5px)"
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          background: "rgba(0, 0, 0, 0.2)",
          padding: '20px 24px',
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: `linear-gradient(90deg, ${colors.redAccent[500]}, ${colors.redAccent[300]})`,
          }
        }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Avatar sx={{ 
                bgcolor: "rgba(255, 99, 99, 0.2)", 
                mr: 2,
                boxShadow: `0 0 20px ${colors.redAccent[500]}40`,
                border: `2px solid ${colors.redAccent[500]}`,
                width: 48,
                height: 48
              }}>
                <WarningAmberIcon sx={{ color: colors.redAccent[500] }} />
              </Avatar>
              <Typography 
                variant="h5" 
                fontWeight="bold"
                sx={{
                  background: `linear-gradient(90deg, ${colors.grey[100]}, ${colors.grey[300]})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Fraud Transaction Details
              </Typography>
            </Box>
            <IconButton 
              onClick={handleCloseDetails} 
              sx={{ 
                color: colors.grey[300],
                bgcolor: "rgba(255, 255, 255, 0.05)",
                '&:hover': {
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  color: colors.grey[100],
                  transform: "rotate(90deg)"
                },
                transition: "all 0.3s ease"
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {selectedTransaction && (
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid item xs={12}>
                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center"
                  sx={{
                    background: "rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "12px",
                    p: 2,
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <Typography 
                    variant="h4" 
                    fontWeight="bold"
                    sx={{
                      background: `linear-gradient(90deg, ${colors.grey[100]}, ${colors.grey[300]})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {selectedTransaction.id}
                  </Typography>
                  <Chip
                    icon={selectedTransaction.status === "Confirmed" ? <VerifiedUserIcon /> : <SecurityIcon />}
                    label={selectedTransaction.status}
                    sx={{
                      bgcolor: selectedTransaction.status === "Confirmed" 
                        ? "rgba(255, 99, 99, 0.2)" 
                        : "rgba(255, 205, 86, 0.2)",
                      color: selectedTransaction.status === "Confirmed" 
                        ? colors.redAccent[400] 
                        : colors.yellowAccent[400],
                      fontWeight: "bold",
                      padding: "20px 12px",
                      '& .MuiChip-label': { 
                        fontSize: '0.9rem',
                        fontWeight: "bold",
                        letterSpacing: "0.5px"
                      },
                      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                      border: `2px solid ${selectedTransaction.status === "Confirmed" 
                        ? colors.redAccent[500] 
                        : colors.yellowAccent[500]}`,
                    }}
                  />
                </Box>
                <Divider sx={{ 
                  my: 2, 
                  opacity: 0.2,
                  borderColor: "rgba(255, 255, 255, 0.1)" 
                }} />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ 
                  p: 2.5, 
                  bgcolor: "rgba(255, 255, 255, 0.03)", 
                  height: '100%',
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                  }
                }}>
                  <Typography 
                    variant="subtitle2" 
                    color={colors.grey[400]}
                    sx={{
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      mb: 1
                    }}
                  >
                    Transaction Amount
                  </Typography>
                  <Typography 
                    variant="h4" 
                    sx={{
                      background: `linear-gradient(90deg, ${colors.greenAccent[500]}, ${colors.greenAccent[300]})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontWeight: "bold"
                    }}
                  >
                    {parseInt(selectedTransaction.amount)}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ 
                  p: 2.5, 
                  bgcolor: "rgba(255, 255, 255, 0.03)", 
                  height: '100%',
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                  }
                }}>
                  <Typography 
                    variant="subtitle2" 
                    color={colors.grey[400]}
                    sx={{
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      mb: 1
                    }}
                  >
                    Transaction Type
                  </Typography>
                  <Typography variant="h5" color={colors.grey[100]}>
                    {selectedTransaction.type || "Payment"}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ 
                  p: 2.5, 
                  bgcolor: "rgba(255, 255, 255, 0.03)", 
                  height: '100%',
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
                  }
                }}>
                  <Typography 
                    variant="subtitle2" 
                    color={colors.grey[400]}
                    sx={{
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      mb: 1
                    }}
                  >
                    Transaction ID
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color={colors.grey[100]}>
                    {selectedTransaction.id}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Box
                  mt={1}
                  p={3}
                  borderRadius="16px"
                  sx={{
                    background: "rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${selectedTransaction.fraudScore >= 0.9 
                      ? colors.redAccent[500] 
                      : "rgba(255, 255, 255, 0.05)"}`,
                    boxShadow: selectedTransaction.fraudScore >= 0.9 
                      ? `0 0 20px ${colors.redAccent[500]}30` 
                      : 'none',
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "3px",
                      background: `linear-gradient(90deg, ${colors.redAccent[500]}, ${colors.redAccent[300]})`,
                      opacity: selectedTransaction.fraudScore >= 0.9 ? 1 : 0.3
                    }
                  }}
                >
                  <Typography 
                    variant="h5" 
                    fontWeight="bold" 
                    mb={3}
                    sx={{
                      background: `linear-gradient(90deg, ${colors.grey[100]}, ${colors.grey[300]})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    Fraud Analysis
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography 
                        variant="subtitle2" 
                        color={colors.grey[400]}
                        sx={{
                          fontSize: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          mb: 1
                        }}
                      >
                        Fraud Type
                      </Typography>
                      <Box 
                        display="flex" 
                        alignItems="center" 
                        sx={{
                          p: 1.5,
                          borderRadius: "10px",
                          background: "rgba(255, 99, 99, 0.1)",
                          border: `1px solid ${colors.redAccent[500]}`,
                        }}
                      >
                        <ReportProblemIcon sx={{ color: colors.redAccent[500], mr: 1.5, fontSize: 28 }} />
                        <Typography 
                          variant="h5" 
                          sx={{
                            background: `linear-gradient(90deg, ${colors.redAccent[500]}, ${colors.redAccent[300]})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontWeight: "bold"
                          }}
                        >
                          {selectedTransaction.fraudType}
                        </Typography>
                      </Box>
                      
                      <Box mt={4}>
                        <Typography 
                          variant="subtitle2" 
                          color={colors.grey[400]}
                          sx={{
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            mb: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between"
                          }}
                        >
                          <span>Risk Score</span>
                          <span style={{ 
                            color: getFraudSeverityColor(selectedTransaction.fraudScore),
                            fontWeight: "bold"
                          }}>
                            {Math.round(selectedTransaction.fraudScore * 100)}%
                          </span>
                        </Typography>
                        <Box 
                          sx={{
                            position: "relative",
                            height: "16px",
                            borderRadius: "8px",
                            background: "rgba(0, 0, 0, 0.3)",
                            overflow: "hidden",
                            border: "1px solid rgba(255, 255, 255, 0.05)"
                          }}
                        >
                          <Box
                            sx={{
                              height: "100%",
                              borderRadius: "8px",
                              background: `linear-gradient(90deg, ${getFraudSeverityColor(selectedTransaction.fraudScore)}, ${getFraudSeverityColor(selectedTransaction.fraudScore)}90)`,
                              width: `${selectedTransaction.fraudScore * 100}%`,
                              transition: 'width 1.5s ease-in-out',
                              boxShadow: selectedTransaction.fraudScore >= 0.9 ? `0 0 15px ${colors.redAccent[500]}` : 'none',
                              position: "relative",
                              "&::after": {
                                content: '""',
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                                animation: selectedTransaction.fraudScore >= 0.9 ? "shine 2s infinite" : "none",
                                "@keyframes shine": {
                                  "0%": { transform: "translateX(-100%)" },
                                  "100%": { transform: "translateX(100%)" }
                                }
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box 
                        sx={{
                          p: 2.5,
                          borderRadius: "10px",
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.05)",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between"
                        }}
                      >
                        <Box>
                          <Typography 
                            variant="subtitle2" 
                            color={colors.grey[400]}
                            sx={{
                              fontSize: "0.75rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              mb: 1.5,
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5
                            }}
                          >
                            Transaction Details
                          </Typography>
                          <Typography variant="body1" color={colors.grey[100]} fontWeight="medium">
                            {selectedTransaction.type || "Payment"} - {new Date(selectedTransaction.timestamp).toLocaleDateString()}
                          </Typography>
                        </Box>
                        
                        <Box mt={2}>
                          <Typography 
                            variant="subtitle2" 
                            color={colors.grey[400]}
                            sx={{
                              fontSize: "0.75rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              mb: 1
                            }}
                          >
                            Amount
                          </Typography>
                          <Typography 
                            variant="body1" 
                            color={colors.greenAccent[400]} 
                            sx={{
                              p: 1,
                              borderRadius: "6px",
                              background: "rgba(0, 0, 0, 0.2)",
                              display: "inline-block",
                              fontWeight: "bold",
                              letterSpacing: "0.5px"
                            }}
                          >
                            {parseInt(selectedTransaction.amount)}
                          </Typography>
                        </Box>
                        
                        <Box mt={2}>
                          <Typography 
                            variant="subtitle2" 
                            color={colors.grey[400]}
                            sx={{
                              fontSize: "0.75rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                              mb: 1
                            }}
                          >
                            Detection Time
                          </Typography>
                          <Typography 
                            variant="body1" 
                            color={colors.grey[100]}
                            sx={{
                              p: 1,
                              borderRadius: "6px",
                              background: "rgba(0, 0, 0, 0.2)",
                              display: "inline-block",
                              letterSpacing: "0.5px"
                            }}
                          >
                            {new Date(selectedTransaction.timestamp).toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle2" 
                  color={colors.grey[400]}
                  sx={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    mb: 1
                  }}
                >
                  Notes
                </Typography>
                <Paper 
                  sx={{ 
                    p: 2.5, 
                    bgcolor: "rgba(255, 255, 255, 0.03)", 
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    minHeight: "80px",
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "4px",
                      height: "100%",
                      background: `linear-gradient(to bottom, ${colors.blueAccent[500]}, ${colors.blueAccent[300]})`,
                      borderTopLeftRadius: "12px",
                      borderBottomLeftRadius: "12px",
                    }
                  }}
                >
                  <Typography 
                    variant="body1" 
                    color={colors.grey[100]}
                    sx={{
                      lineHeight: 1.7,
                      pl: 1
                    }}
                  >
                    {selectedTransaction.notes}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  alignItems="center"
                  p={2.5}
                  borderRadius="12px"
                  sx={{
                    background: "rgba(0, 0, 0, 0.2)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <Box>
                    <Typography 
                      variant="subtitle2" 
                      color={colors.grey[400]}
                      sx={{
                        fontSize: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Reviewed by
                    </Typography>
                    <Typography color={colors.grey[100]} fontWeight="bold" sx={{ mt: 0.5 }}>
                      {selectedTransaction.reviewedBy}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`Status: ${selectedTransaction.status}`}
                    sx={{
                      bgcolor: "rgba(54, 162, 235, 0.2)",
                      color: colors.blueAccent[300],
                      border: `1px solid ${colors.blueAccent[500]}`,
                      fontWeight: "bold",
                      backdropFilter: "blur(5px)"
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ 
          borderTop: "1px solid rgba(255, 255, 255, 0.05)", 
          p: 3,
          background: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
          borderBottomLeftRadius: '16px',
          borderBottomRightRadius: '16px',
          justifyContent: 'space-between'
        }}>
          <Button 
            startIcon={<DashboardIcon />}
            sx={{ 
              color: colors.grey[400],
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.05)",
              borderRadius: "8px",
              padding: "8px 16px",
              '&:hover': {
                color: colors.grey[100],
                background: "rgba(255, 255, 255, 0.08)",
                transform: "translateY(-2px)"
              },
              transition: "all 0.3s ease"
            }}
          >
            View Dashboard
          </Button>
          <Button 
            onClick={handleCloseDetails} 
            variant="contained"
            sx={{ 
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              color: colors.grey[100],
              fontWeight: "bold",
              padding: "10px 24px",
              borderRadius: "8px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
              '&:hover': {
                background: "rgba(255, 255, 255, 0.15)",
                transform: 'translateY(-3px)',
                boxShadow: "0 12px 25px rgba(0,0,0,0.2)",
              },
              transition: 'all 0.3s ease'
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Fade}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          variant="filled"
          icon={snackbarSeverity === "success" ? <RefreshIcon /> : <WarningAmberIcon />}
          sx={{ 
            width: '100%',
            backdropFilter: "blur(10px)",
            borderRadius: "10px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            "& .MuiAlert-icon": {
              color: snackbarSeverity === "success" ? colors.greenAccent[400] : colors.redAccent[400]
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      
      {/* Backdrop for loading state */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: "blur(3px)"
        }}
        open={isLoading}
      />
    </Box>
  );
};

export default FraudHistory;