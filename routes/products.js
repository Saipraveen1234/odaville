const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");
const { auth } = require("./auth");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get all products or filtered by category
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query).sort({
      order: 1,
      createdAt: -1,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new product
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, subtitle, description, category, featured, order } =
      req.body;
    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;

    if (!imageUrl) {
      return res.status(400).json({ message: "Product image is required" });
    }

    const product = new Product({
      title,
      subtitle,
      description,
      category,
      imageUrl,
      featured: featured === "true",
      order: order ? parseInt(order) : 0,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, subtitle, description, category, featured, order } =
      req.body;
    const updateData = {
      title,
      subtitle,
      description,
      category,
      featured: featured === "true",
      order: order ? parseInt(order) : 0,
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/products/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product
router.delete("/:id", auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
