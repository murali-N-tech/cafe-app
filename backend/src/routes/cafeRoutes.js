const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const Cafe = require('../models/Cafe');

// @desc    Get all cafes (Admin only)
// @route   GET /api/cafes
// @access  Private/Admin
router.get('/', protect, authorize('Admin'), async (req, res) => {
  try {
    const cafes = await Cafe.find().populate('owner_id', 'username email');
    res.status(200).json({ success: true, data: cafes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new cafe
// @route   POST /api/cafes
// @access  Private/Admin
router.post('/', protect, authorize('Admin'), async (req, res) => {
  try {
    const { cafe_name, location, contact, opening_hours } = req.body;

    const cafe = await Cafe.create({
      cafe_name,
      location,
      contact,
      opening_hours,
      owner_id: req.user.id,
    });

    res.status(201).json({ success: true, data: cafe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get cafe by ID
// @route   GET /api/cafes/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const cafe = await Cafe.findById(req.params.id).populate('owner_id', 'username email');
    if (!cafe) {
      return res.status(404).json({ message: 'Cafe not found' });
    }
    res.status(200).json({ success: true, data: cafe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update cafe
// @route   PUT /api/cafes/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('Admin'), async (req, res) => {
  try {
    const cafe = await Cafe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!cafe) {
      return res.status(404).json({ message: 'Cafe not found' });
    }

    res.status(200).json({ success: true, data: cafe });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;