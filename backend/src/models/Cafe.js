const mongoose = require('mongoose');

const cafeSchema = new mongoose.Schema({
  cafe_name: {
    type: String,
    required: true,
  },
  location: {
    street: String,
    city: String,
    state: String,
    postal_code: String,
    country: String,
  },
  contact: {
    phone: String,
    email: String,
    website: String,
  },
  opening_hours: {
    open_time: String,
    close_time: String,
  },
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  is_active: {
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

module.exports = mongoose.model('Cafe', cafeSchema);