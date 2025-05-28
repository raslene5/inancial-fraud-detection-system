import {
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
  Tooltip,
} from "@mui/material";
import { tokens } from "../../theme";
import { mockTransactions } from "../../data/mockData";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import LineChart from "../../components/LineChart";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";
import React from "react";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h3" fontWeight="bold" color={colors.grey[100]}>
            🛡️ Fraud Detection Center
          </Typography>
          <Typography variant="h6" color={colors.grey[400]}>
            Real-time Insights & Monitoring of Anomalous Financial Activity
          </Typography>
        </Box>

        <Button
          sx={{
            backgroundColor: colors.blueAccent[700],
            color: colors.grey[100],
            fontWeight: "bold",
            padding: "12px 24px",
            borderRadius: "10px",
            fontSize: "14px",
            boxShadow: `0 4px 8px ${colors.grey[600]}`,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: colors.blueAccent[500],
              transform: "scale(1.05)",
              boxShadow: `0 6px 16px ${colors.grey[700]}`,
            },
          }}
        >
          <DownloadOutlinedIcon sx={{ mr: "10px", fontSize: "20px" }} />
          Download Fraud Reports
        </Button>
      </Box>

      {/* GRID & CONTENT */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
        mt="30px"
      >
        {/* STATISTICS */}
        {[
          {
            title: "12,361",
            subtitle: "Suspicious Emails",
            progress: "0.75",
            increase: "+14%",
            icon: <EmailIcon />,
          },
          {
            title: "431,225",
            subtitle: "Fraudulent Transactions",
            progress: "0.50",
            increase: "+21%",
            icon: <PointOfSaleIcon />,
          },
          {
            title: "32,441",
            subtitle: "Potential Fraud Cases",
            progress: "0.30",
            increase: "+5%",
            icon: <PersonAddIcon />,
          },
          {
            title: "1,325,134",
            subtitle: "Unusual Traffic Alerts",
            progress: "0.80",
            increase: "+43%",
            icon: <TrafficIcon />,
          },
        ].map((item, index) => (
          <Box
            key={index}
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="15px"
            boxShadow={`0 6px 12px ${colors.grey[700]}`}
            sx={{
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.03)",
                boxShadow: `0 10px 18px ${colors.grey[800]}`,
              },
            }}
          >
            <StatBox
              title={item.title}
              subtitle={item.subtitle}
              progress={item.progress}
              increase={item.increase}
              icon={React.cloneElement(item.icon, {
                sx: { color: colors.greenAccent[600], fontSize: "30px" },
              })}
            />
          </Box>
        ))}

        {/* LINE CHART */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          borderRadius="15px"
          boxShadow={`0 6px 12px ${colors.grey[600]}`}
          sx={{ transition: "transform 0.3s ease", "&:hover": { transform: "scale(1.01)" } }}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography variant="h5" fontWeight="600" color={colors.grey[100]}>
                Revenue Impacted
              </Typography>
              <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
                $59,342.32
              </Typography>
            </Box>
            <Tooltip title="Download Financial Data" arrow>
              <IconButton
                sx={{
                  "&:hover": { transform: "scale(1.2)" },
                  "&:focus": {
                    outline: `2px solid ${colors.greenAccent[400]}`,
                  },
                }}
              >
                <DownloadOutlinedIcon sx={{ color: colors.greenAccent[500], fontSize: "26px" }} />
              </IconButton>
            </Tooltip>
          </Box>
          <Box height="250px" mt="-20px">
            <LineChart isDashboard />
          </Box>
        </Box>

        {/* TRANSACTIONS */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          borderRadius="15px"
          boxShadow={`0 6px 12px ${colors.grey[600]}`}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Recent Fraudulent Transactions
            </Typography>
          </Box>
          {mockTransactions.map((tx, i) => (
            <Box
              key={`${tx.txId}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`2px solid ${colors.primary[500]}`}
              p="15px"
              sx={{
                transition: "background-color 0.2s ease, transform 0.2s ease",
                "&:hover": {
                  backgroundColor: colors.primary[300],
                  transform: "scale(1.01)",
                },
              }}
            >
              <Box>
                <Typography color={colors.greenAccent[500]} fontWeight="600">
                  {tx.txId}
                </Typography>
                <Typography color={colors.grey[100]}>{tx.user}</Typography>
              </Box>
              <Typography color={colors.grey[100]}>{tx.date}</Typography>
              <Box
                backgroundColor={colors.greenAccent[600]}
                p="6px 12px"
                borderRadius="8px"
              >
                ${tx.cost}
              </Box>
            </Box>
          ))}
        </Box>

        {/* FRAUD LOSS OVERVIEW */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          borderRadius="15px"
          boxShadow={`0 6px 12px ${colors.grey[600]}`}
          sx={{ transition: "transform 0.3s ease", "&:hover": { transform: "scale(1.02)" } }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            mb="15px"
            textAlign="center"
          >
            Fraud Loss Overview
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
          >
            <ProgressCircle size="125" />
            <Typography variant="h5" color={colors.greenAccent[500]} mt="15px">
              $48,352 Loss to Fraud
            </Typography>
            <Typography color={colors.grey[300]} textAlign="center">
              Includes mitigation costs and recovery attempts
            </Typography>
          </Box>
        </Box>

        {/* BAR CHART */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          borderRadius="15px"
          boxShadow={`0 6px 12px ${colors.grey[600]}`}
          sx={{ transition: "transform 0.3s ease", "&:hover": { transform: "scale(1.02)" } }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            mb="15px"
            textAlign="center"
          >
            Fraudulent Transaction Volume
          </Typography>
          <Box height="250px">
            <BarChart isDashboard />
          </Box>
        </Box>

        {/* GEOGRAPHY */}
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
          borderRadius="15px"
          boxShadow={`0 6px 12px ${colors.grey[600]}`}
          sx={{
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.02)" },
            overflow: "hidden",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            mb="15px"
            textAlign="center"
          >
            Geographic Fraud Heatmap
          </Typography>
          <Box
            sx={{
              height: "250px",
              overflow: "hidden",
              borderRadius: "10px",
            }}
          >
            <GeographyChart isDashboard />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
