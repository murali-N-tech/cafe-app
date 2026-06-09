const Order = require('../models/Order');
const Table = require('../models/Table');
const MenuItem = require('../models/MenuItem');
const OrderHistory = require('../models/OrderHistory');

// Generate unique order number
const generateOrderNumber = async (cafeId) => {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const count = await Order.countDocuments({
    cafe_id: cafeId,
    created_at: {
      $gte: new Date(new Date().setHours(0, 0, 0, 0)),
      $lt: new Date(new Date().setHours(23, 59, 59, 999)),
    },
  });
  return `ORD-${today}-${String(count + 1).padStart(4, '0')}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Waiter/Cashier
exports.createOrder = async (req, res) => {
  try {
    const {
      table_id,
      customer_id,
      items,
      order_type,
      special_notes,
      priority,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'At least one item is required' });
    }

    // Generate order number
    const order_number = await generateOrderNumber(req.user.cafe_id);

    // Process items
    const processedItems = await Promise.all(
      items.map(async (item) => {
        const menuItem = await MenuItem.findById(item.menu_item_id);
        if (!menuItem) {
          throw new Error(`Menu item ${item.menu_item_id} not found`);
        }

        return {
          menu_item_id: item.menu_item_id,
          item_name: menuItem.item_name,
          quantity: item.quantity,
          unit_price: menuItem.base_price,
          variant_selected: item.variant_selected || null,
          addons_selected: item.addons_selected || [],
          special_instructions: item.special_instructions,
        };
      })
    );

    const order = await Order.create({
      cafe_id: req.user.cafe_id,
      table_id: table_id || null,
      customer_id: customer_id || null,
      order_number,
      order_type: order_type || 'dine-in',
      waiter_id: req.user.id,
      items: processedItems,
      special_notes,
      priority: priority || 'normal',
      is_priority: priority === 'urgent' || priority === 'vip',
    });

    // Update table status if dine-in
    if (table_id && order_type !== 'takeaway') {
      await Table.findByIdAndUpdate(table_id, {
        status: 'occupied',
        current_order_id: order._id,
        updated_at: Date.now(),
      });
    }

    // Log order creation
    await OrderHistory.create({
      order_id: order._id,
      cafe_id: req.user.cafe_id,
      action: 'created',
      changed_by: req.user.id,
      details: { order_number, total_items: items.length },
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders for a cafe
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const { status, table_id, order_type } = req.query;
    const query = { cafe_id: req.user.cafe_id };

    if (status) query.status = status;
    if (table_id) query.table_id = table_id;
    if (order_type) query.order_type = order_type;

    const orders = await Order.find(query)
      .populate('table_id', 'table_number')
      .populate('waiter_id', 'username')
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('table_id', 'table_number')
      .populate('waiter_id', 'username')
      .populate('items.menu_item_id', 'item_name');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to existing order
// @route   POST /api/orders/:id/items
// @access  Private/Waiter
exports.addItemToOrder = async (req, res) => {
  try {
    const { menu_item_id, quantity, variant_selected, addons_selected, special_instructions } = req.body;

    if (!menu_item_id || !quantity) {
      return res
        .status(400)
        .json({ message: 'Menu item ID and quantity are required' });
    }

    const menuItem = await MenuItem.findById(menu_item_id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          items: {
            menu_item_id,
            item_name: menuItem.item_name,
            quantity,
            unit_price: menuItem.base_price,
            variant_selected: variant_selected || null,
            addons_selected: addons_selected || [],
            special_instructions,
          },
        },
        updated_at: Date.now(),
      },
      { new: true }
    ).populate('table_id', 'table_number');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Manager/Kitchen
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const oldStatus = order.status;

    // Update order
    if (status === 'completed') {
      order.completed_at = Date.now();
    } else if (status === 'cancelled') {
      order.cancelled_at = Date.now();
    }

    order.status = status;
    await order.save();

    // Update table status if order is completed
    if (status === 'completed' && order.table_id) {
      await Table.findByIdAndUpdate(order.table_id, {
        status: 'empty',
        current_order_id: null,
      });
    }

    // Log status change
    await OrderHistory.create({
      order_id: order._id,
      cafe_id: req.user.cafe_id,
      status_change: { from: oldStatus, to: status },
      changed_by: req.user.id,
      action: 'status_changed',
    });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update individual item status
// @route   PUT /api/orders/:orderId/items/:itemId/status
// @access  Private/Kitchen
exports.updateItemStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId, itemId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.item_status = status;

    if (status === 'preparing') {
      item.preparation_started_at = Date.now();
    } else if (status === 'ready') {
      item.preparation_ended_at = Date.now();
    } else if (status === 'served') {
      item.served_at = Date.now();
    }

    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order history
// @route   GET /api/orders/:id/history
// @access  Private/Manager
exports.getOrderHistory = async (req, res) => {
  try {
    const history = await OrderHistory.find({ order_id: req.params.id })
      .populate('changed_by', 'username')
      .sort({ created_at: -1 });

    res.status(200).json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private/Manager/Waiter
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: 'cancelled',
        cancelled_at: Date.now(),
        cancelled_reason: reason || 'No reason provided',
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update table status
    if (order.table_id) {
      await Table.findByIdAndUpdate(order.table_id, {
        status: 'empty',
        current_order_id: null,
      });
    }

    // Log cancellation
    await OrderHistory.create({
      order_id: order._id,
      cafe_id: req.user.cafe_id,
      action: 'cancelled',
      changed_by: req.user.id,
      details: { reason },
    });

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};