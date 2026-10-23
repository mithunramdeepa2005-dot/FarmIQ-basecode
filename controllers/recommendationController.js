// ==========================================
// RECOMMENDATION CONTROLLER
// ==========================================

import Recommendation from "../models/Recommendation.js";

// ==========================================
// GENERATE FARM RECOMMENDATION
// ==========================================

export const generateRecommendation = async (req, res) => {
  try {
    const {
      crop,
      soilType,
      farmSize,
      irrigation,
      weather,

      // Optional
      farmId,
      userId,
    } = req.body;

  

  

    // ==========================================
    // VALIDATION
    // ==========================================

    if (
      !crop ||
      !soilType ||
      !farmSize ||
      !irrigation
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide crop, soil type, farm size and irrigation type",
      });
    }

    const size = Number(farmSize);

    if (isNaN(size) || size <= 0) {
      return res.status(400).json({
        success: false,
        message: "Farm size must be greater than 0",
      });
    }

    // ==========================================
    // CROP INFORMATION
    // ==========================================

    const cropData = {
      rice: {
        water:
          "Rice requires consistent soil moisture. Maintain adequate water during active growth stages.",

        fertilizer:
          "Use nitrogen, phosphorus and potassium according to soil-test results. Split nitrogen applications during crop growth.",

        tips:
          "Monitor weeds and regularly inspect the crop for pests and diseases.",
      },

      wheat: {
        water:
          "Provide irrigation during important growth stages such as crown root initiation and grain development.",

        fertilizer:
          "Use balanced NPK fertilizer with nitrogen supplied in appropriate split applications.",

        tips:
          "Monitor weeds, rust diseases and insect damage throughout the growing season.",
      },

      groundnut: {
        water:
          "Avoid waterlogging. Provide moderate irrigation during flowering and pod development.",

        fertilizer:
          "Groundnut benefits from phosphorus, potassium, calcium and appropriate micronutrients.",

        tips:
          "Monitor for leaf spot, rust and soil-moisture stress.",
      },

      maize: {
        water:
          "Provide regular irrigation during germination, flowering and grain-filling stages.",

        fertilizer:
          "Maize generally responds well to balanced NPK with nitrogen supplied in stages.",

        tips:
          "Control weeds early and monitor for stem borers and fall armyworm.",
      },

      banana: {
        water:
          "Banana requires regular moisture. Drip irrigation can help maintain consistent soil moisture.",

        fertilizer:
          "Banana requires substantial potassium along with nitrogen and other nutrients.",

        tips:
          "Remove damaged leaves and monitor regularly for pests and fungal diseases.",
      },

      coconut: {
        water:
          "Provide regular irrigation during dry periods, especially around the root zone.",

        fertilizer:
          "Apply organic manure along with balanced potassium, nitrogen and phosphorus according to soil requirements.",

        tips:
          "Maintain good field sanitation and monitor the palm for pests and diseases.",
      },
    };

    const selectedCrop =
      cropData[String(crop).toLowerCase()] || {
        water:
          "Maintain appropriate soil moisture based on the crop's growth stage.",

        fertilizer:
          "Use fertilizer according to soil-test results and crop nutrient requirements.",

        tips:
          "Regularly monitor the crop for pests, diseases and nutrient deficiencies.",
      };

    // ==========================================
    // SOIL RECOMMENDATIONS
    // ==========================================

    const soilRecommendations = {
      red:
        "Red soil generally benefits from organic matter and balanced nutrient management. Consider soil testing before fertilizer application.",

      black:
        "Black soil can retain moisture well. Avoid excessive irrigation and monitor drainage during heavy rainfall.",

      alluvial:
        "Alluvial soil is generally fertile, but nutrient management should be based on soil testing and crop requirements.",

      sandy:
        "Sandy soil drains quickly. Apply organic matter and use smaller, more frequent irrigation and nutrient applications.",

      clay:
        "Clay soil can retain significant moisture. Ensure proper drainage and avoid excessive irrigation.",
    };

    // ==========================================
    // IRRIGATION RECOMMENDATIONS
    // ==========================================

    const irrigationRecommendations = {
      rain:
        "Since the farm is rain-fed, monitor rainfall carefully and consider supplemental irrigation during prolonged dry periods.",

      drip:
        "Drip irrigation can provide water directly to the root zone and improve water-use efficiency.",

      sprinkler:
        "Sprinkler irrigation can provide relatively uniform water distribution. Avoid unnecessary irrigation during rainy periods.",

      canal:
        "Schedule canal irrigation according to crop water requirements and avoid excessive irrigation or waterlogging.",
    };

    // ==========================================
    // FARM SIZE RECOMMENDATION
    // ==========================================

    let farmSizeAdvice;

    if (size < 2) {
      farmSizeAdvice =
        "For a small farm, focus on efficient input usage, regular crop monitoring and careful water management.";
    } else if (size <= 5) {
      farmSizeAdvice =
        "For a medium-sized farm, maintain a structured irrigation and fertilizer schedule and monitor different field sections regularly.";
    } else {
      farmSizeAdvice =
        "For a larger farm, divide the farm into manageable sections and maintain separate irrigation, fertilizer and crop-monitoring schedules.";
    }

    // ==========================================
    // WEATHER INFORMATION
    // ==========================================

    let weatherAdvice =
      "Monitor local weather conditions regularly and adjust irrigation and field activities accordingly.";

    if (weather) {
      const temperature = Number(
        weather.temperature
      );

      const humidity = Number(
        weather.humidity
      );

      if (!isNaN(temperature)) {
        if (temperature >= 35) {
          weatherAdvice =
            "High temperature detected. Monitor the crop for heat stress and maintain appropriate soil moisture.";
        } else if (temperature <= 20) {
          weatherAdvice =
            "Cool conditions detected. Monitor crop growth and avoid unnecessary irrigation.";
        }
      }

      if (
        !isNaN(humidity) &&
        humidity >= 80
      ) {
        weatherAdvice +=
          " High humidity may increase fungal-disease risk, so inspect crops regularly.";
      }
    }

    // ==========================================
    // WEATHER-BASED RECOMMENDATION
    // ==========================================

    const temperature = Number(
      weather?.temperature || 0
    );

    const humidity = Number(
      weather?.humidity || 0
    );

    const weatherDescription =
      String(
        weather?.description || ""
      ).toLowerCase();

    let weatherManagement =
      "Monitor local weather conditions regularly and adjust irrigation and field activities accordingly.";

    if (
      humidity >= 80 ||
      weatherDescription.includes("rain") ||
      weatherDescription.includes("drizzle") ||
      weatherDescription.includes("storm")
    ) {
      weatherManagement =
        "High humidity or wet weather detected. Avoid unnecessary irrigation, maintain proper drainage and monitor soil moisture.";
    } else if (
      temperature >= 35 &&
      humidity < 50
    ) {
      weatherManagement =
        "Hot and relatively dry conditions detected. Monitor soil moisture closely and provide irrigation according to crop requirements.";
    } else if (temperature >= 30) {
      weatherManagement =
        "Warm conditions detected. Monitor soil moisture and provide irrigation according to the crop growth stage.";
    }

    
