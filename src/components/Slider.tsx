import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { Slide, ApiResponse } from "../types/api";
import "./Slider.css";

const SliderComponent: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<Slide[]>>(
        "https://woodfloorllc.com/api/sliders"
      );
      setSlides(response.data.data.filter((slide) => slide.isActive));
    } catch (err) {
      setError("Error loading slides");
      console.error("Error fetching slides:", err);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  if (loading) {
    return <div className="slider-loading">Loading...</div>;
  }

  if (error) {
    return <div className="slider-error">{error}</div>;
  }

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {slides.map((slide) => (
          <div key={slide._id} className="slide">
            <div className="slide-content">
              <img src={slide.image} alt={slide.title} />
              <div className="slide-text">
                <h2>{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default SliderComponent;
