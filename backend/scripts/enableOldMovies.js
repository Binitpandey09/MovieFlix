// Enable all old manual movies
require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

async function enableOldMovies() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB\n');
        
        // Find all manual movies (not TMDB imports)
        const manualMovies = await Movie.find({ isTMDBImport: { $ne: true } });
        
        console.log(`📝 Found ${manualMovies.length} manual movies\n`);
        
        if (manualMovies.length === 0) {
            console.log('No manual movies to enable');
            process.exit(0);
        }
        
        console.log('Enabling manual movies...\n');
        
        let enabled = 0;
        for (const movie of manualMovies) {
            await Movie.findByIdAndUpdate(movie._id, { isEnabled: true });
            console.log(`✅ Enabled: ${movie.title}`);
            enabled++;
        }
        
        console.log(`\n✅ Successfully enabled ${enabled} manual movies`);
        console.log('\nThese movies will now appear on the homepage!');
        console.log('Note: Movies without showtimes will only show in "Coming Soon" or "Movies" tab');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

enableOldMovies();
