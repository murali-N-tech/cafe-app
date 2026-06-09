const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  addVariant,
  addAddon,
  getPopularItems,
} = require('../controllers/menuItemController');

router.use(protect);

router.get('/popular', getPopularItems);
router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);
router.post('/', authorize('Manager', 'Admin'), createMenuItem);
router.put('/:id', authorize('Manager', 'Admin'), updateMenuItem);
router.delete('/:id', authorize('Admin'), deleteMenuItem);
router.post('/:id/variants', authorize('Manager', 'Admin'), addVariant);
router.post('/:id/addons', authorize('Manager', 'Admin'), addAddon);

module.exports = router;