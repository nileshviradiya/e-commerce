const mongoose = require('mongoose');
const slugify = require('slugify'); // Will need to install this dependency

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      // Slug will be auto-generated if not provided
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a product price'],
    },
    images: [
      {
        type: String,
        default: '/images/default-product.jpg', // Placeholder for a default image
      },
    ],
    inventory: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    // category, brand, ratings, reviews etc. can be added later
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Pre-save hook to generate slug from name
ProductSchema.pre('save', function (next) {
  if (!this.isModified('name') && this.slug) {
    // If name is not modified and slug already exists, do nothing
    return next();
  }
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
