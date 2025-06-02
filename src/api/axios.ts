import axios from "axios";

const api = axios.create({
  baseURL: "https://woodfloorllc.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
