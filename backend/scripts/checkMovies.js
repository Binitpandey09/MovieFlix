// Check all movies in database
require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('../models/Movie');

async function checkMovies() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB\n');
        
        // Get all movies
        const allMovies = await Movie.find({});
        console.log(`📊 Total movies in database: ${allMovies.length}\n`);
        
        // Separate TMDB and manual movies
        const tmdbMovies = allMovies.filter(m => m.isTMDBImport);
        const manualMovies = allMovies.filter(m => !m.isTMDBImport);
        
        console.log('🎬 TMDB Movies:', tmdbMovies.length);
        console.log('   Enabled:', tmdbMovies.filter(m => m.isEnabled).length);
        console.log('   Disabled:', tmdbMovies.filter(m => !m.isEnabled).length);
        
        console.log('\n📝 Manual Movies:', manualMovies.length);
        console.log('   With isEnabled field:', manualMovies.filter(m => m.isEnabled !== undefined).length);
        console.log('   Without isEnabled field:', manualMovies.filter(m => m.isEnabled === undefined).length);
        
        if (manualMovies.length > 0) {
            console.log('\n📋 Manual Movies List:');
            manualMovies.forEach((m, i) => {
                console.log(`   ${i + 1}. ${m.title}`);
                console.log(`      - isEnabled: ${m.isEnabled}`);
                console.log(`      - Showtimes: ${m.showtimes?.length || 0}`);
            });
        }
        
        if (tmdbMovies.length > 0) {
            console.log('\n🎬 Sample TMDB Movies:');
            tmdbMovies.slice(0, 5).forEach((m, i) => {
                console.log(`   ${i + 1}. ${m.title}`);
                console.log(`      - Enabled: ${m.isEnabled}`);
                console.log(`      - Release: ${m.releaseDate?.toISOString().split('T')[0]}`);
                console.log(`      - Showtimes: ${m.showtimes?.length || 0}`);
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkMovies();
