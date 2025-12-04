const express = require('express');
const router = express.Router();
const { getMovies, getMovieById, addMovie, updateMovie, deleteMovie, addShowtimeToMovie } = require('../controllers/movieController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getMovies).post(protect, admin, addMovie);
router.route('/:id').get(getMovieById).put(protect, admin, updateMovie).delete(protect, admin, deleteMovie);
router.route('/:id/showtimes').post(protect, admin, addShowtimeToMovie);

module.exports = router;