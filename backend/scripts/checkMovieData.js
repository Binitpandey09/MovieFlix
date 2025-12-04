const mongoose = require('mongoose');
const Movie = require('../models/Movie');
require('dotenv').config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Connected to MongoDB');

        const movies = await Movie.find({ isEnabled: true }).limit(10);
        console.log(`\n🎬 Found ${movies.length} ENABLED movies. Checking details:\n`);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log(`📅 Today is: ${today.toISOString().split('T')[0]}\n`);

        movies.forEach(m => {
            console.log(`Title: ${m.title}`);
            console.log(`   Release Date: ${m.releaseDate ? m.releaseDate.toISOString().split('T')[0] : 'N/A'}`);
            console.log(`   Showtimes: ${m.showtimes.length}`);
            console.log(`   Cities: ${m.cities.join(', ') || 'None'}`);

            const isReleased = m.releaseDate <= today;
            const hasShowtimes = m.showtimes.length > 0;

            let status = [];
            if (isReleased && hasShowtimes) status.push('✅ Now Showing');
            else if (isReleased && !hasShowtimes) status.push('❌ Now Showing (Needs Showtimes)');

            if (!isReleased) status.push('✅ Coming Soon');
            else status.push('❌ Coming Soon (Released in past)');

            console.log(`   Status Analysis: ${status.join(', ')}`);
            console.log('---------------------------------------------------');
        });

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkData();
