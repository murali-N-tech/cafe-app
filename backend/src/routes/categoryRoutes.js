const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

router.use(protect);

router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.post('/', authorize('Manager', 'Admin'), createCategory);
router.put('/:id', authorize('Manager', 'Admin'), updateCategory);
router.delete('/:id', authorize('Admin'), deleteCategory);

module.exports = router;