const express = require('express'); // Server restart trigger
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars BEFORE other imports
dotenv.config();

const cron = require('node-cron');
const { importTMDBMovies } = require('./services/tmdbService');

// Route imports
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const cityRoutes = require('./routes/cityRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const contactRoutes = require('./routes/contactRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const tmdbRoutes = require('./routes/tmdbRoutes');

const app = express();

// Flexible CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow localhost for development
    if (origin === 'http://localhost:3000') return callback(null, true);

    // Allow any movieflix-frontend vercel deployment
    if (origin.includes('movieflix-frontend') && origin.includes('vercel.app')) {
      return callback(null, true);
    }

    // Reject all other origins
    callback(new Error('Request from this origin is not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

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
app.use('/api/tmdb', tmdbRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("✅ MongoDB Atlas connected");

    // Run TMDB import on startup (optional)
    if (process.env.AUTO_IMPORT_ON_START === 'true') {
      console.log('🎬 Running initial TMDB import...');
      importTMDBMovies().catch(err => console.error('Initial import failed:', err));
    }
  })
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Cron job: Auto-import TMDB movies daily at 3 AM
if (process.env.ENABLE_CRON === 'true') {
  cron.schedule('0 3 * * *', async () => {
    console.log('🕐 Running scheduled TMDB import...');
    try {
      await importTMDBMovies();
    } catch (error) {
      console.error('Scheduled import failed:', error);
    }
  });
  console.log('⏰ TMDB auto-import cron job scheduled (daily at 3 AM)');
}

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;