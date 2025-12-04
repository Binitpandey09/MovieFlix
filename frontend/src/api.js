import axios from 'axios';

// Create an Axios instance.
// In a Create React App project, environment variables from a .env file
// that start with REACT_APP_ are automatically loaded onto the process.env object.
// You DO NOT need to import or configure the 'dotenv' package in the frontend.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export default api;