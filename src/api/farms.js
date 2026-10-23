
const API_URL = `${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/login`}/farms`;

// Get authentication token
const getToken = () => {
  return sessionStorage.getItem("farmiq_token");
};

// Common headers
const getHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Parse responses safely
const parseResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

// GET ALL MY FARMS
export const getFarms = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  return parseResponse(response);
};

// GET SINGLE FARM
export const getFarm = async (farmId) => {
  const response = await fetch(`${API_URL}/${farmId}`, {
    method: "GET",
    headers: getHeaders(),
  });

  return parseResponse(response);
};

// CREATE FARM
export const createFarm = async (farmData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(farmData),
  });

  return parseResponse(response);
};

// UPDATE FARM
export const updateFarm = async (farmId, farmData) => {
  const response = await fetch(`${API_URL}/${farmId}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(farmData),
  });

  return parseResponse(response);
};

// DELETE FARM
export const deleteFarm = async (farmId) => {
  const response = await fetch(`${API_URL}/${farmId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return parseResponse(response);
};
