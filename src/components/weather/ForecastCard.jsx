import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { getForecast } from "../../services/weatherService";
import { getUserSettings } from "../../services/userService";

function ForecastCard() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState(
    localStorage.getItem("weatherLocation") ||
      "Vellore"
  );

  const [temperatureUnit, setTemperatureUnit] =
    useState("Celsius");

  // ==========================================
  // LOAD USER SETTINGS
  // ==========================================

  const loadTemperatureUnit = async () => {
    try {
      const settings =
        await getUserSettings();

      const unit =
        settings?.temperatureUnit ||
        "Celsius";

      setTemperatureUnit(unit);

      return unit;
    } catch (error) {
      console.error(
        "Settings Error:",
        error
      );

      return "Celsius";
    }
  };

  // ==========================================
  // FETCH FORECAST
  // ==========================================

  const fetchForecast = async (
    city,
    unit = temperatureUnit
  ) => {
    if (!city) return;

    try {
      setLoading(true);

      console.log(
        "Fetching forecast for:",
        city
      );

      console.log(
        "Forecast Temperature Unit:",
        unit
      );

      const data = await getForecast(
        city,
        unit
      );

      setForecast(data || []);
      setLocation(city);
    } catch (error) {
      console.error(
        "Forecast Error:",
        error
      );

      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    const initializeForecast =
      async () => {
        try {
          const unit =
            await loadTemperatureUnit();

          const savedLocation =
            localStorage.getItem(
              "weatherLocation"
            ) || "Vellore";

          await fetchForecast(
            savedLocation,
            unit
          );
        } catch (error) {
          console.error(
            "Forecast Initialization Error:",
            error
          );
        }
      };

    initializeForecast();
  }, []);

  // ==========================================
  // LISTEN FOR LOCATION / SETTINGS CHANGES
  // ==========================================

  useEffect(() => {
    // WeatherCard sends this event
    // when the location changes.

    const handleLocationChange = (
      event
    ) => {
      const eventData =
        event.detail;

      // Support both:
      // old event: "Salem"
      // new event: { city, temperatureUnit }

      if (typeof eventData === "string") {
        fetchForecast(
          eventData,
          temperatureUnit
        );
        return;
      }

      if (eventData?.city) {
        const unit =
          eventData.temperatureUnit ||
          temperatureUnit;

        setTemperatureUnit(unit);

        fetchForecast(
          eventData.city,
          unit
        );
      }
    };

    // Settings.jsx sends this event
    // when temperature unit changes.

    const handleSettingsChange =
      async () => {
        try {
          const unit =
            await loadTemperatureUnit();

          const savedLocation =
            localStorage.getItem(
              "weatherLocation"
            ) || "Vellore";

          await fetchForecast(
            savedLocation,
            unit
          );
        } catch (error) {
          console.error(
            "Settings Change Error:",
            error
          );
        }
      };

    window.addEventListener(
      "weatherLocationChanged",
      handleLocationChange
    );

    window.addEventListener(
      "farmiqSettingsChanged",
      handleSettingsChange
    );

    return () => {
      window.removeEventListener(
        "weatherLocationChanged",
        handleLocationChange
      );

      window.removeEventListener(
        "farmiqSettingsChanged",
        handleSettingsChange
      );
    };
  }, []);

  // ==========================================
  // TEMPERATURE SYMBOL
  // ==========================================

  const temperatureSymbol =
    temperatureUnit === "Fahrenheit"
      ? "°F"
      : "°C";

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-2">
          5-Day Forecast
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          Loading forecast for {location}...
        </p>

        <div className="flex items-center justify-center py-10">

          <Loader2
            size={32}
            className="animate-spin text-green-600"
          />

        </div>

      </div>
    );
  }

  // ==========================================
  // NO DATA
  // ==========================================

  if (!forecast.length) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">

        <h2 className="text-2xl font-bold mb-2">
          5-Day Forecast
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {location}
        </p>

        <p className="text-gray-500">
          Unable to load forecast data.
        </p>

      </div>
    );
  }

  // ==========================================
  // FORECAST
  // ==========================================

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-bold">
            5-Day Forecast
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            📍 {location}
          </p>

        </div>

      </div>

      <div className="space-y-4">

        {forecast.map((item) => (

          <div
            key={item.date}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition"
          >

            {/* DAY */}

            <span className="font-medium text-gray-700 w-12">
              {item.day}
            </span>

            {/* WEATHER ICON */}

            <div className="flex items-center gap-2">

              <img
                src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                alt={item.description}
                className="w-10 h-10"
              />

            </div>

            {/* TEMPERATURE */}

            <span className="font-bold text-gray-900">
              {item.temperature}
              {temperatureSymbol}
            </span>

          </div>

        ))}

      </div>

      <p className="text-xs text-gray-400 mt-5">
        Forecast data from OpenWeather
      </p>

    </div>
  );
}

export default ForecastCard;