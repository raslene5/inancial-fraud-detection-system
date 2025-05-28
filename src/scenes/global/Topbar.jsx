import {
  Box,
  IconButton,
  InputBase,
  useTheme,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  Button,
  Avatar,
} from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { deepPurple } from "@mui/material/colors";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // Avatar Menu Logic
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Placeholder AI search function
  const handleAISearch = () => {
    alert("AI is analyzing your query... (Connect to backend here)");
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      px={4}
      py={2}
      sx={{
        backdropFilter: "blur(12px)",
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(30,30,30,0.7)"
            : "rgba(255,255,255,0.6)",
        borderBottom: `1px solid ${colors.grey[500]}`,
        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
        borderRadius: "0 0 20px 20px",
      }}
    >
      {/* Brand Title */}
      <Typography
        variant="h4"
        fontFamily="'Merriweather', serif"
        fontWeight="600"
        color={colors.greenAccent[400]}
      >
        Fraud AI Detection Dashboard
      </Typography>

      {/* AI Search Bar */}
      <Box
        display="flex"
        alignItems="center"
        sx={{
          backgroundColor: colors.primary[400],
          borderRadius: "50px",
          px: 2,
          py: 0.5,
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease",
          width: "35%",
          "&:hover": {
            backgroundColor: colors.primary[300],
          },
        }}
      >
        <InputBase
          placeholder="Ask AI to detect trends, anomalies..."
          sx={{
            ml: 1,
            flex: 1,
            color: colors.grey[100],
            fontFamily: "'Source Sans Pro', sans-serif",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAISearch();
          }}
        />
        <IconButton onClick={handleAISearch}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* Quick Access Buttons */}
      <Box display="flex" alignItems="center" gap={1} mx={2}>
        <Button
          variant="outlined"
          size="small"
          sx={{
            borderRadius: "20px",
            fontSize: "0.8rem",
            textTransform: "none",
            borderColor: colors.greenAccent[400],
            color: colors.greenAccent[400],
            "&:hover": {
              backgroundColor: colors.greenAccent[400],
              color: theme.palette.background.default,
            },
          }}
        >
          Reports
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{
            borderRadius: "20px",
            fontSize: "0.8rem",
            textTransform: "none",
            borderColor: colors.greenAccent[400],
            color: colors.greenAccent[400],
            "&:hover": {
              backgroundColor: colors.greenAccent[400],
              color: theme.palette.background.default,
            },
          }}
        >
          Publications
        </Button>
      </Box>

      {/* Icons and Avatar */}
      <Box display="flex" alignItems="center" gap={1}>
        <Tooltip title="Toggle Theme" arrow>
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>

        <Tooltip title="Notifications" arrow>
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Settings" arrow>
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>
        </Tooltip>

        {/* Avatar with Menu */}
        <Tooltip title="Account" arrow>
          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ bgcolor: deepPurple[500], width: 32, height: 32 }}>
              S
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2,
              mt: 1,
              minWidth: 160,
            },
          }}
        >
          <MenuItem onClick={handleMenuClose}>
            <PersonOutlinedIcon sx={{ mr: 1 }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <SettingsOutlinedIcon sx={{ mr: 1 }} /> Settings
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
