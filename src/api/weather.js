import axios from "axios";

const API_KEY =
  import.meta.env.VITE_WEATHER_API_KEY;

const WEATHER_URL =
  "https://api.openweathermap.org/data/2.5/weather";

export const getWeather = async (city) => {
  try {
    if (!API_KEY) {
      throw new Error(
        "Weather API key is missing"
      );
    }

    const response = await axios.get(
      WEATHER_URL,
      {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      }
    );

    return {
      temperature:
        response.data.main.temp,

      humidity:
        response.data.main.humidity,

      wind:
        response.data.wind.speed,

      location:
        response.data.name,

      description:
        response.data.weather[0].description,

      icon:
        response.data.weather[0].icon,
    };
  } catch (error) {
    console.error(
      "Weather API Error:",
      error.response?.data ||
        error.message
    );

    return null;
  }
};