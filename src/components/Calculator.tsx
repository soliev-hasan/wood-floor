import React, { useState, useEffect } from "react";
import axios from "axios";
import { Service, ApiResponse } from "../types/api";
import "./Calculator.css";

const Calculator: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse<Service[]>>(
        "http://localhost:5001/api/services"
      );
      setServices(response.data.data);
      if (response.data.data.length > 0) {
        setSelectedService(response.data.data[0]._id);
      }
    } catch (err) {
      setError("Error loading services");
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedService) {
      const service = services.find((s) => s._id === selectedService);
      if (service) {
        setTotalPrice(service.price * quantity);
      }
    }
  }, [selectedService, quantity, services]);

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedService(e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<any>) => {
    setQuantity(e.target.value);
  };

  if (loading) {
    return <div className="calculator-loading">Loading...</div>;
  }

  if (error) {
    return <div className="calculator-error">{error}</div>;
  }

  const selectedServiceData = services.find((s) => s._id === selectedService);

  return (
    <div className="calculator-container">
      <h2>Cost Calculator</h2>
      <div className="calculator-form">
        <div className="form-group">
          <label htmlFor="service">Select Service:</label>
          <select
            id="service"
            value={selectedService}
            onChange={handleServiceChange}
            className="calculator-select"
          >
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name} - ${service.price}/{service.unit}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">
            Quantity ({selectedServiceData?.unit || "m²"}):
          </label>
          <input
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            className="calculator-input"
          />
        </div>

        <div className="calculator-result">
          <h3>Total Cost:</h3>
          <p className="total-price">${totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
