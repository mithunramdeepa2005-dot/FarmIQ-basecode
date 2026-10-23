
import CropMarketPrice from "../models/CropMarketPrice.js";

// ==========================================
// GET ALL CROP MARKET PRICES
// ==========================================

export const getCropMarketPrices = async (req, res) => {
  try {
    const { cropName, district, marketName } = req.query;

    const filter = {};

    if (cropName) {
      filter.cropName = {
        $regex: cropName,
        $options: "i",
      };
    }

    if (district) {
      filter.district = {
        $regex: district,
        $options: "i",
      };
    }

    if (marketName) {
      filter.marketName = {
        $regex: marketName,
        $options: "i",
      };
    }

    const prices = await CropMarketPrice.find(filter)
      .sort({ priceDate: -1 })
      .limit(500)
      .lean();

    // Calculate percentage change against the previous
    // recorded price for the same crop and market.
    const results = await Promise.all(
      prices.map(async (item) => {
        const previous = await CropMarketPrice.findOne({
          cropName: item.cropName,
          marketName: item.marketName,
          unit: item.unit,
          priceDate: { $lt: item.priceDate },
        })
          .sort({ priceDate: -1 })
          .select("price priceDate")
          .lean();

        let changePercent = null;

        if (previous && previous.price > 0) {
          changePercent = Number(
            (
              ((item.price - previous.price) / previous.price) *
              100
            ).toFixed(2)
          );
        }

        return {
          ...item,
          previousPrice: previous?.price ?? null,
          changePercent,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: results.length,
      prices: results,
    });
  } catch (error) {
    console.error("Get Crop Market Prices Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch crop market prices.",
    });
  }
};

// ==========================================
// GET PRICE HISTORY FOR ONE CROP + MARKET
// ==========================================

export const getCropPriceHistory = async (req, res) => {
  try {
    const { cropName } = req.params;
    const { district, marketName, limit = 30 } = req.query;

    const filter = {
      cropName: {
        $regex: `^${cropName}$`,
        $options: "i",
      },
    };

    if (district) filter.district = district;
    if (marketName) filter.marketName = marketName;

    const safeLimit = Math.min(
      Math.max(Number.parseInt(limit, 10) || 30, 1),
      365
    );

    const history = await CropMarketPrice.find(filter)
      .sort({ priceDate: -1 })
      .limit(safeLimit)
      .lean();

    return res.status(200).json({
      success: true,
      count: history.length,
      history: history.reverse(),
    });
  } catch (error) {
    console.error("Get Crop Price History Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch crop price history.",
    });
  }
};
