import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./ServiceDetails.css";

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image?: string;
  backgroundImage?: string;
  installationSteps?: string[];
  features?: string[];
}

const defaultSteps = [
  "Consultation and material selection",
  "Site visit and cost calculation",
  "Floor base preparation",
  "Floor covering installation",
  "Cleanup and handover",
];

const defaultFeatures = [
  "Moisture resistance",
  "Wear resistance",
  "Easy maintenance",
  "Eco-friendly",
];

const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { services, getServices } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      if (!services.length) {
        await getServices();
      }
      const found = services.find((s) => s._id === id) as Service | undefined;
      setService(found || null);
    };
    fetchService();
  }, [id, services, getServices]);

  if (!service) {
    return <div className="loading">Loading...</div>;
  }

  const backgroundUrl = service.backgroundImage
    ? `https://woodfloorllc.com/api/${service.backgroundImage}`
    : service.image
    ? `https://woodfloorllc.com/api/${service.image}`
    : undefined;

  return (
    <div
      className="service-details-bg"
      style={
        backgroundUrl
          ? {
              backgroundImage: `linear-gradient(rgba(30,40,60,0.55),rgba(30,40,60,0.55)), url('${backgroundUrl}')`,
            }
          : {}
      }
    >
      <div className="service-details-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="service-header">
          <div className="service-header-text">
            <h2>{service.name}</h2>
            <div className="service-details-info">
              <span>
                Price: <b>${service.price}</b>
              </span>
            </div>
          </div>
          {service.image && (
            <img
              src={`http://woodfloorllc.com/api/${service.image}`}
              alt={service.name}
              className="service-details-image"
            />
          )}
        </div>
        <p className="service-description">{service.description}</p>

        <div className="service-section">
          <h3>Installation Process</h3>
          <ol>
            {(service.installationSteps || defaultSteps).map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
          <div className="service-section">
            <h3>Features</h3>
            <ul>
              {(service.features || defaultFeatures).map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
