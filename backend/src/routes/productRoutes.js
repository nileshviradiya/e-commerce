const express = require('express');
const {
  getAllProducts,
  getProductBySlug,
  seedProducts,
} = require('../controllers/productController');

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/:slug', getProductBySlug);

// Seed route (consider protecting this route in a real application, e.g., admin only)
router.post('/seed', seedProducts);

module.exports = router;
