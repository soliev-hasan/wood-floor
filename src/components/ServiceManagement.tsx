import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./ServiceManagement.css";

interface ServiceFormData {
  name: string;
  description: string;
  price: number;
  unit: string;
  image: File | null;
}

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image?: string;
}

const initialFormData: ServiceFormData = {
  name: "",
  description: "",
  price: 0,
  unit: "м²",
  image: null,
};

const ServiceManagement: React.FC = () => {
  const {
    services,
    createService,
    updateService,
    deleteService,
    loading,
    error,
    getServices,
  } = useAuth();
  const [formData, setFormData] = useState<ServiceFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    const loadServices = async () => {
      try {
        await getServices();
      } catch (error: any) {
        setFormError(error.message);
      }
    };
    loadServices();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("unit", formData.unit);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (editingId) {
        console.log("Updating service:", editingId, formData);
        await updateService(editingId, formDataToSend);
        setEditingId(null);
      } else {
        console.log("Creating new service:", formData);
        await createService(formDataToSend);
      }
      setFormData(initialFormData);
      setPreviewUrl("");
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      setFormError(error.message);
    }
  };

  const handleEdit = (service: Service) => {
    console.log("Editing service:", service);
    setEditingId(service._id);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      unit: service.unit,
      image: null,
    });
    setPreviewUrl(service.image ? `http://localhost:5001${service.image}` : "");
  };

  const handleDelete = async (id: string) => {
    console.log("Deleting service:", id);
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await deleteService(id);
      } catch (error: any) {
        console.error("Error in handleDelete:", error);
        setFormError(error.message);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setPreviewUrl("");
  };

  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "";
    return `http://localhost:5001${imagePath}`;
  };

  return (
    <div className="service-management">
      <h2>Service Management</h2>

      <form onSubmit={handleSubmit} className="service-form">
        <div className="form-group">
          <label htmlFor="name">Service Name:</label>
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
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price ($):</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="unit">Unit of Measurement:</label>
          <select
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            required
          >
            <option value="м²">м²</option>
            <option value="м">м</option>
            <option value="pcs">pcs</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
          />
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Preview" />
            </div>
          )}
        </div>

        {formError && <div className="error-message">{formError}</div>}

        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {editingId ? "Save Changes" : "Add Service"}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancel} disabled={loading}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="services-list">
        <h3>Services List</h3>
        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          {services.map((service) => (
            <div key={service._id} className="service-item">
              <div className="service-info">
                {service.image && (
                  <img
                    src={getImageUrl(service.image)}
                    alt={service.name}
                    className="service-image"
                  />
                )}
                <h4>{service.name}</h4>
                <p>{service.description}</p>
                <div className="service-details">
                  <span>
                    Price: ${service.price}/{service.unit}
                  </span>
                </div>
              </div>
              <div className="service-actions">
                <button
                  onClick={() => handleEdit(service)}
                  disabled={loading}
                  className="edit-button"
                  type="button"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service._id)}
                  disabled={loading}
                  className="delete-button"
                  type="button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceManagement;
