
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


// --- Middleware ---

// CORS configuration updated with your NEW Vercel URL ✅
const corsOptions = {
  origin: 'https://movieflix-frontend-5krgW3nk-binitpandey09s-projects.vercel.app',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());


// --- API Routes ---

// Root route for API health check
app.get('/', (req, res) => {
  res.json({
    message: "MovieFlix Backend API is running!",
    status: "success"
  });
});

// All other API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/categories', categoryRoutes);


// --- Database Connection ---
// Make sure your .env file has the correct MONGO_URI
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Atlas connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));


// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
