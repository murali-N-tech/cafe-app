const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { getRoles, getRoleById, getRoleByName } = require('../controllers/roleController');

// All routes require authentication
router.use(protect);

router.get('/', getRoles);
router.get('/:id', getRoleById);
router.get('/name/:name', getRoleByName);

module.exports = router;