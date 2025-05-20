import { useState } from "react";
import api from "../api/axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post<AuthResponse>("/users/register", {
        name,
        email,
        password,
      });

      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Произошла ошибка при регистрации";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post<AuthResponse>("/users/login", {
        email,
        password,
      });

      return response.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Произошла ошибка при входе";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    login,
    loading,
    error,
  };
};
