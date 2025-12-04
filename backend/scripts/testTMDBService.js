console.log('Loading dotenv...');
require('dotenv').config({ path: '../.env' });
console.log('Loading mongoose...');
const mongoose = require('mongoose');
console.log('Loading tmdbService...');
const runTest = async () => {
    try {
        console.log('Loading tmdbService...');
        const { importTMDBMovies } = require('../services/tmdbService');
        console.log('tmdbService loaded.');

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        console.log('🚀 Starting TMDB Import Test...');
        const result = await importTMDBMovies();
        console.log('✅ Import Result:', result);

    } catch (error) {
        console.error('ERROR:', error.message);
        console.error(error.stack);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Disconnected');
    }
};

runTest();
