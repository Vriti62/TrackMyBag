



const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { loadProducts, saveProducts } = require('../models/productModel');
const router = express.Router();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/products/');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, JPG, PNG, GIF) are allowed!'));
    }
  },
});

// Middleware for error handling
const handleErrors = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'An unexpected error occurred' });
};

// Route to fetch all products
router.get('/', (req, res, next) => {
  try {
    const products = loadProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

// Route to fetch a single product by ID
router.get('/:id', (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);
    const products = loadProducts();
    const product = products.find(p => p.id === productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

// Route to add a new product with file upload
router.post('/', upload.single('image'), (req, res, next) => {
  const { name, description, price, category } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required.' });
  }

  try {
    const products = loadProducts();
    const existingProduct = products.find(p => p.name === name && p.category === category);
    if (existingProduct) {
      return res.status(400).json({ error: 'Product with the same name and category already exists.' });
    }

    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = {
      id: nextId,
      name,
      description,
      price: parseFloat(price),
      category,
      image: req.file ? `/uploads/products/${req.file.filename}` : null,
    };

    products.push(newProduct);
    saveProducts(products);

    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// Route to update a product with optional file upload
router.put('/:id', upload.single('image'), (req, res, next) => {
  const productId = parseInt(req.params.id);
  const { name, description, price, category } = req.body;

  try {
    const products = loadProducts();
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const updatedProduct = {
      ...products[productIndex],
      name: name || products[productIndex].name,
      description: description || products[productIndex].description,
      price: price ? parseFloat(price) : products[productIndex].price,
      category: category || products[productIndex].category,
    };

    if (req.file) {
      // Delete old image if it exists
      if (products[productIndex].image) {
        const oldImagePath = path.join(__dirname, '..', products[productIndex].image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updatedProduct.image = `/uploads/products/${req.file.filename}`;
    }

    products[productIndex] = updatedProduct;
    saveProducts(products);

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// Route to delete a product
router.delete('/:id', (req, res, next) => {
  const productId = parseInt(req.params.id);

  try {
    const products = loadProducts();
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Delete the image file from the server if it exists
    if (products[productIndex].image) {
      const imagePath = path.join(__dirname, '..', products[productIndex].image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    products.splice(productIndex, 1);
    saveProducts(products);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Apply error handling middleware
router.use(handleErrors);

module.exports = router;

