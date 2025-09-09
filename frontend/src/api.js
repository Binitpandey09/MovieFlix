import axios from 'axios';

// Create an Axios instance with a base URL pointing to your Render backend.
const api = axios.create({
  baseURL: 'https://movieflix-sp5q.onrender.com'
});

export default api;

