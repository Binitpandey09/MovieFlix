const Movie = require('../models/Movie');

exports.getMovies = async (req, res) => {
    try {
        const query = { isEnabled: true }; // Only show enabled movies to users
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        console.log('GET /api/movies - Query params:', req.query);

        if (req.query.genre && req.query.genre !== 'All') {
            query.genre = { $regex: req.query.genre, $options: 'i' };
        }

        // Search functionality
        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: 'i' };
        }

        // TMDB-based filtering / City-based filtering
        // STRICT CHECK: If city is present (and not 'undefined'), we filter by city.
        // We DO NOT fall back to global filtering if city is present.
        if (req.query.city && req.query.city !== 'undefined' && req.query.city !== '') {
            // City-specific filtering
            console.log(`Filtering for city: ${req.query.city}, status: ${req.query.status}`);

            if (req.query.status === 'now_showing') {
                query.cityStatus = {
                    $elemMatch: {
                        city: req.query.city,
                        status: 'now_showing'
                    }
                };
            } else if (req.query.status === 'coming_soon') {
                query.cityStatus = {
                    $elemMatch: {
                        city: req.query.city,
                        status: 'coming_soon'
                    }
                };
            } else {
                // If city is present but status is not recognized (or missing), return nothing.
                // This prevents showing global movies when looking at a specific city page.
                query._id = null;
            }
        } else {
            // Default Global filtering (Home Page) - ONLY runs if city is NOT present
            if (req.query.status === 'coming_soon') {
                // Upcoming movies: release date in future
                query.releaseDate = { $gt: today };
            } else if (req.query.status === 'now_showing') {
                // Now showing: released + has showtimes
                query.releaseDate = { $lte: today };
                query['showtimes.0'] = { $exists: true }; // Has at least one showtime
            }
        }

        const limit = req.query.limit ? parseInt(req.query.limit) : 0;
        const sort = req.query.sort === 'rating' ? { rating: -1 } : { releaseDate: -1 }; // Default sort by newest

        const movies = await Movie.find(query).sort(sort).limit(limit);
        res.json(movies);
    } catch (error) {
        console.error('Error in getMovies:', error);
        res.status(500).json({ message: "Server Error" });
    }
};

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
    const { title, description, genre, rating, image, cities, releaseDate, cityStatus } = req.body;
    try {
        const movie = await Movie.findById(req.params.id);
        if (movie) {
            movie.title = title || movie.title;
            movie.description = description || movie.description;
            movie.genre = genre || movie.genre;
            movie.rating = rating || movie.rating;
            movie.image = image || movie.image;
            movie.cities = cities || movie.cities;
            movie.releaseDate = releaseDate || movie.releaseDate;
            if (cityStatus) movie.cityStatus = cityStatus;

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