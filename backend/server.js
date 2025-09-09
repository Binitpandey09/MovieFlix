
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');

// dotenv.config();


// dotenv.config();

// // Route imports
// const authRoutes = require('./routes/authRoutes');
// const movieRoutes = require('./routes/movieRoutes');
// const bookingRoutes = require('./routes/bookingRoutes');
// const cityRoutes = require('./routes/cityRoutes');
// const bannerRoutes = require('./routes/bannerRoutes');
// const contactRoutes = require('./routes/contactRoutes');
// const categoryRoutes = require('./routes/categoryRoutes');


// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/movies', movieRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/cities', cityRoutes);
// app.use('/api/banners', bannerRoutes);
// app.use('/api/contact', contactRoutes);
// app.use('/api/categories', categoryRoutes);

// // Database Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log("✅ MongoDB Atlas connected"))
// .catch(err => console.error("❌ MongoDB connection error:", err));

// // Start Server
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// module.exports = app;

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

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://movieflix-frontend-afk2d4qee-binitpandey09s-projects.vercel.app',
    'https://movieflix-frontend-onuzi04fx-binitpandey09s-projects.vercel.app', // Add this new one too
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Root route (ADD THIS SECTION)
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
