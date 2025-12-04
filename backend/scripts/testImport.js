// Test TMDB import directly
require('dotenv').config();
const mongoose = require('mongoose');
const { importTMDBMovies } = require('../services/tmdbService');

async function testImport() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected\n');
        
        console.log('Starting TMDB import...');
        const result = await importTMDBMovies();
        
        console.log('\n✅ Import successful!');
        console.log('Result:', result);
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Import failed!');
        console.error('Error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
}

testImport();
