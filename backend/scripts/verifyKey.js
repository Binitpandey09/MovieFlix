require('dotenv').config();
const axios = require('axios');

const key = process.env.TMDB_API_KEY;
console.log('Key loaded:', key ? `${key.substring(0, 5)}...${key.substring(key.length - 5)}` : 'UNDEFINED');
console.log('Key length:', key ? key.length : 0);

const testKey = async () => {
    try {
        const url = `https://api.themoviedb.org/3/authentication/token/new?api_key=${key}`;
        console.log('Testing key with URL:', url.replace(key, 'HIDDEN'));
        const res = await axios.get(url);
        console.log('✅ Key is VALID! Success:', res.data.success);
    } catch (e) {
        console.error('❌ Key is INVALID:', e.response?.data || e.message);
    }
};

testKey();
