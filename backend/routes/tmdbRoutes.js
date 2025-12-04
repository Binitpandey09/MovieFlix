const express = require('express');
const router = express.Router();
const {
    fetchTMDBMovies,
    enableMovie,
    disableMovie,
    addShowtime,
    removeShowtime,
    setPrice,
    getAllTMDBMovies,
} = require('../controllers/tmdbController');
const { protect, admin } = require('../middleware/authMiddleware');

// Admin routes - protected
router.post('/fetch', protect, admin, fetchTMDBMovies);
router.get('/all', protect, admin, getAllTMDBMovies);
router.put('/:movieId/enable', protect, admin, enableMovie);
router.put('/:movieId/disable', protect, admin, disableMovie);
router.post('/:movieId/showtime', protect, admin, addShowtime);
router.delete('/:movieId/showtime/:showtimeId', protect, admin, removeShowtime);
router.put('/:movieId/price', protect, admin, setPrice);

module.exports = router;
