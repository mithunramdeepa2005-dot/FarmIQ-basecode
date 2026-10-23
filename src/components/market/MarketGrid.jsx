
  import { useEffect, useMemo, useState } from "react";
  import {
    getCropMarketPrices,
    getCropPriceHistory,
  } from "../../api/cropMarket";

  const CROPS = [
    "All Crops",
    "Rice",
    "Groundnut",
    "Cotton",
    "Tomato",
    "Onion",
    "Wheat",
    "Maize",
    "Sugarcane",
    "Potato",
    "Other",
  ];

  function formatPrice(price) {
    return Number(price).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function MarketGrid() {
    const [prices, setPrices] = useState([]);
    const [selectedCrop, setSelectedCrop] = useState("All Crops");
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [error, setError] = useState("");
    const [today, setToday] = useState(() => new Date());

    // Keep the dashboard date current, even if the page stays open overnight.
    useEffect(() => {
      const dateInterval = setInterval(() => setToday(new Date()), 60_000);
      return () => clearInterval(dateInterval);
    }, []);

    useEffect(() => {
      let active = true;

      async function loadPrices() {
        try {
          setLoading(true);
          setError("");

          const data = await getCropMarketPrices();

          if (active) {
            setPrices(data.prices || []);
          }
        } catch (err) {
          if (active) {
            setError(err.message || "Could not load crop prices.");
          }
        } finally {
          if (active) setLoading(false);
        }
      }

      loadPrices();

      return () => {
        active = false;
      };
    }, []);

    const filteredPrices = useMemo(() => {
      const latestByMarket = new Map();

      prices.forEach((item) => {
        const key = `${item.cropName}-${item.marketName}-${item.district}-${item.unit}`;
        const existing = latestByMarket.get(key);

        if (
          !existing ||
          new Date(item.priceDate) > new Date(existing.priceDate)
        ) {
          latestByMarket.set(key, item);
        }
      });

      return [...latestByMarket.values()].filter(
        (item) =>
          selectedCrop === "All Crops" ||
          item.cropName === selectedCrop
      );
    }, [prices, selectedCrop]);

    async function openHistory(item) {
      setSelectedRecord(item);
      setHistory([]);
      setHistoryLoading(true);

      try {
        const data = await getCropPriceHistory(item.cropName, {
          district: item.district,
          marketName: item.marketName,
          limit: "30",
        });

        setHistory(data.history || []);
      } catch (err) {
        setError(err.message || "Could not load price history.");
      } finally {
        setHistoryLoading(false);
      }
    }

    const averagePrice = filteredPrices.length
      ? filteredPrices.reduce((sum, item) => sum + item.price, 0) /
        filteredPrices.length
      : 0;

    return (
      <div className="space-y-6">
        <section className="rounded-2xl bg-slate-950 p-6 text-white shadow-lg">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                FarmIQ Exchange
              </p>
              <h2 className="mt-2 text-3xl font-bold">
                Crop Market Watch
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Crop prices and historical market trends.
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Dashboard updated: {today.toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
              Demo data — not live market prices
            </div>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Markets displayed</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              {filteredPrices.length}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Average price per quintal
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">
              ₹{formatPrice(averagePrice)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Across displayed records; mixed crops may not be comparable.
            </p>
          </div>
        </div>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h3 className="text-xl font-bold text-gray-900">
              Crop prices
            </h3>

            <select
              value={selectedCrop}
              onChange={(event) => setSelectedCrop(event.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 outline-none focus:border-emerald-500"
            >
              {CROPS.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <p className="py-8 text-center text-gray-500">
              Loading crop prices...
            </p>
          )}

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {!loading && !error && filteredPrices.length === 0 && (
            <p className="py-8 text-center text-gray-500">
              No crop prices found.
            </p>
          )}

          {!loading && filteredPrices.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Crop</th>
                    <th className="px-4 py-3">Market</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3">Latest price</th>
                    <th className="px-4 py-3">Change</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">History</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPrices.map((item) => (
                    <tr
                      key={`${item._id}-${item.cropName}`}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 font-semibold text-gray-900">
                        {item.cropName}
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        {item.marketName}
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        {item.district}
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-900">
                        ₹{formatPrice(item.price)}
                        <span className="ml-1 text-xs font-normal text-gray-500">
                          /{item.unit}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-4 font-semibold ${
                          item.changePercent > 0
                            ? "text-emerald-600"
                            : item.changePercent < 0
                              ? "text-red-600"
                              : "text-gray-500"
                        }`}
                      >
                        {item.changePercent == null
                          ? "—"
                          : `${item.changePercent > 0 ? "+" : ""}${item.changePercent.toFixed(2)}%`}
                      </td>
                      <td className="px-4 py-4 text-gray-600">
                        {new Date(item.priceDate).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => openHistory(item)}
                          className="rounded-lg bg-emerald-50 px-3 py-2 font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          View chart
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {selectedRecord && (
          <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {selectedRecord.cropName} price history
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedRecord.marketName}, {selectedRecord.district}
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedRecord(null);
                  setHistory([]);
                }}
                className="self-start rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>

            {historyLoading && (
              <p className="py-6 text-gray-500">Loading history...</p>
            )}

            
  {!historyLoading && history.length > 0 && (
    <div className="mt-5">
      {(() => {
        const values = history.map((point) => Number(point.price));
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = max - min || 1;

        return (
          <>
            <div className="flex h-64 items-end gap-2 overflow-x-auto rounded-lg bg-slate-50 p-4">
              {history.map((point, index) => {
                const value = Number(point.price);
                const height = 15 + ((value - min) / range) * 85;

                return (
                  <div
                    key={point._id || index}
                    className="group relative flex h-full min-w-5 flex-1 items-end"
                    title={`${new Date(point.priceDate).toLocaleDateString("en-IN")} — ₹${formatPrice(value)}`}
                  >
                    <div
                      className="w-full rounded-t-md bg-emerald-500 hover:bg-emerald-700"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <span>
                {new Date(history[0].priceDate).toLocaleDateString("en-IN")}
              </span>
              <span>
                {new Date(history[history.length - 1].priceDate).toLocaleDateString("en-IN")}
              </span>
            </div>

            <p className="mt-3 text-xs text-amber-700">
              Historical values are generated demo data, not verified market prices.
            </p>
          </>
        );
      })()}
    </div>
  )}


            {!historyLoading && history.length === 0 && (
              <p className="py-6 text-gray-500">
                No historical records available.
              </p>
            )}
          </section>
        )}
      </div>
    );
  }

  export default MarketGrid;
