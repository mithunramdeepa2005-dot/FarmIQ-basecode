
import { useEffect, useState } from "react";
import {
  CloudSun,
  Droplets,
  Wind,
  MapPin,
  Search,
  LoaderCircle,
} from "lucide-react";

import {
  getWeather,
  searchLocations,
} from "../../services/weatherService";

import { getUserSettings } from "../../services/userService";

function WeatherCard() {
  const [weather, setWeather] = useState(null);

  const [location, setLocation] = useState(
    localStorage.getItem("weatherLocation") || "Vellore"
  );

  const [temperatureUnit, setTemperatureUnit] = useState("Celsius");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const loadTemperatureUnit = async () => {
    try {
      const settings = await getUserSettings();
      const unit = settings?.temperatureUnit || "Celsius";
      setTemperatureUnit(unit);
      return unit;
    } catch (error) {
      console.error("Settings Error:", error);
      return "Celsius";
    }
  };

  // Fetch weather for the selected location.
  const fetchWeather = async (
    city,
    unit = temperatureUnit
  ) => {
    const query = city.trim();

    if (!query) {
      setErrorMessage("Enter a village, town, or city.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getWeather(query, unit);

      if (!data) {
        setErrorMessage(
          "Weather not found. Try adding the district and state, for example: Village, Salem, Tamil Nadu."
        );
        return;
      }

      setWeather(data);
      setLocation(query);
      setSuggestions([]);

      localStorage.setItem("weatherLocation", query);

      window.dispatchEvent(
        new CustomEvent("weatherLocationChanged", {
          detail: {
            city: query,
            temperatureUnit: unit,
          },
        })
      );
    } catch (error) {
      console.error("Weather Error:", error);
      setErrorMessage("Unable to load weather. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Search for matching locations.
  const handleSearch = async () => {
    const query = location.trim();

    if (!query) {
      setErrorMessage("Enter a village, town, or city.");
      return;
    }

    try {
      setSearching(true);
      setErrorMessage("");
      setSuggestions([]);

      const results = await searchLocations(query);

      if (!results.length) {
        setErrorMessage(
          "No matching location found. Try adding its district and Tamil Nadu."
        );
        return;
      }

      // Show suggestions when several matches are available.
      if (results.length > 1) {
        setSuggestions(results);
      } else {
        await fetchWeather(query, temperatureUnit);
      }
    } catch (error) {
      console.error("Location Search Error:", error);
      setErrorMessage(
        error.message || "Unable to search locations."
      );
    } finally {
      setSearching(false);
    }
  };

  // Load initial weather and temperature preference.
  useEffect(() => {
    let active = true;

    const initialize = async () => {
      const unit = await loadTemperatureUnit();

      if (!active) return;

      const savedLocation =
        localStorage.getItem("weatherLocation") || "Vellore";

      await fetchWeather(savedLocation, unit);
    };

    initialize();

    return () => {
      active = false;
    };
  }, []);

  // Reload when the user's temperature setting changes.
  useEffect(() => {
    const handleSettingsChange = async () => {
      const unit = await loadTemperatureUnit();
      const savedLocation =
        localStorage.getItem("weatherLocation") || "Vellore";

      await fetchWeather(savedLocation, unit);
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

  const selectLocation = async (place) => {
    setSuggestions([]);
    setLocation(place.label);

    await fetchWeather(
      `${place.name}${place.state ? `, ${place.state}` : ""}, ${place.country}`,
      temperatureUnit
    );
  };

  const temperatureSymbol =
    temperatureUnit === "Fahrenheit" ? "°F" : "°C";

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      {/* Current weather */}
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500">Current Weather</p>

          <h2 className="text-6xl font-bold text-green-700 mt-3">
            {weather ? Math.round(weather.temperature) : "--"}
            {temperatureSymbol}
          </h2>

          <p className="mt-3 text-gray-600">
            {weather?.location || "Location unavailable"}
          </p>

          <p className="text-gray-500">
            {weather?.description || ""}
          </p>
        </div>

        <CloudSun size={70} className="text-yellow-500" />
      </div>

      {/* Location search */}
      <div className="mt-8">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Search village, town, or city
        </label>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <MapPin
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={location}
              onChange={(event) => {
                setLocation(event.target.value);
                setSuggestions([]);
                setErrorMessage("");
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="e.g. Village, Salem, Tamil Nadu"
              className="w-full border rounded-xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={searching || loading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold px-5 py-3 rounded-xl transition"
          >
            {searching ? (
              <LoaderCircle size={18} className="animate-spin" />
            ) : (
              <Search size={18} />
            )}
            Search
          </button>
        </div>

        {errorMessage && (
          <p role="alert" className="text-red-600 text-sm mt-3">
            {errorMessage}
          </p>
        )}

        {suggestions.length > 0 && (
          <div className="mt-3 border rounded-xl overflow-hidden">
            <p className="px-4 py-2 text-sm text-gray-500 bg-gray-50">
              Select the correct location
            </p>

            {suggestions.map((place, index) => (
              <button
                key={`${place.lat}-${place.lon}-${index}`}
                onClick={() => selectLocation(place)}
                className="block w-full text-left px-4 py-3 hover:bg-green-50 border-t"
              >
                <span className="font-medium">{place.name}</span>
                <span className="block text-sm text-gray-500">
                  {[place.state, place.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Weather details */}
      {weather && (
        <div className="grid grid-cols-2 gap-6 mt-10">
          <div className="flex items-center gap-3">
            <Droplets className="text-blue-500" />
            <div>
              <p>Humidity</p>
              <h3 className="font-bold">{weather.humidity}%</h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Wind />
            <div>
              <p>Wind</p>
              <h3 className="font-bold">
                {weather.wind}{" "}
                {temperatureUnit === "Fahrenheit" ? "mph" : "m/s"}
              </h3>
            </div>
          </div>
        </div>
      )}

      {loading && weather && (
        <p className="text-sm text-gray-500 mt-4">
          Updating weather...
        </p>
      )}
    </div>
  );
}

export default WeatherCard;
