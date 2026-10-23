import { Sprout } from "lucide-react";

function CropCard() {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition">

      <div className="flex justify-between">

        <div>

          <p className="text-gray-500">
            Current Crop
          </p>

          <h2 className="text-3xl font-bold text-green-700 mt-2">
            Paddy
          </h2>

          <p className="text-green-600 mt-2">
            Healthy
          </p>

        </div>

        <Sprout
          size={50}
          className="text-green-600"
        />

      </div>

    </div>
  );
}

export default CropCard;