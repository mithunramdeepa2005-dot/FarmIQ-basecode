import Product from "../models/Product.js";

// ==========================================
// HELPER: ADD PRICE CHANGE DATA
// ==========================================

const formatProduct = (product) => {
  const productObject = product.toObject();

  const currentPrice = Number(
    productObject.price || 0
  );

  const previousPrice = Number(
    productObject.previousPrice || 0
  );

  let change = "0.0%";
  let up = true;

  if (previousPrice > 0) {
    const percentageChange =
      ((currentPrice - previousPrice) /
        previousPrice) *
      100;

    change =
      percentageChange.toFixed(1) + "%";

    up = percentageChange >= 0;
  }

  return {
    ...productObject,
    change,
    up,
  };
};


// ==========================================
// GET ALL PRODUCTS
// ==========================================

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 });

    const formattedProducts =
      products.map(formatProduct);

    return res.status(200).json({
      success: true,
      count: formattedProducts.length,
      products: formattedProducts,
    });

  } catch (error) {
    console.error(
      "Get Products Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching products",
    });
  }
};


// ==========================================
// GET PRODUCT BY ID
// ==========================================

export const getProductById = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product: formatProduct(product),
    });

  } catch (error) {
    console.error(
      "Get Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while fetching product",
    });
  }
};


// ==========================================
// CREATE PRODUCT
// ==========================================

export const createProduct = async (
  req,
  res
) => {
  try {
    const {
      name,
      category,
      description,
      price,
      previousPrice,
      unit,
      stock,
      seller,
      location,
      image,
      isAvailable,
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (
      !name ||
      !category ||
      price === undefined ||
      !unit ||
      stock === undefined ||
      !seller ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please fill all required product fields",
      });
    }

    const currentPrice = Number(price);

    const oldPrice =
      previousPrice !== undefined
        ? Number(previousPrice)
        : currentPrice;

    if (
      Number.isNaN(currentPrice) ||
      currentPrice < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product price",
      });
    }

    // ======================================
    // CREATE PRODUCT
    // ======================================

    const product =
      await Product.create({
        name: name.trim(),

        category,

        description:
          description?.trim() || "",

        price: currentPrice,

        previousPrice: oldPrice,

        unit: unit.trim(),

        stock: Number(stock),

        seller: seller.trim(),

        location: location.trim(),

        image: image?.trim() || "",

        isAvailable:
          isAvailable !== undefined
            ? isAvailable
            : true,
      });

    return res.status(201).json({
      success: true,
      message:
        "Product created successfully",
      product: formatProduct(product),
    });

  } catch (error) {
    console.error(
      "Create Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while creating product",
    });
  }
};


// ==========================================
// UPDATE PRODUCT
// ==========================================

export const updateProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findById(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      category,
      description,
      price,
      previousPrice,
      unit,
      stock,
      seller,
      location,
      image,
      isAvailable,
    } = req.body;

    // ======================================
    // BASIC FIELDS
    // ======================================

    if (name !== undefined) {
      product.name = name.trim();
    }

    if (category !== undefined) {
      product.category = category;
    }

    if (description !== undefined) {
      product.description =
        description.trim();
    }

    // ======================================
    // PRICE UPDATE
    // ======================================

    if (price !== undefined) {
      const newPrice = Number(price);

      if (
        Number.isNaN(newPrice) ||
        newPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product price",
        });
      }

      // If price changes, move the
      // current price into previousPrice.
      if (newPrice !== product.price) {
        product.previousPrice =
          product.price;
      }

      product.price = newPrice;
    }

    // Allow manually setting previousPrice
    // when needed.
    if (
      previousPrice !== undefined &&
      price === undefined
    ) {
      const oldPrice =
        Number(previousPrice);

      if (
        Number.isNaN(oldPrice) ||
        oldPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid previous price",
        });
      }

      product.previousPrice =
        oldPrice;
    }

    // ======================================
    // OTHER FIELDS
    // ======================================

    if (unit !== undefined) {
      product.unit = unit.trim();
    }

    if (stock !== undefined) {
      product.stock = Number(stock);
    }

    if (seller !== undefined) {
      product.seller = seller.trim();
    }

    if (location !== undefined) {
      product.location =
        location.trim();
    }

    if (image !== undefined) {
      product.image = image.trim();
    }

    if (isAvailable !== undefined) {
      product.isAvailable =
        isAvailable;
    }

    // ======================================
    // SAVE
    // ======================================

    await product.save();

    return res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
      product: formatProduct(product),
    });

  } catch (error) {
    console.error(
      "Update Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while updating product",
    });
  }
};


// ==========================================
// DELETE PRODUCT
// ==========================================

export const deleteProduct = async (
  req,
  res
) => {
  try {
    const product =
      await Product.findByIdAndDelete(
        req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while deleting product",
    });
  }
};