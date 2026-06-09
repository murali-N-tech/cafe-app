const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth');
const {
  getTables,
  getTableById,
  createTable,
  updateTable,
  updateTableStatus,
  deleteTable,
  getTableOccupancyStats,
} = require('../controllers/tableController');

router.use(protect);

router.get('/stats/occupancy', getTableOccupancyStats);
router.get('/', getTables);
router.get('/:id', getTableById);
router.post('/', authorize('Manager', 'Admin'), createTable);
router.put('/:id', authorize('Manager', 'Admin'), updateTable);
router.put('/:id/status', updateTableStatus);
router.delete('/:id', authorize('Admin'), deleteTable);

module.exports = router;