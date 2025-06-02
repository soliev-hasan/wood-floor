import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Requests.css";

interface Request {
  _id: string;
  serviceId: {
    _id: string;
    name: string;
  };
  name: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
}

const Requests: React.FC = () => {
  const { isAdmin } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("https://woodfloorllc.com/api/requests", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch requests");
        }

        const data = await response.json();
        setRequests(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (isAdmin) {
      fetchRequests();
    }
  }, [isAdmin]);

  const handleStatusChange = async (
    requestId: string,
    newStatus: "confirmed" | "cancelled"
  ) => {
    try {
      const response = await fetch(
        `https://woodfloorllc.com/api/requests/${requestId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Обновляем список заявок
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, status: newStatus }
            : request
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!isAdmin) {
    return <div className="error-message">Access denied. Admin only.</div>;
  }

  if (loading) {
    return <div className="loading">Loading requests...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="requests-container">
      <h2>Service Requests</h2>
      <div className="requests-list">
        {requests.map((request) => (
          <div key={request._id} className="request-card">
            <div className="request-header">
              <h3>{request.serviceId?.name || "Unknown service"}</h3>
              <span className={`status ${request.status}`}>
                {request.status}
              </span>
            </div>
            <div className="request-details">
              <p>
                <strong>Name:</strong> {request.name}
              </p>
              <p>
                <strong>Phone:</strong> {request.phone}
              </p>
              <p>
                <strong>Email:</strong> {request.email}
              </p>
              <p>
                <strong>Preferred Date:</strong>{" "}
                {new Date(request.preferredDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Preferred Time:</strong> {request.preferredTime}
              </p>
              {request.notes && (
                <p>
                  <strong>Notes:</strong> {request.notes}
                </p>
              )}
              <p>
                <strong>Created:</strong>{" "}
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </div>
            {request.status === "pending" && (
              <div className="request-actions">
                <button
                  className="confirm-button"
                  onClick={() => handleStatusChange(request._id, "confirmed")}
                >
                  Confirm
                </button>
                <button
                  className="cancel-button"
                  onClick={() => handleStatusChange(request._id, "cancelled")}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
