const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menu_item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
  item_name: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unit_price: {
    type: Number,
    required: true,
  },
  variant_selected: {
    variant_id: mongoose.Schema.Types.ObjectId,
    variant_name: String,
    option_name: String,
    price_modifier: Number,
  },
  addons_selected: [{
    addon_id: mongoose.Schema.Types.ObjectId,
    addon_name: String,
    addon_price: Number,
  }],
  special_instructions: String,
  item_status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'served', 'cancelled'],
    default: 'pending',
  },
  preparation_started_at: Date,
  preparation_ended_at: Date,
  served_at: Date,
}, { _id: true });

const orderSchema = new mongoose.Schema({
  cafe_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cafe',
    required: true,
  },
  table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    default: null, // For takeaway/delivery orders
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    default: null, // For walk-in customers
  },
  order_number: {
    type: String,
    unique: true,
    required: true,
  },
  order_type: {
    type: String,
    enum: ['dine-in', 'takeaway', 'delivery'],
    default: 'dine-in',
  },
  waiter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'],
    default: 'pending',
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    default: 0,
  },
  tax_amount: {
    type: Number,
    default: 0,
  },
  service_charge: {
    type: Number,
    default: 0,
  },
  discount_amount: {
    type: Number,
    default: 0,
  },
  total_amount: {
    type: Number,
    default: 0,
  },
  special_notes: String,
  priority: {
    type: String,
    enum: ['normal', 'vip', 'urgent'],
    default: 'normal',
  },
  is_priority: {
    type: Boolean,
    default: false,
  },
  estimated_prep_time: Number, // in minutes
  created_at: {
    type: Date,
    default: Date.now,
  },
  completed_at: Date,
  cancelled_at: Date,
  cancelled_reason: String,
});

// Calculate totals before saving
orderSchema.pre('save', function (next) {
  // Calculate subtotal from items
  this.subtotal = this.items.reduce((sum, item) => {
    const itemPrice = item.unit_price * item.quantity;
    const addonsPrice = (item.addons_selected || []).reduce(
      (addonSum, addon) => addonSum + addon.addon_price,
      0
    );
    const variantPrice = item.variant_selected?.price_modifier || 0;
    return sum + itemPrice + addonsPrice + variantPrice;
  }, 0);

  // Calculate total
  this.total_amount =
    this.subtotal + this.tax_amount + this.service_charge - this.discount_amount;

  next();
});

// Create indexes for efficient queries
orderSchema.index({ cafe_id: 1, status: 1, created_at: -1 });
orderSchema.index({ cafe_id: 1, table_id: 1 });
orderSchema.index({ order_number: 1 });

module.exports = mongoose.model('Order', orderSchema);