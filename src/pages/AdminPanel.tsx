import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./AdminPanel.css";
import ContactInfoManagement from "../components/ContactInfoManagement";

interface SliderItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

const AdminPanel: React.FC = () => {
  const {
    user,
    sliders,
    getSliders,
    createSlider,
    updateSlider,
    deleteSlider,
  } = useAuth();
  const [activeTab, setActiveTab] = useState("sliders");
  const [newSlider, setNewSlider] = useState({
    title: "",
    subtitle: "",
    link: "",
    order: 0,
    image: null as File | null,
  });
  const [editingSlider, setEditingSlider] = useState<any>(null);

  useEffect(() => {
    getSliders();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewSlider({ ...newSlider, image: e.target.files[0] });
    }
  };

  const handleCreateSlider = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newSlider.title);
    formData.append("subtitle", newSlider.subtitle);
    formData.append("link", newSlider.link);
    formData.append("order", newSlider.order.toString());
    if (newSlider.image) {
      formData.append("image", newSlider.image);
    }
    await createSlider(formData);
    setNewSlider({
      title: "",
      subtitle: "",
      link: "",
      order: 0,
      image: null,
    });
  };

  const handleUpdateSlider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlider) return;
    const formData = new FormData();
    formData.append("title", editingSlider.title);
    formData.append("subtitle", editingSlider.subtitle);
    formData.append("link", editingSlider.link);
    formData.append("order", editingSlider.order.toString());
    if (editingSlider.image) {
      formData.append("image", editingSlider.image);
    }
    await updateSlider(editingSlider._id, formData);
    setEditingSlider(null);
  };

  if (!user || user.role !== "admin") {
    return <div>Access Denied</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-tabs">
        <button
          className={activeTab === "sliders" ? "active" : ""}
          onClick={() => setActiveTab("sliders")}
        >
          Sliders
        </button>
        <button
          className={activeTab === "contact" ? "active" : ""}
          onClick={() => setActiveTab("contact")}
        >
          Contact Information
        </button>
      </div>

      {activeTab === "sliders" && (
        <div className="admin-content">
          <h2>Slider Management</h2>

          <form onSubmit={handleCreateSlider} className="admin-form">
            <h3>Add New Slide</h3>
            <input
              type="text"
              placeholder="Title"
              value={newSlider.title}
              onChange={(e) =>
                setNewSlider({ ...newSlider, title: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Subtitle"
              value={newSlider.subtitle}
              onChange={(e) =>
                setNewSlider({ ...newSlider, subtitle: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Link"
              value={newSlider.link}
              onChange={(e) =>
                setNewSlider({ ...newSlider, link: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Order"
              value={newSlider.order}
              onChange={(e) =>
                setNewSlider({ ...newSlider, order: parseInt(e.target.value) })
              }
            />
            <input type="file" onChange={handleFileChange} required />
            <button type="submit">Add Slide</button>
          </form>

          <div className="sliders-list">
            <h3>Existing Slides</h3>
            {sliders.map((slider) => (
              <div key={slider._id} className="slider-item">
                <img src={slider.imageUrl} alt={slider.title} />
                <div className="slider-info">
                  <h4>{slider.title}</h4>
                  <p>{slider.description}</p>
                  <p>Order: {slider.order}</p>
                  <p>Status: {slider.isActive ? "Active" : "Inactive"}</p>
                </div>
                <div className="slider-actions">
                  <button onClick={() => setEditingSlider(slider)}>Edit</button>
                  <button onClick={() => deleteSlider(slider._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {editingSlider && (
            <form onSubmit={handleUpdateSlider} className="admin-form">
              <h3>Edit Slide</h3>
              <input
                type="text"
                placeholder="Title"
                value={editingSlider.title}
                onChange={(e) =>
                  setEditingSlider({ ...editingSlider, title: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Subtitle"
                value={editingSlider.subtitle}
                onChange={(e) =>
                  setEditingSlider({
                    ...editingSlider,
                    subtitle: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Link"
                value={editingSlider.link}
                onChange={(e) =>
                  setEditingSlider({ ...editingSlider, link: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Order"
                value={editingSlider.order}
                onChange={(e) =>
                  setEditingSlider({
                    ...editingSlider,
                    order: parseInt(e.target.value),
                  })
                }
              />
              <input type="file" onChange={handleFileChange} />
              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setEditingSlider(null)}>
                Cancel
              </button>
            </form>
          )}
        </div>
      )}

      {activeTab === "contact" && (
        <div className="admin-content">
          <h2>Contact Information Management</h2>
          <ContactInfoManagement />
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
