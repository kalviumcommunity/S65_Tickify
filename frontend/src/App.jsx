import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/HomePage/LandingPage";
import ChecklistPage from "./components/ChecklistPage/ChecklistPage";
import HighPriorityPage from "./components/PriorityLabels/HighPriorityPage";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
    localStorage.setItem("darkMode", !isDarkMode);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />}
      />
      <Route
        path="/checklist"
        element={<ChecklistPage isDarkMode={isDarkMode} />}
      />
      <Route 
      path="/high-priority" 
      element={<HighPriorityPage isDarkMode={isDarkMode}/>} /> 
    </Routes>
  );
}

export default App;