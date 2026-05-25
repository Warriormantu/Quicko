const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getProducts, getProduct, createProduct, updateProduct,
  deleteProduct, addReview, getRelated
} = require('../controllers/productController');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Specific routes FIRST (before /:id wildcard)
router.get('/', getProducts);
router.post('/', protect, adminOnly, upload.array('images', 5), createProduct);

// Sub-routes before generic /:id
router.get('/:id/related', getRelated);
router.post('/:id/reviews', protect, addReview);

// Generic /:id routes
router.get('/:id', getProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
