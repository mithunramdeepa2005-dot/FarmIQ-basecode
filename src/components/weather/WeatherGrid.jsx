import WeatherCard from "./WeatherCard";
import ForecastCard from "./ForecastCard";
import FarmingAdvice from "./FarmingAdvice";
import WeatherAlert from "./WeatherAlert";

function WeatherGrid() {
  return (
    <div className="space-y-6">

      {/* Weather Alert */}

      <WeatherAlert />

      {/* Weather + Forecast */}

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2">
          <WeatherCard />
        </div>

        <ForecastCard />

      </div>

      {/* Farming Advice */}

      <FarmingAdvice />

    </div>
  );
}

export default WeatherGrid;