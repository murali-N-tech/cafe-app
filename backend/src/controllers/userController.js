const User = require('../models/User');

// @desc    Get all users (Admin/Manager only)
// @route   GET /api/users
// @access  Private/Admin/Manager
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ cafe_id: req.user.cafe_id })
      .select('-password_hash')
      .populate('role_id', 'role_name')
      .populate('cafe_id', 'cafe_name');

    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password_hash')
      .populate('role_id', 'role_name')
      .populate('cafe_id', 'cafe_name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin/Manager
exports.updateUser = async (req, res) => {
  try {
    const { email, username, phone, is_active } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { email, username, phone, is_active, updated_at: Date.now() },
      { new: true, runValidators: true }
    )
      .select('-password_hash')
      .populate('role_id', 'role_name')
      .populate('cafe_id', 'cafe_name');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (deactivate)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { is_active: false, updated_at: Date.now() },
      { new: true }
    ).select('-password_hash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ success: true, message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Change user password
// @route   PUT /api/users/:id/password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide old and new password' });
    }

    const user = await User.findById(req.params.id).select('+password_hash');

    // Verify old password
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    // Update password
    user.password_hash = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};