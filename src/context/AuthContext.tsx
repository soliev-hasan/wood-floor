import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

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

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ServiceRequest {
  serviceId: string;
  name: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  notes?: string;
}

interface Slider {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isAuthLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
  services: Service[];
  getServices: () => Promise<void>;
  createService: (serviceData: FormData) => Promise<void>;
  updateService: (id: string, serviceData: FormData) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  createRequest: (requestData: ServiceRequest) => Promise<void>;
  sliders: Slider[];
  getSliders: () => Promise<void>;
  createSlider: (formData: FormData) => Promise<void>;
  updateSlider: (id: string, formData: FormData) => Promise<void>;
  deleteSlider: (id: string) => Promise<void>;
  createFloorInstallationSlider: () => Promise<void>;
  updateFloorInstallationSlider: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [sliders, setSliders] = useState<Slider[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      checkAuth();
    } else {
      setIsAuthLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await api.get<ApiResponse<{ user: User }>>(
        "/api/auth/me"
      );
      setUser(response.data.data.user);
      setIsAdmin(response.data.data.user.role === "admin");
    } catch (error) {
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        "/api/users/login",
        {
          email,
          password,
        }
      );
      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
      setIsAdmin(user.role === "admin");
    } catch (error: any) {
      setError(error.response?.data?.message || "Login error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        "/api/users/register",
        {
          name,
          email,
          password,
        }
      );
      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      setToken(token);
      setUser(user);
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsAdmin(false);
  };

  const getServices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<ApiResponse<Service[]>>("/api/services");
      console.log("Services response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Error fetching services");
      }

      setServices(response.data.data);
    } catch (error: any) {
      const errorMessage = error.message || "Error fetching services";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createService = async (serviceData: FormData) => {
    try {
      if (!token) {
        throw new Error("Authentication required");
      }

      setLoading(true);
      setError(null);

      const response = await api.post<ApiResponse<Service>>(
        "/api/services",
        serviceData
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Error creating service");
      }

      await getServices(); // Refresh services list
    } catch (error: any) {
      console.error("Error creating service:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error creating service";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (id: string, serviceData: FormData) => {
    try {
      if (!token) {
        throw new Error("Authentication required");
      }

      setLoading(true);
      setError(null);

      console.log("Updating service with data:", { id, serviceData });

      const response = await api.put<ApiResponse<Service>>(
        `/api/services/${id}`,
        serviceData
      );

      const data = response.data;
      console.log("Update response:", data);

      if (!data.success) {
        throw new Error(data.message || "Error updating service");
      }

      await getServices(); // Refresh services list
    } catch (error: any) {
      console.error("Error in updateService:", error);
      const errorMessage = error.message || "Error updating service";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: string) => {
    try {
      if (!token) {
        throw new Error("Authentication required");
      }

      setLoading(true);
      setError(null);

      const response = await api.delete<ApiResponse<void>>(
        `/api/services/${id}`
      );

      const data = response.data;
      console.log("Delete response:", data);

      if (!data.success) {
        throw new Error(data.message || "Error deleting service");
      }

      await getServices(); // Refresh services list
    } catch (error: any) {
      const errorMessage = error.message || "Error deleting service";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createRequest = async (requestData: ServiceRequest) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post<ApiResponse<void>>(
        "/api/requests",
        requestData
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Error creating request");
      }

      // Show success notification
    } catch (error: any) {
      const errorMessage = error.message || "Error creating request";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getSliders = async () => {
    try {
      const response = await api.get<ApiResponse<Slider[]>>("/api/sliders");
      if (response.data.success) {
        setSliders(response.data.data);
      } else {
        console.error("Error fetching sliders:", response.data.message);
        setSliders([]);
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
      setSliders([]);
    }
  };

  const createSlider = async (formData: FormData) => {
    try {
      // Log the FormData contents
      console.log("FormData contents:");
      Array.from(formData.entries()).forEach(([key, value]) => {
        if (value instanceof File) {
          console.log(
            `${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`
          );
        } else {
          console.log(`${key}: ${value}`);
        }
      });

      // Ensure we have the token
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const response = await api.post<ApiResponse<Slider>>(
        "/api/sliders",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000, // 30 seconds
        }
      );
      console.log("Response data:", response.data);

      // Update the sliders state with the new slider
      if (response.data.success && response.data.data) {
        setSliders((prevSliders) => [
          ...(prevSliders || []),
          response.data.data,
        ]);
      } else {
        throw new Error("Failed to create slider: Invalid response format");
      }
    } catch (error: any) {
      console.error("Error creating slider:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
      throw error;
    }
  };

  const updateSlider = async (id: string, formData: FormData) => {
    try {
      const response = await api.put<ApiResponse<Slider>>(
        "/api/sliders/" + id,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success && response.data.data) {
        setSliders((prevSliders) =>
          (prevSliders || []).map((slider) =>
            slider._id === id ? response.data.data : slider
          )
        );
      } else {
        throw new Error("Failed to update slider: Invalid response format");
      }
    } catch (error) {
      console.error("Error updating slider:", error);
      throw error;
    }
  };

  const deleteSlider = async (id: string) => {
    try {
      await api.delete("/api/sliders/" + id);
      setSliders(sliders.filter((slider) => slider._id !== id));
    } catch (error) {
      console.error("Error deleting slider:", error);
    }
  };

  const createFloorInstallationSlider = async () => {
    try {
      const sliderData = new FormData();
      sliderData.append("title", "Professional Floor Installation");
      sliderData.append(
        "description",
        "Expert floor installation services with premium materials and guaranteed quality. Transform your space with our professional team."
      );
      sliderData.append("order", "1");
      sliderData.append("isActive", "true");

      // Note: You'll need to provide an actual image file here
      // sliderData.append('image', imageFile);

      const response = await api.post<ApiResponse<Slider>>(
        "/api/sliders",
        sliderData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSliders([...sliders, response.data.data]);
    } catch (error) {
      console.error("Error creating floor installation slider:", error);
    }
  };

  const updateFloorInstallationSlider = async (id: string) => {
    try {
      const sliderData = new FormData();
      sliderData.append("title", "Premium Floor Installation");
      sliderData.append(
        "description",
        "Experience the difference with our professional floor installation services. We use only the highest quality materials and provide expert craftsmanship for your perfect floor."
      );
      sliderData.append("order", "1");
      sliderData.append("isActive", "true");

      // Note: You'll need to provide an actual image file here
      // sliderData.append('image', imageFile);

      const response = await api.put<ApiResponse<Slider>>(
        "/api/sliders/" + id,
        sliderData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSliders(
        sliders.map((slider) =>
          slider._id === id ? response.data.data : slider
        )
      );
    } catch (error) {
      console.error("Error updating floor installation slider:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        isAuthLoading,
        login,
        register,
        logout,
        loading,
        error,
        services,
        getServices,
        createService,
        updateService,
        deleteService,
        createRequest,
        sliders,
        getSliders,
        createSlider,
        updateSlider,
        deleteSlider,
        createFloorInstallationSlider,
        updateFloorInstallationSlider,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
