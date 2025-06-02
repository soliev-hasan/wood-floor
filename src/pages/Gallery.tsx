import { log } from "console";
import React, { useEffect, useState } from "react";

interface GalleryImage {
  _id: string;
  url: string;
  filename: string;
  createdAt: string;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetch("https://woodfloorllc.com/api/gallery")
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
  }, []);

  const openModal = (img: GalleryImage) => setSelectedImage(img);
  const closeModal = () => setSelectedImage(null);

  if (loading) return <div className="gallery-page">Loading...</div>;
  if (error) return <div className="gallery-page error">{error}</div>;
  return (
    <div className="gallery-page">
      <h1>Gallery</h1>
      <div className="gallery-grid">
        {images.length === 0 ? (
          <div>No images yet.</div>
        ) : (
          images.map((img) => (
            <div key={img._id} className="gallery-item">
              <img
                src={`https://woodfloorllc.com/api${img.url}`}
                alt="Work"
                onClick={() => openModal(img)}
                style={{ cursor: "pointer" }}
              />
            </div>
          ))
        )}
      </div>
      {selectedImage && (
        <div className="gallery-modal" onClick={closeModal}>
          <div
            className="gallery-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="gallery-modal-close" onClick={closeModal}>
              &times;
            </button>
            <img
              src={`https://woodfloorllc.com/api/${selectedImage.url}`}
              alt="Enlarged"
              className="gallery-modal-img"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
