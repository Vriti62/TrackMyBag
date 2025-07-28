const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// Get product by ID
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// Add new product
exports.addProduct = async (req, res, next) => {
  const { name, description, price, category } = req.body;
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required.' });
  }
  try {
    const existingProduct = await Product.findOne({ name, category });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product with the same name and category already exists.' });
    }
    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      image: req.file ? `/uploads/products/${req.file.filename}` : null,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

// Update product
exports.updateProduct = async (req, res, next) => {
  const { name, description, price, category } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = parseFloat(price);
    if (category) product.category = category;

    if (req.file) {
      product.image = `/uploads/products/${req.file.filename}`;
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};