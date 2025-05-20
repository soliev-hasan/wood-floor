import React, { useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Gallery.css";

const GalleryUploadPage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    setError("");
    setSuccess("");
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const res = await fetch("http://localhost:5001/api/gallery", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      } as any);
      const data = await res.json();
      if (data.success) {
        setSelectedFile(null);
        setPreview(null);
        setSuccess("Photo uploaded successfully!");
        setTimeout(() => navigate("/admin"), 1200);
      } else {
        setError(data.message || "Failed to upload image");
      }
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="gallery-page">
      <h1>Add Photo to Gallery</h1>
      <form className="gallery-upload-form" onSubmit={handleUpload}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {preview && (
          <div className="gallery-preview">
            <img src={preview} alt="Preview" />
          </div>
        )}
        <button type="submit" disabled={!selectedFile || uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
      {error && <div className="gallery-page error">{error}</div>}
      {success && <div className="gallery-page success">{success}</div>}
    </div>
  );
};

export default GalleryUploadPage;
