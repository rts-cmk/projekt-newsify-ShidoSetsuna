import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import Login from "./pages/login.jsx";
import Home from "./pages/home.jsx";
import Archive from "./pages/archive.jsx";
import Popular from "./pages/popular.jsx";
import Settings from "./pages/settings.jsx";
import Search from "./pages/search.jsx";
import ErrorPage from "./pages/error.jsx";
import Layout from "./layout/layout.jsx";
import Splash from "./components/splash/splash.jsx";
import Onboarding from "./components/onboarding/onboarding.jsx";

// Create our query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 4, // 4 minutes
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error?.message?.includes("429")) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

// Create persister using the new simple API
const persister = {
  persistClient: async (client) => {
    localStorage.setItem("nyt-query-cache", JSON.stringify(client));
  },
  restoreClient: async () => {
    const cache = localStorage.getItem("nyt-query-cache");
    return cache ? JSON.parse(cache) : undefined;
  },
  removeClient: async () => {
    localStorage.removeItem("nyt-query-cache");
  },
};

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

// Public Route Component
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
      {
        path: "search",
        element: <Search />,
      },
    ],
  },
]);

function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [appReady, setAppReady] = useState(false);

  // Initialize theme immediately on app load (IMPORTANT!!)
  useEffect(() => {
    const initializeTheme = () => {
      const saved = localStorage.getItem("theme");
      const isDark = saved
        ? saved === "dark"
        : window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.body.className = isDark ? "dark-theme" : "light-theme";
    };

    initializeTheme();
  }, []);

  useEffect(() => {
    const hasShownSplashThisSession = sessionStorage.getItem("splash_shown");

    if (!hasShownSplashThisSession || !isAuthenticated()) {
      setShowSplash(true);
      sessionStorage.setItem("splash_shown", "true");
    } else {
      if (isAuthenticated() && hasSeenOnboarding()) {
        setAppReady(true);
      } else if (!hasSeenOnboarding()) {
        setShowOnboarding(true);
      } else {
        setAppReady(true);
      }
    }

    if (!hasSeenOnboarding()) {
      setShowOnboarding(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    if (isAuthenticated() && hasSeenOnboarding()) {
      setAppReady(true);
    } else if (!hasSeenOnboarding()) {
    } else {
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
    return (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}>
        <Splash onComplete={handleSplashComplete} />
      </PersistQueryClientProvider>
    );
  }

  // Show onboarding if user hasn't seen it
  if (showOnboarding && !hasSeenOnboarding()) {
    return (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}>
        <Onboarding
          onSkip={handleOnboardingSkip}
          onComplete={handleOnboardingComplete}
        />
      </PersistQueryClientProvider>
    );
  }

  // Show the main app with routing
  if (appReady) {
    return (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}>
        <RouterProvider router={router} />
      </PersistQueryClientProvider>
    );
  }

  // Fallback (Pray we dont end up here)
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}>
      <RouterProvider router={router} />
    </PersistQueryClientProvider>
  );
}

export default App;
