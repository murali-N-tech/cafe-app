const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  variant_name: {
    type: String,
    required: true,
  },
  variant_type: {
    type: String,
    enum: ['size', 'flavor', 'temperature', 'custom'],
    required: true,
  },
  options: [{
    option_name: String,
    price_modifier: Number, // e.g., +50 for Large
  }],
}, { _id: true });

const addonSchema = new mongoose.Schema({
  addon_name: {
    type: String,
    required: true,
  },
  addon_price: {
    type: Number,
    required: true,
  },
  is_available: {
    type: Boolean,
    default: true,
  },
}, { _id: true });

const menuItemSchema = new mongoose.Schema({
  cafe_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cafe',
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  item_name: {
    type: String,
    required: true,
  },
  description: String,
  base_price: {
    type: Number,
    required: true,
    min: 0,
  },
  image_url: String,
  images: [String], // Array for gallery
  is_available: {
    type: Boolean,
    default: true,
  },
  prep_time_minutes: {
    type: Number,
    default: 10,
  },
  in_stock_quantity: {
    type: Number,
    default: null, // null means unlimited
  },
  allergens: [String], // e.g., ['nuts', 'dairy', 'gluten']
  dietary_tags: [String], // e.g., ['vegan', 'gluten-free', 'organic']
  variants: [variantSchema],
  addons: [addonSchema],
  is_popular: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  sales_count: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for efficient queries
menuItemSchema.index({ cafe_id: 1, category_id: 1 });
menuItemSchema.index({ cafe_id: 1, is_available: 1 });
menuItemSchema.index({ cafe_id: 1, is_popular: 1 });

module.exports = mongoose.model('MenuItem', menuItemSchema);