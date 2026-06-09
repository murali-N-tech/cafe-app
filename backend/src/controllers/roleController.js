const Role = require('../models/Role');

// @desc    Get all roles
// @route   GET /api/roles
// @access  Private
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get role by ID
// @route   GET /api/roles/:id
// @access  Private
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get role by name
// @route   GET /api/roles/name/:name
// @access  Private
exports.getRoleByName = async (req, res) => {
  try {
    const role = await Role.findOne({ role_name: req.params.name });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.status(200).json({ success: true, data: role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};