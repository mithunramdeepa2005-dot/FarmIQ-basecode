import Farm from "../models/Farm.js";

// ===============================
// CREATE FARM
// ===============================
export const createFarm = async (req, res) => {
  try {
    const {
      farmName,
      location,
      crop,
      area,
      description,
    } = req.body;

    // Validate required fields
    if (!farmName || !location || !crop || area === undefined) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required farm fields",
      });
    }

    // Create farm for logged-in user
    
const farm = await Farm.create({
  userId: req.user.userId,
  farmName: farmName.trim(),
  location: location.trim(),
  crop: crop.trim(),
  area: Number(area),
  soilType: req.body.soilType || "red",
  irrigation: req.body.irrigation || "rain",
  status: req.body.status || "Healthy",
  description: description?.trim() || "",
});


    return res.status(201).json({
      success: true,
      message: "Farm created successfully",
      farm,
    });
  } catch (error) {
    console.error("Create Farm Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while creating farm",
    });
  }
};


// ===============================
// GET MY FARMS
// ===============================
export const getMyFarms = async (req, res) => {
  try {
    const farms = await Farm.find({
      userId: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: farms.length,
      farms,
    });
  } catch (error) {
    console.error("Get Farms Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching farms",
    });
  }
};


// ===============================
// GET SINGLE FARM
// ===============================
export const getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    return res.status(200).json({
      success: true,
      farm,
    });
  } catch (error) {
    console.error("Get Farm Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while fetching farm",
    });
  }
};


// ===============================
// UPDATE FARM
// ===============================

export const updateFarm = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      farmName,
      location,
      crop,
      area,
      soilType,
      irrigation,
      status,
      description,
    } = req.body;

    const farm = await Farm.findOne({
      _id: id,
      userId: req.user.userId,
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    if (farmName !== undefined) farm.farmName = farmName.trim();
    if (location !== undefined) farm.location = location.trim();
    if (crop !== undefined) farm.crop = crop.trim();

    if (area !== undefined) {
      const numericArea = Number(area);

      if (!Number.isFinite(numericArea) || numericArea <= 0) {
        return res.status(400).json({
          success: false,
          message: "Farm area must be greater than 0",
        });
      }

      farm.area = numericArea;
    }

    if (soilType !== undefined) farm.soilType = soilType;
    if (irrigation !== undefined) farm.irrigation = irrigation;
    if (status !== undefined) farm.status = status;

    if (description !== undefined) {
      farm.description = description.trim();
    }

    await farm.save();

    return res.status(200).json({
      success: true,
      message: "Farm updated successfully",
      farm,
    });
  } catch (error) {
    console.error("Update Farm Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating farm",
    });
  }
};



// ===============================
// DELETE FARM
// ===============================
export const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!farm) {
      return res.status(404).json({
        success: false,
        message: "Farm not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Farm deleted successfully",
    });
  } catch (error) {
    console.error("Delete Farm Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while deleting farm",
    });
  }
};