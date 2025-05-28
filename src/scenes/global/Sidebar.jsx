import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  Box,
  Typography,
  useTheme,
  Tooltip,
  Avatar,
  Divider,
  Fade,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import {
  HomeOutlined,
  PeopleOutlined,
  ContactsOutlined,
  ReceiptOutlined,
  PersonOutlined,
  CalendarTodayOutlined,
  HelpOutlineOutlined,
  BarChartOutlined,
  PieChartOutlineOutlined,
  TimelineOutlined,
  MenuOutlined,
  MapOutlined,
  Mic,
  MicOff,
  SettingsOutlined,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const SidebarItem = ({ title, to, icon, selected, setSelected, isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Tooltip
      title={isCollapsed ? title : ""}
      arrow
      placement="right"
      TransitionComponent={Fade}
      enterDelay={300}
    >
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[100],
          fontWeight: selected === title ? "700" : "400",
          transition: "color 0.3s ease",
          borderRadius: 10,
          paddingLeft: isCollapsed ? 16 : 22,
          paddingRight: isCollapsed ? 16 : 28,
        }}
        onClick={() => setSelected(title)}
        icon={icon}
        tabIndex={0}
        onKeyDown={(e) => {
          if (["Enter", " "].includes(e.key)) {
            setSelected(title);
            e.preventDefault();
          }
        }}
        aria-current={selected === title ? "page" : undefined}
      >
        {!isCollapsed && (
          <Typography
            variant="body1"
            sx={{ fontFamily: "Poppins, sans-serif", userSelect: "none" }}
          >
            {title}
          </Typography>
        )}
        <Link to={to} />
      </MenuItem>
    </Tooltip>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // States
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const [micOn, setMicOn] = useState(false);

  // Sidebar width animation variants
  const sidebarVariants = {
    expanded: { width: 280, transition: { duration: 0.4, ease: "easeInOut" } },
    collapsed: { width: 80, transition: { duration: 0.4, ease: "easeInOut" } },
  };

  // Accessible toggle for mic
  const toggleMic = () => setMicOn((prev) => !prev);

  return (
    <Box
      sx={{
        height: "100vh",
        boxShadow: 4,
        borderRight: `2px solid ${colors.primary[300]}`,
        background: colors.primary[400],
        display: "flex",
        flexDirection: "column",
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          transition: "all 0.4s ease-in-out",
          boxShadow: "0 0 20px rgba(0,0,0,0.18)",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "8px 28px 8px 22px !important",
          borderRadius: "10px",
          transition: "background-color 0.3s ease, color 0.3s ease",
          userSelect: "none",
        },
        "& .pro-inner-item:hover": {
          color: colors.greenAccent[400],
          backgroundColor: `${colors.primary[500]}33`,
          outline: `2px solid ${colors.greenAccent[400]}`,
          outlineOffset: "2px",
        },
        "& .pro-menu-item.active": {
          color: colors.greenAccent[500],
          backgroundColor: `${colors.primary[600]}55`,
          fontWeight: "700",
          boxShadow: `inset 4px 0 0 0 ${colors.greenAccent[500]}`,
        },
        "& .pro-inner-item:focus-visible": {
          outline: `3px solid ${colors.greenAccent[300]}`,
          outlineOffset: "3px",
          backgroundColor: `${colors.primary[500]}44`,
        },
      }}
      role="complementary"
      aria-label="Sidebar navigation"
    >
      <motion.div
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        style={{ height: "100%" }}
      >
        <ProSidebar collapsed={isCollapsed} breakPoint="md">
          <Menu iconShape="square" aria-label="Main navigation menu">
            {/* Header with two icons + centered title */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 1.5,
                py: 1,
                mb: 2,
              }}
            >
              {/* Left toggle button */}
              <IconButton
                onClick={() => setIsCollapsed(!isCollapsed)}
                size="large"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-expanded={!isCollapsed}
                tabIndex={0}
                sx={{
                  color: colors.grey[100],
                  transition: "color 0.3s ease",
                  "&:hover": { color: colors.greenAccent[400] },
                  outline: "none",
                }}
                onKeyDown={(e) => {
                  if (["Enter", " "].includes(e.key)) {
                    setIsCollapsed(!isCollapsed);
                    e.preventDefault();
                  }
                }}
              >
                <MenuOutlined />
              </IconButton>

              {/* Title centered */}
              {!isCollapsed && (
                <Typography
                  variant="h5"
                  noWrap
                  component="div"
                  sx={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: "bold",
                    color: colors.grey[100],
                    userSelect: "none",
                    textAlign: "center",
                    flexGrow: 1,
                    mx: 2,
                    letterSpacing: 0.7,
                    whiteSpace: "nowrap",
                  }}
                >
                  Financial Fraud Detection Pro
                </Typography>
              )}

              {/* Right additional button: mic toggle */}
              <Tooltip
                title={micOn ? "Turn microphone off" : "Turn microphone on"}
                arrow
                placement="right"
                TransitionComponent={Fade}
                enterDelay={300}
              >
                <IconButton
                  onClick={toggleMic}
                  size="large"
                  aria-pressed={micOn}
                  aria-label={micOn ? "Microphone on" : "Microphone off"}
                  sx={{
                    color: micOn ? colors.greenAccent[400] : colors.grey[400],
                    transition: "color 0.3s ease",
                    "&:hover": {
                      color: micOn
                        ? colors.greenAccent[500]
                        : colors.grey[600],
                    },
                    outline: "none",
                  }}
                >
                  {micOn ? <Mic /> : <MicOff />}
                </IconButton>
              </Tooltip>
            </Box>

            {/* User Profile */}
            {!isCollapsed && (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mb={3}
                aria-label="User profile information"
                tabIndex={-1}
              >
                <Avatar
                  alt="User Profile"
                  src={`../../assets/user.jpg`}
                  sx={{
                    width: 90,
                    height: 90,
                    mb: 1,
                    border: `3px solid ${colors.greenAccent[500]}`,
                    boxShadow: `0 0 15px ${colors.greenAccent[300]}`,
                    userSelect: "none",
                  }}
                />
                <Typography
                  variant="h5"
                  color={colors.grey[100]}
                  sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                  tabIndex={0}
                >
                  John Doe
                </Typography>
                <Typography
                  variant="body2"
                  color={colors.greenAccent[500]}
                  sx={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Fraud Analyst
                </Typography>
              </Box>
            )}

            <Divider
              sx={{
                borderColor: colors.greenAccent[500],
                mb: 2,
                mx: isCollapsed ? "auto" : 2.5,
              }}
            />

            {/* Navigation Sections */}
            <Box
              role="menu"
              aria-label="Sidebar navigation links"
              flexGrow={1}
              sx={{ overflowY: "auto" }}
            >
              <SidebarItem
                title="Dashboard"
                to="/"
                icon={<HomeOutlined />}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
              />
              <Typography
                variant="subtitle2"
                color={colors.greenAccent[300]}
                sx={{ m: "15px 0 5px 20px", fontFamily: "Poppins, sans-serif" }}
              >
                Data
              </Typography>
              <SidebarItem
                title="Manage Team"
                to="/team"
                icon={<PeopleOutlined />}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                title="Contacts Information"
                to="/contacts"
                icon={<ContactsOutlined />}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                title="Invoices Balances"
                to="/invoices"
                icon={<ReceiptOutlined />}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
              />
              <Typography
                variant="subtitle2"
                color={colors.greenAccent[300]}
                sx={{ m: "15px 0 5px 20px", fontFamily: "Poppins, sans-serif" }}
              >
                Pages
              </Typography>
              <SidebarItem
                title="Profile Form"
                to="/form"
                icon={<PersonOutlined />}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                title="Calendar"
                to="/calendar"
                icon={<CalendarTodayOutlined />}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                title="FAQ Page"
                to="/faq"
                icon={<HelpOutlineOutlined />}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
              />
              <Typography
                variant="subtitle2"
                color={colors.greenAccent[300]}
                sx={{ m: "15px 0 5px 20px", fontFamily: "Poppins, sans-serif" }}
              >
                Charts
              </Typography>
              <SidebarItem
                title="Bar Chart"
                to="/bar"
                icon={<BarChartOutlined />}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                title="Pie Chart"
                to="/pie"
                icon={<PieChartOutlineOutlined />}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                title="Line Chart"
                to="/line"
                icon={<TimelineOutlined />}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                title="Geography Chart"
                to="/geography"
                icon={<MapOutlined />}
                selected={selected}
                setSelected={setSelected}
                isCollapsed={isCollapsed}
              />
            </Box>

            {/* Bottom Settings */}
            <Box
              sx={{
                borderTop: `1px solid ${colors.greenAccent[300]}`,
                py: 1,
                px: isCollapsed ? 1 : 2,
                display: "flex",
                justifyContent: isCollapsed ? "center" : "flex-start",
                alignItems: "center",
              }}
            >
              <Tooltip title="Settings" arrow>
                <IconButton
                  aria-label="Settings"
                  sx={{
                    color: colors.grey[100],
                    "&:hover": { color: colors.greenAccent[400] },
                    outline: "none",
                  }}
                >
                  <SettingsOutlined />
                </IconButton>
              </Tooltip>
              {!isCollapsed && (
                <Typography
                  sx={{
                    ml: 1,
                    fontFamily: "Poppins, sans-serif",
                    color: colors.grey[100],
                    userSelect: "none",
                  }}
                  tabIndex={-1}
                >
                  Settings
                </Typography>
              )}
            </Box>
          </Menu>
        </ProSidebar>
      </motion.div>
    </Box>
  );
};

export default Sidebar;
