const express = require('express');
const {
  getCart,
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
} = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware'); // Assuming this is the correct path

const router = express.Router();

// All cart routes are protected
router.use(protect);

router.route('/')
  .get(getCart);

router.route('/items')
  .post(addItemToCart);

router.route('/items/:productId')
  .put(updateCartItemQuantity)
  .delete(removeItemFromCart);

module.exports = router;
