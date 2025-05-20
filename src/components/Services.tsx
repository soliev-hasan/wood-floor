import React from "react";
import { Link } from "react-router-dom";
import "./Services.css";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  features: string[];
  benefits: string[];
}

const Services: React.FC = () => {
  const services: Service[] = [
    {
      _id: "1",
      name: "Hardwood Floor Installation",
      description: "Professional installation of premium hardwood floors",
      price: 1500,
      duration: 480,
      image:
        "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?ixlib=rb-4.0.3",
      features: [
        "Solid hardwood installation",
        "Engineered wood flooring",
        "Custom patterns and designs",
        "Professional sanding and finishing",
        "Stain and seal application",
        "Quality guarantee",
      ],
      benefits: [
        "Premium quality materials",
        "Expert craftsmanship",
        "Long-lasting durability",
        "Increases property value",
      ],
    },
    {
      _id: "2",
      name: "Laminate Floor Installation",
      description: "Affordable and stylish laminate flooring solutions",
      price: 800,
      duration: 360,
      image:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3",
      features: [
        "High-quality laminate installation",
        "Underlayment installation",
        "Moisture barrier setup",
        "Professional cutting and fitting",
        "Transition strips installation",
        "Clean installation process",
      ],
      benefits: [
        "Cost-effective solution",
        "Quick installation",
        "Easy maintenance",
        "Wide style selection",
      ],
    },
    {
      _id: "3",
      name: "Vinyl Floor Installation",
      description: "Modern and durable vinyl flooring installation",
      price: 1000,
      duration: 420,
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3",
      features: [
        "Luxury vinyl plank installation",
        "Vinyl tile installation",
        "Waterproof solutions",
        "Commercial grade installation",
        "Custom patterns",
        "Professional finishing",
      ],
      benefits: [
        "Water-resistant",
        "Perfect for any room",
        "Easy to clean",
        "Durable and long-lasting",
      ],
    },
    {
      _id: "4",
      name: "Tile Floor Installation",
      description: "Expert tile flooring installation services",
      price: 1200,
      duration: 540,
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3",
      features: [
        "Ceramic tile installation",
        "Porcelain tile installation",
        "Natural stone installation",
        "Custom patterns and designs",
        "Professional grouting",
        "Sealing and finishing",
      ],
      benefits: [
        "Waterproof solution",
        "Perfect for bathrooms and kitchens",
        "Easy to maintain",
        "Long-lasting durability",
      ],
    },
  ];

  return (
    <div className="services-page">
      <h1>Our Flooring Services</h1>
      <div className="services-grid">
        {services.map((service) => (
          <div key={service._id} className="service-card">
            <img src={service.image} alt={service.name} />
            <div className="service-content">
              <h3>{service.name}</h3>
              <p className="service-description">{service.description}</p>
              <div className="service-details">
                <span>Price: ${service.price}</span>
                <span>Duration: {service.duration} min</span>
              </div>
              <div className="service-features">
                <h4>Features</h4>
                <ul>
                  {service.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="service-benefits">
                <h4>Benefits</h4>
                <ul>
                  {service.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
              <Link to="/contact" className="service-cta">
                Get a Quote
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
