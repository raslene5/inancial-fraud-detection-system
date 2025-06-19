import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography, useTheme, Avatar, Divider, alpha } from "@mui/material";
import { ProSidebar, Menu } from "react-pro-sidebar";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import HistoryIcon from "@mui/icons-material/History";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SidebarItem from "./SidebarItem";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") setSelected("Dashboard");
    else if (location.pathname === "/team") setSelected("Fraud History");
    else if (location.pathname === "/faq") setSelected("FAQ");
  }, [location.pathname]);

  return (
    <Box
      sx={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "3px",
          background: `linear-gradient(to bottom, 
            ${colors.greenAccent[500]}, 
            ${colors.blueAccent[500]}, 
            ${colors.greenAccent[500]})`,
          boxShadow: `0 0 15px ${alpha(colors.greenAccent[500], 0.7)}`,
          zIndex: 10,
          display: isCollapsed ? "none" : "block",
        },
        "& .ps-sidebar-root": {
          border: "none !important",
          height: "100%",
          background: `linear-gradient(135deg, 
            ${alpha(colors.primary[600], 0.97)} 0%, 
            ${alpha(colors.primary[500], 0.95)} 50%,
            ${alpha(colors.primary[700], 0.98)} 100%)`,
          backdropFilter: "blur(20px)",
          boxShadow: `
            5px 0 30px ${alpha(colors.primary[900], 0.5)},
            inset -1px 0 0 ${alpha(colors.grey[100], 0.1)}
          `,
          borderRadius: "0 24px 24px 0",
        },
        "& .ps-sidebar-container": {
          background: "transparent !important",
          height: "100%",
          overflow: "hidden",
        },
        "& .ps-menu-button:hover": {
          backgroundColor: "transparent !important",
        },
      }}
    >
      {/* Animated background elements */}
      {!isCollapsed && (
        <>
          <Box
            component={motion.div}
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            sx={{
              position: "absolute",
              top: "20%",
              left: "50%",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(colors.greenAccent[500], 0.15)} 0%, transparent 70%)`,
              filter: "blur(20px)",
              zIndex: 0,
              transform: "translateX(-50%)",
            }}
          />
          
          <Box
            component={motion.div}
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              delay: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            sx={{
              position: "absolute",
              bottom: "20%",
              left: "30%",
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(colors.blueAccent[500], 0.1)} 0%, transparent 70%)`,
              filter: "blur(25px)",
              zIndex: 0,
            }}
          />
        </>
      )}

      <ProSidebar collapsed={isCollapsed} width="280px" collapsedWidth="80px">
        <Menu>
          {/* Toggle Button */}
          <Box
            display="flex"
            justifyContent={isCollapsed ? "center" : "flex-end"}
            alignItems="center"
            padding={isCollapsed ? "20px 0" : "20px 15px"}
            mb={2}
          >
            <IconButton 
              onClick={() => setIsCollapsed(!isCollapsed)}
              sx={{
                background: `linear-gradient(135deg, ${alpha(colors.greenAccent[500], 0.2)}, ${alpha(colors.blueAccent[500], 0.2)})`,
                backdropFilter: "blur(10px)",
                border: `1px solid ${alpha(colors.grey[100], 0.15)}`,
                boxShadow: `0 4px 15px ${alpha(colors.primary[900], 0.3)}`,
                "&:hover": {
                  background: `linear-gradient(135deg, ${alpha(colors.greenAccent[500], 0.3)}, ${alpha(colors.blueAccent[500], 0.3)})`,
                  boxShadow: `0 6px 20px ${alpha(colors.primary[900], 0.4)}`,
                }
              }}
            >
              <MenuOutlinedIcon />
            </IconButton>
          </Box>

          {/* AI ICON WITH ANIMATIONS - Only when expanded */}
          {!isCollapsed && (
            <Box display="flex" flexDirection="column" alignItems="center" mb={3} position="relative" zIndex={2}>
              {/* Container for the animated AI icon */}
              <Box 
                sx={{
                  position: "relative",
                  width: "140px",
                  height: "140px",
                  mb: 2,
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    top: "-10px",
                    left: "-10px",
                    right: "-10px",
                    bottom: "-10px",
                    borderRadius: "50%",
                    border: `1px solid ${alpha(colors.grey[100], 0.2)}`,
                    boxShadow: `0 0 20px ${alpha(colors.blueAccent[500], 0.3)}`,
                    animation: "pulse 3s infinite ease-in-out",
                  },
                  "@keyframes pulse": {
                    "0%": { opacity: 0.5, transform: "scale(0.98)" },
                    "50%": { opacity: 1, transform: "scale(1.02)" },
                    "100%": { opacity: 0.5, transform: "scale(0.98)" },
                  }
                }}
              >
                {/* Outer ring animation */}
                <Box
                  component={motion.div}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    border: `2px dashed ${alpha(colors.blueAccent[400], 0.4)}`,
                  }}
                />
                
                {/* Middle ring animation */}
                <Box
                  component={motion.div}
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  sx={{
                    position: "absolute",
                    top: "10%",
                    left: "10%",
                    width: "80%",
                    height: "80%",
                    borderRadius: "50%",
                    border: `2px dashed ${alpha(colors.greenAccent[400], 0.4)}`,
                  }}
                />
                
                {/* Inner circle with AI icon */}
                <Box
                  component={motion.div}
                  whileHover={{ scale: 1.05 }}
                  sx={{
                    position: "absolute",
                    top: "20%",
                    left: "20%",
                    width: "60%",
                    height: "60%",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${alpha(colors.blueAccent[600], 0.9)}, ${alpha(colors.blueAccent[900], 0.95)})`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `
                      0 0 30px ${alpha(colors.blueAccent[500], 0.6)},
                      inset 0 0 15px ${alpha(colors.blueAccent[300], 0.5)}
                    `,
                    border: `2px solid ${alpha(colors.grey[100], 0.2)}`,
                    zIndex: 2,
                  }}
                >
                  <SmartToyIcon 
                    sx={{ 
                      fontSize: 40, 
                      color: colors.grey[100],
                      filter: `drop-shadow(0 0 8px ${alpha(colors.blueAccent[400], 0.8)})`,
                    }} 
                  />
                </Box>
                
                {/* Orbiting elements */}
                <Box
                  component={motion.div}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "10%",
                      left: "50%",
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      background: colors.greenAccent[500],
                      boxShadow: `0 0 15px ${alpha(colors.greenAccent[500], 0.7)}`,
                      transform: "translateX(-50%)",
                    }}
                  />
                </Box>
                
                <Box
                  component={motion.div}
                  animate={{
                    rotate: -360,
                  }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "80%",
                      left: "30%",
                      width: "15px",
                      height: "15px",
                      borderRadius: "50%",
                      background: colors.redAccent[500],
                      boxShadow: `0 0 15px ${alpha(colors.redAccent[500], 0.7)}`,
                    }}
                  />
                </Box>
              </Box>
              
              <Typography 
                variant="h5" 
                color={colors.grey[100]} 
                fontWeight="bold"
                sx={{
                  textShadow: `0 2px 10px ${alpha(colors.primary[900], 0.7)}`,
                  letterSpacing: "0.5px",
                }}
              >
                AI Fraud Detection
              </Typography>
              
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mt: 1,
                  background: alpha(colors.primary[400], 0.3),
                  backdropFilter: "blur(5px)",
                  borderRadius: "20px",
                  padding: "4px 12px",
                  border: `1px solid ${alpha(colors.greenAccent[500], 0.3)}`,
                }}
              >
                <Box
                  component={motion.div}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: colors.greenAccent[500],
                    boxShadow: `0 0 10px ${alpha(colors.greenAccent[500], 0.7)}`,
                  }}
                />
                <Typography 
                  variant="body2" 
                  color={colors.greenAccent[400]}
                  sx={{ fontWeight: 500 }}
                >
                  System Active
                </Typography>
              </Box>
            </Box>
          )}

          {/* Divider - Only when expanded */}
          {!isCollapsed && (
            <Box px={3} mb={2} position="relative">
              <Divider 
                sx={{ 
                  borderColor: alpha(colors.grey[100], 0.2),
                  "&::before, &::after": {
                    borderColor: alpha(colors.grey[100], 0.2),
                  },
                  "&::before": {
                    width: "40%",
                    borderImage: `linear-gradient(to right, transparent, ${alpha(colors.greenAccent[500], 0.5)}) 1`,
                  },
                  "&::after": {
                    width: "40%",
                    borderImage: `linear-gradient(to left, transparent, ${alpha(colors.blueAccent[500], 0.5)}) 1`,
                  },
                }} 
              />
            </Box>
          )}

          {/* Menu Items */}
          <Box 
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: isCollapsed ? "center" : "stretch",
              px: isCollapsed ? 1 : 3,
              "& > a": {  // Target SidebarItem Link components
                width: isCollapsed ? "60px" : "auto",
                justifyContent: isCollapsed ? "center" : "flex-start",
              }
            }}
          >
            <SidebarItem
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
            />
            
            <SidebarItem
              title="Fraud History"
              to="/team"
              icon={<HistoryIcon />}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
              isHot={true}
            />
            
            <SidebarItem
              title="FAQ"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isCollapsed={isCollapsed}
            />
          </Box>
          
          {/* Version info - Only when expanded */}
          {!isCollapsed && (
            <Box 
              sx={{ 
                position: "absolute", 
                bottom: 20, 
                width: "100%", 
                textAlign: "center",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: "-20px",
                  left: "25%",
                  right: "25%",
                  height: "1px",
                  background: `linear-gradient(to right, 
                    transparent, 
                    ${alpha(colors.grey[100], 0.2)}, 
                    transparent)`,
                }
              }}
            >
              <Typography 
                variant="caption" 
                color={alpha(colors.grey[100], 0.6)}
                sx={{
                  background: alpha(colors.primary[400], 0.3),
                  backdropFilter: "blur(5px)",
                  borderRadius: "10px",
                  padding: "2px 10px",
                  border: `1px solid ${alpha(colors.grey[100], 0.1)}`,
                }}
              >
                FFDS v2.1.0
              </Typography>
            </Box>
          )}
        </Menu>
      </ProSidebar>

      {/* Top and bottom edge accents - Only when expanded */}
      {!isCollapsed && (
        <>
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "30%",
              height: "3px",
              background: colors.greenAccent[500],
              boxShadow: `0 0 10px ${alpha(colors.greenAccent[500], 0.7)}`,
              zIndex: 10,
              borderRadius: "0 0 0 3px",
            }}
          />
          
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "30%",
              height: "3px",
              background: colors.blueAccent[500],
              boxShadow: `0 0 10px ${alpha(colors.blueAccent[500], 0.7)}`,
              zIndex: 10,
              borderRadius: "3px 0 0 0",
            }}
          />
        </>
      )}
    </Box>
  );
};

export default Sidebar;