import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./SliderManagement.css";

const SliderManagement: React.FC = () => {
  const { sliders, getSliders, createSlider, updateSlider, deleteSlider } =
    useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [currentSlider, setCurrentSlider] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 1,
    isActive: true,
    image: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSliders();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      // Создаем URL для предпросмотра
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sliderFormData = new FormData();
    sliderFormData.append("title", formData.title);
    sliderFormData.append("description", formData.description);
    sliderFormData.append("order", formData.order.toString());
    sliderFormData.append("isActive", formData.isActive.toString());

    if (!isEditing && !formData.image) {
      alert("Please select an image for the slider");
      return;
    }

    if (formData.image) {
      sliderFormData.append("image", formData.image);
    }

    try {
      setLoading(true);
      if (isEditing && currentSlider) {
        await updateSlider(currentSlider._id, sliderFormData);
      } else {
        await createSlider(sliderFormData);
      }
      await getSliders(); // Wait for getSliders to complete
      resetForm();
    } catch (error: any) {
      console.error("Error saving slider:", error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Error saving slider. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slider: any) => {
    setCurrentSlider(slider);
    setFormData({
      title: slider.title,
      description: slider.description,
      order: slider.order,
      isActive: slider.isActive,
      image: null,
    });
    setPreviewUrl(
      slider.imageUrl ? `http://localhost:5001${slider.imageUrl}` : ""
    );
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      try {
        await deleteSlider(id);
        getSliders();
      } catch (error) {
        console.error("Error deleting slider:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      order: 1,
      isActive: true,
      image: null,
    });
    setCurrentSlider(null);
    setIsEditing(false);
    setPreviewUrl("");
  };

  // Функция для получения полного URL изображения
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    // Remove any leading slashes to avoid double slashes
    const cleanPath = imagePath.startsWith("/")
      ? imagePath.slice(1)
      : imagePath;
    return `http://localhost:5001/${cleanPath}`;
  };

  const defaultSliders = [
    {
      title: "Premium Parquet Flooring",
      description:
        "Experience the timeless elegance of our premium parquet flooring. Handcrafted with the finest hardwoods, each piece tells a story of craftsmanship and luxury.",
      order: 1,
      isActive: true,
    },
    {
      title: "Modern Vinyl Solutions",
      description:
        "Discover our innovative vinyl flooring options. Perfect for any space, combining durability with stunning designs that mimic natural materials.",
      order: 2,
      isActive: true,
    },
    {
      title: "Luxury Laminate Collection",
      description:
        "Transform your space with our high-quality laminate flooring. Offering the perfect balance of style, durability, and affordability.",
      order: 3,
      isActive: true,
    },
    {
      title: "Professional Installation",
      description:
        "Our expert team ensures perfect installation of any flooring type. With years of experience and attention to detail, we guarantee exceptional results.",
      order: 4,
      isActive: true,
    },
  ];

  const addDefaultSlider = async (slider: any) => {
    try {
      setLoading(true);
      // Create a default image URL for each type of slider
      let defaultImageUrl = "";
      switch (slider.title) {
        case "Premium Parquet Flooring":
          defaultImageUrl =
            "https://images.unsplash.com/photo-1615529162924-f8605388461d?ixlib=rb-4.0.3";
          break;
        case "Modern Vinyl Solutions":
          defaultImageUrl =
            "https://images.unsplash.com/photo-1615529162924-f8605388461d?ixlib=rb-4.0.3";
          break;
        case "Luxury Laminate Collection":
          defaultImageUrl =
            "https://images.unsplash.com/photo-1615529162924-f8605388461d?ixlib=rb-4.0.3";
          break;
        case "Professional Installation":
          defaultImageUrl =
            "https://images.unsplash.com/photo-1615529162924-f8605388461d?ixlib=rb-4.0.3";
          break;
        default:
          defaultImageUrl =
            "https://images.unsplash.com/photo-1615529162924-f8605388461d?ixlib=rb-4.0.3";
      }

      // Fetch the image and convert it to a File object
      const response = await fetch(defaultImageUrl);
      const blob = await response.blob();
      const file = new File([blob], "default-image.jpg", {
        type: "image/jpeg",
      });

      const sliderFormData = new FormData();
      sliderFormData.append("title", slider.title);
      sliderFormData.append("description", slider.description);
      sliderFormData.append("order", slider.order.toString());
      sliderFormData.append("isActive", slider.isActive.toString());
      sliderFormData.append("image", file);

      await createSlider(sliderFormData);
      await getSliders(); // Wait for getSliders to complete
    } catch (error) {
      console.error("Error adding default slider:", error);
      alert("Error adding default slider. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="slider-management">
      <h2>Slider Management</h2>

      <form onSubmit={handleSubmit} className="slider-form">
        <h3>{isEditing ? "Edit Slider" : "Add New Slider"}</h3>

        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="order">Order</label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="isActive">Active</label>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
            }
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            required={!isEditing}
          />
          {previewUrl && (
            <div className="image-preview">
              <img src={previewUrl} alt="Preview" />
            </div>
          )}
          <small className="form-text text-muted">
            {isEditing ? "Leave empty to keep current image" : "Required"}
          </small>
        </div>

        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Update Slider" : "Add Slider"}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="sliders-list">
        <h3>Current Sliders</h3>
        <div className="sliders-grid">
          {(sliders || []).map((slider) => (
            <div key={slider._id} className="slider-card">
              <img src={getImageUrl(slider.imageUrl)} alt={slider.title} />
              <div className="slider-info">
                <h4>{slider.title}</h4>
                <p>{slider.description}</p>
                <div className="slider-meta">
                  <span>Order: {slider.order}</span>
                  <span>Status: {slider.isActive ? "Active" : "Inactive"}</span>
                </div>
                <div className="slider-actions">
                  <button onClick={() => handleEdit(slider)}>Edit</button>
                  <button
                    onClick={() => handleDelete(slider._id)}
                    className="delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SliderManagement;
