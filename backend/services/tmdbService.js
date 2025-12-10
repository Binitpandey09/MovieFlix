const axios = require('axios');
const Movie = require('../models/Movie');
const https = require('https');

const agent = new https.Agent({
    keepAlive: true,
    rejectUnauthorized: false,
    family: 4 // Force IPv4
});

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper
const fetchWithRetry = async (fn, retries = 1) => { // Reduced retries to 1
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            console.error(`❌ Request failed: ${error.message}`);
            if (error.response) {
                console.error(`Status: ${error.response.status}, Data: ${JSON.stringify(error.response.data)}`);
            }
            if (i === retries - 1) throw error;
            console.log(`⚠️ Retrying (${i + 1}/${retries})...`);
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
                region: 'IN',
                page: 1,
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json',
                'Connection': 'keep-alive'
            },
            timeout: 10000, // Reduced to 10s for faster feedback
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
        // Interleave to get a mix of Now Playing and Upcoming
        const allMovies = [];
        const maxLength = Math.max(upcomingMovies.length, nowPlayingMovies.length);
        for (let i = 0; i < maxLength; i++) {
            if (i < nowPlayingMovies.length) allMovies.push(nowPlayingMovies[i]);
            if (i < upcomingMovies.length) allMovies.push(upcomingMovies[i]);
        }

        let uniqueMovies = allMovies.filter((movie, index, self) =>
            index === self.findIndex((m) => m.id === movie.id)
        );

        // Get list of existing TMDB IDs from database
        const existingTmdbIds = await Movie.find({
            tmdbId: { $in: uniqueMovies.map(m => m.id) }
        }).distinct('tmdbId');

        // Filter to keep only NEW movies (ensure type safety)
        const newMovies = uniqueMovies.filter(m => !existingTmdbIds.some(id => String(id) === String(m.id)));

        console.log(`📥 TMDB Fetch: ${uniqueMovies.length} total. Existing in DB: ${existingTmdbIds.length}. New available: ${newMovies.length}`);

        // Select top 5 NEW movies to import
        // If we have fewer than 5 new movies, we can fill the rest with existing ones to ensure we process 5 items (optional, but user wants imports)
        // For now, let's strictly prioritize NEW movies.
        const moviesToProcess = newMovies.slice(0, 5);

        console.log(`Processing ${moviesToProcess.length} new movies...`);

        let imported = 0;
        let updated = 0;
        let skipped = 0;

        for (const tmdbMovie of moviesToProcess) {
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
