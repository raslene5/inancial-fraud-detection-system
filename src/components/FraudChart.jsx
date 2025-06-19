import { useEffect, useRef, useState } from "react";
import { 
  Box, useTheme, Typography, alpha, IconButton, Tooltip,
  ToggleButtonGroup, ToggleButton, Chip
} from "@mui/material";
import { tokens } from "../theme";
import { 
  Chart, ArcElement, Tooltip as ChartTooltip, Legend, 
  LineElement, PointElement, LinearScale, CategoryScale, Filler,
  Title, BarElement, DoughnutController, LineController
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import TimelineIcon from "@mui/icons-material/Timeline";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";

// Register Chart.js components
Chart.register(
  ArcElement, 
  ChartTooltip, 
  Legend, 
  LineElement, 
  PointElement, 
  LinearScale, 
  CategoryScale,
  Filler,
  Title,
  BarElement,
  DoughnutController,
  LineController
);

const FraudChart = ({ data, chartType = "pie", title = "Fraud Analysis", onItemClick, id }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [isChartReady, setIsChartReady] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeChartType, setActiveChartType] = useState(chartType);
  const [timeRange, setTimeRange] = useState("week");

  // Update active chart type when prop changes
  useEffect(() => {
    setActiveChartType(chartType);
    
    // Reset chart instance when chart type changes
    if (chartInstance.current) {
      try {
        chartInstance.current.destroy();
        chartInstance.current = null;
      } catch (error) {
        console.log("Chart cleanup error on type change:", error);
      }
    }
    
    // Reset chart ready state
    setIsChartReady(false);
  }, [chartType]);

  // Update chart when selected segment changes
  useEffect(() => {
    // Only run this effect when chart is fully initialized
    if (isChartReady && chartInstance.current && activeChartType === "pie") {
      try {
        // Update the chart to reflect selection
        const chart = chartInstance.current;
        
        if (chart.data && chart.data.datasets && chart.data.datasets[0]) {
          // Reset all segments to normal
          const dataset = chart.data.datasets[0];
          dataset.offset = dataset.offset || Array(dataset.data.length).fill(0);
          
          // Apply offset to selected segment
          if (selectedSegment !== null && selectedSegment >= 0 && selectedSegment < dataset.offset.length) {
            dataset.offset = dataset.offset.map((_, i) => i === selectedSegment ? 10 : 0);
          } else {
            dataset.offset = dataset.offset.map(() => 0);
          }
          
          // Only update if the chart canvas is still in the DOM
          if (chartRef.current) {
            chart.update('none'); // Use 'none' animation mode to prevent errors
          }
        }
      } catch (error) {
        console.log("Chart update error:", error);
      }
    }
  }, [selectedSegment, activeChartType, isChartReady]);

  useEffect(() => {
    setIsChartReady(false);
    
    try {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    } catch (error) {
      console.log("Chart cleanup error:", error);
    }

    if (!chartRef.current || !data) {
      console.log("Chart ref or data missing:", { chartRef: !!chartRef.current, data: !!data });
      return;
    }
    
    // Validate timeline data if chart type is line
    if (activeChartType === "line" && (!data.timelineData || !Array.isArray(data.timelineData.labels) || !data.timelineData.labels.length)) {
      console.log("Invalid timeline data:", data.timelineData);
      return;
    }
    
    // Filter timeline data based on selected time range
    const filterTimelineDataByRange = () => {
      if (activeChartType !== "line" || !data.timelineData) return data.timelineData;
      
      const today = new Date();
      const timelineData = { ...data.timelineData };
      
      // Determine how many days to include based on timeRange
      let daysToInclude;
      switch (timeRange) {
        case "week":
          daysToInclude = 7;
          break;
        case "month":
          daysToInclude = 30;
          break;
        case "year":
          daysToInclude = 365;
          break;
        default:
          daysToInclude = 7; // Default to week
      }
      
      // If we have sample data with fixed length, adjust it for different time ranges
      if (timeRange !== "week" && timelineData.labels.length === 7) {
        // For demo purposes, generate more data points for month and year views
        const newLabels = [];
        const newValues = [];
        const newSecondaryValues = [];
        
        for (let i = daysToInclude - 1; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          
          const dayKey = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
          newLabels.push(dayKey);
          
          // Generate some random but realistic-looking data
          if (timeRange === "month") {
            // More variation for month view
            newValues.push(Math.floor(Math.random() * 8) + 1); // 1-8 fraud transactions
            newSecondaryValues.push(Math.floor(Math.random() * 10) + 3); // 3-12 suspicious transactions
          } else if (timeRange === "year") {
            // Aggregate data for year view (higher numbers)
            newValues.push(Math.floor(Math.random() * 20) + 5); // 5-24 fraud transactions
            newSecondaryValues.push(Math.floor(Math.random() * 30) + 10); // 10-39 suspicious transactions
          }
        }
        
        if (timeRange !== "week") {
          return {
            labels: newLabels,
            values: newValues,
            secondaryValues: newSecondaryValues
          };
        }
      }
      
      return timelineData;
    };

    const ctx = chartRef.current.getContext("2d");
    let chartConfig;

    // Handle different chart types
    if (activeChartType === "pie") {
      // Filter data to only include Normal, Suspicious, and Fraud
      const validLabels = ["Normal", "Suspicious", "Fraud"];
      const filteredLabels = [];
      const filteredValues = [];
      
      if (data.statusData && data.statusData.labels && data.statusData.values) {
        data.statusData.labels.forEach((label, index) => {
          if (validLabels.includes(label)) {
            filteredLabels.push(label);
            filteredValues.push(data.statusData.values[index]);
          }
        });
      }

      // Define colors for each status
      const statusColors = {
        Normal: {
          main: "#2e7d32",
          light: "#81c784",
          dark: "#1b5e20"
        },
        Suspicious: {
          main: "#f57c00",
          light: "#ffb74d",
          dark: "#e65100"
        },
        Fraud: {
          main: "#c62828",
          light: "#e57373",
          dark: "#b71c1c"
        }
      };

      // Create datasets with custom colors
      const backgroundColors = filteredLabels.map(label => statusColors[label].main);
      const hoverColors = filteredLabels.map(label => statusColors[label].light);
      const borderColors = filteredLabels.map(label => statusColors[label].dark);

      chartConfig = {
        type: "doughnut",
        data: {
          labels: filteredLabels,
          datasets: [
            {
              data: filteredValues,
              backgroundColor: backgroundColors,
              hoverBackgroundColor: hoverColors,
              borderColor: borderColors,
              borderWidth: 2,
              hoverBorderWidth: 0,
              hoverOffset: 15,
              borderRadius: 8,
              spacing: 4,
              offset: Array(filteredValues.length).fill(0),
              hoverBorderColor: borderColors.map(color => alpha(color, 0.8)),
              hoverBorderWidth: 3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "60%",
          layout: {
            padding: 20
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: true,
              backgroundColor: alpha(colors.primary[900], 0.8),
              titleColor: colors.grey[100],
              bodyColor: colors.grey[100],
              titleFont: {
                size: 14,
                weight: "bold"
              },
              bodyFont: {
                size: 13
              },
              padding: 12,
              cornerRadius: 8,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.raw || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                  return `${label}: ${value} (${percentage}%)`;
                }
              }
            }
          },
          animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1200,
            easing: 'easeOutElastic',
            onComplete: () => {
              setIsChartReady(true);
            }
          },
          onHover: (event, elements) => {
            if (elements && elements.length) {
              setHoveredSegment(elements[0].index);
            } else {
              setHoveredSegment(null);
            }
          },
          onClick: (event, elements) => {
            if (elements && elements.length) {
              const index = elements[0].index;
              
              // Toggle selection if clicking the same segment
              if (selectedSegment === index) {
                setSelectedSegment(null);
                // Call parent callback with null to indicate deselection
                if (onItemClick) {
                  onItemClick(null, null, -1);
                }
              } else {
                setSelectedSegment(index);
                // Call parent callback if provided
                if (onItemClick && filteredLabels[index]) {
                  onItemClick(filteredLabels[index], filteredValues[index], index);
                }
              }
              
              // Don't manually update the chart here - let the effect handle it
            }
          }
        },
      };
    }
    // Timeline chart for fraud trends
    else if (activeChartType === "line") {
      // Filter timeline data based on selected time range
      const filteredTimelineData = filterTimelineDataByRange();
      
      // Format timeline data
      const timelineData = filteredTimelineData || { labels: [], values: [], secondaryValues: [] };
      
      // Ensure we have valid data for the timeline chart
      console.log(`Timeline data (${timeRange}):`, timelineData);
      
      // Format dates for better display
      const formattedLabels = timelineData.labels?.map(date => {
        if (!date) return "";
        try {
          const [year, month, day] = date.split('-');
          return `${month}/${day}`;
        } catch (error) {
          console.error("Error formatting date:", date, error);
          return "";
        }
      }).filter(label => label !== "") || [];
      
      // Create enhanced gradient fills with multiple color stops
      const fraudGradient = ctx.createLinearGradient(0, 0, 0, 400);
      fraudGradient.addColorStop(0, alpha(colors.redAccent[500], 0.8));
      fraudGradient.addColorStop(0.5, alpha(colors.redAccent[500], 0.4));
      fraudGradient.addColorStop(1, alpha(colors.redAccent[500], 0.05));
      
      const suspiciousGradient = ctx.createLinearGradient(0, 0, 0, 400);
      suspiciousGradient.addColorStop(0, alpha('#ff9800', 0.6));
      suspiciousGradient.addColorStop(0.6, alpha('#ff9800', 0.3));
      suspiciousGradient.addColorStop(1, alpha('#ff9800', 0.05));
      
      // Create shadow effect for line
      const shadowColor = alpha(colors.primary[900], 0.3);
      
      // Create dummy data if no real data exists
      if (!Array.isArray(timelineData.values) || timelineData.values.length === 0) {
        console.log("Creating dummy timeline data");
        timelineData.values = [5, 3, 7, 4, 6, 2, 8];
        timelineData.secondaryValues = [8, 6, 9, 7, 10, 5, 12];
        
        if (!Array.isArray(timelineData.labels) || timelineData.labels.length === 0) {
          const today = new Date();
          timelineData.labels = [];
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            timelineData.labels.push(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
          }
        }
      }
      
      // Ensure we have valid data arrays
      const fraudValues = Array.isArray(timelineData.values) ? timelineData.values : [];
      const suspiciousValues = Array.isArray(timelineData.secondaryValues) ? timelineData.secondaryValues : [];
      
      // Make sure we have matching data points for each label
      while (fraudValues.length < formattedLabels.length) {
        fraudValues.push(0);
      }
      
      while (suspiciousValues.length < formattedLabels.length) {
        suspiciousValues.push(0);
      }
      
      console.log("Creating line chart with data:", { labels: formattedLabels, fraud: fraudValues, suspicious: suspiciousValues });
      
      chartConfig = {
        type: "line",
        data: {
          labels: formattedLabels,
          datasets: [
            {
              label: "Fraud",
              data: fraudValues,
              borderColor: colors.redAccent[500],
              backgroundColor: fraudGradient,
              borderWidth: 3,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: colors.redAccent[500],
              pointBorderColor: colors.grey[900],
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 8,
              pointStyle: 'circle',
              pointHoverBackgroundColor: colors.redAccent[300],
              borderCapStyle: 'round',
              borderJoinStyle: 'round',
            },
            {
              label: "Suspicious",
              data: suspiciousValues,
              borderColor: '#ff9800',
              backgroundColor: suspiciousGradient,
              borderWidth: 3,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: '#ff9800',
              pointBorderColor: colors.grey[900],
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 8,
              pointStyle: 'circle',
              pointHoverBackgroundColor: '#ffb74d',
              borderCapStyle: 'round',
              borderJoinStyle: 'round',
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              position: "top",
              align: "end",
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
                boxWidth: 15,
                boxHeight: 15,
                padding: 20,
                color: colors.grey[100],
                font: {
                  size: 14,
                  weight: 'bold'
                }
              }
            },
            tooltip: {
              backgroundColor: alpha(colors.primary[900], 0.9),
              titleColor: colors.grey[100],
              bodyColor: colors.grey[100],
              padding: 15,
              cornerRadius: 10,
              displayColors: true,
              titleFont: {
                size: 14,
                weight: 'bold'
              },
              bodyFont: {
                size: 13
              },
              callbacks: {
                title: function(context) {
                  // Show full date in tooltip
                  const index = context[0].dataIndex;
                  const fullDate = timelineData.labels?.[index] || '';
                  if (fullDate) {
                    const date = new Date(fullDate);
                    return date.toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    });
                  }
                  return '';
                },
                label: function(context) {
                  const label = context.dataset.label || '';
                  const value = context.raw || 0;
                  return `${label}: ${value} transactions`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                color: alpha(colors.grey[700], 0.15),
                drawBorder: false,
                borderDash: [5, 5],
                z: -1
              },
              ticks: {
                color: colors.grey[200],
                font: {
                  size: 12,
                  weight: 'bold'
                },
                padding: 12,
                maxRotation: 0
              },
              title: {
                display: true,
                text: timeRange === 'year' ? 'Date (Month/Day)' : 'Date (MM/DD)',
                color: colors.grey[200],
                font: {
                  size: 16,
                  weight: 'bold'
                },
                padding: {top: 15, bottom: 0}
              },
              border: {
                display: false
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: alpha(colors.grey[700], 0.15),
                drawBorder: false,
                borderDash: [5, 5],
                z: -1
              },
              ticks: {
                color: colors.grey[200],
                font: {
                  size: 12,
                  weight: 'bold'
                },
                padding: 12,
                callback: function(value) {
                  return value % 1 === 0 ? value : '';
                }
              },
              title: {
                display: true,
                text: timeRange === 'year' ? 'Monthly Transactions' : 
                      timeRange === 'month' ? 'Daily Transactions' : 'Daily Transactions',
                color: colors.grey[200],
                font: {
                  size: 16,
                  weight: 'bold'
                },
                padding: {bottom: 15}
              },
              border: {
                display: false
              }
            }
          },
          animation: {
            duration: 1000,
            easing: 'easeOutQuad'
          },
          layout: {
            padding: {
              top: 30,
              right: 30,
              bottom: 30,
              left: 30
            }
          },
          elements: {
            line: {
              borderWidth: 3
            },
            point: {
              radius: 5,
              hoverRadius: 8
            }
          }
        }
      };
    }

    // Create chart instance if config exists
    if (chartConfig && chartRef.current) {
      try {
        // Destroy any existing chart
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        
        // Create new chart immediately
        chartInstance.current = new Chart(ctx, chartConfig);
        
        // Set chart as ready after a short delay
        setTimeout(() => {
          if (chartRef.current) {
            setIsChartReady(true);
          }
        }, 500);
      } catch (error) {
        console.error("Chart creation error:", error);
        setIsChartReady(false);
      }
    }

    // Cleanup function
    return () => {
      try {
        if (chartInstance.current) {
          chartInstance.current.destroy();
          chartInstance.current = null;
        }
      } catch (error) {
        console.log("Chart cleanup error:", error);
      }
    };
  }, [data, activeChartType, colors, timeRange]);

  // Get total count from status data
  const totalCount = data?.statusData?.values?.reduce((a, b) => a + b, 0) || 0;
  
  // Debug log to check data structure
  useEffect(() => {
    if (data) {
      if (activeChartType === "pie") {
        console.log("Pie chart data:", data.statusData);
      } else if (activeChartType === "line") {
        console.log("Timeline chart data:", data.timelineData);
      }
    }
  }, [activeChartType, data]);

  // Create legend items manually
  const legendItems = [];
  if (data?.statusData?.labels && data?.statusData?.values) {
    const validLabels = ["Normal", "Suspicious", "Fraud"];
    data.statusData.labels.forEach((label, index) => {
      if (validLabels.includes(label)) {
        const value = data.statusData.values[index];
        const percentage = totalCount > 0 ? Math.round((value / totalCount) * 100) : 0;
        
        // Define colors and icons for each status
        let color, icon, description;
        
        if (label === "Normal") {
          color = "#4caf50";
          icon = "✓";
          description = "Legitimate transactions";
        } else if (label === "Suspicious") {
          color = "#ff9800";
          icon = "⚠";
          description = "Requires review";
        } else if (label === "Fraud") {
          color = "#f44336";
          icon = "✗";
          description = "Confirmed fraud";
        }
        
        legendItems.push({ label, value, percentage, color, icon, description });
      }
    });
  }

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        height: "100%",
        width: "100%",
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        background: `linear-gradient(135deg, ${alpha(colors.primary[400], 0.03)} 0%, ${alpha(colors.primary[800], 0.1)} 100%)`,
        backdropFilter: "blur(8px)",
        boxShadow: `
          0 10px 30px -5px ${alpha(colors.primary[900], 0.2)},
          0 1px 3px 0 ${alpha(colors.primary[900], 0.1)},
          inset 0 1px 0 0 ${alpha(colors.grey[100], 0.05)}
        `,
        border: `1px solid ${alpha(colors.grey[100], 0.08)}`,
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          borderBottom: `1px solid ${alpha(colors.grey[500], 0.1)}`
        }}
      >
        {/* Header top row */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {activeChartType === "line" ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  background: `linear-gradient(135deg, ${alpha(colors.primary[400], 0.2)}, ${alpha(colors.primary[600], 0.3)})`,
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  py: 1,
                  px: 2,
                  border: `1px solid ${alpha(colors.grey[100], 0.15)}`,
                }}
              >
                <TimelineIcon 
                  sx={{ 
                    mr: 1, 
                    color: colors.grey[100],
                    filter: `drop-shadow(0 2px 3px ${alpha(colors.primary[900], 0.5)})`
                  }} 
                />
                <Typography 
                  variant="h6" 
                  fontWeight="600" 
                  color={colors.grey[100]}
                  sx={{
                    textShadow: `0 2px 4px ${alpha(colors.primary[900], 0.4)}`,
                    letterSpacing: "0.5px"
                  }}
                >
                  Fraud Activity Timeline ({timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  background: `linear-gradient(135deg, ${alpha(colors.redAccent[500], 0.2)}, ${alpha(colors.redAccent[700], 0.3)})`,
                  backdropFilter: "blur(10px)",
                  borderRadius: "10px",
                  py: 1,
                  px: 2,
                  border: `1px solid ${alpha(colors.grey[100], 0.15)}`,
                }}
              >
                <DonutLargeIcon 
                  sx={{ 
                    mr: 1, 
                    color: colors.grey[100],
                    filter: `drop-shadow(0 2px 3px ${alpha(colors.primary[900], 0.5)})`
                  }} 
                />
                <Typography 
                  variant="h6" 
                  fontWeight="600" 
                  color={colors.grey[100]}
                  sx={{
                    textShadow: `0 2px 4px ${alpha(colors.primary[900], 0.4)}`,
                    letterSpacing: "0.5px"
                  }}
                >
                  Fraud by Status
                </Typography>
              </Box>
            )}
            <IconButton 
              size="small" 
              sx={{ ml: 1, color: alpha(colors.grey[100], 0.7) }}
              onClick={() => setShowDetails(!showDetails)}
            >
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                bgcolor: alpha(colors.primary[900], 0.2),
                borderRadius: 5,
                px: 1.5,
                py: 0.5
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: colors.greenAccent[500],
                  animation: "pulse 2s infinite"
                }}
              />
              <Typography variant="caption" color={colors.grey[300]} fontWeight="bold">
                LIVE
              </Typography>
            </Box>
          </Box>
        </Box>
        
        {/* Chart title only */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
          {activeChartType === "line" && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {["week", "month", "year"].map((range) => (
                <Chip
                  key={range}
                  label={range.charAt(0).toUpperCase() + range.slice(1)}
                  size="small"
                  clickable
                  color={timeRange === range ? "primary" : "default"}
                  onClick={() => setTimeRange(range)}
                  sx={{
                    fontWeight: timeRange === range ? "bold" : "normal",
                    boxShadow: timeRange === range ? 
                      `0 0 10px ${alpha(colors.blueAccent[500], 0.5)}` : "none",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                    }
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Chart Container */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          position: "relative",
          p: activeChartType === "line" ? 2 : 2
        }}
      >
        {/* Chart */}
        <Box
          component={motion.div}
          whileHover={{
            boxShadow: `
              0 15px 35px -5px ${alpha(colors.primary[900], 0.4)},
              0 8px 15px -5px ${alpha(colors.primary[900], 0.3)}
            `
          }}
          sx={{
            flex: 1,
            position: "relative",
            height: "100%",
            borderRadius: activeChartType === "line" ? 3 : 3,
            overflow: "hidden",
            background: activeChartType === "line" ? 
              `linear-gradient(135deg, ${alpha(colors.grey[100], 0.02)} 0%, ${alpha(colors.grey[900], 0.03)} 100%)` : 
              `radial-gradient(circle at center, ${alpha(colors.grey[100], 0.01)} 0%, ${alpha(colors.grey[900], 0.02)} 100%)`,
            boxShadow: activeChartType === "line" ? 
              `
                0 10px 30px -5px ${alpha(colors.primary[900], 0.3)},
                0 5px 10px -5px ${alpha(colors.primary[900], 0.2)},
                inset 0 1px 0 0 ${alpha(colors.grey[100], 0.05)}
              ` : 
              `
                0 8px 25px -5px ${alpha(colors.primary[900], 0.25)},
                0 5px 10px -5px ${alpha(colors.primary[900], 0.15)},
                inset 0 1px 0 0 ${alpha(colors.grey[100], 0.05)}
              `,
            p: activeChartType === "line" ? 1 : 0,
            border: `1px solid ${alpha(colors.grey[100], 0.1)}`,
            transition: "all 0.3s ease"
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeChartType}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ width: "100%", height: "100%", maxHeight: "500px" }}
            >
              {/* Add key to force canvas recreation when chart type changes */}
              <canvas 
                key={`chart-${activeChartType}`} 
                ref={chartRef} 
                id={id || `chart-${activeChartType}`}
                style={{ maxHeight: "100%" }} 
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Center content for pie chart */}
          {activeChartType === "pie" && (
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 0 30px ${alpha(colors.primary[900], 0.5)}`
              }}
              transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                zIndex: 10,
                background: `radial-gradient(circle, ${alpha(colors.primary[400], 0.15)} 0%, ${alpha(colors.primary[900], 0.3)} 70%)`,
                borderRadius: "50%",
                p: 0,
                cursor: "pointer",
                width: "140px",
                height: "140px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backdropFilter: "blur(5px)",
                border: `1px solid ${alpha(colors.grey[100], 0.1)}`,
                boxShadow: `0 0 20px ${alpha(colors.primary[900], 0.4)}`,
                "&:hover": {
                  background: `radial-gradient(circle, ${alpha(colors.primary[400], 0.2)} 0%, ${alpha(colors.primary[900], 0.4)} 70%)`,
                }
              }}
              onClick={() => {
                // Calculate total
                const total = data?.statusData?.values?.reduce((a, b) => a + b, 0) || 0;
                if (onItemClick) {
                  onItemClick("Total", total, -1);
                }
              }}
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.9, 1, 0.9]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%"
                }}
              >
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={colors.grey[100]}
                  sx={{ 
                    textShadow: `0 2px 10px ${alpha(colors.primary[900], 0.5)}`,
                    lineHeight: 1.2
                  }}
                >
                  {totalCount}
                </Typography>
                <Typography
                  variant="body2"
                  color={colors.grey[300]}
                  sx={{ 
                    textShadow: `0 2px 10px ${alpha(colors.primary[900], 0.5)}`,
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    mt: 1
                  }}
                >
                  Total
                </Typography>
              </motion.div>
            </Box>
          )}
          

          

        </Box>

        {/* Legend - only show for pie chart */}
        <Box
          sx={{
            width: activeChartType === "pie" ? "40%" : "0%",
            pl: activeChartType === "pie" ? 2 : 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 1
          }}
        >
          {legendItems.map((item, index) => (
            <Box
              component={motion.div}
              key={item.label}
              whileHover={{ 
                x: 5,
                transition: { type: "spring", stiffness: 300 }
              }}
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 1.5,
                borderRadius: 2,
                bgcolor: hoveredSegment === index || selectedSegment === index ? alpha(item.color, 0.15) : "transparent",
                transition: "all 0.3s ease",
                cursor: "pointer",
                transform: selectedSegment === index ? "translateX(5px)" : "none",
                boxShadow: selectedSegment === index ? `0 4px 12px ${alpha(item.color, 0.3)}` : "none",
                border: selectedSegment === index ? `1px solid ${alpha(item.color, 0.3)}` : `1px solid transparent`,
                backdropFilter: selectedSegment === index ? "blur(4px)" : "none",
                position: "relative",
                overflow: "hidden",
                "&::after": selectedSegment === index ? {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(45deg, transparent 0%, ${alpha(item.color, 0.1)} 50%, transparent 100%)`,
                  animation: "shine 2s infinite",
                  zIndex: 0
                } : {}
              }}
              onClick={() => {
                setSelectedSegment(selectedSegment === index ? null : index);
                if (onItemClick) {
                  onItemClick(item.label, item.value, selectedSegment === index ? -1 : index);
                }
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5, position: "relative", zIndex: 1 }}>
                <Box
                  sx={{
                    width: 22,
                    height: 22,
                    borderRadius: 1.5,
                    bgcolor: item.color,
                    mr: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold",
                    boxShadow: `0 2px 8px ${alpha(item.color, 0.5)}`,
                    border: `1px solid ${alpha("#fff", 0.2)}`,
                    transition: "all 0.3s ease",
                    transform: selectedSegment === index ? "scale(1.2)" : "scale(1)"
                  }}
                >
                  {item.icon}
                </Box>
                <Typography 
                  variant="subtitle2" 
                  fontWeight="bold" 
                  color={colors.grey[100]}
                  sx={{
                    textShadow: selectedSegment === index ? `0 0 10px ${alpha(item.color, 0.5)}` : "none"
                  }}
                >
                  {item.label}
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: alpha(item.color, 0.1),
                    px: 1,
                    py: 0.3,
                    borderRadius: 5,
                    border: `1px solid ${alpha(item.color, 0.2)}`
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    fontWeight="bold" 
                    color={item.color}
                    sx={{
                      textShadow: `0 0 5px ${alpha(item.color, 0.3)}`
                    }}
                  >
                    {item.percentage}%
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="caption" color={colors.grey[400]} sx={{ pl: 3 }}>
                  {item.description}
                </Typography>
                <Typography variant="caption" color={colors.grey[300]}>
                  {item.value}
                </Typography>
              </Box>
              
              <Box
                sx={{
                  mt: 1.5,
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha(colors.grey[700], 0.3),
                  overflow: "hidden",
                  width: "100%",
                  position: "relative",
                  zIndex: 1,
                  boxShadow: `inset 0 1px 3px ${alpha(colors.primary[900], 0.3)}`
                }}
              >
                <Box
                  component={motion.div}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ 
                    duration: 1, 
                    delay: index * 0.2,
                    ease: "easeOut"
                  }}
                  sx={{
                    height: "100%",
                    bgcolor: item.color,
                    borderRadius: 3,
                    boxShadow: `0 0 10px ${alpha(item.color, 0.5)}`,
                    background: `linear-gradient(90deg, ${alpha(item.color, 0.8)}, ${item.color})`,
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "50%",
                      background: alpha("#fff", 0.2),
                      borderRadius: "3px 3px 0 0"
                    }
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Add keyframes for pulse animation */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          
          @keyframes shine {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-5px); }
            100% { transform: translateY(0px); }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
            50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(255, 255, 255, 0.2); }
            100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
          }
        `}
      </style>
    </Box>
  );
};

export default FraudChart;