const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      // If no cart exists for the user, create an empty one
      cart = await Cart.create({ userId: req.user.id, items: [] });
    }

    // Optionally populate product details if items only store IDs
    // However, our schema stores denormalized name, price, image
    // If you need full product objects:
    // cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId', 'name description images');

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error getting cart: ${error.message}` });
  }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart/items
// @access  Private
exports.addItemToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;

  try {
    // Find the product to get its current details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.inventory < quantity) {
        return res.status(400).json({ success: false, message: 'Not enough product in stock' });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If no cart, create a new one
      cart = await Cart.create({
        userId,
        items: [{
          productId,
          quantity,
          price: product.price, // Store current price
          name: product.name,
          image: product.images && product.images.length > 0 ? product.images[0] : '/images/default-product.jpg',
        }],
      });
    } else {
      // Cart exists, check if item is already in cart
      const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        // Item exists, update quantity
        cart.items[itemIndex].quantity += quantity;
        // Optionally, re-check stock for the new total quantity:
        if (product.inventory < cart.items[itemIndex].quantity) {
            // This check is simplistic. If quantity was 1 and user adds 1, new quantity is 2.
            // A more robust check would be if (product.inventory < quantity_being_added_now)
            // Or even better, if (product.inventory < cart.items[itemIndex].quantity_after_potential_add)
            // For now, we assume the initial quantity check for the *added* amount is sufficient,
            // and rely on inventory checks at checkout.
             // However, let's adjust to check total quantity against inventory
            if (product.inventory < cart.items[itemIndex].quantity) {
                 return res.status(400).json({ success: false, message: `Not enough stock to add ${quantity}. Available: ${product.inventory}` });
            }
        }

      } else {
        // Item does not exist, add new item
        cart.items.push({
          productId,
          quantity,
          price: product.price,
          name: product.name,
          image: product.images && product.images.length > 0 ? product.images[0] : '/images/default-product.jpg',
        });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error adding item to cart: ${error.message}` });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
// @access  Private
exports.removeItemFromCart = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1); // Remove item from array
      await cart.save();
      res.status(200).json({ success: true, data: cart });
    } else {
      res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: `Error removing item from cart: ${error.message}` });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:productId
// @access  Private
exports.updateCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body; // New quantity
  const userId = req.user.id;

  if (quantity === undefined || quantity < 0) {
    return res.status(400).json({ success: false, message: 'Please provide a valid quantity (0 or more).' });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    if (quantity === 0) {
      // If quantity is 0, remove the item
      cart.items.splice(itemIndex, 1);
    } else {
      // Check stock before updating quantity
      const product = await Product.findById(productId);
      if (!product) {
        // This should ideally not happen if item is in cart, but good to check
        return res.status(404).json({ success: false, message: 'Product details not found for item in cart' });
      }
      if (product.inventory < quantity) {
        return res.status(400).json({ success: false, message: `Not enough product in stock. Available: ${product.inventory}` });
      }
      cart.items[itemIndex].quantity = quantity;
      // Price is not updated here, it remains the price at time of adding to cart.
    }

    await cart.save();
    res.status(200).json({ success: true, data: cart });

  } catch (error) {
    res.status(500).json({ success: false, message: `Error updating cart item quantity: ${error.message}` });
  }
};
