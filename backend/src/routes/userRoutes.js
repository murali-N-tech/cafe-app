const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword,
} = require('../controllers/userController');

// All routes require authentication
router.use(protect);

router.get('/', authorize('Admin', 'Manager'), getUsers);
router.get('/:id', getUserById);
router.put('/:id', authorize('Admin', 'Manager'), updateUser);
router.delete('/:id', authorize('Admin'), deleteUser);
router.put('/:id/password', changePassword);

module.exports = router;