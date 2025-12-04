const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars BEFORE requiring services
dotenv.config({ path: path.join(__dirname, '../.env') });

const Movie = require('../models/Movie');
const { fetchMovieDetails } = require('../services/tmdbService');

const updateTrailers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const movies = await Movie.find({ isTMDBImport: true });
        console.log(`🎬 Found ${movies.length} TMDB movies to update...`);

        let updatedCount = 0;

        for (const movie of movies) {
            if (!movie.tmdbId) continue;

            console.log(`Processing: ${movie.title} (ID: ${movie.tmdbId})`);

            // Fetch details including videos
            const details = await fetchMovieDetails(movie.tmdbId);

            if (details) {
                if (details.videos && details.videos.results && details.videos.results.length > 0) {
                    const trailer = details.videos.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');

                    if (trailer) {
                        movie.trailerKey = trailer.key;
                        await movie.save();
                        console.log(`   ✅ Added trailer: https://www.youtube.com/watch?v=${trailer.key}`);
                        updatedCount++;
                    } else {
                        console.log('   ⚠️ No YouTube trailer found in results:', details.videos.results.map(v => v.type));
                    }
                } else {
                    console.log('   ⚠️ No videos found in TMDB response');
                }
            } else {
                console.log('   ❌ Failed to fetch details from TMDB');
            }

            // Small delay to be nice to API
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log(`\n🎉 Finished! Updated ${updatedCount} movies with trailers.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

updateTrailers();
