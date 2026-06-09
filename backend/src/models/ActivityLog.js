const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cafe_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cafe',
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  resource: {
    type: String,
    required: true,
  },
  resource_id: {
    type: String,
    required: true,
  },
  changes: {
    before: {},
    after: {},
  },
  ip_address: String,
  user_agent: String,
  status: {
    type: String,
    enum: ['success', 'failure'],
    default: 'success',
  },
  error_message: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Create index for efficient querying
activityLogSchema.index({ user_id: 1, cafe_id: 1, created_at: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);