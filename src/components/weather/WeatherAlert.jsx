import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CloudRain,
  Sun,
  Wind,
  X,
} from "lucide-react";

import { getWeather } from "../../services/weatherService";
import { getUserSettings } from "../../services/userService";

function WeatherAlert() {
  const [alert, setAlert] = useState(null);
  const [weatherAlertsEnabled, setWeatherAlertsEnabled] =
    useState(true);

  const [location, setLocation] = useState(
    localStorage.getItem("weatherLocation") || "Vellore"
  );

  // ==========================================
  // CHECK WEATHER
  // ==========================================

  const checkWeatherAlert = async (
    city,
    alertsEnabled
  ) => {
    if (!city || !alertsEnabled) {
      setAlert(null);
      return;
    }

    try {
      const weather = await getWeather(city);

      if (!weather) {
        setAlert(null);
        return;
      }

      const temperature = Number(weather.temperature);
      const humidity = Number(weather.humidity);
      const wind = Number(weather.wind);

      const description =
        weather.description?.toLowerCase() || "";

      let newAlert = null;

      // ========================================
      // HEAVY RAIN / THUNDERSTORM
      // ========================================

      if (
        description.includes("thunderstorm") ||
        description.includes("heavy rain")
      ) {
        newAlert = {
          type: "rain",
          title: "Severe Weather Alert",
          message:
            `Thunderstorm or heavy rain is currently expected in ${city}. ` +
            "Check drainage and avoid unnecessary irrigation.",
          icon: CloudRain,
        };
      }

      // ========================================
      // RAIN
      // ========================================

      else if (
        description.includes("rain") ||
        description.includes("drizzle")
      ) {
        newAlert = {
          type: "rain",
          title: "Rain Alert",
          message:
            `Rain is expected in ${city}. ` +
            "Consider reducing irrigation and check farm drainage.",
          icon: CloudRain,
        };
      }

      // ========================================
      // HIGH TEMPERATURE
      // ========================================

      else if (temperature >= 35) {
        newAlert = {
          type: "heat",
          title: "High Temperature Alert",
          message:
            `High temperature detected in ${city}. ` +
            "Check soil moisture and provide adequate irrigation.",
          icon: Sun,
        };
      }

      // ========================================
      // STRONG WIND
      // ========================================

      else if (wind >= 8) {
        newAlert = {
          type: "wind",
          title: "Strong Wind Alert",
          message:
            `Strong winds are currently reported in ${city}. ` +
            "Avoid spraying pesticides or fertilizers.",
          icon: Wind,
        };
      }

      // ========================================
      // HIGH HUMIDITY
      // ========================================

      else if (humidity >= 90) {
        newAlert = {
          type: "humidity",
          title: "High Humidity Alert",
          message:
            `Very high humidity has been detected in ${city}. ` +
            "Monitor crops carefully for fungal diseases.",
          icon: AlertTriangle,
        };
      }

      setAlert(newAlert);
    } catch (error) {
      console.error(
        "Weather Alert Error:",
        error
      );

      setAlert(null);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    const initialize = async () => {
      try {
        const settings =
          await getUserSettings();

        const enabled =
          settings?.weatherAlerts ?? true;

        setWeatherAlertsEnabled(enabled);

        const savedLocation =
          localStorage.getItem(
            "weatherLocation"
          ) || "Vellore";

        setLocation(savedLocation);

        await checkWeatherAlert(
          savedLocation,
          enabled
        );
      } catch (error) {
        console.error(
          "Weather Alert Initialization Error:",
          error
        );
      }
    };

    initialize();
  }, []);

  // ==========================================
  // LOCATION CHANGE
  // ==========================================

  useEffect(() => {
    const handleLocationChange = async (
      event
    ) => {
      const data = event.detail;

      let newLocation;

      if (typeof data === "string") {
        newLocation = data;
      } else {
        newLocation = data?.city;
      }

      if (!newLocation) return;

      setLocation(newLocation);

      await checkWeatherAlert(
        newLocation,
        weatherAlertsEnabled
      );
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
  }, [weatherAlertsEnabled]);

  // ==========================================
  // SETTINGS CHANGE
  // ==========================================

  useEffect(() => {
    const handleSettingsChange =
      async () => {
        try {
          const settings =
            await getUserSettings();

          const enabled =
            settings?.weatherAlerts ?? true;

          setWeatherAlertsEnabled(enabled);

          const savedLocation =
            localStorage.getItem(
              "weatherLocation"
            ) || "Vellore";

          if (!enabled) {
            setAlert(null);
            return;
          }

          await checkWeatherAlert(
            savedLocation,
            enabled
          );
        } catch (error) {
          console.error(
            "Weather Alert Settings Error:",
            error
          );
        }
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
  // WEATHER ALERT DISABLED
  // ==========================================

  if (!weatherAlertsEnabled) {
    return null;
  }

  // ==========================================
  // NO ALERT
  // ==========================================

  if (!alert) {
    return null;
  }

  const Icon = alert.icon;

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">

      <div className="flex items-start gap-4">

        <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">

          <Icon
            size={24}
            className="text-orange-600"
          />

        </div>

        <div className="flex-1">

          <div className="flex items-center justify-between">

            <h3 className="font-bold text-orange-800 text-lg">
              {alert.title}
            </h3>

            <button
              type="button"
              onClick={() => setAlert(null)}
              className="text-orange-500 hover:text-orange-700"
              title="Dismiss alert"
            >
              <X size={20} />
            </button>

          </div>

          <p className="text-sm text-orange-700 mt-2">
            {alert.message}
          </p>

          <p className="text-xs text-orange-500 mt-2">
            📍 {location}
          </p>

        </div>

      </div>

    </div>
  );
}

export default WeatherAlert;