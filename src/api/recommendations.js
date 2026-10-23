
import axios from "axios";

const API_URL = `${
  import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/login`
}/recommendations`;

const getAuthHeaders = () => {
  const token = sessionStorage.getItem("farmiq_token");

  if (!token) {
    throw new Error("Please log in to continue.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const generateRecommendation = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/generate`,
      data,
      { headers: getAuthHeaders() }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Recommendation API Error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to generate recommendation"
    );
  }
};

export const getRecommendationHistory = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/history`,
      { headers: getAuthHeaders() }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Recommendation History API Error:",
      error.response?.data || error.message
    );

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch recommendation history"
    );
  }
};
