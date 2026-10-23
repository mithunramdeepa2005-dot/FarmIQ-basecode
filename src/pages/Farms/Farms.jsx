import { useEffect, useState } from "react";

import FarmList from "../../components/farms/FarmList";
import AddFarmButton from "../../components/farms/AddFarmButton";
import AddFarmModal from "../../components/farms/AddFarmModal";
import EditFarmModal from "../../components/farms/EditFarmModal";

import {
  getFarms,
  deleteFarm,
} from "../../api/farms";

function Farms() {
  const [isOpen, setIsOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);

  const [selectedFarm, setSelectedFarm] =
    useState(null);

  const [farms, setFarms] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  // ==========================================
  // LOAD FARMS
  // ==========================================

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getFarms();

      const formattedFarms =
        (data.farms || []).map((farm) => ({
          id: farm._id,

          name: farm.farmName,

          location: farm.location,

          area: `${farm.area} Acres`,

          crop: farm.crop,

          soilType:
            farm.soilType || "red",

          irrigation:
            farm.irrigation || "rain",

          status:
            farm.status || "Healthy",

          description:
            farm.description || "",
        }));

      setFarms(formattedFarms);
    } catch (err) {
      console.error(
        "Load Farms Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load farms"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  // ==========================================
  // FARM CREATED
  // ==========================================

  const handleFarmCreated = (newFarm) => {
    if (!newFarm) {
      setIsOpen(false);
      return;
    }

    const formattedFarm = {
      id: newFarm._id,

      name: newFarm.farmName,

      location: newFarm.location,

      area: `${newFarm.area} Acres`,

      crop: newFarm.crop,

      soilType:
        newFarm.soilType || "red",

      irrigation:
        newFarm.irrigation || "rain",

      status:
        newFarm.status || "Healthy",

      description:
        newFarm.description || "",
    };

    setFarms((currentFarms) => [
      ...currentFarms,
      formattedFarm,
    ]);

    setIsOpen(false);
    setError("");
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const handleEditClick = (farm) => {
    setSelectedFarm(farm);
    setEditOpen(true);
    setError("");
  };

  // ==========================================
  // FARM UPDATED
  // ==========================================

  const handleFarmUpdated = (updatedFarm) => {
    if (!updatedFarm) {
      setEditOpen(false);
      setSelectedFarm(null);
      return;
    }

    const formattedFarm = {
      id: updatedFarm._id,

      name: updatedFarm.farmName,

      location: updatedFarm.location,

      area: `${updatedFarm.area} Acres`,

      crop: updatedFarm.crop,

      soilType:
        updatedFarm.soilType || "red",

      irrigation:
        updatedFarm.irrigation || "rain",

      status:
        updatedFarm.status || "Healthy",

      description:
        updatedFarm.description || "",
    };

    setFarms((currentFarms) =>
      currentFarms.map((farm) =>
        farm.id === updatedFarm._id
          ? formattedFarm
          : farm
      )
    );

    setEditOpen(false);
    setSelectedFarm(null);
    setError("");
  };

  // ==========================================
  // DELETE FARM
  // ==========================================

  const handleDeleteFarm = async (id) => {
    try {
      setError("");

      await deleteFarm(id);

      setFarms((currentFarms) =>
        currentFarms.filter(
          (farm) => farm.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete Farm Error:",
        err
      );

      setError(
        err.message ||
          "Failed to delete farm"
      );
    }
  };

  // ==========================================
  // CLOSE ADD MODAL
  // ==========================================

  const handleCloseAddModal = () => {
    setIsOpen(false);
    setError("");
  };

  // ==========================================
  // CLOSE EDIT MODAL
  // ==========================================

  const handleCloseEditModal = () => {
    setEditOpen(false);
    setSelectedFarm(null);
    setError("");
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="space-y-6">

      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            My Farms
          </h1>

          <p className="text-gray-500 mt-2">
            Manage and monitor all your farms
            in one place.
          </p>
        </div>

        <AddFarmButton
          onClick={() => {
            setError("");
            setIsOpen(true);
          }}
        />

      </div>

      {/* ====================================== */}
      {/* ERROR */}
      {/* ====================================== */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
          {error}
        </div>
      )}

      {/* ====================================== */}
      {/* FARM LIST */}
      {/* ====================================== */}

      {loading ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">

          <div className="text-4xl mb-3">
            🌱
          </div>

          <p className="text-gray-500">
            Loading your farms...
          </p>

        </div>
      ) : farms.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">

          <div className="text-5xl mb-4">
            🌾
          </div>

          <h2 className="text-2xl font-bold text-gray-800">
            No Farms Added Yet
          </h2>

          <p className="text-gray-500 mt-2">
            Add your first farm to start
            managing your agricultural data.
          </p>

          <button
            type="button"
            onClick={() => {
              setError("");
              setIsOpen(true);
            }}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Add Your First Farm
          </button>

        </div>
      ) : (
        <FarmList
          farms={farms}
          onDelete={handleDeleteFarm}
          onEdit={handleEditClick}
        />
      )}

      {/* ====================================== */}
      {/* ADD FARM MODAL */}
      {/* ====================================== */}

      {isOpen && (
        <AddFarmModal
          onClose={handleCloseAddModal}
          onFarmCreated={handleFarmCreated}
        />
      )}

      {/* ====================================== */}
      {/* EDIT FARM MODAL */}
      {/* ====================================== */}

      {editOpen && selectedFarm && (
        <EditFarmModal
          farm={selectedFarm}
          onClose={handleCloseEditModal}
          onFarmUpdated={handleFarmUpdated}
        />
      )}

    </div>
  );
}

export default Farms;