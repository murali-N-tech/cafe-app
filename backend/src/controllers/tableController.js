const Table = require('../models/Table');
const Order = require('../models/Order');

// @desc    Get all tables for a cafe
// @route   GET /api/tables
// @access  Private
exports.getTables = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { cafe_id: req.user.cafe_id };

    if (status) query.status = status;

    const tables = await Table.find(query)
      .populate('current_order_id', 'order_number status items')
      .sort({ table_number: 1 });

    res.status(200).json({
      success: true,
      count: tables.length,
      data: tables,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get table by ID
// @route   GET /api/tables/:id
// @access  Private
exports.getTableById = async (req, res) => {
  try {
    const table = await Table.findOne({
      _id: req.params.id,
      cafe_id: req.user.cafe_id,
    }).populate('current_order_id');

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new table
// @route   POST /api/tables
// @access  Private/Manager/Admin
exports.createTable = async (req, res) => {
  try {
    const { table_number, capacity, location, notes } = req.body;

    if (!table_number || !capacity) {
      return res
        .status(400)
        .json({ message: 'Table number and capacity are required' });
    }

    const table = await Table.create({
      cafe_id: req.user.cafe_id,
      table_number,
      capacity,
      location,
      notes,
    });

    res.status(201).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update table
// @route   PUT /api/tables/:id
// @access  Private/Manager/Admin
exports.updateTable = async (req, res) => {
  try {
    const { table_number, capacity, status, notes, is_active } = req.body;

    const table = await Table.findOneAndUpdate(
      {
        _id: req.params.id,
        cafe_id: req.user.cafe_id,
      },
      {
        table_number,
        capacity,
        status,
        notes,
        is_active,
        updated_at: Date.now(),
      },
      { new: true, runValidators: true }
    ).populate('current_order_id');

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update table status
// @route   PUT /api/tables/:id/status
// @access  Private/Waiter/Manager/Admin
exports.updateTableStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const table = await Table.findOneAndUpdate(
      {
        _id: req.params.id,
        cafe_id: req.user.cafe_id,
      },
      { status, updated_at: Date.now() },
      { new: true }
    ).populate('current_order_id');

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json({ success: true, data: table });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete table
// @route   DELETE /api/tables/:id
// @access  Private/Admin
exports.deleteTable = async (req, res) => {
  try {
    const table = await Table.findOneAndDelete({
      _id: req.params.id,
      cafe_id: req.user.cafe_id,
    });

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json({ success: true, message: 'Table deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get table occupancy stats
// @route   GET /api/tables/stats/occupancy
// @access  Private/Manager/Admin
exports.getTableOccupancyStats = async (req, res) => {
  try {
    const tables = await Table.find({ cafe_id: req.user.cafe_id });

    const stats = {
      total_tables: tables.length,
      occupied: tables.filter((t) => t.status === 'occupied').length,
      empty: tables.filter((t) => t.status === 'empty').length,
      reserved: tables.filter((t) => t.status === 'reserved').length,
      cleaning: tables.filter((t) => t.status === 'cleaning').length,
      occupancy_rate: 0,
    };

    stats.occupancy_rate = stats.total_tables
      ? ((stats.occupied / stats.total_tables) * 100).toFixed(2)
      : '0.00';

    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
