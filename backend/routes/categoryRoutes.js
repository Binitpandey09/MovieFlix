const express = require('express');
const router = express.Router();
const { getCategories, addCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getCategories).post(protect, admin, addCategory);
router.route('/:id').delete(protect, admin, deleteCategory);

module.exports = router;