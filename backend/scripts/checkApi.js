const axios = require('axios');

const checkApi = async () => {
    try {
        console.log('Fetching from http://localhost:5001/api/movies?status=now_showing');
        const response = await axios.get('http://localhost:5001/api/movies?status=now_showing');
        console.log('Status:', response.status);
        console.log('Movies Found:', response.data.length);
        if (response.data.length > 0) {
            console.log('First Movie:', response.data[0].title);
        }
    } catch (error) {
        console.error('API Error:', error.message);
    }
};

checkApi();
