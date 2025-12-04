require('dotenv').config();
const mongoose = require('mongoose');
const { importTMDBMovies } = require('../services/tmdbService');

const runImport = async () => {
    try {
        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        console.log('🎬 Starting Movie Import...');
        const result = await importTMDBMovies();

        console.log('==========================================');
        console.log('🎉 Import Summary:');
        console.log(`   New Movies: ${result.imported}`);
        console.log(`   Updated:    ${result.updated}`);
        console.log(`   Skipped:    ${result.skipped}`);
        console.log(`   Total:      ${result.total}`);
        console.log('==========================================');

        process.exit(0);
    } catch (error) {
        console.error('❌ Import Failed:', error);
        process.exit(1);
    }
};

runImport();
