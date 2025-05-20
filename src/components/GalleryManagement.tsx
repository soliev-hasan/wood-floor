import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import "../pages/Gallery.css";

interface GalleryImage {
  _id: string;
  url: string;
  filename: string;
  createdAt: string;
}

const GalleryManagement: React.FC = () => {
  const { token } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchImages = () => {
    setLoading(true);
    fetch("http://localhost:5001/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImages(data.data);
        } else {
          setError("Failed to load gallery");
        }
      })
      .catch(() => setError("Failed to load gallery"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchImages();
  }, []);

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
    const formData = new FormData();
    formData.append("image", selectedFile);
    try {
      const res = await fetch("http://localhost:5001/api/gallery", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      } as any); // TS workaround for fetch + FormData
      const data = await res.json();
      if (data.success) {
        setSelectedFile(null);
        setPreview(null);
        fetchImages();
      } else {
        setError(data.message || "Failed to upload image");
      }
    } catch (err) {
      setError("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      const res = await fetch(`http://localhost:5001/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setImages((imgs) => imgs.filter((img) => img._id !== id));
      } else {
        setError(data.message || "Failed to delete image");
      }
    } catch (err) {
      setError("Failed to delete image");
    }
  };

  const UploadIcon = () => (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );

  return (
    <div className="gallery-page admin-gallery">
      <h1>Gallery Management</h1>
      <form className="gallery-upload-form compact" onSubmit={handleUpload}>
        <label
          className="gallery-upload-label"
          title="Upload a new photo to the gallery"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            style={{ display: "none" }}
          />
          <span className="gallery-upload-btn highlight">
            <UploadIcon />
            <span style={{ marginLeft: 8 }}>
              {uploading ? "Uploading..." : "Upload Photo"}
            </span>
          </span>
        </label>
        {preview && (
          <div className="gallery-preview small">
            <img src={preview} alt="Preview" />
          </div>
        )}
        <button
          type="submit"
          disabled={!selectedFile || uploading}
          className="gallery-upload-submit"
          title="Add selected photo to gallery"
        >
          Add
        </button>
      </form>
      {error && <div className="gallery-page error">{error}</div>}
      <div className="gallery-grid admin">
        {images.length === 0 ? (
          <div>No images yet.</div>
        ) : (
          images.map((img) => (
            <div key={img._id} className="gallery-item admin">
              <img src={`http://localhost:5001${img.url}`} alt="Work" />
              <button
                className="gallery-delete"
                onClick={() => handleDelete(img._id)}
                title="Delete image"
              >
                X
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default GalleryManagement;
