import { useEffect, useState } from "react";
import { X, Sprout } from "lucide-react";

import { updateFarm } from "../../api/farms";

function EditFarmModal({
  farm,
  onClose,
  onFarmUpdated,
}) {
  const [formData, setFormData] = useState({
    farmName: "",
    location: "",
    crop: "",
    area: "",
    soilType: "",
    irrigation: "",
    status: "Healthy",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD FARM DATA
  // ==========================================

  useEffect(() => {
    if (!farm) {
      return;
    }

    // Convert "7 Acres" -> "7"
    const cleanArea = String(
      farm.area ?? ""
    )
      .replace(/Acres?/gi, "")
      .trim();

    setFormData({
      farmName: farm.name || "",
      location: farm.location || "",
      crop: farm.crop || "",
      area: cleanArea,
      soilType: farm.soilType || "red",
      irrigation: farm.irrigation || "rain",
      status: farm.status || "Healthy",
      description: farm.description || "",
    });

    setError("");
  }, [farm]);

  // ==========================================
  // HANDLE INPUT CHANGES
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  // ==========================================
  // UPDATE FARM
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.farmName.trim() ||
      !formData.location.trim() ||
      !formData.crop.trim() ||
      !formData.area ||
      !formData.soilType ||
      !formData.irrigation
    ) {
      setError(
        "Please fill in all required fields."
      );

      return;
    }

    const numericArea = Number(
      formData.area
    );

    if (
      !Number.isFinite(numericArea) ||
      numericArea <= 0
    ) {
      setError(
        "Farm area must be a valid number greater than 0."
      );

      return;
    }

    if (!farm?.id) {
      setError(
        "Farm ID is missing. Please close and reopen the edit form."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      const farmData = {
        farmName:
          formData.farmName.trim(),

        location:
          formData.location.trim(),

        crop:
          formData.crop.trim(),

        area: numericArea,

        soilType:
          formData.soilType,

        irrigation:
          formData.irrigation,

        status:
          formData.status,

        description:
          formData.description.trim(),
      };

      console.log(
        "Updating farm:",
        farm.id
      );

      console.log(
        "Update data:",
        farmData
      );

      const data = await updateFarm(
        farm.id,
        farmData
      );

      if (
        data?.farm &&
        onFarmUpdated
      ) {
        onFarmUpdated(data.farm);
      }

      onClose();
    } catch (err) {
      console.error(
        "Update Farm Error:",
        err
      );

      setError(
        err.message ||
          "Failed to update farm."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // NO FARM
  // ==========================================

  if (!farm) {
    return null;
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}

        <div className="flex items-center justify-between p-6 border-b">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
              <Sprout
                size={24}
                className="text-green-600"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Edit Farm
              </h2>

              <p className="text-sm text-gray-500">
                Update your farm information
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-gray-100 transition disabled:opacity-50"
          >
            <X size={22} />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* FARM NAME */}

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Farm Name
            </label>

            <input
              type="text"
              name="farmName"
              value={formData.farmName}
              onChange={handleChange}
              placeholder="e.g. Green Valley Farm"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* LOCATION */}

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Vellore"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* CROP + AREA */}

          <div className="grid md:grid-cols-2 gap-5">

            {/* CROP */}

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Crop
              </label>

              <input
                type="text"
                name="crop"
                value={formData.crop}
                onChange={handleChange}
                placeholder="e.g. Groundnut"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* AREA */}

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Farm Area
              </label>

              <div className="relative">

                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  min="0.1"
                  step="0.1"
                  placeholder="5"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-20 outline-none focus:ring-2 focus:ring-green-500"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  acres
                </span>

              </div>
            </div>

          </div>

          {/* SOIL + IRRIGATION */}

          <div className="grid md:grid-cols-2 gap-5">

            {/* SOIL */}

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Soil Type
              </label>

              <select
                name="soilType"
                value={formData.soilType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">
                  Select soil type
                </option>

                <option value="red">
                  Red Soil
                </option>

                <option value="black">
                  Black Soil
                </option>

                <option value="alluvial">
                  Alluvial Soil
                </option>

                <option value="sandy">
                  Sandy Soil
                </option>

                <option value="clay">
                  Clay Soil
                </option>
              </select>
            </div>

            {/* IRRIGATION */}

            <div>
              <label className="block font-medium text-gray-700 mb-2">
                Irrigation
              </label>

              <select
                name="irrigation"
                value={formData.irrigation}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">
                  Select irrigation
                </option>

                <option value="rain">
                  Rain Fed
                </option>

                <option value="drip">
                  Drip Irrigation
                </option>

                <option value="sprinkler">
                  Sprinkler
                </option>

                <option value="canal">
                  Canal Irrigation
                </option>
              </select>
            </div>

          </div>

          {/* STATUS */}

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Farm Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Healthy">
                Healthy
              </option>

              <option value="Growing">
                Growing
              </option>

              <option value="Needs Water">
                Needs Water
              </option>

              <option value="Harvest Ready">
                Harvest Ready
              </option>
            </select>
          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Add additional information..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* ERROR */}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              <p className="font-medium">
                {error}
              </p>
            </div>
          )}

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition"
            >
              {loading
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditFarmModal;