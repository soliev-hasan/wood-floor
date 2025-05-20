import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./MobileMenu.css";

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mobile-menu">
      <button className="menu-toggle" onClick={toggleMenu}>
        <i className={`fas ${isOpen ? "fa-times" : "fa-bars"}`}></i>
      </button>

      <div className={`menu-overlay ${isOpen ? "active" : ""}`}>
        <nav className="mobile-nav">
          <Link to="/" onClick={toggleMenu}>
            Home
          </Link>
          <Link to="/services" onClick={toggleMenu}>
            Services
          </Link>
          <Link to="/about" onClick={toggleMenu}>
            About
          </Link>
          <Link to="/contact" onClick={toggleMenu}>
            Contact
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
