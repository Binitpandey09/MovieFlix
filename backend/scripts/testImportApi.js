const axios = require('axios');
require('dotenv').config({ path: '../.env' });

const API_URL = 'http://localhost:5001/api';

const testImport = async () => {
    try {
        console.log('🔑 Logging in as admin...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'vinitpandey858@gmail.com',
            password: 'admin123'
        }).catch(e => {
            console.error('Login Error:', e.response?.data || e.message);
            throw e;
        });

        const token = loginRes.data.token;
        console.log('✅ Login successful. Token:', token.substring(0, 20) + '...');

        console.log('🚀 Triggering TMDB Import...');
        const importRes = await axios.post(
            `${API_URL}/tmdb/fetch`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 60000 // 60s timeout
            }
        );

        console.log('✅ Import Response:', importRes.data);
    } catch (error) {
        console.error('❌ Import Failed:', error.response?.data || error.message);
    }
};

testImport();
