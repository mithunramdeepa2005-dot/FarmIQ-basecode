
import { BarChart3 } from "lucide-react";
import MarketGrid from "../../components/market/MarketGrid";

function Marketplace() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
          <BarChart3 size={30} />
        </div>

        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Agricultural Markets
          </h1>

          <p className="text-gray-500 text-lg mt-2">
            Monitor crop listings, prices, and market movements.
          </p>
        </div>
      </div>

      <MarketGrid />
    </div>
  );
}

export default Marketplace;
