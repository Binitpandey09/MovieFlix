const express = require('express');
const router = express.Router();
const { getCities, addCity, deleteCity } = require('../controllers/cityController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getCities).post(protect, admin, addCity);
router.route('/:id').delete(protect, admin, deleteCity);

module.exports = router;