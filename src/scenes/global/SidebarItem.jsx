import React from "react";
import { Box, Typography, useTheme, Badge, alpha } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";

const SidebarItem = ({
  title,
  to,
  icon,
  selected,
  setSelected,
  isCollapsed,
  isHot,
  isNew,
  badge
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isActive = selected === title;

  // Badge handling
  const badgeLabel = isNew ? "NEW" : isHot ? "HOT" : badge;
  const showBadge = badge || isNew || isHot;
  const badgeColor = isNew ? "success" : isHot ? "error" : "error";

  return (
    <Box
      component={Link}
      to={to}
      onClick={() => setSelected(title)}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: isCollapsed ? "center" : "flex-start",
        width: "100%",
        padding: isCollapsed ? "12px 0" : "10px 15px",
        color: isActive ? colors.greenAccent[500] : colors.grey[100],
        backgroundColor: isActive 
          ? alpha(colors.primary[600], 0.6)
          : "transparent",
        borderRadius: "10px",
        textDecoration: "none",
        transition: "all 0.3s ease",
        margin: "5px 0",
        "&:hover": {
          backgroundColor: alpha(colors.primary[600], 0.4),
          transform: isCollapsed ? "translateY(-3px)" : "translateX(5px)",
        }
      }}
    >
      {/* Icon */}
      <Box 
        sx={{ 
          position: "relative",
          mr: isCollapsed ? 0 : 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon}
        
        {/* Badge */}
        {showBadge && (
          <Badge
            badgeContent={badgeLabel}
            color={badgeColor}
            sx={{
              position: "absolute",
              top: -5,
              right: -5,
              "& .MuiBadge-badge": {
                fontSize: "0.6rem",
                height: 16,
                minWidth: 16,
                fontWeight: "bold",
              },
            }}
          />
        )}
      </Box>
      
      {/* Title */}
      {!isCollapsed && (
        <Typography
          variant="body1"
          sx={{
            fontWeight: isActive ? 600 : 400,
            fontSize: "0.9rem",
          }}
        >
          {title}
        </Typography>
      )}
    </Box>
  );
};

export default SidebarItem;