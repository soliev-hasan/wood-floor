import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, logout, token } = useAuth();
  const navigate = useNavigate();
  const [pendingServiceRequests, setPendingServiceRequests] = useState(0);
  const [pendingConsultationRequests, setPendingConsultationRequests] =
    useState(0);

  useEffect(() => {
    if (isAdmin && token) {
      // Service requests
      fetch("https://woodfloorllc.com/api/requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            setPendingServiceRequests(
              data.data.filter((r: any) => r.status === "pending").length
            );
          }
        })
        .catch(() => setPendingServiceRequests(0));
      // Consultation requests
      fetch("https://woodfloorllc.com/api/users/contact-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            setPendingConsultationRequests(
              data.data.filter((r: any) => r.status === "pending").length
            );
          }
        })
        .catch(() => setPendingConsultationRequests(0));
    }
  }, [isAdmin, token]);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" onClick={closeMenu}>
          <img src="./logo.png" alt="logo" className="logo" />
        </Link>
      </div>

      <button
        className={`mobile-menu-button${isMobileMenuOpen ? " open" : ""}`}
        onClick={() => setIsMobileMenuOpen((v) => !v)}
      >
        <span className={`hamburger${isMobileMenuOpen ? " open" : ""}`}></span>
      </button>

      <div className={`nav-links${isMobileMenuOpen ? " open" : ""}`}>
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>
        <Link to="/services" onClick={closeMenu}>
          Services
        </Link>

        <Link to="/gallery" onClick={closeMenu}>
          Gallery
        </Link>
        <Link to="/faq" onClick={closeMenu}>
          FAQ
        </Link>
        <Link to="/contact" onClick={closeMenu}>
          Contact
        </Link>
        {isAdmin && (
          <>
            <div style={{ position: "relative", display: "inline-block" }}>
              <Link to="/admin/requests" onClick={closeMenu}>
                Requests
              </Link>
              {pendingServiceRequests > 0 && (
                <span className="navbar-request-counter">
                  {pendingServiceRequests}
                </span>
              )}
            </div>
          </>
        )}
        {user ? (
          <>
            {isAdmin && (
              <div style={{ position: "relative", display: "inline-block" }}>
                <Link to="/admin" onClick={closeMenu}>
                  Admin
                </Link>
                {pendingConsultationRequests > 0 && (
                  <span className="navbar-request-counter consultation">
                    {pendingConsultationRequests}
                  </span>
                )}
              </div>
            )}
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu}>
              Login
            </Link>
            <Link to="/register" onClick={closeMenu}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
