import React, { useState, useEffect } from "react";
import axios from "axios";
import { Service, ApiResponse } from "../types/api";
import "./Calculator.css";

const SQM_TO_SQFT = 10.7639;

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
        "https://woodfloorllc.com/api/services"
      );
      const convertedServices = response.data.data.map((s) => ({
        ...s,
        price: s.unit === "m²" ? s.price / SQM_TO_SQFT : s.price,
        unit: "sqft",
      }));
      setServices(convertedServices);
      if (convertedServices.length > 0) {
        setSelectedService(convertedServices[0]._id);
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

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setQuantity(value);
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
                {service.name} - ${service.price.toFixed(2)}/sqft
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity ({"sqft"}):</label>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            className="calculator-input"
            min={0}
          />
        </div>

        <div className="calculator-result">
          <h3>Total Cost:</h3>
          <p className="total-price">
            ${Number.isNaN(quantity) ? 0 : totalPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
