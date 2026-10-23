import { useEffect, useState } from "react";
import {
  Sprout,
  Droplets,
  CloudRain,
  Wind,
  Sun,
} from "lucide-react";

import { getWeather } from "../../services/weatherService";
import { getUserSettings } from "../../services/userService";

function FarmingAdvice() {
  const [weather, setWeather] = useState(null);

  const [location, setLocation] = useState(
    localStorage.getItem("weatherLocation") ||
      "Vellore"
  );

  const [temperatureUnit, setTemperatureUnit] =
    useState("Celsius");

  // ==========================================
  // LOAD SETTINGS
  // ==========================================

  const loadSettings = async () => {
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
  // FETCH WEATHER
  // ==========================================

  const fetchWeather = async (
    city,
    unit = temperatureUnit
  ) => {
    if (!city) return;

    try {
      const data = await getWeather(
        city,
        unit
      );

      if (data) {
        setWeather(data);
        setLocation(city);
      }
    } catch (error) {
      console.error(
        "Farming Advice Weather Error:",
        error
      );

      setWeather(null);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    const initialize = async () => {
      const unit =
        await loadSettings();

      const savedLocation =
        localStorage.getItem(
          "weatherLocation"
        ) || "Vellore";

      await fetchWeather(
        savedLocation,
        unit
      );
    };

    initialize();
  }, []);

  // ==========================================
  // LOCATION CHANGE
  // ==========================================

  useEffect(() => {
    const handleLocationChange = (
      event
    ) => {
      const data = event.detail;

      if (typeof data === "string") {
        fetchWeather(
          data,
          temperatureUnit
        );

        return;
      }

      if (data?.city) {
        const unit =
          data.temperatureUnit ||
          temperatureUnit;

        setTemperatureUnit(unit);

        fetchWeather(
          data.city,
          unit
        );
      }
    };

    window.addEventListener(
      "weatherLocationChanged",
      handleLocationChange
    );

    return () => {
      window.removeEventListener(
        "weatherLocationChanged",
        handleLocationChange
      );
    };
  }, []);

  // ==========================================
  // SETTINGS CHANGE
  // ==========================================

  useEffect(() => {
    const handleSettingsChange =
      async () => {
        const unit =
          await loadSettings();

        const savedLocation =
          localStorage.getItem(
            "weatherLocation"
          ) || "Vellore";

        await fetchWeather(
          savedLocation,
          unit
        );
      };

    window.addEventListener(
      "farmiqSettingsChanged",
      handleSettingsChange
    );

    return () => {
      window.removeEventListener(
        "farmiqSettingsChanged",
        handleSettingsChange
      );
    };
  }, []);

  // ==========================================
  // NO WEATHER
  // ==========================================

  if (!weather) {
    return null;
  }

  // ==========================================
  // WEATHER VALUES
  // ==========================================

  const temperature =
    weather.temperature;

  const humidity =
    weather.humidity;

  const wind =
    weather.wind;

  const description =
    weather.description.toLowerCase();

  const advice = [];

  // ==========================================
  // TEMPERATURE
  // ==========================================

  /*
    OpenWeather returns Fahrenheit when
    temperatureUnit = Fahrenheit.

    Convert back to Celsius for our
    farming thresholds so that the
    advice logic stays consistent.
  */

  const temperatureCelsius =
    temperatureUnit === "Fahrenheit"
      ? (temperature - 32) * (5 / 9)
      : temperature;

  // ==========================================
  // TEMPERATURE ADVICE
  // ==========================================

  if (temperatureCelsius >= 35) {
    advice.push({
      icon: Sun,
      title: "High Temperature",
      message:
        "Increase irrigation frequency and avoid heavy farm work during peak afternoon heat.",
    });
  } else if (temperatureCelsius <= 20) {
    advice.push({
      icon: Sun,
      title: "Cool Weather",
      message:
        "Monitor crop growth and avoid excessive irrigation.",
    });
  } else {
    advice.push({
      icon: Sprout,
      title: "Good Growing Conditions",
      message:
        "Temperature is suitable for normal crop growth and routine farm activities.",
    });
  }

  // ==========================================
  // HUMIDITY
  // ==========================================

  if (humidity >= 80) {
    advice.push({
      icon: Droplets,
      title: "High Humidity",
      message:
        "Monitor crops for fungal diseases and avoid unnecessary leaf wetting.",
    });
  } else if (humidity <= 35) {
    advice.push({
      icon: Droplets,
      title: "Low Humidity",
      message:
        "Crops may lose moisture quickly. Check soil moisture regularly.",
    });
  }

  // ==========================================
  // RAIN
  // ==========================================

  if (
    description.includes("rain") ||
    description.includes("drizzle") ||
    description.includes("thunderstorm")
  ) {
    advice.push({
      icon: CloudRain,
      title: "Rain Expected",
      message:
        "Consider reducing irrigation and check drainage in low-lying areas.",
    });
  }

  // ==========================================
  // WIND
  // ==========================================

  /*
    OpenWeather:
    metric    = m/s
    imperial  = mph

    Convert to m/s for the farming threshold.
  */

  const windMetersPerSecond =
    temperatureUnit === "Fahrenheit"
      ? wind * 0.44704
      : wind;

  if (windMetersPerSecond >= 8) {
    advice.push({
      icon: Wind,
      title: "Strong Wind",
      message:
        "Avoid spraying pesticides or fertilizers and secure vulnerable plants.",
    });
  }

  // ==========================================
  // TEMPERATURE DISPLAY
  // ==========================================

  const temperatureSymbol =
    temperatureUnit === "Fahrenheit"
      ? "°F"
      : "°C";

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      {/* HEADER */}

      <div className="flex items-center gap-3 mb-6">

        <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">

          <Sprout
            size={24}
            className="text-green-600"
          />

        </div>

        <div>

          <h2 className="text-2xl font-bold text-gray-900">
            Farming Advice
          </h2>

          <p className="text-sm text-gray-500">
            Recommendations based on current weather
          </p>

          <p className="text-xs text-gray-400 mt-1">
            📍 {location} •{" "}
            {Math.round(temperature)}
            {temperatureSymbol}
          </p>

        </div>

      </div>

      {/* ADVICE */}

      <div className="space-y-4">

        {advice.map(
          (item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="flex gap-4 p-4 bg-green-50 rounded-xl"
              >

                <div className="flex-shrink-0">

                  <Icon
                    size={24}
                    className="text-green-600"
                  />

                </div>

                <div>

                  <h3 className="font-semibold text-gray-800">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">
                    {item.message}
                  </p>

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}

export default FarmingAdvice;