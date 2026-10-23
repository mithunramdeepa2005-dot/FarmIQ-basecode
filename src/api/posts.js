const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
}/posts`;


const getToken = () => {
  return sessionStorage.getItem("farmiq_token");
};

const getHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ==========================================
// GET POSTS
// ==========================================

export const getPosts = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch posts"
    );
  }

  return data;
};


// ==========================================
// CREATE POST
// ==========================================

export const createPost = async (postData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(postData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create post"
    );
  }

  return data;
};


// ==========================================
// UPDATE POST
// ==========================================

export const updatePost = async (
  postId,
  postData
) => {
  const response = await fetch(
    `${API_URL}/${postId}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(postData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update post"
    );
  }

  return data;
};


// ==========================================
// DELETE POST
// ==========================================

export const deletePost = async (postId) => {
  const response = await fetch(
    `${API_URL}/${postId}`,
    {
      method: "DELETE",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete post"
    );
  }

  return data;
};


// ==========================================
// LIKE / UNLIKE POST
// ==========================================

export const toggleLike = async (postId) => {
  const response = await fetch(
    `${API_URL}/${postId}/like`,
    {
      method: "POST",
      headers: getHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update like"
    );
  }

  return data;
};


// ==========================================
// ADD COMMENT
// ==========================================

export const addComment = async (
  postId,
  text
) => {
  const response = await fetch(
    `${API_URL}/${postId}/comments`,
    {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        text,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to add comment"
    );
  }

  return data;
};