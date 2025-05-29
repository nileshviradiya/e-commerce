const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity cannot be less than 1.'],
    default: 1,
  },
  price: {
    // Stores the price of the product at the time it was added to cart
    type: Number,
    required: true,
  },
  name: {
    // Stores the name of the product for convenience
    type: String,
    required: true,
  },
  image: {
    // Stores one product image for convenience
    type: String,
  },
}, {_id: true}); // Ensure _id is created for subdocuments if needed for direct manipulation, though often not necessary.


const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Each user has only one cart
    },
    items: [CartItemSchema],
    // You can add methods here or use virtuals for calculated properties like subtotal/total
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Method to calculate total price (example, can be expanded)
CartSchema.methods.calculateTotal = function() {
  return this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

// Virtual for total price (alternative to a method, not stored in DB)
CartSchema.virtual('totalPrice').get(function() {
  return this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
});

// Ensure virtuals are included when converting to JSON/object
CartSchema.set('toObject', { virtuals: true });
CartSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('Cart', CartSchema);
