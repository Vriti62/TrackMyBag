const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup for product images
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
const upload = multer({ storage });

// Routes
router.get("/", productsController.getAllProducts);
router.get("/:id", productsController.getProductById);
router.post("/", upload.single('image'), productsController.addProduct);
router.put("/:id", upload.single('image'), productsController.updateProduct);
router.delete("/:id", productsController.deleteProduct);

module.exports = router;