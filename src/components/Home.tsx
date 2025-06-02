import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import HeroCarousel from "./HeroCarousel";
import Review from "./Review";
import "./Home.css";
import { useAuth } from "../context/AuthContext";
import Calculator from "./Calculator";

const Home: React.FC = () => {
  const { sliders, getSliders, services } = useAuth();

  useEffect(() => {
    getSliders();
  }, []);

  return (
    <div className="home">
      <HeroCarousel slides={sliders} />
      <section className="calculator-section">
        <Calculator />
      </section>
      <section id="services" className="services">
        <h2>Our Services</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div
              key={service._id}
              className="service-card"
              style={{ cursor: "pointer" }}
            >
              {service.image && (
                <img
                  src={`https://woodfloorllc.com/api${service.image}`}
                  alt={service.name}
                  className="service-image"
                />
              )}
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="service-details">
                <span className="price">${service.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="reviews" className="reviews-section">
        <Review />
      </section>

      <section id="about" className="about">
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            Welcome to Wood Floors LLC, your trusted partner in premium wood
            flooring solutions. With 5+ years of experience in the industry, we
            specialize in delivering top-quality wood flooring installations
            that enhance the beauty and value of your space. Our dedicated team
            is committed to providing exceptional craftsmanship, personalized
            service, and durable products that stand the test of time. Whether
            you’re renovating your home or completing a commercial project, we
            are here to bring your vision to life with our expert flooring
            solutions.
          </p>
          <div className="stats">
            <div className="stat-item">
              <h3>5+</h3>
              <p>Years Experience</p>
            </div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>Projects Completed</p>
            </div>
            <div className="stat-item">
              <h3>100%</h3>
              <p>Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="cta">
        <div className="cta-content">
          <h2>Ready to Transform Your Space?</h2>
          <p>Get in touch with us for a free consultation and quote.</p>
          <Link to="/contact" className="cta-button">
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
