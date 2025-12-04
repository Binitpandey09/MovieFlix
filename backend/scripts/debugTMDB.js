const axios = require('axios');
require('dotenv').config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

console.log('🔑 Testing TMDB API Key:', TMDB_API_KEY ? 'Present' : 'Missing');

const testTMDB = async () => {
    try {
        console.log('🌐 Connecting to TMDB API...');
        const response = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'en-US',
                page: 1,
            },
            headers: {
                'User-Agent': 'MovieFlix/1.0',
                'Accept-Encoding': 'gzip,deflate,compress'
            },
            timeout: 10000
        });

        console.log('✅ Connection Successful!');
        console.log(`🎬 Found ${response.data.results.length} movies.`);
        console.log('First movie:', response.data.results[0].title);

    } catch (error) {
        console.error('❌ TMDB Connection Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
            if (error.code === 'ECONNRESET') {
                console.error('⚠️  Network connection was reset. This might be due to a firewall, proxy, or unstable internet.');
            }
        }
    }
};

testTMDB();
