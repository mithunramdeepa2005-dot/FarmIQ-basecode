
import { useEffect, useState } from "react";
import {
  MapPin,
  Sprout,
  Pencil,
  Trash2,
  Droplets,
  Layers,
  FileText,
  Wind,
  CloudSun,
  RefreshCw,
} from "lucide-react";

import { getWeather } from "../../services/weatherService";

function FarmCard({ farm, onDelete, onEdit }) {
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadWeather = async () => {
      setWeatherLoading(true);
      setWeather(null);

      try {
        const result = await getWeather(farm.location, "Celsius");

        if (!cancelled) {
          setWeather(result);
        }
      } catch (error) {
        console.error("Farm weather error:", error);

        if (!cancelled) {
          setWeather(null);
        }
      } finally {
        if (!cancelled) {
          setWeatherLoading(false);
        }
      }
    };

    if (farm.location) {
      loadWeather();
    } else {
      setWeatherLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [farm.location]);

  const formatLabel = (value) => {
    if (!value) return "Not specified";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
      <h2 className="text-2xl font-bold text-green-700">
        {farm.name}
      </h2>

      <div className="mt-5 space-y-3">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={18} />
          <span>{farm.location}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <span>📐</span>
          <span>{farm.area}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Sprout size={18} />
          <span>{farm.crop}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Layers size={18} />
          <span>Soil: {formatLabel(farm.soilType)}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-600">
          <Droplets size={18} />
          <span>Irrigation: {formatLabel(farm.irrigation)}</span>
        </div>

        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
          {farm.status || "Healthy"}
        </span>

        {farm.description && (
          <div className="flex items-start gap-2 text-gray-600 pt-1">
            <FileText size={18} className="mt-1 shrink-0" />
            <p className="text-sm leading-relaxed">
              {farm.description}
            </p>
          </div>
        )}
      </div>

      {/* Farm-specific weather */}
      <div className="mt-5 p-4 rounded-xl bg-sky-50 border border-sky-100">
        <div className="flex items-center gap-2 text-sky-800 font-semibold mb-3">
          <CloudSun size={20} />
          <span>Current Weather</span>
        </div>

        {weatherLoading ? (
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <RefreshCw size={15} className="animate-spin" />
            Loading weather for {farm.location}...
          </p>
        ) : weather ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round(weather.temperature)}°{
                    weather.temperatureUnit === "Fahrenheit" ? "F" : "C"
                  }
                </p>

                <p className="text-sm text-gray-600 capitalize mt-1">
                  {weather.description}
                </p>
              </div>

              {weather.icon && (
                <img
                  src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                  alt={weather.description}
                  className="w-16 h-16"
                />
              )}
            </div>

            <div className="flex flex-wrap gap-5 mt-3 text-sm text-gray-700">
              <span className="flex items-center gap-1">
                <Droplets size={16} />
                Humidity: {weather.humidity}%
              </span>

              <span className="flex items-center gap-1">
                <Wind size={16} />
                Wind: {weather.wind} m/s
              </span>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">
            Weather unavailable for {farm.location}. Check the location name or API connection.
          </p>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={() => onEdit(farm)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
        >
          <Pencil size={16} />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(farm.id)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}

export default FarmCard;
