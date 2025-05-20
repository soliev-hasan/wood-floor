import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ServiceManagement from "./ServiceManagement";
import SliderManagement from "./admin/SliderManagement";
import GalleryManagement from "./GalleryManagement";
import "./AdminDashboard.css";

interface ContactRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: "pending" | "processed";
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "requests" | "services" | "sliders" | "gallery"
  >("requests");
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/users/contact-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      setRequests(data.data);
    } catch (error) {
      setError("Failed to fetch contact requests");
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: "processed") => {
    console.log("Updating request status:", { id, status });
    try {
      if (!id) {
        throw new Error("Request ID is required");
      }

      const response = await fetch(
        `http://localhost:5001/api/users/contact-requests/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update request status");
      }

      // Update the request in the local state
      setRequests(
        requests.map((request) =>
          request._id === id ? { ...request, status } : request
        )
      );
    } catch (error: any) {
      console.error("Error updating request status:", error);
      setError(error.message || "Failed to update request status");
    }
  };

  if (loading) {
    return <div className="admin-dashboard">Loading...</div>;
  }

  if (error) {
    return <div className="admin-dashboard error">{error}</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-tabs">
        <button
          className={`tab-button ${activeTab === "requests" ? "active" : ""}`}
          onClick={() => setActiveTab("requests")}
        >
          Requests
        </button>
        <button
          className={`tab-button ${activeTab === "services" ? "active" : ""}`}
          onClick={() => setActiveTab("services")}
        >
          Services
        </button>
        <button
          className={`tab-button ${activeTab === "sliders" ? "active" : ""}`}
          onClick={() => setActiveTab("sliders")}
        >
          Sliders
        </button>
        <button
          className={`tab-button ${activeTab === "gallery" ? "active" : ""}`}
          onClick={() => setActiveTab("gallery")}
        >
          Gallery
        </button>
      </div>

      {activeTab === "requests" ? (
        <>
          <h1>
            Consultation Requests
            {requests.filter((r) => r.status === "pending").length > 0 && (
              <span className="pending-count">
                {requests.filter((r) => r.status === "pending").length}
              </span>
            )}
          </h1>
          <div className="requests-grid">
            {requests.map((request) => (
              <div key={request._id} className="request-card">
                <div className="request-header">
                  <h3>{request.name}</h3>
                  <span className={`status ${request.status}`}>
                    {request.status}
                  </span>
                </div>
                <div className="request-details">
                  <p>
                    <strong>Email:</strong> {request.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {request.phone}
                  </p>
                  <p>
                    <strong>Service:</strong> {request.service}
                  </p>
                  <p>
                    <strong>Message:</strong> {request.message}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {request.status === "pending" && (
                  <div className="request-actions">
                    <button
                      onClick={() =>
                        updateRequestStatus(request._id, "processed")
                      }
                      className="process"
                    >
                      Process
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : activeTab === "services" ? (
        <ServiceManagement />
      ) : activeTab === "sliders" ? (
        <SliderManagement />
      ) : (
        <GalleryManagement />
      )}
    </div>
  );
};

export default AdminDashboard;
