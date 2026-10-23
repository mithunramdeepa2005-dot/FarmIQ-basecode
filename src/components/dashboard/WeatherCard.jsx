import { CloudSun } from "lucide-react";

function WeatherCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

      <div className="flex justify-between items-start">

        <div>
          <p className="text-gray-500">Today's Weather</p>

          <h2 className="text-5xl font-bold text-green-700 mt-2">
            29°C
          </h2>

          <p className="mt-2 text-gray-600">
            Sunny
          </p>

          <p className="text-sm text-gray-400">
            Humidity: 62%
          </p>
        </div>

        <CloudSun size={55} className="text-yellow-500" />

      </div>

    </div>
  );
}

export default WeatherCard;