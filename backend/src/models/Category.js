const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  cafe_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cafe',
    required: true,
  },
  category_name: {
    type: String,
    required: true,
  },
  description: String,
  image_url: String,
  display_order: {
    type: Number,
    default: 0,
  },
  is_available: {
    type: Boolean,
    default: true,
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

// Create index for cafe and category
categorySchema.index({ cafe_id: 1, category_name: 1 });

module.exports = mongoose.model('Category', categorySchema);