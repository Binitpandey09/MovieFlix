const mongoose = require('mongoose');
const Movie = require('../models/Movie');
require('dotenv').config();

const addShowtimes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Connected to MongoDB');

        const movies = await Movie.find({ isEnabled: true });
        console.log(`Found ${movies.length} enabled movies.`);

        const cities = ['Mumbai', 'Delhi', 'Bangalore', 'New York', 'Amritsar', 'Pune', 'Chennai'];
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let updatedCount = 0;

        for (const movie of movies) {
            // Force update cities to include new ones
            movie.cities = cities;

            // Add showtimes if missing
            if (!movie.showtimes || movie.showtimes.length === 0) {
                movie.showtimes = [
                    {
                        date: today,
                        time: '10:00 AM',
                        screen: 'Screen 1',
                        totalSeats: 100,
                        availableSeats: 100,
                        price: 250
                    },
                    {
                        date: today,
                        time: '02:00 PM',
                        screen: 'Screen 2',
                        totalSeats: 120,
                        availableSeats: 120,
                        price: 300
                    },
                    {
                        date: tomorrow,
                        time: '06:00 PM',
                        screen: 'Screen 1',
                        totalSeats: 100,
                        availableSeats: 90,
                        price: 350
                    }
                ];
            }

            await movie.save();
            updatedCount++;
            console.log(`✅ Updated "${movie.title}" with cities and showtimes.`);
        }

        console.log(`\n🎉 Successfully updated ${updatedCount} movies!`);
        console.log('They should now appear in "Now Showing" on the homepage.');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

addShowtimes();
