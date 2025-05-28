import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";

import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import Calendar from "./scenes/calendar";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const navigate = useNavigate();

  // Voice Command Setup
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.warn("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript
        .trim()
        .toLowerCase();

      console.log("Voice command detected:", transcript);

      // Map commands to routes
      if (transcript.includes("dashboard")) {
        navigate("/");
        maybeCloseSidebar();
      } else if (transcript.includes("team")) {
        navigate("/team");
        maybeCloseSidebar();
      } else if (transcript.includes("contacts")) {
        navigate("/contacts");
        maybeCloseSidebar();
      } else if (transcript.includes("invoices")) {
        navigate("/invoices");
        maybeCloseSidebar();
      } else if (transcript.includes("form")) {
        navigate("/form");
        maybeCloseSidebar();
      } else if (transcript.includes("bar")) {
        navigate("/bar");
        maybeCloseSidebar();
      } else if (transcript.includes("pie")) {
        navigate("/pie");
        maybeCloseSidebar();
      } else if (transcript.includes("line")) {
        navigate("/line");
        maybeCloseSidebar();
      } else if (transcript.includes("faq")) {
        navigate("/faq");
        maybeCloseSidebar();
      } else if (transcript.includes("calendar")) {
        navigate("/calendar");
        maybeCloseSidebar();
      } else if (transcript.includes("geography")) {
        navigate("/geography");
        maybeCloseSidebar();
      } else if (transcript.includes("open menu") || transcript.includes("show menu")) {
        setIsSidebar(true);
      } else if (transcript.includes("close menu") || transcript.includes("hide menu")) {
        setIsSidebar(false);
      } else {
        console.log("Unrecognized voice command:", transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [navigate]);

  // Helper: close sidebar on mobile if open
  const maybeCloseSidebar = () => {
    if (window.innerWidth <= 768) {
      setIsSidebar(false);
    }
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/invoices" element={<Invoices />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;