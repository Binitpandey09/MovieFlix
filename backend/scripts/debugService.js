require('dotenv').config();
const { fetchTMDBMovies } = require('../services/tmdbService');

const testService = async () => {
    try {
        console.log('🧪 Testing TMDB Service...');
        const movies = await fetchTMDBMovies('/movie/now_playing');
        console.log(`✅ Service returned ${movies.length} movies.`);
        console.log('First movie:', movies[0].title);
    } catch (error) {
        console.error('❌ Service Failed:', error.message);
        if (error.code) console.error('Code:', error.code);
    }
};

testService();
