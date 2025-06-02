import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./ContactInfoManagement.css";

interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    whatsapp: string;
  };
}

const ContactInfoManagement: React.FC = () => {
  const { token } = useAuth();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await fetch("https://woodfloorllc.com/api/contact-info");
      const data = await response.json();
      if (data.success) {
        setContactInfo(data.data);
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch(
        "https://woodfloorllc.com/api/contact-info",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(contactInfo),
        }
      );

      const data = await response.json();
      if (data.success) {
        setStatus({
          type: "success",
          message: "Contact information updated successfully!",
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Failed to update contact information.",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("social.")) {
      const socialPlatform = name.split(".")[1];
      setContactInfo((prev) => ({
        ...prev!,
        socialLinks: {
          ...prev!.socialLinks,
          [socialPlatform]: value,
        },
      }));
    } else {
      setContactInfo((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  if (!contactInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div className="contact-info-management">
      <h2>Contact Information Management</h2>
      {status.type && (
        <div className={`status-message ${status.type}`}>{status.message}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={contactInfo.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={contactInfo.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={contactInfo.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Instagram URL:</label>
          <input
            type="url"
            name="social.instagram"
            value={contactInfo.socialLinks.instagram}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Facebook URL:</label>
          <input
            type="url"
            name="social.facebook"
            value={contactInfo.socialLinks.facebook}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>WhatsApp URL:</label>
          <input
            type="url"
            name="social.whatsapp"
            value={contactInfo.socialLinks.whatsapp}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Update Contact Information</button>
      </form>
    </div>
  );
};

export default ContactInfoManagement;
