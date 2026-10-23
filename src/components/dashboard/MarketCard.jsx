import { TrendingUp } from "lucide-react";

function MarketCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

      <div className="flex justify-between">

        <div>

          <p className="text-gray-500">
            Market Price
          </p>

          <h2 className="text-4xl font-bold text-green-700 mt-2">
            ₹2450
          </h2>

          <p className="text-green-600 mt-2">
            ▲ 5% Today
          </p>

        </div>

        <TrendingUp
          size={50}
          className="text-blue-600"
        />

      </div>

    </div>
  );
}

export default MarketCard;