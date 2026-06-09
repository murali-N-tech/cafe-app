const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  role_name: {
    type: String,
    enum: ['Admin', 'Manager', 'Cashier', 'Waiter', 'Kitchen Staff', 'Accountant'],
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  permissions: {
    type: [String],
    default: [],
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

module.exports = mongoose.model('Role', roleSchema);