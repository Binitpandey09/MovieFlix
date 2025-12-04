const mongoose = require('mongoose');
const Movie = require('../models/Movie');
require('dotenv').config();

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Connected to MongoDB');

        const count = await Movie.countDocuments();
        console.log(`🎬 Total Movies in Database: ${count}`);

        if (count > 0) {
            const movies = await Movie.find().limit(5);
            console.log('First 5 movies:');
            movies.forEach(m => console.log(` - ${m.title} (Enabled: ${m.isEnabled})`));
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

verify();
