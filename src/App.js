import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/fraud history";
import Bar from "./scenes/bar";
import FAQ from "./scenes/faq";
import { CssBaseline, ThemeProvider, Box } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { AnimatePresence, motion } from "framer-motion";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Set data-theme attribute for CSS selectors
  useEffect(() => {
    document.querySelector(".app").setAttribute("data-theme", theme.palette.mode);
  }, [theme.palette.mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app" style={{ display: "flex", position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
          <Box sx={{ position: "fixed", top: 0, left: 0, height: "100vh", zIndex: 1200 }}>
            <Sidebar 
              isSidebar={isSidebar} 
              isCollapsed={isSidebarCollapsed}
              setIsCollapsed={setIsSidebarCollapsed}
            />
          </Box>
          <Box
            component={motion.main}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: 1,
              marginLeft: isSidebarCollapsed ? "80px" : "280px",
              transition: { duration: 0.4, ease: "easeInOut" }
            }}
            transition={{ duration: 0.5 }}
            className="content"
            sx={{
              transition: "margin-left 0.4s ease-in-out",
              width: `calc(100% - ${isSidebarCollapsed ? '80px' : '280px'})`,
              position: "absolute",
              left: 0,
              top: 0,
              right: 0,
              bottom: 0
            }}
          >
            <Topbar setIsSidebar={setIsSidebar} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
            <Box sx={{ padding: "20px", marginTop: "70px", height: "calc(100vh - 70px)", overflowY: "auto" }}>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/bar" element={<Bar />} />
                  <Route path="/faq" element={<FAQ />} />
                  {/* New routes for enhanced sidebar */}
                  <Route path="/analytics" element={<Dashboard />} />
                  <Route path="/transactions" element={<Dashboard />} />
                  <Route path="/reports" element={<Dashboard />} />
                  <Route path="/alerts" element={<Dashboard />} />
                  <Route path="/settings" element={<Dashboard />} />
                </Routes>
              </AnimatePresence>
            </Box>
          </Box>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;