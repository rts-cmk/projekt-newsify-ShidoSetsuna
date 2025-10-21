import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { useState, useEffect } from "react";

import Login from "./pages/login.jsx";
import Home from "./pages/home.jsx";
import Archive from "./pages/archive.jsx";
import Popular from "./pages/popular.jsx";
import Settings from "./pages/settings.jsx";
import ErrorPage from "./pages/error.jsx";
import Layout from "./layout/layout.jsx";
import Splash from "./components/splash/splash.jsx";
import Onboarding from "./components/onboarding/onboarding.jsx";

// Auth utility functions
const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

const hasSeenOnboarding = () => {
  return localStorage.getItem("skip_onboarding") === "true";
};

const login = () => {
  localStorage.setItem("isLoggedIn", "true");
  window.location.href = "/";
};

const logout = () => {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "/login";
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  return !isAuthenticated() ? children : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login onLogin={login} />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout onLogout={logout} />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "archive",
        element: <Archive />,
      },
      {
        path: "popular",
        element: <Popular />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Check if this is a fresh app load (not internal navigation)
    const hasShownSplashThisSession = sessionStorage.getItem("splash_shown");

    if (!hasShownSplashThisSession || !isAuthenticated()) {
      // First time this session - show splash
      setShowSplash(true);
      sessionStorage.setItem("splash_shown", "true");
    } else {
      // Already shown splash this session - skip to appropriate screen
      if (isAuthenticated() && hasSeenOnboarding()) {
        // User is logged in and has seen onboarding - go straight to app
        setAppReady(true);
      } else if (!hasSeenOnboarding()) {
        // User hasn't seen onboarding - show it
        setShowOnboarding(true);
      } else {
        // User has seen onboarding but not logged in - go to login
        setAppReady(true);
      }
    }

    // Check if user has seen onboarding
    if (!hasSeenOnboarding()) {
      setShowOnboarding(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // If user is logged in and has seen onboarding, go straight to app
    if (isAuthenticated() && hasSeenOnboarding()) {
      setAppReady(true);
    }
    // If user hasn't seen onboarding, show it next
    else if (!hasSeenOnboarding()) {
      // Onboarding will be shown
    }
    // If user has seen onboarding but not logged in, go to login
    else {
      setAppReady(true);
    }
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem("skip_onboarding", "true");
    setShowOnboarding(false);
    setAppReady(true);
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem("skip_onboarding", "true");
    setShowOnboarding(false);
    setAppReady(true);
  };

  // Show splash screen first
  if (showSplash) {
    return <Splash onComplete={handleSplashComplete} />;
  }

  // Show onboarding if user hasn't seen it
  if (showOnboarding && !hasSeenOnboarding()) {
    return (
      <Onboarding
        onSkip={handleOnboardingSkip}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  // Show the main app with routing
  if (appReady) {
    return <RouterProvider router={router} />;
  }

  // Fallback - should never reach here, but just in case
  return <RouterProvider router={router} />;
}

export default App;
