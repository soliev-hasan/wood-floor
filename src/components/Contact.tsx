import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./Contact.css";

const Contact: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    service: "",
    message: "",
    privacyPolicy: false,
  });
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [services, setServices] = useState<{ _id: string; name: string }[]>([]);

  useEffect(() => {
    fetch("http://localhost:5001/api/services")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setServices(data.data);
        }
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5001/api/users/contact-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log("Contact request response:", data);
      if (data.success) {
        setStatus({
          type: "success",
          message: "Thank you for your message. We will get back to you soon!",
        });
        setFormData({
          name: user?.name || "",
          email: user?.email || "",
          phone: "",
          service: "",
          message: "",
          privacyPolicy: false,
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
    }
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <div className="contact-container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            We'd love to hear from you. Please fill out the form or contact us
            directly.
          </p>
          <div className="contact-details">
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <p style={{ color: "black" }}>651-999-94-96</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <p style={{ color: "black" }}>woodfloorsllc1@gmail.com</p>
            </div>
            <div className="contact-item">
              <i className="fas fa-location-dot"></i>
              <p style={{ color: "black" }}>
                14300 34th Ave N Plymouth MN 55447
              </p>
            </div>
          </div>
          {/* <div className="business-hours">
            <h3>Business Hours</h3>
            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p>Saturday: 10:00 AM - 4:00 PM</p>
            <p>Sunday: Closed</p>
          </div> */}
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          {status.type && (
            <div className={`form-status ${status.type}`}>{status.message}</div>
          )}

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="service">Service Interested In</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service._id} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
            ></textarea>
          </div>

          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="privacyPolicy"
              name="privacyPolicy"
              checked={formData.privacyPolicy}
              onChange={handleChange}
              required
            />
            <label htmlFor="privacyPolicy">
              I agree to the privacy policy and terms of service
            </label>
          </div>

          <button type="submit" className="submit-button">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
