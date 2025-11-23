const axios = require('axios');
const Movie = require('../models/Movie');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Fetch movies from TMDB
const fetchTMDBMovies = async (endpoint) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'en-US',
                page: 1,
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('TMDB API Error:', error.message);
        throw error;
    }
};

// Get movie details from TMDB
const fetchMovieDetails = async (tmdbId) => {
    try {
        const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'en-US',
            }
        });
        return response.data;
    } catch (error) {
        console.error('TMDB Movie Details Error:', error.message);
        return null;
    }
};

// Import movies from TMDB to database
const importTMDBMovies = async () => {
    try {
        console.log('🎬 Starting TMDB movie import...');
        
        // Fetch upcoming and now playing movies
        const upcomingMovies = await fetchTMDBMovies('/movie/upcoming');
        const nowPlayingMovies = await fetchTMDBMovies('/movie/now_playing');
        
        // Combine and remove duplicates
        const allMovies = [...upcomingMovies, ...nowPlayingMovies];
        const uniqueMovies = allMovies.filter((movie, index, self) =>
            index === self.findIndex((m) => m.id === movie.id)
        );
        
        console.log(`📥 Found ${uniqueMovies.length} unique movies from TMDB`);
        
        let imported = 0;
        let updated = 0;
        let skipped = 0;
        
        for (const tmdbMovie of uniqueMovies) {
            try {
                // Get detailed info
                const details = await fetchMovieDetails(tmdbMovie.id);
                if (!details) {
                    skipped++;
                    continue;
                }
                
                // Check if movie already exists
                const existingMovie = await Movie.findOne({ tmdbId: tmdbMovie.id });
                
                const movieData = {
                    tmdbId: tmdbMovie.id,
                    title: tmdbMovie.title,
                    description: tmdbMovie.overview || 'No description available',
                    poster: tmdbMovie.poster_path,
                    backdrop: tmdbMovie.backdrop_path,
                    releaseDate: new Date(tmdbMovie.release_date),
                    genre: details.genres && details.genres.length > 0 
                        ? details.genres.map(g => g.name).join(', ') 
                        : 'General',
                    rating: tmdbMovie.vote_average || 0,
                    voteAverage: tmdbMovie.vote_average,
                    runtime: details.runtime,
                    language: details.original_language?.toUpperCase() || 'EN',
                    isTMDBImport: true,
                };
                
                if (existingMovie) {
                    // Update existing movie (but preserve admin settings)
                    await Movie.findByIdAndUpdate(existingMovie._id, {
                        ...movieData,
                        isEnabled: existingMovie.isEnabled, // Preserve admin choice
                        showtimes: existingMovie.showtimes, // Preserve showtimes
                        cities: existingMovie.cities, // Preserve cities
                    });
                    updated++;
                } else {
                    // Create new movie (disabled by default)
                    await Movie.create({
                        ...movieData,
                        isEnabled: false,
                        cities: [],
                        showtimes: [],
                    });
                    imported++;
                }
            } catch (error) {
                console.error(`Error processing movie ${tmdbMovie.title}:`, error.message);
                skipped++;
            }
        }
        
        console.log(`✅ Import complete: ${imported} new, ${updated} updated, ${skipped} skipped`);
        return { imported, updated, skipped, total: uniqueMovies.length };
    } catch (error) {
        console.error('❌ TMDB import failed:', error.message);
        throw error;
    }
};

module.exports = {
    importTMDBMovies,
    fetchTMDBMovies,
    fetchMovieDetails,
};
