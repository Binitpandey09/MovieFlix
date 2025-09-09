const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Route imports
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const cityRoutes = require('./routes/cityRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const contactRoutes = require('./routes/contactRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();

// Flexible CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin === 'http://localhost:3000') return callback(null, true);
    
    // Allow any Cloudflare Pages deployment for your project
    if (origin.includes('movieflix') && origin.includes('pages.dev')) {
      return callback(null, true);
    }
    
    // Reject all other origins
    callback(new Error('Request from this origin is not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Make sure this line is below the corsOptions object
app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: "MovieFlix Backend API is running!", 
    status: "success",
    endpoints: {
      auth: "/api/auth",
      movies: "/api/movies", 
      bookings: "/api/bookings",
      cities: "/api/cities",
      banners: "/api/banners",
      contact: "/api/contact",
      categories: "/api/categories"
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/categories', categoryRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Atlas connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;