const alternativeCrops = {
  red: {
    rain: ["Groundnut", "Millet", "Pulses"],
    drip: ["Groundnut", "Vegetables", "Millet"],
    sprinkler: ["Millet", "Groundnut", "Maize"],
    canal: ["Maize", "Pulses", "Groundnut"],
  },
  black: {
    rain: ["Millet", "Pulses", "Cotton"],
    drip: ["Cotton", "Pulses", "Groundnut"],
    sprinkler: ["Maize", "Pulses", "Cotton"],
    canal: ["Cotton", "Maize", "Pulses"],
  },
  alluvial: {
    rain: ["Pulses", "Maize", "Groundnut"],
    drip: ["Vegetables", "Maize", "Groundnut"],
    sprinkler: ["Maize", "Vegetables", "Pulses"],
    canal: ["Rice", "Wheat", "Maize"],
  },
  sandy: {
    rain: ["Millet", "Groundnut", "Pulses"],
    drip: ["Groundnut", "Vegetables", "Millet"],
    sprinkler: ["Millet", "Groundnut", "Maize"],
    canal: ["Groundnut", "Maize", "Pulses"],
  },
  clay: {
    rain: ["Pulses", "Rice", "Millet"],
    drip: ["Pulses", "Vegetables", "Maize"],
    sprinkler: ["Maize", "Pulses", "Rice"],
    canal: ["Rice", "Maize", "Pulses"],
  },
};


