

const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
}/products`;



let productsPromise = null;

export const getProducts = async () => {
  // Prevent multiple simultaneous requests
  if (productsPromise) {
    return productsPromise;
  }

  productsPromise = fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch products"
        );
      }

      return data;
    })
    .catch((error) => {
      // Allow another request after a genuine failure
      productsPromise = null;

      throw error;
    });

  return productsPromise;
};

export const getProduct = async (productId) => {
  const response = await fetch(
    `${API_URL}/${productId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to fetch product"
    );
  }

  return data;
};

export const createProduct = async (
  productData
) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to create product"
    );
  }

  // Refresh cached GET data
  productsPromise = null;

  return data;
};

export const updateProduct = async (
  productId,
  productData
) => {
  const response = await fetch(
    `${API_URL}/${productId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to update product"
    );
  }

  productsPromise = null;

  return data;
};

export const deleteProduct = async (
  productId
) => {
  const response = await fetch(
    `${API_URL}/${productId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Failed to delete product"
    );
  }

  productsPromise = null;

  return data;
};