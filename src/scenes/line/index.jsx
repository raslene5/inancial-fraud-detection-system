import { Box, Typography, Paper, useTheme } from "@mui/material";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";

const Line = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        margin: "20px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: theme.palette.background?.default || "#f9fafb", // Light background
        borderRadius: "16px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)", // Subtle shadow
      }}
    >
      {/* Header Section */}
      <Header
        title="Line Chart Analysis"
        subtitle="Fraudulent Activity and Detection Trends"
        sx={{
          backgroundColor: theme.palette.primary.main,
          color: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          width: "100%",
        }}
      />

      {/* Chart Section */}
      <Box
        sx={{
          height: "75vh",
          width: "100%",
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "16px",
          backgroundColor: theme.palette.background?.default || "#ffffff", // Light background
          padding: "20px",
        }}
      >
        <LineChart />
      </Box>

      {/* Footnote or Additional Information Section */}
      <Paper
        sx={{
          marginTop: "40px",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: theme.palette.background?.default || "#f4f6f8",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          maxWidth: "800px",
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text?.secondary || "#6b7280",
            textAlign: "center",
            fontSize: "1rem",
            lineHeight: "1.6",
          }}
        >
          This chart visualizes the trends in fraudulent transactions and detection scores across
          different periods, providing insights into the effectiveness of fraud detection systems
          over time. The data highlights key patterns and anomalies, enabling researchers and
          analysts to make informed decisions.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Line;