
import { useEffect, useState } from "react";
import {
  Sprout,
  CloudSun,
  TrendingUp,
  Droplets,
  ThermometerSun,
  Leaf,
  Wind,
} from "lucide-react";

import { getFarms } from "../../api/farms.js";
import { getWeather } from "../../services/weatherService.js";

function Dashboard() {
  const [farms, setFarms] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getFarms();

        // Support common API response formats.
        const farmList = Array.isArray(response)
          ? response
          : Array.isArray(response?.farms)
          ? response.farms
          : Array.isArray(response?.data?.farms)
          ? response.data.farms
          : [];

        if (cancelled) return;

        setFarms(farmList);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Unable to load your farms.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadWeather = async () => {
      const farm = farms[0];

      // Use the location stored with the user's first farm.
      const location =
        farm?.location ||
        farm?.village ||
        farm?.city;

      if (!location) {
        setWeather(null);
        return;
      }

      setWeatherLoading(true);

      try {
        const result = await getWeather(location, "Celsius");

        if (!cancelled) {
          setWeather(result);
        }
      } catch {
        if (!cancelled) setWeather(null);
      } finally {
        if (!cancelled) setWeatherLoading(false);
      }
    };

    if (!loading && farms.length > 0) {
      loadWeather();
    } else if (!loading) {
      setWeather(null);
    }

    return () => {
      cancelled = true;
    };
  }, [farms, loading]);

  const formatNumber = (value) =>
    typeof value === "number" ? value : "--";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-gray-500">
          An overview of your farms and local conditions.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Farms"
          value={loading ? "..." : farms.length}
          subtitle="Your registered farms"
          icon={<Sprout size={25} />}
          color="green"
        />

        <StatCard
          title="Temperature"
          value={
            weather
              ? `${formatNumber(weather.temperature)}°C`
              : weatherLoading
              ? "Loading..."
              : "--"
          }
          subtitle={weather?.location || "Farm location weather"}
          icon={<ThermometerSun size={25} />}
          color="orange"
        />

        <StatCard
          title="Humidity"
          value={
            weather
              ? `${formatNumber(weather.humidity)}%`
              : "--"
          }
          subtitle="Current relative humidity"
          icon={<Droplets size={25} />}
          color="blue"
        />

        <StatCard
          title="Market Trend"
          value="Unavailable"
          subtitle="Live market data not connected"
          icon={<TrendingUp size={25} />}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Weather Overview
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Weather for your first registered farm
              </p>
            </div>
            <CloudSun size={30} className="text-green-600" />
          </div>

          {weatherLoading ? (
            <p className="text-gray-500">Loading weather...</p>
          ) : weather ? (
            <div className="rounded-xl bg-green-50 p-5">
              <p className="text-gray-600">{weather.location}</p>
              <h3 className="mt-2 text-4xl font-bold text-gray-900">
                {Math.round(weather.temperature)}°C
              </h3>
              <p className="mt-1 capitalize text-green-700">
                {weather.description}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white p-4">
                  <Droplets className="text-blue-500" />
                  <p className="mt-2 text-sm text-gray-500">
                    Humidity
                  </p>
                  <p className="text-xl font-bold">
                    {weather.humidity}%
                  </p>
                </div>

                <div className="rounded-xl bg-white p-4">
                  <Wind className="text-gray-700" />
                  <p className="mt-2 text-sm text-gray-500">
                    Wind speed
                  </p>
                  <p className="text-xl font-bold">
                    {weather.wind} m/s
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl bg-gray-50 p-5 text-gray-600">
              {farms.length === 0
                ? "Add a farm with a location to view its weather."
                : "Weather is unavailable. Check the farm location and API connection."}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                My Farms
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Farms associated with your account
              </p>
            </div>
            <Leaf size={30} className="text-green-600" />
          </div>

          {loading ? (
            <p className="text-gray-500">Loading your farms...</p>
          ) : farms.length === 0 ? (
            <p className="rounded-xl bg-gray-50 p-5 text-gray-600">
              No farms found for this account. Add your first farm to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {farms.map((farm, index) => (
                <div
                  key={farm._id || farm.id || index}
                  className="rounded-xl border border-gray-100 p-4"
                >
                  <h3 className="font-semibold text-gray-900">
                    {farm.name || farm.farmName || "Unnamed farm"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Location:{" "}
                    {farm.location ||
                      farm.village ||
                      farm.city ||
                      "Not specified"}
                  </p>

                  {farm.crop && (
                    <p className="mt-1 text-sm text-gray-500">
                      Crop: {farm.crop}
                    </p>
                  )}

                  {farm.area != null && (
                    <p className="mt-1 text-sm text-gray-500">
                      Area: {farm.area} acres
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }) {
  const styles = {
    green: "bg-green-100 text-green-600",
    orange: "bg-orange-100 text-orange-500",
    blue: "bg-blue-100 text-blue-500",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="mt-2 break-words text-2xl font-bold text-gray-900">
            {value}
          </h2>
        </div>
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${styles[color]}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500">{subtitle}</p>
    </div>
  );
}

export default Dashboard;
