
const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// ==========================================
// COMMON AUTHENTICATION HEADERS
// ==========================================

const getHeaders = () => {
  const token = sessionStorage.getItem("farmiq_token");

  if (!token) {
    throw new Error("No authentication token found. Please log in.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// Safely parse API responses
const parseResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed (${response.status})`
    );
  }

  return data;
};

// ==========================================
// GET CURRENT USER PROFILE
// GET /api/users/profile
// ==========================================

export const getCurrentUser = async () => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await parseResponse(response);
  return data.user;
};

// ==========================================
// UPDATE CURRENT USER PROFILE
// PUT /api/users/profile
// ==========================================

export const updateUserProfile = async (profileData) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({
      name: profileData.name,
      phone: profileData.phone,
      location: profileData.location,
    }),
  });

  const data = await parseResponse(response);
  return data.user;
};

// ==========================================
// GET USER SETTINGS
// GET /api/users/settings
// ==========================================

export const getUserSettings = async () => {
  const response = await fetch(`${API_URL}/users/settings`, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await parseResponse(response);
  return data.settings;
};

// ==========================================
// UPDATE USER SETTINGS
// PUT /api/users/settings
// ==========================================

export const updateUserSettings = async (settings) => {
  const response = await fetch(`${API_URL}/users/settings`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({
      notifications: settings.notifications,
      weatherAlerts: settings.weatherAlerts,
      marketAlerts: settings.marketAlerts,
      temperatureUnit: settings.temperatureUnit,
    }),
  });

  const data = await parseResponse(response);
  return data.settings;
};

// ==========================================
// CHANGE PASSWORD
// PUT /api/users/change-password
// ==========================================

export const changePassword = async (
  currentPassword,
  newPassword
) => {
  const response = await fetch(`${API_URL}/users/change-password`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });

  return parseResponse(response);
};
