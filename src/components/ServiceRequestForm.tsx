import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./ServiceRequestForm.css";

interface ServiceRequestFormProps {
  serviceId: string;
  serviceName: string;
  onClose: () => void;
}

const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({
  serviceId,
  serviceName,
  onClose,
}) => {
  const { createRequest, loading, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isAdmin) {
      setError("Administrators cannot submit service requests");
      return;
    }

    try {
      await createRequest({
        serviceId,
        ...formData,
      });
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  if (isAdmin) {
    return (
      <div className="request-form-overlay">
        <div className="request-form-container">
          <button className="close-button" onClick={onClose}>
            ×
          </button>
          <div className="error-message">
            Administrators cannot submit service requests
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="request-form-overlay">
      <div className="request-form-container">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Book a Service: {serviceName}</h2>
        <form onSubmit={handleSubmit} className="request-form">
          <div className="form-group">
            <label htmlFor="name">Your Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              placeholder="(XXX) XXX-XXXX"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferredDate">Preferred Date:</label>
            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferredTime">Preferred Time:</label>
            <input
              type="time"
              id="preferredTime"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes:</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Sending..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ServiceRequestForm;
