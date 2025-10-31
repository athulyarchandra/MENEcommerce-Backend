import Product from "../models/productModel.js";

// ADD PRODUCT
export const addProduct = async (req, res) => {
  console.log("Inside addProduct controller...");
  try {
    const {
      productCode,
      name,
      price,
      available_country,
      tax_rate,
      color,
      size,
      stock,
      category,
      offer,
      description,
      brand,
      ratings,
    } = req.body;

    const productImages = req.files ? req.files.map((file) => file.path) : [];

    if (
      !productCode ||
      !name ||
      !price ||
      !available_country ||
      !tax_rate ||
      !color ||
      !size ||
      !stock ||
      !category ||
      !offer ||
      !description ||
      !brand ||
      !ratings
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const existing = await Product.findOne({ productCode });
    if (existing) {
      return res.status(409).json({ error: "Product code already exists." });
    }

    const newProduct = new Product({
      productCode,
      name,
      price,
      available_country,
      tax_rate,
      color,
      size,
      stock,
      category,
      offer,
      description,
      brand,
      ratings,
      productImages,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", newProduct });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET ALL
export const getAllProducts = async (req, res) => {
  try {
    const allProductsList = await Product.find({});
    res.status(200).json({ allProductsList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// EDIT PRODUCT
export const editSinglePrdt = async (req, res) => {
  try {
    const productId = req.params.id;
    const existing = await Product.findById(productId);
    if (!existing) return res.status(404).json({ error: "Product not found" });

    const {
      name,
      price,
      available_country,
      tax_rate,
      color,
      size,
      stock,
      category,
      offer,
      description,
      brand,
      ratings,
    } = req.body;

    const productImages = req.files?.length
      ? req.files.map((file) => file.path)
      : existing.productImages;

    const updated = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        price,
        available_country,
        tax_rate,
        color,
        size,
        stock,
        category,
        offer,
        description,
        brand,
        ratings,
        productImages,
      },
      { new: true }
    );

    res.status(200).json({ message: "Product updated successfully", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE PRODUCT
export const removeSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Not found" });

    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Single Product (for user view)
export const getSingleProductByUser = async (req, res) => {
  console.log("Inside getSingleProductByUser controller...");
  try {
    const { id } = req.params;

    // Check if ID is provided
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Find product by ID
    const singleProduct = await Product.findById(id);

    // If product not found
    if (!singleProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Send back single product details
    return res.status(200).json({
      message: "Product fetched successfully",
      singleProduct,
    });

  } catch (err) {
    console.error("Error fetching product details:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};