const cropReasons = {
  rice: "Often suited to water-retentive soils where adequate water is available.",
  wheat: "Can be considered where the local climate and growing season suit wheat.",
  groundnut: "Can grow in well-drained soils; avoid waterlogging.",
  maize: "Consider where soil fertility, temperature, and water supply are suitable.",
  banana: "Requires reliable water and suitable warm growing conditions.",
  coconut: "A long-term crop to evaluate against local climate and soil conditions.",
  millet: "Some millet varieties tolerate relatively dry conditions.",
  pulses: "Many pulse crops can fit into crop rotations; suitability varies by species.",
  cotton: "Can be considered in suitable climates and soils with appropriate drainage.",
  vegetables: "Choose specific vegetables according to season, soil, and market demand.",
};

const soilKey = String(soilType).toLowerCase();
const irrigationKey = String(irrigation).toLowerCase();

const suggestedCrops = (
  alternativeCrops[soilKey]?.[irrigationKey] || []
)
  .filter(
    (suggestedCrop) =>
      suggestedCrop.toLowerCase() !==
      String(crop).trim().toLowerCase()
  )
  .map((suggestedCrop) => ({
    name: suggestedCrop,
    reason:
      cropReasons[suggestedCrop.toLowerCase()] ||
      "Evaluate this crop against local soil, seasonal, and water requirements.",
  }));



    // ==========================================
    // FINAL RECOMMENDATION
    // ==========================================

    const recommendation = {
      crop,
      soilType,
      farmSize: size,
      irrigation,

      weather: weather || null,

      suggestedCrops,

      waterManagement: selectedCrop.water,

      waterManagement:
        selectedCrop.water,

      fertilizer:
        selectedCrop.fertilizer,

      cropManagement:
        selectedCrop.tips,

      soilManagement:
        soilRecommendations[
          String(soilType).toLowerCase()
        ] ||
        "Perform a soil test and manage nutrients according to crop requirements.",

      irrigationManagement:
        irrigationRecommendations[
          String(irrigation).toLowerCase()
        ] ||
        "Adjust irrigation according to soil moisture and crop growth stage.",

      farmManagement:
        farmSizeAdvice,

      weatherManagement:
        weatherManagement,
    };

    // ==========================================
    // SAVE TO MONGODB
    // ==========================================

    const savedRecommendation =
      await Recommendation.create({
        userId: req.user.userId,
        farmId: farmId || null,

        crop, 
        soilType,
        farmSize: size,
        irrigation,

        suggestedCrops: recommendation.suggestedCrops,

        weather: weather || null,

        waterManagement:
          recommendation.waterManagement,

        fertilizer:
          recommendation.fertilizer,

        cropManagement:
          recommendation.cropManagement,

        soilManagement:
          recommendation.soilManagement,

        irrigationManagement:
          recommendation.irrigationManagement,

        farmManagement:
          recommendation.farmManagement,

        weatherManagement:
          recommendation.weatherManagement,
      });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      message:
        "Recommendation generated and saved successfully",

      recommendation: {
        ...recommendation,

        // MongoDB document ID
        _id: savedRecommendation._id,

        createdAt:
          savedRecommendation.createdAt,
      },
    });

  } catch (error) {
    console.error(
      "Recommendation Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Server error while generating recommendation",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });

    
  }
};


export const getRecommendationHistory = async (req, res) => {
  try {
    const recommendations = await Recommendation.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error("Recommendation History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recommendation history",
    });
  }
};
