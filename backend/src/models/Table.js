const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  cafe_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cafe',
    required: true,
  },
  table_number: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  location: {
    x: Number, // For table map visualization
    y: Number,
  },
  status: {
    type: String,
    enum: ['empty', 'occupied', 'reserved', 'cleaning'],
    default: 'empty',
  },
  current_order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  notes: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Create index for efficient queries
tableSchema.index({ cafe_id: 1, status: 1 });
tableSchema.index({ cafe_id: 1, table_number: 1 });

module.exports = mongoose.model('Table', tableSchema);