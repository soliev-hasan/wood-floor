import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ServiceRequestForm from "../components/ServiceRequestForm";
import { useNavigate } from "react-router-dom";
import "./Services.css";

const Services: React.FC = () => {
  const { services, getServices, loading, error } = useAuth();
  const [localError, setLocalError] = useState("");
  const [selectedService, setSelectedService] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        await getServices();
      } catch (error: any) {
        setLocalError(error.message);
      }
    };

    fetchServices();
  }, []);

  // Функция для получения полного URL изображения
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "";
    return `https://woodfloorllc.com${imagePath}`;
  };

  const handleRequestClick = (
    serviceId: string,
    serviceName: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setSelectedService({ id: serviceId, name: serviceName });
  };

  const handleCloseRequestForm = () => {
    setSelectedService(null);
  };

  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  if (error || localError) {
    return <div className="error-message">{error || localError}</div>;
  }

  return (
    <div className="services-container">
      <h2>Our Services</h2>
      <div className="services-grid">
        {services.map((service) => (
          <div
            key={service._id}
            className="service-card"
            onClick={() => navigate(`/services/${service._id}`)}
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
            <button
              className="request-button"
              onClick={(e) => handleRequestClick(service._id, service.name, e)}
            >
              Get a quote
            </button>
          </div>
        ))}
      </div>

      {selectedService && (
        <ServiceRequestForm
          serviceId={selectedService.id}
          serviceName={selectedService.name}
          onClose={handleCloseRequestForm}
        />
      )}
    </div>
  );
};

export default Services;
