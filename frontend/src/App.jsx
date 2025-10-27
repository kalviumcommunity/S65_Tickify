import { useState, useEffect, createContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./components/HomePage/LandingPage";
import ChecklistPage from "./components/ChecklistPage/ChecklistPage";
import HighPriorityPage from "./components/PriorityLabels/HighPriorityPage";
import Signin from "./components/SignIn & SignUp/SignIn";
import Signup from "./components/SignIn & SignUp/SignUp";
import { Toaster } from "react-hot-toast";
import Settings from "./components/HomePage/Settings";
import Profile from "./components/HomePage/Profile";
import About from "./components/About";

// Create auth context to share user state across components
export const AuthContext = createContext();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  // Enhanced auth state with userId to detect user changes
  const [authState, setAuthState] = useState(() => {
    return {
      isAuthenticated: localStorage.getItem("isLoggedIn") === "true",
      userId: localStorage.getItem("userId") || null,
      userEmail: localStorage.getItem("userEmail") || null,
    };
  });

  // ⭐ NEW: Search state for filtering tasks
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  // Update body class when dark mode changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Handle signup success with all user data
  const handleSignupSuccess = (userId, userEmail) => {
    console.log("[App] Signup successful", userId);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", userId);
    localStorage.setItem("userEmail", userEmail);

    setAuthState({
      isAuthenticated: true,
      userId: userId,
      userEmail: userEmail,
    });

    navigate("/");
  };

  // Handle signin success with all user data
  const handleSigninSuccess = (userId, userEmail) => {
    console.log("[App] Signin successful", userId);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userId", userId);
    localStorage.setItem("userEmail", userEmail);

    setAuthState({
      isAuthenticated: true,
      userId: userId,
      userEmail: userEmail,
    });

    navigate("/");
  };

  // Handle sign out with complete state reset
  const handleSignOut = () => {
    console.log("[App] Signing out user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");

    setAuthState({
      isAuthenticated: false,
      userId: null,
      userEmail: null,
    });

    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              isAuthenticated={authState.isAuthenticated}
              onSignOut={handleSignOut}
              searchQuery={searchQuery} // ⭐ NEW
              setSearchQuery={setSearchQuery} // ⭐ NEW
            />
          }
        />
        <Route
          path="/checklist"
          element={
            <ChecklistPage
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              authState={authState}
              searchQuery={searchQuery} // ⭐ NEW
              setSearchQuery={setSearchQuery} // ⭐ NEW
            />
          }
        />
        <Route
          path="/high-priority"
          element={
            <HighPriorityPage
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              authState={authState}
              searchQuery={searchQuery} // ⭐ NEW
              setSearchQuery={setSearchQuery} // ⭐ NEW
            />
          }
        />
        <Route
          path="/signin"
          element={
            <Signin
              isDarkMode={isDarkMode}
              onSigninSuccess={handleSigninSuccess}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <Signup
              isDarkMode={isDarkMode}
              onSignupSuccess={handleSignupSuccess}
            />
          }
        />

        <Route
          path="/settings"
          element={
            <Settings isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route path="/profile" element={<Profile isDarkMode={isDarkMode} />} />

        <Route path="/about" element={<About isDarkMode={isDarkMode} />} />
      </Routes>

      <Toaster />
    </AuthContext.Provider>
  );
}

export default App;
