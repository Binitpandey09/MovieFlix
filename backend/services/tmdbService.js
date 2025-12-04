const axios = require('axios');
const Movie = require('../models/Movie');
const https = require('https');

const agent = new https.Agent({
    keepAlive: true,
    rejectUnauthorized: false
});

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper
const fetchWithRetry = async (fn, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`⚠️ Request failed, retrying (${i + 1}/${retries})...`);
            await delay(1000 * (i + 1));
        }
    }
};

// Fetch movies from TMDB
const fetchTMDBMovies = async (endpoint) => {
    return fetchWithRetry(async () => {
        console.log('🔍 Fetching from:', `${TMDB_BASE_URL}${endpoint}`);
        const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'en-US',
                page: 1,
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json',
                'Connection': 'keep-alive'
            },
            timeout: 60000, // 60s
            httpsAgent: agent,
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        });
        return response.data.results;
    });
};

// Get movie details from TMDB
const fetchMovieDetails = async (tmdbId) => {
    try {
        return await fetchWithRetry(async () => {
            const response = await axios.get(`${TMDB_BASE_URL}/movie/${tmdbId}`, {
                params: {
                    api_key: TMDB_API_KEY,
                    language: 'en-US',
                    append_to_response: 'videos', // Fetch videos/trailers
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'Accept': 'application/json',
                    'Connection': 'keep-alive'
                },
                timeout: 60000, // 60s
                httpsAgent: agent,
                maxBodyLength: Infinity,
                maxContentLength: Infinity
            });
            return response.data;
        });
    } catch (error) {
        console.error(`TMDB Movie Details Error for ID ${tmdbId}:`, error.message);
        return null;
    }
};

// Import movies from TMDB to database
const importTMDBMovies = async () => {
    try {
        console.log('🎬 Starting TMDB movie import...');

        // Fetch upcoming and now playing movies
        const upcomingMovies = await fetchTMDBMovies('/movie/upcoming');
        await delay(1000); // Wait 1s
        const nowPlayingMovies = await fetchTMDBMovies('/movie/now_playing');

        // Combine and remove duplicates
        const allMovies = [...upcomingMovies, ...nowPlayingMovies];
        const uniqueMovies = allMovies.filter((movie, index, self) =>
            index === self.findIndex((m) => m.id === movie.id)
        ).slice(0, 5); // Limit to 5 movies per batch for maximum stability

        console.log(`📥 Found ${uniqueMovies.length} unique movies from TMDB`);

        let imported = 0;
        let updated = 0;
        let skipped = 0;

        for (const tmdbMovie of uniqueMovies) {
            try {
                // Add delay to avoid rate limiting
                await delay(5000); // Increased delay to 5s

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
                    trailerKey: details.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer')?.key,
                    isTMDBImport: true,
                };

                if (existingMovie) {
                    // Update existing movie (but preserve admin settings)
                    await Movie.findByIdAndUpdate(existingMovie._id, {
                        ...movieData,
                        isEnabled: existingMovie.isEnabled, // Preserve admin choice
                        showtimes: existingMovie.showtimes, // Preserve showtimes
                        // cities: existingMovie.cities, // Removed cities preservation as field is gone
                    });
                    updated++;
                } else {
                    // Create new movie (disabled by default)
                    await Movie.create({
                        ...movieData,
                        isEnabled: false,
                        // cities: [], // Removed cities initialization
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
