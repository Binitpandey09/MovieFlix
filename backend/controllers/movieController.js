const Movie = require('../models/Movie');

exports.getMovies = async (req, res) => {
    try {
        const query = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (req.query.city) {
            query.cities = req.query.city;
        }
        if (req.query.genre && req.query.genre !== 'All') {
            query.genre = req.query.genre;
        }

        // CORRECTED LOGIC: Only filter by date if a 'status' is provided
        if (req.query.status) {
            if (req.query.status === 'coming_soon') {
                query.releaseDate = { $gt: today }; // Movies with release date after today
            } else {
                // Default to "Now Showing" if status is present
                query.releaseDate = { $lte: today }; // Movies with release date of today or earlier
            }
        }
        // If no 'status' is provided (like from the Admin Panel), this block is skipped,
        // and all movies are fetched.

        const movies = await Movie.find(query);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// --- All other functions remain the same ---

exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie) res.json(movie);
        else res.status(404).json({ message: "Movie not found" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.addMovie = async (req, res) => {
    const { title, description, genre, rating, image, cities, releaseDate, showtimes } = req.body;
    if (!title || !description || !genre || !rating || !image || !cities || !releaseDate) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }
    try {
        const movie = new Movie({ title, description, genre, rating, image, cities, releaseDate, showtimes: showtimes || [] });
        const createdMovie = await movie.save();
        res.status(201).json(createdMovie);
    } catch (error) {
        res.status(500).json({ message: 'Server Error while adding movie', error: error.message });
    }
};

exports.updateMovie = async (req, res) => {
    const { title, description, genre, rating, image, cities, releaseDate } = req.body;
    try {
        const movie = await Movie.findById(req.params.id);
        if(movie) {
            movie.title = title || movie.title;
            movie.description = description || movie.description;
            movie.genre = genre || movie.genre;
            movie.rating = rating || movie.rating;
            movie.image = image || movie.image;
            movie.cities = cities || movie.cities;
            movie.releaseDate = releaseDate || movie.releaseDate;
            const updatedMovie = await movie.save();
            res.json(updatedMovie);
        } else res.status(404).json({ message: 'Movie not found' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie) {
            await movie.deleteOne();
            res.json({ message: 'Movie removed' });
        } else res.status(404).json({ message: 'Movie not found' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.addShowtimeToMovie = async (req, res) => {
    const { date, time, totalSeats } = req.body;
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie) {
            const showtime = { date, time, totalSeats: totalSeats || 50, availableSeats: totalSeats || 50 };
            movie.showtimes.push(showtime);
            await movie.save();
            res.status(201).json(movie);
        } else res.status(404).json({ message: 'Movie not found' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};