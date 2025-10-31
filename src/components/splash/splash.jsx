import { useState, useEffect } from "react";
import "./splash.scss";

export default function Splash({ onComplete }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showText, setShowText] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Handle the timing of text appearance and fade-out
  useEffect(() => {
    if (imageLoaded) {
      const textTimer = setTimeout(() => {
        setShowText(true);
      }, 800);

      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 2000);

      const completeTimer = setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 2800);

      return () => {
        clearTimeout(textTimer);
        clearTimeout(fadeTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [imageLoaded, onComplete]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <main className={`splash ${fadeOut ? "splash--fade-out" : ""}`}>
      <div className="splash__content">
        <img
          src="/logo.png"
          alt="Headliner Logo"
          className={`splash__logo ${
            imageLoaded ? "splash__logo--loaded" : ""
          }`}
          onLoad={handleImageLoad}
        />
        <h1
          className={`splash__title ${
            showText ? "splash__title--visible" : ""
          }`}>
          Headliner
        </h1>
      </div>
    </main>
  );
}
