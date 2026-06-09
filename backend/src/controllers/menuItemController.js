const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

// @desc    Get all menu items for a cafe
// @route   GET /api/menu-items
// @access  Private
exports.getMenuItems = async (req, res) => {
  try {
    const { category_id, is_available, search, popular_only } = req.query;
    const query = { cafe_id: req.user.cafe_id };

    if (category_id) query.category_id = category_id;
    if (is_available !== undefined) query.is_available = is_available === 'true';
    if (popular_only === 'true') query.is_popular = true;
    if (search) {
      query.$or = [
        { item_name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await MenuItem.find(query)
      .populate('category_id', 'category_name')
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get menu item by ID
// @route   GET /api/menu-items/:id
// @access  Private
exports.getMenuItemById = async (req, res) => {
  try {
    const item = await MenuItem.findOne({
      _id: req.params.id,
      cafe_id: req.user.cafe_id,
    })
      .populate('category_id', 'category_name');

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new menu item
// @route   POST /api/menu-items
// @access  Private/Manager/Admin
exports.createMenuItem = async (req, res) => {
  try {
    const {
      category_id,
      item_name,
      description,
      base_price,
      image_url,
      prep_time_minutes,
      in_stock_quantity,
      allergens,
      dietary_tags,
      variants,
      addons,
    } = req.body;

    if (!category_id || !item_name || base_price === undefined) {
      return res
        .status(400)
        .json({ message: 'Category, item name, and price are required' });
    }

    // Verify category exists
    const category = await Category.findOne({
      _id: category_id,
      cafe_id: req.user.cafe_id,
    });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const item = await MenuItem.create({
      cafe_id: req.user.cafe_id,
      category_id,
      item_name,
      description,
      base_price,
      image_url,
      prep_time_minutes: prep_time_minutes || 10,
      in_stock_quantity,
      allergens: allergens || [],
      dietary_tags: dietary_tags || [],
      variants: variants || [],
      addons: addons || [],
    });

    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu-items/:id
// @access  Private/Manager/Admin
exports.updateMenuItem = async (req, res) => {
  try {
    const {
      item_name,
      description,
      base_price,
      image_url,
      is_available,
      prep_time_minutes,
      in_stock_quantity,
      allergens,
      dietary_tags,
      is_popular,
    } = req.body;

    const item = await MenuItem.findOneAndUpdate(
      {
        _id: req.params.id,
        cafe_id: req.user.cafe_id,
      },
      {
        item_name,
        description,
        base_price,
        image_url,
        is_available,
        prep_time_minutes,
        in_stock_quantity,
        allergens,
        dietary_tags,
        is_popular,
        updated_at: Date.now(),
      },
      { new: true, runValidators: true }
    ).populate('category_id', 'category_name');

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu-items/:id
// @access  Private/Admin
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findOneAndDelete({
      _id: req.params.id,
      cafe_id: req.user.cafe_id,
    });

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add variant to menu item
// @route   POST /api/menu-items/:id/variants
// @access  Private/Manager/Admin
exports.addVariant = async (req, res) => {
  try {
    const { variant_name, variant_type, options } = req.body;

    if (!variant_name || !variant_type || !options) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const item = await MenuItem.findOneAndUpdate(
      {
        _id: req.params.id,
        cafe_id: req.user.cafe_id,
      },
      {
        $push: {
          variants: {
            variant_name,
            variant_type,
            options,
          },
        },
      },
      { new: true }
    ).populate('category_id', 'category_name');

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add addon to menu item
// @route   POST /api/menu-items/:id/addons
// @access  Private/Manager/Admin
exports.addAddon = async (req, res) => {
  try {
    const { addon_name, addon_price } = req.body;

    if (!addon_name || addon_price === undefined) {
      return res
        .status(400)
        .json({ message: 'Addon name and price are required' });
    }

    const item = await MenuItem.findOneAndUpdate(
      {
        _id: req.params.id,
        cafe_id: req.user.cafe_id,
      },
      {
        $push: {
          addons: {
            addon_name,
            addon_price,
          },
        },
      },
      { new: true }
    ).populate('category_id', 'category_name');

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get popular items
// @route   GET /api/menu-items/popular
// @access  Private
exports.getPopularItems = async (req, res) => {
  try {
    const items = await MenuItem.find({
      cafe_id: req.user.cafe_id,
      is_available: true,
    })
      .sort({ sales_count: -1, rating: -1 })
      .limit(10)
      .populate('category_id', 'category_name');

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
