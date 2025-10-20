import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import Onboarding from "../components/onboarding/onboarding.jsx";
import Splash from "../components/splash/splash.jsx";

export default function Layout() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(null);

  useEffect(() => {
    const skipOnboarding = localStorage.getItem("skip_onboarding");
    if (skipOnboarding === "true") {
      setShowOnboarding(false);
    } else {
      setShowOnboarding(true);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleSkip = () => {
    setShowOnboarding(false);
    localStorage.setItem("skip_onboarding", "true");
  };

  const handleComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem("skip_onboarding", "true");
  };

  return (
    <>
      {showSplash ? (
        <Splash onComplete={handleSplashComplete} />
      ) : showOnboarding ? (
        <Onboarding onSkip={handleSkip} onComplete={handleComplete} />
      ) : (
        <Outlet />
      )}
    </>
  );
}
