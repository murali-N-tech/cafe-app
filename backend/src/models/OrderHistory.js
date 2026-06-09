const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  cafe_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cafe',
    required: true,
  },
  status_change: {
    from: String,
    to: String,
  },
  changed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: String, // e.g., 'created', 'updated', 'status_changed'
  details: mongoose.Schema.Types.Mixed, // For storing any additional details
  notes: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Create index for efficient queries
orderHistorySchema.index({ order_id: 1, created_at: -1 });
orderHistorySchema.index({ cafe_id: 1, created_at: -1 });

module.exports = mongoose.model('OrderHistory', orderHistorySchema);