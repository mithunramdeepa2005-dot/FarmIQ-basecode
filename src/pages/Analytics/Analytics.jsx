
import { useEffect, useState } from "react";
import {
  Sprout,
  Activity,
  BarChart3,
  TrendingUp,
  CloudSun,
  Layers,
  History,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { getFarms } from "../../api/farms";
import { getRecommendationHistory } from "../../api/recommendations";

function Analytics() {
  const [farms, setFarms] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const [farmResult, recommendationResult] = await Promise.all([
        getFarms(),
        getRecommendationHistory(),
      ]);

      setFarms(farmResult.farms || []);
      setRecommendations(recommendationResult.recommendations || []);
    } catch (err) {
      console.error("Analytics loading error:", err);
      setError(err.message || "Unable to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const totalFarms = farms.length;

  const totalArea = farms.reduce(
    (sum, farm) => sum + Number(farm.area ?? farm.farmSize ?? 0),
    0
  );

  const cropCounts = {};
  farms.forEach((farm) => {
    const crop = farm.crop || farm.cropName;
    if (crop) {
      const name = String(crop).trim();
      const key = name.toLowerCase();
      cropCounts[key] ??= { name, count: 0 };
      cropCounts[key].count += 1;
    }
  });

  const farmCropData = Object.values(cropCounts).sort(
    (a, b) => b.count - a.count
  );

  const recommendationCropCounts = {};
  recommendations.forEach((item) => {
    if (item.crop) {
      const name = String(item.crop).trim();
      const key = name.toLowerCase();
      recommendationCropCounts[key] ??= { name, count: 0 };
      recommendationCropCounts[key].count += 1;
    }
  });

  const popularCrops = Object.values(recommendationCropCounts).sort(
    (a, b) => b.count - a.count
  );

  const soilCounts = {};
  recommendations.forEach((item) => {
    if (item.soilType) {
      const name = String(item.soilType).trim();
      const key = name.toLowerCase();
      soilCounts[key] ??= { name, count: 0 };
      soilCounts[key].count += 1;
    }
  });

  const soilData = Object.values(soilCounts).sort(
    (a, b) => b.count - a.count
  );

  const healthValues = farms
    .map((farm) =>
      Number(farm.health ?? farm.healthScore ?? farm.healthPercentage)
    )
    .filter((value) => Number.isFinite(value) && value >= 0 && value <= 100);

  const farmHealth =
    healthValues.length > 0
      ? Math.round(
          healthValues.reduce((sum, value) => sum + value, 0) /
            healthValues.length
        )
      : null;

  const formatArea = (area) =>
    Number.isInteger(area) ? area : area.toFixed(1);

  const maxCropCount = Math.max(
    1,
    ...farmCropData.map((item) => item.count)
  );

  const maxRecommendationCount = Math.max(
    1,
    ...popularCrops.map((item) => item.count)
  );

  const maxSoilCount = Math.max(1, ...soilData.map((item) => item.count));

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-green-600" size={40} />
          <p className="text-gray-500">Loading FarmIQ analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadAnalytics}
          className="mt-4 flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          <RefreshCw size={16} />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Farm Analytics
          </h1>
          <p className="mt-2 text-gray-500">
            Monitor your farms and explore your saved farming recommendations.
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-medium text-white hover:bg-green-700"
        >
          <RefreshCw size={17} />
          Refresh data
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Farms"
          value={totalFarms}
          subtitle="Registered farms"
          icon={<Sprout size={26} />}
          color="green"
        />

        <SummaryCard
          title="Cultivated Area"
          value={`${formatArea(totalArea)} acres`}
          subtitle="Combined farm area"
          icon={<Activity size={26} />}
          color="blue"
        />

        <SummaryCard
          title="Recommendations"
          value={recommendations.length}
          subtitle="Saved recommendations"
          icon={<History size={26} />}
          color="purple"
        />

        <SummaryCard
          title="Farm Health"
          value={farmHealth === null ? "Not tracked" : `${farmHealth}%`}
          subtitle={
            farmHealth === null
              ? "No health scores recorded"
              : "Average recorded health score"
          }
          icon={<BarChart3 size={26} />}
          color="yellow"
        />
      </div>

      {/* Farm crop distribution */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <Sprout className="text-green-600" size={26} />
            <div>
              <h2 className="text-xl font-bold">Crop Distribution</h2>
              <p className="text-sm text-gray-500">
                Crops registered across your farms
              </p>
            </div>
          </div>

          {farmCropData.length === 0 ? (
            <EmptyState message="No crop data available yet." />
          ) : (
            <div className="space-y-5">
              {farmCropData.map((crop) => (
                <div key={crop.name}>
                  <div className="mb-2 flex justify-between gap-3">
                    <span className="font-medium">{crop.name}</span>
                    <span className="text-sm text-gray-500">
                      {crop.count} {crop.count === 1 ? "farm" : "farms"}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-green-600 transition-all"
                      style={{
                        width: `${(crop.count / maxCropCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recommendation crop statistics */}
        <section className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <TrendingUp className="text-blue-600" size={26} />
            <div>
              <h2 className="text-xl font-bold">Recommended Crops</h2>
              <p className="text-sm text-gray-500">
                Frequency in saved recommendations
              </p>
            </div>
          </div>

          {popularCrops.length === 0 ? (
            <EmptyState message="Generate a recommendation to see crop statistics." />
          ) : (
            <div className="space-y-5">
              {popularCrops.map((crop) => (
                <div key={crop.name}>
                  <div className="mb-2 flex justify-between gap-3">
                    <span className="font-medium">{crop.name}</span>
                    <span className="text-sm text-gray-500">
                      {crop.count} {crop.count === 1 ? "time" : "times"}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${
                          (crop.count / maxRecommendationCount) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Soil distribution */}
        <section className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <Layers className="text-amber-600" size={26} />
            <div>
              <h2 className="text-xl font-bold">Soil Distribution</h2>
              <p className="text-sm text-gray-500">
                Soil types in saved recommendations
              </p>
            </div>
          </div>

          {soilData.length === 0 ? (
            <EmptyState message="No soil data available yet." />
          ) : (
            <div className="space-y-5">
              {soilData.map((soil) => (
                <div key={soil.name}>
                  <div className="mb-2 flex justify-between gap-3">
                    <span className="font-medium capitalize">{soil.name}</span>
                    <span className="text-sm text-gray-500">
                      {soil.count} {soil.count === 1 ? "record" : "records"}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all"
                      style={{
                        width: `${(soil.count / maxSoilCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* General insights */}
        <section className="rounded-2xl bg-white p-6 shadow-lg">
          <div className="mb-6 flex items-center gap-3">
            <CloudSun className="text-cyan-600" size={26} />
            <div>
              <h2 className="text-xl font-bold">Farm Insights</h2>
              <p className="text-sm text-gray-500">
                Summary of your recorded data
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-green-50 p-4">
              <p className="font-semibold text-green-800">Farm overview</p>
              <p className="mt-1 text-sm text-gray-600">
                You have {totalFarms}{" "}
                {totalFarms === 1 ? "farm" : "farms"} covering{" "}
                {formatArea(totalArea)} acres in total.
              </p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="font-semibold text-blue-800">
                Recommendation activity
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {recommendations.length} saved{" "}
                {recommendations.length === 1
                  ? "recommendation is"
                  : "recommendations are"}{" "}
                available in your history.
              </p>
            </div>

            <div className="rounded-xl bg-amber-50 p-4">
              <p className="font-semibold text-amber-800">Farm health data</p>
              <p className="mt-1 text-sm text-gray-600">
                {farmHealth === null
                  ? "Health scores are not recorded for your farms yet."
                  : `The average recorded farm health score is ${farmHealth}%.`}
              </p>
            </div>
          </div>
        </section>
      </div>

      <p className="text-sm text-gray-500">
        Statistics are calculated from your currently saved farms and
        recommendations. Market prices, productivity, and water efficiency
        are not estimated without recorded data.
      </p>
    </div>
  );
}

function SummaryCard({ title, value, subtitle, icon, color }) {
  const colors = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    yellow: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">{value}</h2>
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className={`rounded-full p-3 ${colors[color]}`}>{icon}</div>
      </div>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="py-8 text-center">
      <Sprout size={34} className="mx-auto text-gray-300" />
      <p className="mt-3 text-gray-500">{message}</p>
    </div>
  );
}

export default Analytics;
