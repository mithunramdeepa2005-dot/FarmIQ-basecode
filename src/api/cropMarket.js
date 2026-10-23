
const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
}/crop-market`;

export async function getCropMarketPrices(filters = {}) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  const query = params.toString();
  const response = await fetch(
    `${API_URL}${query ? `?${query}` : ""}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch crop market prices.");
  }

  return response.json();
}

export async function getCropPriceHistory(
  cropName,
  filters = {}
) {
  const params = new URLSearchParams(filters);
  const query = params.toString();

  const response = await fetch(
    `${API_URL}/history/${encodeURIComponent(cropName)}?${query}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch crop price history.");
  }

  return response.json();
}
