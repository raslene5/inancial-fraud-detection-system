import { useTheme, Box } from "@mui/material";
import { tokens } from "../theme";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const PieChart = ({ data, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isDashboard ? "bottom" : "right",
        labels: {
          color: colors.grey[100],
          font: {
            family: "Poppins, sans-serif",
            size: isDashboard ? 11 : 12
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: colors.primary[500],
        titleColor: colors.greenAccent[500],
        bodyColor: colors.grey[100],
        borderColor: colors.greenAccent[500],
        borderWidth: 1,
        padding: 10,
        bodyFont: {
          family: "Poppins, sans-serif"
        },
        titleFont: {
          family: "Poppins, sans-serif",
          weight: "bold"
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: isDashboard ? '60%' : '50%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
      easing: 'easeOutQuart'
    },
    elements: {
      arc: {
        borderWidth: 2,
        borderColor: colors.primary[400],
        hoverBorderColor: colors.grey[100],
        hoverBorderWidth: 3,
        hoverOffset: 10
      }
    }
  };

  // If no data is provided, return a placeholder
  if (!data) {
    return (
      <Box 
        height="100%" 
        width="100%" 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        color={colors.grey[100]}
      >
        No data available
      </Box>
    );
  }

  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        hoverBackgroundColor: data.map(item => {
          // Create a slightly lighter version of the color for hover
          const color = item.color.replace('hsl(', '').replace(')', '').split(',');
          const h = parseInt(color[0]);
          const s = parseInt(color[1]);
          const l = parseInt(color[2]);
          return `hsl(${h}, ${s}%, ${Math.min(l + 10, 90)}%)`;
        }),
        borderColor: colors.primary[400],
        borderWidth: 2
      }
    ]
  };

  return (
    <Box height="100%" width="100%" position="relative">
      <Pie options={options} data={chartData} />
    </Box>
  );
};

export default PieChart;