const express = require('express');
const router = express.Router();
const { getTheaters, addTheater, deleteTheater } = require('../controllers/theaterController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getTheaters).post(protect, admin, addTheater);
router.route('/:id').delete(protect, admin, deleteTheater);

module.exports = router;
