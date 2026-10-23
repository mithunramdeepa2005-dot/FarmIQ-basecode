import { useState } from "react";

function RecommendationForm({ setResult }) {
  const [soil, setSoil] = useState("Loamy");
  const [season, setSeason] = useState("Summer");
  const [temperature, setTemperature] = useState("");
  const [rainfall, setRainfall] = useState("");

  const handleRecommend = () => {
    const temp = Number(temperature);
    const rain = Number(rainfall);

    let recommendation = {
      crop: "Maize",
      soil: "Mixed",
      water: "Medium",
      days: "95 Days",
      price: "₹2250 / Quintal",
      reason:
        "Based on the selected conditions, Maize is the safest recommendation.",
    };

    if (
      soil === "Loamy" &&
      season === "Summer" &&
      temp >= 28 &&
      rain >= 200
    ) {
      recommendation = {
        crop: "Paddy",
        soil: "Loamy",
        water: "High",
        days: "120 Days",
        price: "₹2540 / Quintal",
        reason:
          "Loamy soil with high rainfall and warm temperature makes Paddy the best recommendation.",
      };
    } else if (soil === "Sandy" && season === "Summer") {
      recommendation = {
        crop: "Groundnut",
        soil: "Sandy",
        water: "Medium",
        days: "110 Days",
        price: "₹6100 / Quintal",
        reason:
          "Groundnut grows well in sandy soil during summer and requires moderate irrigation.",
      };
    } else if (soil === "Black" && season === "Winter") {
      recommendation = {
        crop: "Cotton",
        soil: "Black",
        water: "Medium",
        days: "180 Days",
        price: "₹7200 / Quintal",
        reason:
          "Black soil retains moisture and provides excellent nutrients for Cotton.",
      };
    } else if (soil === "Clay" && season === "Rainy") {
      recommendation = {
        crop: "Rice",
        soil: "Clay",
        water: "Very High",
        days: "130 Days",
        price: "₹2800 / Quintal",
        reason:
          "Clay soil retains water effectively, making it ideal for Rice cultivation.",
      };
    } else if (soil === "Loamy" && season === "Winter") {
      recommendation = {
        crop: "Wheat",
        soil: "Loamy",
        water: "Medium",
        days: "140 Days",
        price: "₹3200 / Quintal",
        reason:
          "Loamy soil and cool winter temperatures create excellent conditions for Wheat.",
      };
    }

    setResult(recommendation);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        Enter Farm Conditions
      </h2>

      <div className="space-y-4">

        <select
          value={soil}
          onChange={(e) => setSoil(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option>Loamy</option>
          <option>Sandy</option>
          <option>Clay</option>
          <option>Black</option>
        </select>

        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="w-full border rounded-lg p-3"
        >
          <option>Summer</option>
          <option>Winter</option>
          <option>Rainy</option>
        </select>

        <input
          type="number"
          placeholder="Temperature (°C)"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <input
          type="number"
          placeholder="Rainfall (mm)"
          value={rainfall}
          onChange={(e) => setRainfall(e.target.value)}
          className="w-full border rounded-lg p-3"
        />

        <button
          onClick={handleRecommend}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
        >
          Recommend Crop
        </button>

      </div>

    </div>
  );
}

export default RecommendationForm;