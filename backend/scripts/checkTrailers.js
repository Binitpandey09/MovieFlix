const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Movie = require('../models/Movie');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkTrailers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const movies = await Movie.find({});
        console.log(`🎬 Total Movies: ${movies.length}`);

        const moviesWithTrailer = movies.filter(m => m.trailerKey);
        console.log(`✅ Movies with Trailer: ${moviesWithTrailer.length}`);

        if (moviesWithTrailer.length > 0) {
            console.log('Sample movie with trailer:', moviesWithTrailer[0].title, moviesWithTrailer[0].trailerKey);
        } else {
            console.log('❌ No movies have trailerKey set!');
            // Log one movie to see its structure
            if (movies.length > 0) {
                console.log('Sample movie structure:', JSON.stringify(movies[0], null, 2));
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkTrailers();
