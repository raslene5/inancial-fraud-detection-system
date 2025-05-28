import { Box, Paper, Typography } from "@mui/material";
import Header from "../../components/Header";
import PieChart from "../../components/PieChart";

const Pie = () => {
  return (
    <Box
      sx={{
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "32px",
      }}
    >
      <Header
        title="Fraud Detection Insights"
        subtitle="Breakdown of Transaction Statuses"
        sx={{
          backgroundColor: "primary.main",
          color: "white",
          borderRadius: "12px",
          padding: "24px",
          textAlign: "center",
          width: "100%",
          boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
        }}
      />

      <Box
        sx={{
          height: "70vh",
          width: "100%",
          padding: "20px",
          borderRadius: "20px",
          backgroundColor: "background.paper",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
        }}
      >
        <PieChart />
      </Box>

      <Paper
        sx={{
          maxWidth: 800,
          padding: "20px",
          borderRadius: "12px",
          backgroundColor: "background.default",
          boxShadow: "0 6px 20px rgba(0,0,0,0.07)",
        }}
      >
        <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center" }}>
          This visualization provides a real-time overview of transaction categories in our mobile
          money fraud detection system. It highlights the proportion of legitimate transactions,
          fraud cases, and those flagged for manual review—empowering data-driven security
          decisions.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Pie;
