import { Box, Paper, Typography } from "@mui/material";
import Header from "../../components/Header";
import BarChart from "../../components/BarChart";

const Bar = () => {
  return (
    <Box m="20px">
      <Header
        title="Transaction Risk Categories"
        subtitle="Visual breakdown of transaction types by fraud detection levels"
      />

      <Box
        sx={{
          height: "75vh",
          marginTop: "30px",
          padding: "20px",
          borderRadius: "20px",
          backgroundColor: "background.paper",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
        }}
      >
        <BarChart />
      </Box>

      <Paper
        sx={{
          marginTop: "30px",
          padding: "20px",
          borderRadius: "10px",
          backgroundColor: "background.default",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center" }}>
          This bar chart provides a grouped visual comparison between legitimate, suspicious,
          and fraudulent transactions across various mobile money operations.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Bar;
