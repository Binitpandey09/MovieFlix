const Booking = require('../models/Booking');
const Movie = require('../models/Movie');

exports.createBooking = async (req, res) => {
    const { movieId, showtime, seats } = req.body;
    try {
        const movie = await Movie.findById(movieId);
        if (!movie) return res.status(404).json({ message: 'Movie not found' });

        const showtimeToUpdate = movie.showtimes.find(st => st.date === showtime.date && st.time === showtime.time);
        if (!showtimeToUpdate) return res.status(404).json({ message: 'Showtime not found' });
        
        if (showtimeToUpdate.availableSeats < seats.length) {
            return res.status(400).json({ message: 'Not enough seats available' });
        }
        
        showtimeToUpdate.availableSeats -= seats.length;
        await movie.save();

        const booking = new Booking({
            userId: req.user._id,
            movieId,
            showtime,
            seats,
        });

        const createdBooking = await booking.save();
        res.status(201).json(createdBooking);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user._id }).populate('movieId', 'title image');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};