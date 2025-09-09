
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

// List of all your Vercel deployment URLs that should be allowed.
const allowedOrigins = [
  'https://movieflix-frontend-ten.vercel.app',
  'https://movieflix-frontend-5krgW3nk-binitpandey09s-projects.vercel.app',
  'https://movieflix-frontend-hgekehzi1-binitpandey09s-projects.vercel.app',
  'https://movieflix-frontend-r9w2e30n-binitpandey09s-projects.vercel.app' // This is your latest one
];

const corsOptions = {
  origin: function (origin, callback) {
    // Check if the incoming origin is in our list of allowed origins
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

// Use the new CORS options ✅
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());


// --- API Routes ---

app.get('/', (req, res) => {
  res.json({
    message: "MovieFlix Backend API is running!",
    status: "success"
  });
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
.then(() => console.log("✅ MongoDB Atlas connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));


// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

