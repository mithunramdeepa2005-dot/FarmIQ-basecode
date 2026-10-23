import {
  Leaf,
  Droplets,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

function RecommendationResult({ result }) {
  if (!result) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Fill the form and click <strong>Recommend Crop</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">

      <div className="flex items-center gap-4">

        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center text-5xl">
          🌾
        </div>

        <div>
          <h2 className="text-4xl font-bold text-green-700">
            {result.crop}
          </h2>

          <p className="text-yellow-500 text-lg">
            ⭐⭐⭐⭐⭐
          </p>
        </div>

      </div>

      <div className="mt-8">

        <div className="flex justify-between mb-2">
          <span className="font-semibold">
            Suitability
          </span>

          <span className="font-bold text-green-700">
            95%
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4">

          <div
            className="bg-green-600 h-4 rounded-full"
            style={{ width: "95%" }}
          />

        </div>

      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <div className="flex items-center gap-3">
          <Leaf className="text-green-600" />
          <span>
            <strong>Suitable Soil:</strong> {result.soil}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Droplets className="text-blue-500" />
          <span>
            <strong>Water Need:</strong> {result.water}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <CalendarDays className="text-orange-500" />
          <span>
            <strong>Growth Time:</strong> {result.days}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <IndianRupee className="text-green-600" />
          <span>
            <strong>Market Price:</strong> {result.price}
          </span>
        </div>

      </div>

      <div className="bg-green-50 rounded-xl border border-green-200 p-5 mt-8">

        <h3 className="font-bold text-xl mb-2">
          AI Analysis
        </h3>

        <p className="text-gray-700">
          {result.reason}
        </p>

      </div>

    </div>
  );
}

export default RecommendationResult;