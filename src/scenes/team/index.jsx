import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  useTheme,
  TextField,
  Button,
  Grid,
  Snackbar,
  Tooltip,
} from "@mui/material";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import axios from "axios";

const Transactions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    type: "",
    amount: "",
    day: "",
    partOfTheDay: "",
    transactionPairCode: "",
  });
  const [prediction, setPrediction] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/fraud-detect/all");
      setData(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        amount: parseFloat(formData.amount),
        type: formData.type,
        day: parseInt(formData.day),
        partOfTheDay: formData.partOfTheDay,
        transactionPairCode: formData.transactionPairCode,
      };

      const response = await axios.post("http://localhost:8089/api/fraud-detect", payload);
      setPrediction(response.data.isFraud);
      setError(null);
      setOpenSnackbar(true);
      fetchData();
    } catch (err) {
      console.error("Prediction Error:", err);
      setError("Something went wrong. Please check your inputs or backend server.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const calculateStats = (data) => {
    const total = data.length;
    const fraud = data.filter((d) => d.isFraud === true).length;
    const avgAmount = data.reduce((sum, d) => sum + d.amount, 0) / total;
    return {
      total,
      fraud,
      fraudRate: ((fraud / total) * 100).toFixed(2),
      avgAmount: avgAmount.toFixed(2),
    };
  };

  const stats = calculateStats(data);

  const renderTransactionType = (type) => {
    switch (type.toLowerCase()) {
      case "payment":
        return "💸";
      case "transfer":
        return "🔁";
      case "cash_out":
        return "🏧";
      case "debit":
        return "💳";
      case "cash_in":
        return "💰";
      default:
        return "❓";
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "type",
      headerName: "Transaction Type",
      flex: 1,
      renderCell: ({ value }) => (
        <Tooltip title={`Transaction Type: ${value}`} arrow>
          <Box display="flex" justifyContent="center">
            {renderTransactionType(value)}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: "amount",
      headerName: "Amount (USD)",
      type: "number",
      flex: 1,
      renderCell: ({ value }) => (
        <Box
          p="5px"
          textAlign="center"
          borderRadius="4px"
          sx={{
            backgroundColor:
              value > 10000
                ? colors.redAccent?.[600]
                : value > 5000
                ? colors.orangeAccent?.[400]
                : colors.greenAccent?.[600],
            color: colors.grey?.[100],
          }}
        >
          {value.toLocaleString()}
        </Box>
      ),
    },
    {
      field: "isFraud",
      headerName: "Fraudulent?",
      flex: 1,
      renderCell: ({ value }) => (
        <Tooltip title={value === true ? "Flagged as fraudulent" : "No fraud detected"} arrow>
          <Box
            p="5px"
            textAlign="center"
            borderRadius="4px"
            backgroundColor={value === true ? colors.redAccent?.[600] : colors.greenAccent?.[600]}
            color={colors.grey?.[100]}
          >
            {value === true ? "Yes" : "No"}
          </Box>
        </Tooltip>
      ),
    },
    { field: "day", headerName: "Day of Week", flex: 1 },
    { field: "partOfTheDay", headerName: "Time of Day", flex: 1 },
    { field: "transactionPairCode", headerName: "Recipient Type", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="Transactions" subtitle="Fraud Detection Dashboard" />

      <Box mb={2}>
        <Typography variant="h6" gutterBottom>
          Add New Transaction for Fraud Prediction
        </Typography>
        <Grid container spacing={2}>
          {["type", "amount", "day", "partOfTheDay", "transactionPairCode"].map((field) => (
            <Grid item xs={12} sm={6} md={4} key={field}>
              <TextField
                fullWidth
                label={field.replace(/([A-Z])/g, " $1").toUpperCase()}
                name={field}
                value={formData[field]}
                onChange={handleChange}
              />
            </Grid>
          ))}
        </Grid>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Predict Fraud
          </Button>
        </Box>
      </Box>

      {prediction !== null && (
        <Box mt={2}>
          <Typography variant="h6">
            Prediction Result:{" "}
            <span style={{ color: prediction ? "red" : "green" }}>
              {prediction ? "Fraudulent" : "Not Fraudulent"}
            </span>
          </Typography>
        </Box>
      )}

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Summary Statistics
        </Typography>
        <Typography>Total Transactions: {stats.total}</Typography>
        <Typography>Fraudulent Transactions: {stats.fraud}</Typography>
        <Typography>Fraud Rate: {stats.fraudRate}%</Typography>
        <Typography>Average Amount: ${stats.avgAmount}</Typography>
      </Box>

      <Box mt={4} height="600px">
        <DataGrid
          rows={data.map((row, index) => ({ id: index + 1, ...row }))}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error || "Prediction submitted successfully."}
      />
    </Box>
  );
};

export default Transactions;
