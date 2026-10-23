import {
  TrendingUp,
  TrendingDown,
} from "lucide-react";

function MarketCard({ crop }) {
  const currentPrice = Number(crop.price || 0);
  const previousPrice = Number(
    crop.previousPrice || 0
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex justify-between items-start">

        <div>
          <h2 className="text-2xl font-bold text-green-700">
            {crop.name}
          </h2>

          <p className="text-4xl font-bold mt-4">
            ₹{currentPrice}
          </p>

          <p className="text-gray-500">
            Per {crop.unit || "Quintal"}
          </p>
        </div>

        {/* PRICE DIRECTION ICON */}

        <div
          className={`p-3 rounded-full ${
            crop.up
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {crop.up ? (
            <TrendingUp size={30} />
          ) : (
            <TrendingDown size={30} />
          )}
        </div>

      </div>

      {/* ======================================
          PRICE CHANGE
      ====================================== */}

      <div className="mt-6">

        <span
          className={`font-semibold ${
            crop.up
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {crop.up ? "↑" : "↓"} {crop.change}
        </span>

        <span className="text-gray-500 ml-2">
          Today
        </span>

      </div>

      {/* ======================================
          PREVIOUS PRICE
      ====================================== */}

      {previousPrice > 0 &&
        previousPrice !== currentPrice && (
          <div className="mt-3 text-sm text-gray-500">
            Previous price: ₹{previousPrice}
          </div>
        )}

    </div>
  );
}

export default MarketCard;