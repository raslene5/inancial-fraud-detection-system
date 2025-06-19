import {
  Box,
  IconButton,
  useTheme,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Badge,
  Divider,
  ListItemIcon,
  alpha,
  Chip,
  Fade,
  Paper,
  CircularProgress,
  Backdrop,
  Zoom,
  Popper,
  ClickAwayListener,
  Grow,
  MenuList,
  Stack
} from "@mui/material";
import { useContext, useState, useRef, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import SecurityIcon from "@mui/icons-material/Security";
import GavelIcon from "@mui/icons-material/Gavel";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimelineIcon from "@mui/icons-material/Timeline";
import AssessmentIcon from "@mui/icons-material/Assessment";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FilterListIcon from "@mui/icons-material/FilterList";
import TuneIcon from "@mui/icons-material/Tune";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import BoltIcon from "@mui/icons-material/Bolt";

const Topbar = ({ setIsSidebar, toggleSidebar }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  // State management
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [quickActions, setQuickActions] = useState(false);
  
  // Menu states
  const open = Boolean(anchorEl);
  const notificationsOpen = Boolean(notificationAnchorEl);
  
  // Handlers
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleNotificationsOpen = (event) => setNotificationAnchorEl(event.currentTarget);
  const handleNotificationsClose = () => setNotificationAnchorEl(null);
  
  // Quick actions toggle
  const toggleQuickActions = () => setQuickActions(!quickActions);

  // Mock notifications
  const notifications = [
    {
      id: 1,
      title: "High Risk Alert",
      description: "New high-risk transaction detected",
      time: "5 min ago",
      type: "alert",
      unread: true
    },
    {
      id: 2,
      title: "Case Update",
      description: "Case #FR-2023-0472 has been updated",
      time: "1 hour ago",
      type: "update",
      unread: true
    },
    {
      id: 3,
      title: "System Notification",
      description: "AI model training completed",
      time: "3 hours ago",
      type: "system",
      unread: false
    }
  ];

  // Get notification type color
  const getNotificationColor = (type) => {
    switch (type) {
      case "alert":
        return colors.redAccent[500];
      case "update":
        return colors.blueAccent[500];
      case "system":
        return colors.greenAccent[500];
      default:
        return colors.grey[500];
    }
  };

  // Count unread notifications
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={2}
      py={1.75}
      sx={{
        width: "100%",
        backdropFilter: "blur(20px)",
        backgroundColor: theme.palette.mode === "dark"
          ? alpha(colors.primary[900], 0.85)
          : alpha(colors.grey[100], 0.8),
        borderBottom: `1px solid ${alpha(colors.grey[500], 0.2)}`,
        boxShadow: `0 12px 32px 0 ${alpha(colors.primary[900], 0.15)}`,
        borderRadius: "0 0 24px 24px",
        position: "sticky",
        top: 0,
        zIndex: 1100,
        transition: "all 0.3s ease-in-out",
        background: theme.palette.mode === "dark"
          ? `linear-gradient(135deg, ${alpha(colors.primary[900], 0.95)} 0%, ${alpha(colors.blueAccent[900], 0.85)} 100%)`
          : `linear-gradient(135deg, ${alpha(colors.grey[100], 0.95)} 0%, ${alpha(colors.blueAccent[100], 0.85)} 100%)`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]}, ${colors.greenAccent[500]})`,
          backgroundSize: '200% 100%',
          zIndex: 1101,
          animation: "flowing-gradient 3s linear infinite"
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: -2,
          left: '10%',
          right: '10%',
          height: '6px',
          background: `radial-gradient(ellipse at center, ${alpha(colors.blueAccent[500], 0.3)} 0%, transparent 70%)`,
          filter: 'blur(4px)',
          zIndex: 1100
        },
        '@keyframes flowing-gradient': {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 0%' }
        },
        '@keyframes pulse-border': {
          '0%': { opacity: 0.6 },
          '50%': { opacity: 1 },
          '100%': { opacity: 0.6 }
        }
      }}
    >
      {/* Brand Title with Enhanced Icon */}
      <Box display="flex" alignItems="center" ml={1}>
        
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 52,
            height: 52,
            borderRadius: "16px",
            background: `linear-gradient(135deg, ${colors.greenAccent[500]} 0%, ${colors.blueAccent[500]} 100%)`,
            boxShadow: `0 8px 32px ${alpha(colors.greenAccent[500], 0.5)}, 0 0 0 2px ${alpha(colors.greenAccent[500], 0.2)}`,
            mr: 2,
            position: "relative",
            overflow: "hidden",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            "&:hover": {
              transform: "scale(1.08) rotate(3deg)",
              boxShadow: `0 15px 35px ${alpha(colors.greenAccent[500], 0.6)}, 0 0 0 3px ${alpha(colors.greenAccent[500], 0.3)}`
            },
            "&::before": {
              content: '""',
              position: "absolute",
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              background: `linear-gradient(270deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]}, ${colors.greenAccent[500]})`,
              backgroundSize: "400% 400%",
              animation: "rotating-border 3s ease infinite",
              borderRadius: "22px",
              zIndex: -2
            },
            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(135deg, transparent 0%, ${alpha("#fff", 0.3)} 50%, transparent 100%)`,
              animation: "shimmer 2s infinite",
              zIndex: -1
            },
            "@keyframes rotating-border": {
              "0%": { backgroundPosition: "0% 50%" },
              "50%": { backgroundPosition: "100% 50%" },
              "100%": { backgroundPosition: "0% 50%" }
            },
            "@keyframes shimmer": {
              "0%": { transform: "translateX(-100%)" },
              "100%": { transform: "translateX(100%)" }
            }
          }}
        >
          <SecurityIcon sx={{ 
            color: "#fff", 
            fontSize: 36,
            filter: `drop-shadow(0 0 8px ${alpha(colors.greenAccent[500], 0.8)})`,
            animation: "pulse-icon 2s infinite ease-in-out"
          }} />
          <style jsx global>{`
            @keyframes pulse-icon {
              0% { transform: scale(1); filter: brightness(1); }
              50% { transform: scale(1.1); filter: brightness(1.2); }
              100% { transform: scale(1); filter: brightness(1); }
            }
          `}</style>
        </Box>
        <Typography
          variant="h4"
          fontFamily="'Poppins', sans-serif"
          fontWeight="800"
          sx={{
            position: "relative",
            background: theme.palette.mode === "dark"
              ? `linear-gradient(90deg, ${colors.greenAccent[400]} 0%, ${colors.blueAccent[300]} 50%, ${colors.greenAccent[400]} 100%)`
              : `linear-gradient(90deg, ${colors.greenAccent[600]} 0%, ${colors.blueAccent[400]} 50%, ${colors.greenAccent[600]} 100%)`,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "1.5px",
            fontSize: "1.8rem",
            mt: 0.5,
            animation: "shine 3s linear infinite",
            textShadow: `0 0 15px ${alpha(colors.greenAccent[500], 0.4)}`,
            transform: "translateZ(0)",
            "&::after": {
              content: "''",
              position: "absolute",
              bottom: -4,
              left: 0,
              width: "80%",
              height: "3px",
              background: `linear-gradient(90deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]}, transparent)`,
              opacity: 0.8,
              borderRadius: "3px"
            },
            "&::before": {
              content: "''",
              position: "absolute",
              top: -2,
              left: 0,
              width: "40%",
              height: "2px",
              background: `linear-gradient(90deg, ${colors.blueAccent[500]}, transparent)`,
              opacity: 0.6,
              borderRadius: "3px"
            },
            "@keyframes shine": {
              "0%": { backgroundPosition: "0% center" },
              "100%": { backgroundPosition: "200% center" }
            }
          }}
        >
          FRAUD DETECTION SYSTEM
        </Typography>
      </Box>

      {/* Enhanced Quick Access Buttons */}
      <Box 
        display="flex" 
        alignItems="center" 
        gap={1.5} 
        sx={{ 
          position: "absolute", 
          left: "50%", 
          transform: "translateX(-50%)",
          zIndex: 10
        }}>
        
        <Tooltip title="Analytics Dashboard" arrow TransitionComponent={Zoom}>
          <Button
            variant="text"
            startIcon={<BarChartIcon />}
            sx={{
              borderRadius: "16px",
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "none",
              color: theme.palette.text.primary,
              px: 1.5,
              py: 0.8,
              background: `linear-gradient(135deg, ${alpha(colors.blueAccent[500], 0.05)} 0%, ${alpha(colors.blueAccent[700], 0.1)} 100%)`,
              backdropFilter: "blur(8px)",
              border: `1px solid ${alpha(colors.blueAccent[500], 0.1)}`,
              position: "relative",
              overflow: "hidden",
              "&::after": {
                content: "''",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `linear-gradient(135deg, transparent, ${alpha(colors.blueAccent[500], 0.1)}, transparent)`,
                transform: "translateX(-100%)",
                transition: "transform 0.5s ease"
              },
              "&:hover": {
                backgroundColor: alpha(colors.blueAccent[500], 0.1),
                color: colors.blueAccent[500],
                transform: "translateY(-2px)",
                boxShadow: `0 4px 12px ${alpha(colors.blueAccent[500], 0.2)}`,
                "&::after": {
                  transform: "translateX(100%)"
                }
              },
              transition: "all 0.3s ease"
            }}
          >
            Analytics
          </Button>
        </Tooltip>
        
        <Tooltip title="Reports Dashboard" arrow TransitionComponent={Zoom}>
          <Button
            variant="text"
            startIcon={<AssessmentIcon />}
            sx={{
              borderRadius: "16px",
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "none",
              color: theme.palette.text.primary,
              px: 1.5,
              py: 0.8,
              background: `linear-gradient(135deg, ${alpha(colors.yellowAccent[500], 0.05)} 0%, ${alpha(colors.yellowAccent[700], 0.1)} 100%)`,
              backdropFilter: "blur(8px)",
              border: `1px solid ${alpha(colors.yellowAccent[500], 0.1)}`,
              position: "relative",
              overflow: "hidden",
              "&::after": {
                content: "''",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `linear-gradient(135deg, transparent, ${alpha(colors.yellowAccent[500], 0.1)}, transparent)`,
                transform: "translateX(-100%)",
                transition: "transform 0.5s ease"
              },
              "&:hover": {
                backgroundColor: alpha(colors.yellowAccent[500], 0.1),
                color: colors.yellowAccent[500],
                transform: "translateY(-2px)",
                boxShadow: `0 4px 12px ${alpha(colors.yellowAccent[500], 0.2)}`,
                "&::after": {
                  transform: "translateX(100%)"
                }
              },
              transition: "all 0.3s ease"
            }}
          >
            Reports
          </Button>
        </Tooltip>
        
        <Tooltip title="Risk Management" arrow TransitionComponent={Zoom}>
          <Button
            variant="text"
            startIcon={<GavelIcon />}
            sx={{
              borderRadius: "16px",
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "none",
              color: theme.palette.text.primary,
              px: 1.5,
              py: 0.8,
              background: `linear-gradient(135deg, ${alpha(colors.redAccent[500], 0.05)} 0%, ${alpha(colors.redAccent[700], 0.1)} 100%)`,
              backdropFilter: "blur(8px)",
              border: `1px solid ${alpha(colors.redAccent[500], 0.1)}`,
              position: "relative",
              overflow: "hidden",
              "&::after": {
                content: "''",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `linear-gradient(135deg, transparent, ${alpha(colors.redAccent[500], 0.1)}, transparent)`,
                transform: "translateX(-100%)",
                transition: "transform 0.5s ease"
              },
              "&:hover": {
                backgroundColor: alpha(colors.redAccent[500], 0.1),
                color: colors.redAccent[500],
                transform: "translateY(-2px)",
                boxShadow: `0 4px 12px ${alpha(colors.redAccent[500], 0.2)}`,
                "&::after": {
                  transform: "translateX(100%)"
                }
              },
              transition: "all 0.3s ease"
            }}
          >
            Risk
          </Button>
        </Tooltip>

        <Tooltip title="Performance Metrics" arrow TransitionComponent={Zoom}>
          <Button
            variant="text"
            startIcon={<AutoGraphIcon />}
            sx={{
              borderRadius: "16px",
              fontSize: "0.8rem",
              fontWeight: 600,
              textTransform: "none",
              color: theme.palette.text.primary,
              px: 1.5,
              py: 0.8,
              background: `linear-gradient(135deg, ${alpha(colors.greenAccent[500], 0.05)} 0%, ${alpha(colors.greenAccent[700], 0.1)} 100%)`,
              backdropFilter: "blur(8px)",
              border: `1px solid ${alpha(colors.greenAccent[500], 0.1)}`,
              position: "relative",
              overflow: "hidden",
              "&::after": {
                content: "''",
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `linear-gradient(135deg, transparent, ${alpha(colors.greenAccent[500], 0.1)}, transparent)`,
                transform: "translateX(-100%)",
                transition: "transform 0.5s ease"
              },
              "&:hover": {
                backgroundColor: alpha(colors.greenAccent[500], 0.1),
                color: colors.greenAccent[500],
                transform: "translateY(-2px)",
                boxShadow: `0 4px 12px ${alpha(colors.greenAccent[500], 0.2)}`,
                "&::after": {
                  transform: "translateX(100%)"
                }
              },
              transition: "all 0.3s ease"
            }}
          >
            Metrics
          </Button>
        </Tooltip>
      </Box>

      {/* Icons with Enhanced Visuals */}
      <Box 
        display="flex" 
        alignItems="center" 
        gap={1.5}
        mr={1}
        sx={{
          background: alpha(theme.palette.background.paper, 0.1),
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          padding: "6px 12px",
          border: `1px solid ${alpha(colors.grey[500], 0.1)}`,
          boxShadow: `0 8px 32px ${alpha(colors.primary[900], 0.15)}`,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${alpha("#fff", 0.2)}, transparent)`,
            zIndex: 1
          }
        }}>
        <Tooltip title="Help" arrow TransitionComponent={Zoom}>
          <IconButton
            sx={{
              borderRadius: "14px",
              transition: "all 0.3s ease",
              background: `linear-gradient(135deg, ${alpha(colors.blueAccent[500], 0.1)} 0%, ${alpha(colors.blueAccent[700], 0.2)} 100%)`,
              backdropFilter: "blur(8px)",
              padding: "8px",
              border: `1px solid ${alpha(colors.blueAccent[500], 0.2)}`,
              "&:hover": {
                backgroundColor: alpha(colors.blueAccent[500], 0.15),
                transform: "translateY(-3px) scale(1.05)",
                boxShadow: `0 6px 15px ${alpha(colors.blueAccent[500], 0.25)}`
              }
            }}
          >
            <HelpOutlineIcon sx={{ 
              fontSize: "1.1rem", 
              color: colors.blueAccent[400],
              filter: `drop-shadow(0 0 2px ${alpha(colors.blueAccent[400], 0.5)})`
            }} />
          </IconButton>
        </Tooltip>
        
        <Tooltip title={theme.palette.mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"} arrow TransitionComponent={Zoom}>
          <IconButton 
            onClick={colorMode.toggleColorMode}
            sx={{
              borderRadius: "14px",
              transition: "all 0.3s ease",
              background: theme.palette.mode === "dark"
                ? `linear-gradient(135deg, ${alpha(colors.yellowAccent[500], 0.1)} 0%, ${alpha(colors.yellowAccent[700], 0.2)} 100%)`
                : `linear-gradient(135deg, ${alpha(colors.blueAccent[500], 0.1)} 0%, ${alpha(colors.blueAccent[700], 0.2)} 100%)`,
              backdropFilter: "blur(8px)",
              padding: "8px",
              border: `1px solid ${alpha(
                theme.palette.mode === "dark" ? colors.yellowAccent[500] : colors.blueAccent[500], 
                0.2
              )}`,
              "&:hover": {
                backgroundColor: theme.palette.mode === "dark" 
                  ? alpha(colors.yellowAccent[500], 0.15)
                  : alpha(colors.blueAccent[500], 0.15),
                transform: "rotate(30deg) translateY(-3px)",
                boxShadow: `0 6px 15px ${alpha(
                  theme.palette.mode === "dark" ? colors.yellowAccent[500] : colors.blueAccent[500], 
                  0.25
                )}`
              }
            }}
          >
            {theme.palette.mode === "dark" ? (
              <LightModeOutlinedIcon sx={{ 
                color: colors.yellowAccent[500],
                filter: `drop-shadow(0 0 2px ${alpha(colors.yellowAccent[500], 0.5)})` 
              }} />
            ) : (
              <DarkModeOutlinedIcon sx={{ 
                color: colors.blueAccent[500],
                filter: `drop-shadow(0 0 2px ${alpha(colors.blueAccent[500], 0.5)})` 
              }} />
            )}
          </IconButton>
        </Tooltip>

        {/* Notifications with Badge */}
        <Tooltip title="Notifications" arrow TransitionComponent={Zoom}>
          <IconButton 
            onClick={handleNotificationsOpen}
            sx={{
              borderRadius: "14px",
              transition: "all 0.3s ease",
              background: unreadCount > 0
                ? `linear-gradient(135deg, ${alpha(colors.redAccent[500], 0.1)} 0%, ${alpha(colors.redAccent[700], 0.2)} 100%)`
                : `linear-gradient(135deg, ${alpha(colors.grey[500], 0.1)} 0%, ${alpha(colors.grey[700], 0.15)} 100%)`,
              backdropFilter: "blur(8px)",
              padding: "8px",
              border: `1px solid ${alpha(
                unreadCount > 0 ? colors.redAccent[500] : colors.grey[500], 
                0.2
              )}`,
              "&:hover": {
                backgroundColor: unreadCount > 0 
                  ? alpha(colors.redAccent[500], 0.15)
                  : alpha(colors.grey[500], 0.15),
                transform: "translateY(-3px) scale(1.05)",
                boxShadow: `0 6px 15px ${alpha(
                  unreadCount > 0 ? colors.redAccent[500] : colors.primary[900], 
                  0.25
                )}`
              }
            }}
          >
            <Badge 
              badgeContent={unreadCount} 
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: colors.redAccent[500],
                  boxShadow: `0 0 0 2px ${theme.palette.background.paper}, 0 0 0 4px ${alpha(colors.redAccent[500], 0.3)}`,
                  animation: unreadCount > 0 ? "pulse-badge 2s infinite" : "none",
                  fontWeight: "bold",
                  minWidth: "18px",
                  height: "18px",
                  "@keyframes pulse-badge": {
                    "0%": { 
                      transform: "scale(1)",
                      boxShadow: `0 0 0 0 ${alpha(colors.redAccent[500], 0.7)}`
                    },
                    "70%": { 
                      transform: "scale(1.2)",
                      boxShadow: `0 0 0 6px ${alpha(colors.redAccent[500], 0)}`
                    },
                    "100%": { 
                      transform: "scale(1)",
                      boxShadow: `0 0 0 0 ${alpha(colors.redAccent[500], 0)}`
                    }
                  }
                }
              }}
            >
              {unreadCount > 0 ? (
                <NotificationsActiveIcon sx={{ 
                  color: colors.redAccent[500], 
                  fontSize: "1.1rem",
                  filter: `drop-shadow(0 0 2px ${alpha(colors.redAccent[500], 0.5)})`,
                  animation: "vibrate 0.5s ease infinite"
                }} />
              ) : (
                <NotificationsOutlinedIcon sx={{ 
                  fontSize: "1.1rem",
                  color: theme.palette.text.secondary
                }} />
              )}
              <style jsx global>{`
                @keyframes vibrate {
                  0% { transform: rotate(-5deg); }
                  50% { transform: rotate(5deg); }
                  100% { transform: rotate(-5deg); }
                }
              `}</style>
            </Badge>
          </IconButton>
        </Tooltip>
        
        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={notificationsOpen}
          onClose={handleNotificationsClose}
          TransitionComponent={Fade}
          PaperProps={{
            elevation: 6,
            sx: {
              mt: 1.5,
              overflow: 'visible',
              borderRadius: 3,
              width: 320,
              boxShadow: `0 10px 40px ${alpha(colors.primary[900], 0.25)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: "blur(16px)",
              border: `1px solid ${alpha(colors.grey[500], 0.2)}`,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: `linear-gradient(90deg, ${colors.redAccent[500]}, ${colors.blueAccent[500]})`,
                zIndex: 1
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: alpha(theme.palette.background.paper, 0.95),
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                boxShadow: `-3px -3px 5px ${alpha(colors.primary[900], 0.1)}`,
              },
            },
          }}
        >
          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight="600">Notifications</Typography>
            <Chip 
              label={`${unreadCount} new`} 
              size="small" 
              sx={{ 
                backgroundColor: unreadCount > 0 ? alpha(colors.redAccent[500], 0.1) : alpha(colors.grey[500], 0.1),
                color: unreadCount > 0 ? colors.redAccent[500] : colors.grey[500],
                fontWeight: 600,
                fontSize: "0.7rem"
              }} 
            />
          </Box>
          <Divider />
          
          {notifications.map((notification) => (
            <MenuItem 
              key={notification.id} 
              onClick={handleNotificationsClose}
              sx={{ 
                py: 1.5,
                px: 2,
                borderLeft: notification.unread ? `4px solid ${getNotificationColor(notification.type)}` : "none",
                backgroundColor: notification.unread ? alpha(getNotificationColor(notification.type), 0.05) : "transparent",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: alpha(getNotificationColor(notification.type), 0.1)
                }
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                  <Typography variant="subtitle2" fontWeight={notification.unread ? 700 : 500}>
                    {notification.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" noWrap>
                  {notification.description}
                </Typography>
              </Box>
            </MenuItem>
          ))}
          
          <Divider />
          <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
            <Button 
              size="small" 
              sx={{ 
                textTransform: "none", 
                color: colors.blueAccent[500],
                "&:hover": {
                  backgroundColor: alpha(colors.blueAccent[500], 0.1)
                }
              }}
            >
              View all notifications
            </Button>
          </Box>
        </Menu>





        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          TransitionComponent={Fade}
          PaperProps={{
            elevation: 6,
            sx: {
              mt: 1.5,
              overflow: 'visible',
              borderRadius: 3,
              minWidth: 220,
              boxShadow: `0 10px 40px ${alpha(colors.primary[900], 0.25)}`,
              backgroundColor: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: "blur(16px)",
              border: `1px solid ${alpha(colors.grey[500], 0.2)}`,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "3px",
                background: `linear-gradient(90deg, ${colors.greenAccent[500]}, ${colors.blueAccent[500]})`,
                zIndex: 1
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: alpha(theme.palette.background.paper, 0.95),
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
                boxShadow: `-3px -3px 5px ${alpha(colors.primary[900], 0.1)}`,
              },
            },
          }}
        >
          <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Avatar 
                src="/assets/user.png"
                sx={{ 
                  width: 48, 
                  height: 48,
                  border: `2px solid ${colors.greenAccent[500]}`,
                  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
                  mr: 2
                }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight="600">John Doe</Typography>
                <Typography variant="body2" color="text.secondary">Fraud Analyst</Typography>
              </Box>
            </Box>
            <Chip 
              label="Premium Account" 
              size="small" 
              sx={{ 
                backgroundColor: alpha(colors.greenAccent[500], 0.15),
                color: colors.greenAccent[500],
                fontWeight: 600,
                fontSize: "0.75rem",
                mt: 1,
                border: `1px solid ${alpha(colors.greenAccent[500], 0.3)}`,
                boxShadow: `0 2px 8px ${alpha(colors.greenAccent[500], 0.2)}`,
                position: "relative",
                overflow: "hidden",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: `linear-gradient(90deg, transparent, ${alpha(colors.greenAccent[500], 0.2)}, transparent)`,
                  animation: "shimmer-chip 2s infinite",
                },
                "@keyframes shimmer-chip": {
                  "0%": { transform: "translateX(-100%)" },
                  "100%": { transform: "translateX(100%)" }
                }
              }} 
            />
          </Box>
          
          <Divider />
          
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <PersonOutlinedIcon fontSize="small" sx={{ color: colors.blueAccent[500] }} />
            </ListItemIcon>
            <Typography variant="body2">My Profile</Typography>
          </MenuItem>
          
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <TimelineIcon fontSize="small" sx={{ color: colors.greenAccent[500] }} />
            </ListItemIcon>
            <Typography variant="body2">My Investigations</Typography>
          </MenuItem>
          
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <SettingsOutlinedIcon fontSize="small" sx={{ color: colors.yellowAccent[500] }} />
            </ListItemIcon>
            <Typography variant="body2">Settings</Typography>
          </MenuItem>
          
          <Divider />
          
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: colors.redAccent[500] }} />
            </ListItemIcon>
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Menu>


      </Box>
    </Box>
  );
};

export default Topbar;