import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./HeroCarousel.css";

interface Slide {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

interface HeroCarouselProps {
  slides?: Slide[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Используем слайды из props
  const activeSlides = (slides || [])
    .filter((slide) => slide.isActive)
    .sort((a, b) => a.order - b.order);

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    // Remove any leading slashes to avoid double slashes
    const cleanPath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;

    return `http://localhost:5001/${cleanPath}`;
  };
  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentSlide(index);
      setIsAutoPlaying(false);
      setTimeout(() => setIsTransitioning(false), 800);
    },
    [isTransitioning]
  );

  const goToNextSlide = useCallback(() => {
    if (isTransitioning) return;
    goToSlide((currentSlide + 1) % activeSlides.length);
  }, [currentSlide, activeSlides.length, goToSlide, isTransitioning]);

  const goToPrevSlide = useCallback(() => {
    if (isTransitioning) return;
    goToSlide((currentSlide - 1 + activeSlides.length) % activeSlides.length);
  }, [currentSlide, activeSlides.length, goToSlide, isTransitioning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying && activeSlides.length > 1 && !isTransitioning) {
      interval = setInterval(goToNextSlide, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, activeSlides.length, goToNextSlide, isTransitioning]);

  if (!activeSlides.length) {
    return null;
  }

  return (
    <div className="hero-carousel">
      <div className="carousel-container">
        {activeSlides.map((slide, index) => (
          <div
            key={slide._id}
            className={`carousel-slide ${
              index === currentSlide ? "active" : ""
            }`}
            style={{
              backgroundImage: `url(${getImageUrl(slide.imageUrl)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <img
              src={getImageUrl(slide.imageUrl)}
              className={`carousel-slide ${
                index === currentSlide ? "active" : ""
              }`}
            />
            <div className="slide-content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
              <Link to="/services" className="cta-button">
                Learn More
              </Link>
            </div>
          </div>
        ))}

        {activeSlides.length > 1 && (
          <>
            <button
              className="carousel-button prev"
              onClick={goToPrevSlide}
              aria-label="Previous slide"
            >
              &#10094;
            </button>
            <button
              className="carousel-button next"
              onClick={goToNextSlide}
              aria-label="Next slide"
            >
              &#10095;
            </button>

            <div className="carousel-indicators">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${
                    index === currentSlide ? "active" : ""
                  }`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeroCarousel;
