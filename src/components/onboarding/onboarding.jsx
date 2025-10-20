import { useState } from "react";
import onboardingData from "./content.json";
import "./onboarding.scss";

export default function Onboarding({ onSkip, onComplete }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = onboardingData.slides;

  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    setCurrentSlide(nextIndex);

    // If we've reached the end, call onComplete
    if (nextIndex === 0 && onComplete) {
      onComplete();
    }
  };

  // Not used
  // const prevSlide = () => {
  //   setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  // };

  const skip = () => {
    localStorage.setItem("skip_onboarding", "true");
    if (onSkip) {
      onSkip();
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <main className="onboarding">
      <section className="onboarding__content">
        <img
          src={currentSlideData.image}
          alt={`Onboarding slide ${currentSlide + 1}`}
          className="onboarding__image"
        />
        <article className="onboarding__text">
          <h1 className="onboarding__header">{currentSlideData.header}</h1>
          <p className="onboarding__description">
            {currentSlideData.description}
          </p>
        </article>
      </section>

      {/* Slide indicators */}
      <div className="onboarding__indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`onboarding__indicator ${
              index === currentSlide ? "active" : ""
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="onboarding__navigation">
        <button
          className="onboarding__nav-btn onboarding__nav-btn--prev"
          onClick={skip}
          aria-label="Previous slide">
          skip
        </button>

        <button
          className="onboarding__nav-btn onboarding__nav-btn--next"
          onClick={
            currentSlide === slides.length - 1 ? onComplete || skip : nextSlide
          }
          aria-label="Next slide">
          {currentSlide === slides.length - 1 ? "Get Started" : "Continue"}
        </button>
      </div>
    </main>
  );
}
