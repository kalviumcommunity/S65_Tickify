import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import LandingPage from "./components/HomePage/LandingPage";
import ChecklistPage from "./components/ChecklistPage/ChecklistPage";
import HighPriorityPage from "./components/PriorityLabels/HighPriorityPage";
import Signin from "./components/SignIn & SignUp/SignIn";
import Signup from "./components/SignIn & SignUp/SignUp";
import SignupPopup from "./components/SignIn & SignUp/SignupPopup";
import { Toaster } from "react-hot-toast";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const [showSignupPopup, setShowSignupPopup] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  // Check authentication status on component mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    console.log("[App] Checking auth status:", isLoggedIn);

    if (isLoggedIn) {
      setIsAuthenticated(true);
      setShowSignupPopup(false);
    } else {
      setIsAuthenticated(false);
      const currentPath = window.location.pathname;
      if (currentPath !== "/signin" && currentPath !== "/signup") {
        setShowSignupPopup(true);
      }
    }
  }, []);

  // Handle signup success
  const handleSignupSuccess = () => {
    console.log("[App] Signup successful");
    localStorage.setItem("isLoggedIn", "true");
    setIsAuthenticated(true);
    setShowSignupPopup(false);
    navigate("/");
  };

  // Handle signin success
  const handleSigninSuccess = () => {
    console.log("[App] Signin successful");
    localStorage.setItem("isLoggedIn", "true");
    setIsAuthenticated(true);
    setShowSignupPopup(false);
    navigate("/");
  };

  // Handle sign out
  const handleSignOut = () => {
    console.log("[App] Signing out user");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    setIsAuthenticated(false);
    const currentPath = window.location.pathname;
    if (currentPath === "/") {
      setShowSignupPopup(true);
    }
    navigate("/");
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    useEffect(() => {
      if (!isAuthenticated) {
        console.log("[App] Access to protected route attempted. Redirecting to signin.");
        navigate("/signin");
      }
    }, [isAuthenticated, navigate]);

    return isAuthenticated ? children : null;
  };

  // Listen for route changes to manage popup visibility
  useEffect(() => {
    const handleRouteChange = () => {
      const currentPath = window.location.pathname;
      if (currentPath === "/signin" || currentPath === "/signup") {
        setShowSignupPopup(false);
      } else if (currentPath === "/" && !isAuthenticated) {
        setShowSignupPopup(true);
      }
    };

    handleRouteChange();
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, [isAuthenticated]);

  return (
    <>
      {showSignupPopup && !isAuthenticated && (
        <SignupPopup
          isDarkMode={isDarkMode}
          onClose={() => setShowSignupPopup(false)}
          onSignupSuccess={handleSignupSuccess}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              isAuthenticated={isAuthenticated}
              onSignOut={handleSignOut}
            />
          }
        />
        <Route
          path="/checklist"
          element={
            <ProtectedRoute>
              <ChecklistPage
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                isAuthenticated={isAuthenticated}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/high-priority"
          element={
            <ProtectedRoute>
              <HighPriorityPage
                isDarkMode={isDarkMode}
                toggleDarkMode={toggleDarkMode}
                isAuthenticated={isAuthenticated}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/signin"
          element={<Signin isDarkMode={isDarkMode} onSigninSuccess={handleSigninSuccess} />}
        />
        <Route
          path="/signup"
          element={<Signup isDarkMode={isDarkMode} onSignupSuccess={handleSignupSuccess} />}
        />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;