import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ContactForm from "./components/ContactForm";
import HeroCarousel from "./components/HeroCarousel";
import MobileMenu from "./components/MobileMenu";
import TeamMember from "./components/TeamMember";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Register from "./components/Register";
import AdminDashboard from "./components/AdminDashboard";
import ServiceManagement from "./components/ServiceManagement";
import Requests from "./pages/Requests";
import ServiceDetails from "./pages/ServiceDetails";
import GalleryUploadPage from "./pages/GalleryUploadPage";
import Gallery from "./pages/Gallery";
import FAQ from "./pages/FAQ";
import "./App.css";

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAdmin, isAuthLoading } = useAuth();
  if (isAuthLoading) return null;
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isAuthLoading } = useAuth();
  if (isAuthLoading) return null;
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedRoute>
              <ServiceManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/requests"
          element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gallery-upload"
          element={
            <ProtectedRoute>
              <GalleryUploadPage />
            </ProtectedRoute>
          }
        />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

export default App;
