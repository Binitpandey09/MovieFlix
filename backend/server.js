const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// --- Route Imports ---
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const cityRoutes = require('./routes/cityRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const contactRoutes = require('./routes/contactRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

const app = express();


// --- Middleware ---

// List of all your Vercel deployment URLs that should be allowed.
const allowedOrigins = [
  'https://movieflix-frontend-ten.vercel.app',
  'https://movieflix-frontend-5krgW3nk-binitpandey09s-projects.vercel.app',
  'https://movieflix-frontend-hgekehzi1-binitpandey09s-projects.vercel.app',
  'https://movieflix-frontend-r9w2e30n-binitpandey09s-projects.vercel.app',
  'https://movieflix-frontend-hn8so9s1w-binitpandey09s-projects.vercel.app' // This is your newest one ✅
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Request from this origin is not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(express.json());


// --- API Routes ---
app.get('/', (req, res) => {
  res.json({ message: "MovieFlix Backend API is alive and running!" });
});

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/categories', categoryRoutes);


// --- Database Connection ---
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB Atlas connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));


// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

