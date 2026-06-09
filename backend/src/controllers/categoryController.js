const Category = require('../models/Category');

// @desc    Get all categories for a cafe
// @route   GET /api/categories
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    const { cafe_id } = req.query || req.user.cafe_id;
    const categories = await Category.find({ cafe_id })
      .sort({ display_order: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Private
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Manager/Admin
exports.createCategory = async (req, res) => {
  try {
    const { category_name, description, image_url, display_order } = req.body;

    if (!category_name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await Category.create({
      cafe_id: req.user.cafe_id,
      category_name,
      description,
      image_url,
      display_order: display_order || 0,
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Manager/Admin
exports.updateCategory = async (req, res) => {
  try {
    const { category_name, description, image_url, display_order, is_available } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        category_name,
        description,
        image_url,
        display_order,
        is_available,
        updated_at: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};