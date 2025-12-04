// Test script to verify TMDB API connection
require('dotenv').config();
const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function testTMDBConnection() {
    console.log('🎬 Testing TMDB API Connection...\n');
    
    if (!TMDB_API_KEY || TMDB_API_KEY === 'your_tmdb_api_key_here') {
        console.error('❌ ERROR: TMDB_API_KEY not set in .env file');
        console.log('\n📝 Please add your TMDB API key to backend/.env:');
        console.log('   TMDB_API_KEY=your_actual_key_here\n');
        process.exit(1);
    }
    
    try {
        // Test 1: Fetch now playing movies
        console.log('Test 1: Fetching now playing movies...');
        const nowPlayingResponse = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'en-US',
                page: 1,
            }
        });
        console.log(`✅ Success! Found ${nowPlayingResponse.data.results.length} now playing movies`);
        console.log(`   Sample: "${nowPlayingResponse.data.results[0].title}"\n`);
        
        // Test 2: Fetch upcoming movies
        console.log('Test 2: Fetching upcoming movies...');
        const upcomingResponse = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'en-US',
                page: 1,
            }
        });
        console.log(`✅ Success! Found ${upcomingResponse.data.results.length} upcoming movies`);
        console.log(`   Sample: "${upcomingResponse.data.results[0].title}"\n`);
        
        // Test 3: Fetch movie details
        const movieId = nowPlayingResponse.data.results[0].id;
        console.log(`Test 3: Fetching details for movie ID ${movieId}...`);
        const detailsResponse = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
            params: {
                api_key: TMDB_API_KEY,
                language: 'en-US',
            }
        });
        console.log(`✅ Success! Got details for "${detailsResponse.data.title}"`);
        console.log(`   Runtime: ${detailsResponse.data.runtime} minutes`);
        console.log(`   Genres: ${detailsResponse.data.genres.map(g => g.name).join(', ')}\n`);
        
        console.log('🎉 All tests passed! TMDB API is working correctly.\n');
        console.log('✅ You can now import movies via the Admin Panel!\n');
        
    } catch (error) {
        console.error('❌ ERROR: TMDB API test failed');
        if (error.response) {
            console.error(`   Status: ${error.response.status}`);
            console.error(`   Message: ${error.response.data.status_message || error.message}`);
            
            if (error.response.status === 401) {
                console.log('\n💡 This usually means your API key is invalid.');
                console.log('   Please check your TMDB_API_KEY in backend/.env\n');
            }
        } else {
            console.error(`   ${error.message}`);
        }
        process.exit(1);
    }
}

testTMDBConnection();
