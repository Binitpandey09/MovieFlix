require('dotenv').config();
const mongoose = require('mongoose');
const { importTMDBMovies } = require('../services/tmdbService');

console.log('Script started');

async function main() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        console.log('Calling importTMDBMovies...');
        const result = await importTMDBMovies();
        console.log('Result:', result);

    } catch (e) {
        console.error('CRITICAL ERROR:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Done.');
    }
}

main();
