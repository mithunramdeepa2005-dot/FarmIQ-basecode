const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://farmiq-api-6asq.onrender.com/api";

// ==========================================
// GET CURRENT USER
// ==========================================

export const getCurrentUser = async () => {
  const token = sessionStorage.getItem("farmiq_token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(
    `${API_URL}/users/profile`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to get user profile"
    );
  }

  return data.user;
};

// ==========================================
// UPDATE CURRENT USER PROFILE
// ==========================================

export const updateUserProfile = async (
  profileData
) => {
  const token = sessionStorage.getItem(
    "farmiq_token"
  );

  if (!token) {
    throw new Error(
      "No authentication token found"
    );
  }

  const response = await fetch(
    `${API_URL}/users/profile`,
    {
      method: "PUT",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: profileData.name,
        phone: profileData.phone,
        location: profileData.location,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update profile"
    );
  }

  return data.user;
};

// ==========================================
// CHANGE PASSWORD
// ==========================================

export const changePassword = async ({
  currentPassword,
  newPassword,
}) => {
  const token = sessionStorage.getItem(
    "farmiq_token"
  );

  if (!token) {
    throw new Error(
      "No authentication token found"
    );
  }

  // Basic frontend validation
  if (!currentPassword || !newPassword) {
    throw new Error(
      "Current password and new password are required"
    );
  }

  if (newPassword.length < 6) {
    throw new Error(
      "New password must be at least 6 characters"
    );
  }

  const response = await fetch(
    `${API_URL}/users/change-password`,
    {
      method: "PUT",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to change password"
    );
  }

  return data;
};