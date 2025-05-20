export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Slide {
  _id: string;
  title: string;
  description: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
