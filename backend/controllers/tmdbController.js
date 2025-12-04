const { importTMDBMovies } = require('../services/tmdbService');
const Movie = require('../models/Movie');

// Manual trigger to import TMDB movies
exports.fetchTMDBMovies = async (req, res) => {
    try {
        console.log('📥 TMDB import requested by:', req.user?.email);
        const result = await importTMDBMovies();
        console.log('✅ TMDB import completed:', result);
        res.json({
            success: true,
            message: 'TMDB movies imported successfully',
            ...result
        });
    } catch (error) {
        console.error('❌ TMDB import failed:', error);
        console.error('Error stack:', error.stack);

        // Log to file for debugging
        const fs = require('fs');
        fs.writeFileSync('import_error.log', `${new Date().toISOString()} - ${error.message}\n${error.stack}\n`);

        res.status(500).json({
            success: false,
            message: 'Failed to import TMDB movies',
            error: error.message
        });
    }
};

// Enable movie for booking
exports.enableMovie = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { cities } = req.body;

        const movie = await Movie.findByIdAndUpdate(
            movieId,
            {
                isEnabled: true,
                cities: cities || []
            },
            { new: true }
        );

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json({ success: true, movie });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Disable movie for booking
exports.disableMovie = async (req, res) => {
    try {
        const { movieId } = req.params;

        const movie = await Movie.findByIdAndUpdate(
            movieId,
            { isEnabled: false },
            { new: true }
        );

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json({ success: true, movie });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Add showtime to movie
exports.addShowtime = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { date, time, screen, totalSeats, price } = req.body;

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        const showtime = {
            date,
            time,
            screen: screen || 'Screen 1',
            totalSeats: totalSeats || 50,
            availableSeats: totalSeats || 50,
            price: price || movie.defaultPrice || 200,
        };

        movie.showtimes.push(showtime);
        await movie.save();

        res.json({ success: true, movie });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Remove showtime
exports.removeShowtime = async (req, res) => {
    try {
        const { movieId, showtimeId } = req.params;

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        movie.showtimes = movie.showtimes.filter(
            st => st._id.toString() !== showtimeId
        );
        await movie.save();

        res.json({ success: true, movie });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Set default price for movie
exports.setPrice = async (req, res) => {
    try {
        const { movieId } = req.params;
        const { price } = req.body;

        const movie = await Movie.findByIdAndUpdate(
            movieId,
            { defaultPrice: price },
            { new: true }
        );

        if (!movie) {
            return res.status(404).json({ message: 'Movie not found' });
        }

        res.json({ success: true, movie });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get all TMDB imported movies (for admin)
exports.getAllTMDBMovies = async (req, res) => {
    try {
        const movies = await Movie.find({ isTMDBImport: true })
            .sort({ releaseDate: -1 });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};
