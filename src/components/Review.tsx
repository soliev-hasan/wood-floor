import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./Review.css";

const API_URL = "http://localhost:5001";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
});

// Add request interceptor to add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Initialize headers if they don't exist
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface ReviewData {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

const Review: React.FC = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [userReview, setUserReview] = useState<ReviewData | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
    if (user) {
      fetchUserReview();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.get<ReviewData[]>("/api/reviews");
      setReviews(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    try {
      const response = await api.get<ReviewData>("/api/reviews/my-review");
      setUserReview(response.data);
    } catch (error) {
      console.error("Error fetching user review:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!rating) {
      setError("Please select a rating");
      return;
    }

    if (comment.length < 10) {
      setError("Comment must be at least 10 characters long");
      return;
    }

    try {
      console.log(localStorage.getItem("token"));

      await axios.post(
        "http://localhost:5001/api/reviews",
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRating(0);
      setComment("");
      fetchReviews();
      fetchUserReview();
    } catch (error: any) {
      setError(error.response?.data?.message || "Error submitting review");
    }
  };

  const renderStars = (rating: number) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  if (loading) {
    return (
      <div className="review-container">
        <h2>Customer Reviews</h2>
        <div className="loading">Loading reviews...</div>
      </div>
    );
  }

  return (
    <div className="review-container">
      <h2>Customer Reviews</h2>

      {error && <div className="error-message">{error}</div>}

      {user && !userReview && user.role !== "admin" && (
        <form onSubmit={handleSubmit} className="review-form">
          <div className="rating-input">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                  cursor: "pointer",
                  fontSize: "24px",
                  color: star <= rating ? "#ffd700" : "#ccc",
                }}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review (minimum 10 characters)"
            rows={4}
            className="review-textarea"
          />
          <button type="submit" className="submit-button">
            Submit Review
          </button>
        </form>
      )}

      <div className="review-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">
            No reviews yet. Be the first to leave a review!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <strong>{review.userId.name}</strong>
                <span className="stars">{renderStars(review.rating)}</span>
              </div>
              <p>{review.comment}</p>
              <small className="review-date">
                {new Date(review.createdAt).toLocaleDateString()}
              </small>
            </div>
          ))
        )}
      </div>

      <style>{`
        .review-container {
          padding: 20px;
          margin-bottom: 20px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .review-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-bottom: 20px;
        }

        .rating-input {
          display: flex;
          gap: 5px;
        }

        .review-textarea {
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #ddd;
          resize: vertical;
        }

        .error-message {
          color: red;
        }

        .submit-button {
          padding: 10px 20px;
          background-color: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .submit-button:hover {
          background-color: #1565c0;
        }

        .review-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .review-item {
          padding: 15px;
          border: 1px solid #eee;
          border-radius: 4px;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .stars {
          color: #ffd700;
        }

        .review-date {
          color: #666;
          display: block;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
};

export default Review;
