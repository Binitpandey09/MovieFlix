const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { movieId, showtime, seats, theaterId, quantity, totalAmount } = req.body;

        if (!seats || seats.length === 0) {
            return res.status(400).json({ message: 'No seats selected' });
        }

        const booking = new Booking({
            user: req.user._id,
            movie: movieId,
            theater: theaterId,
            showtime,
            seats,
            quantity,
            totalAmount,
            status: 'Confirmed' // Direct confirmation for now
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        console.error("Create Booking Error:", error);
        res.status(500).json({ message: 'Booking failed', error: error.message });
    }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('movie', 'title image')
            .populate('theater', 'name location')
            .sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch bookings' });
    }
};

module.exports = { createBooking, getMyBookings };
