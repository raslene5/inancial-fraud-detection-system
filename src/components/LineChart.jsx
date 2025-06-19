import { useTheme, Box } from "@mui/material";
import { tokens } from "../theme";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

// Helper function to convert hex to rgba
const hexToRgba = (hex, alpha = 1) => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Return rgba string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart = ({ data, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: colors.grey[100],
          font: {
            family: "Poppins, sans-serif",
            size: isDashboard ? 11 : 12
          }
        }
      },
      tooltip: {
        mode: "index",
        intersect: false,
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
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', { 
                style: 'currency', 
                currency: 'EUR',
                minimumFractionDigits: 2
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: colors.grey[800]
        },
        ticks: {
          color: colors.grey[100],
          font: {
            family: "Poppins, sans-serif"
          }
        }
      },
      y: {
        grid: {
          color: colors.grey[800]
        },
        ticks: {
          color: colors.grey[100],
          font: {
            family: "Poppins, sans-serif"
          },
          callback: function(value) {
            return '€' + value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      line: {
        tension: 0.4, // Smoother curves
        borderWidth: 3
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 6,
        borderWidth: 2,
        hoverBorderWidth: 3,
        backgroundColor: colors.primary[400]
      }
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart'
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

  // Process the data to add gradient fill
  const chartData = {
    labels: data[0]?.data.map(d => d.x) || [],
    datasets: data.map((dataset, index) => {
      const color = dataset.color || colors.greenAccent[500];
      return {
        label: dataset.id,
        data: dataset.data.map(d => d.y),
        borderColor: color,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, context.chart.height);
          // Create semi-transparent versions using rgba
          const rgbaColor = hexToRgba(color, 0.6);
          const transparentColor = hexToRgba(color, 0);
          gradient.addColorStop(0, rgbaColor);
          gradient.addColorStop(1, transparentColor);
          return gradient;
        },
        pointBackgroundColor: color,
        pointBorderColor: colors.primary[400],
        fill: true,
        hoverBackgroundColor: color,
        hoverBorderColor: colors.greenAccent[300]
      };
    })
  };

  return (
    <Box height="100%" width="100%" position="relative">
      <Line options={options} data={chartData} />
    </Box>
  );
};

export default LineChart;