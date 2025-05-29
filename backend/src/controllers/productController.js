const Product = require('../models/ProductModel');

const mockProducts = [
  {
    name: 'Awesome T-Shirt',
    description: 'Comfortable cotton t-shirt, available in various sizes and colors. Made from 100% organic cotton.',
    price: 19.99,
    images: ['/images/tshirt_default.jpg'],
    inventory: 100,
    isPublished: true,
  },
  {
    name: 'Cool Mug',
    description: 'Keeps your coffee warm and your hands cool. Ceramic mug, dishwasher safe.',
    price: 12.50,
    images: ['/images/mug_default.jpg'],
    inventory: 50,
    isPublished: true,
  },
  {
    name: 'Super Comfy Hoodie',
    description: 'A warm and stylish hoodie perfect for chilly evenings. Fleece-lined interior.',
    price: 45.00,
    images: ['/images/hoodie_default.jpg'],
    inventory: 75,
    isPublished: true,
  },
  {
    name: 'Stylish Baseball Cap',
    description: 'Protect yourself from the sun with this cool baseball cap. Adjustable strap.',
    price: 15.75,
    images: ['/images/cap_default.jpg'],
    inventory: 120,
    isPublished: false, // Example of an unpublished product
  },
  {
    name: 'Eco-Friendly Water Bottle',
    description: 'Stay hydrated with this reusable and eco-friendly water bottle. BPA-free.',
    price: 22.00,
    images: ['/images/bottle_default.jpg'],
    inventory: 90,
    isPublished: true,
  },
];

// @desc    Seed initial products
// @route   POST /api/products/seed
// @access  Private (should be protected in a real app)
exports.seedProducts = async (req, res, next) => {
  try {
    // Clear existing products (optional, be careful with this in production)
    // await Product.deleteMany({});

    // Insert mock products
    // Mongoose will auto-generate slugs based on the pre-save hook
    const createdProducts = await Product.insertMany(mockProducts.map(p => ({...p}))); // Ensure slug generation by creating new objects

    res.status(201).json({
      success: true,
      message: 'Products seeded successfully',
      data: createdProducts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: `Error seeding products: ${error.message}` });
  }
};

// @desc    Get all published products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isPublished: true });

    if (!products.length) {
      // If no products in DB and want to return mock data as fallback:
      // return res.status(200).json({ success: true, data: mockProducts.filter(p => p.isPublished) });
      return res.status(200).json({ success: true, message: 'No products found', data: [] });
    }

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single product by slug
// @route   GET /api/products/:slug
// @access  Public
exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isPublished: true });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
