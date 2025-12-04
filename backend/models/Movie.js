const mongoose = require('mongoose');

const ShowtimeSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    screen: { type: String, default: 'Screen 1' },
    totalSeats: { type: Number, default: 50 },
    availableSeats: { type: Number, default: 50 },
    price: { type: Number, default: 200 },
});

const MovieSchema = new mongoose.Schema({
    // TMDB fields
    tmdbId: { type: Number, unique: true, sparse: true }, // TMDB movie ID
    title: { type: String, required: true },
    description: { type: String, required: true },
    poster: { type: String }, // TMDB poster path
    backdrop: { type: String }, // TMDB backdrop path
    trailerKey: { type: String }, // YouTube video key
    releaseDate: { type: Date, required: true },

    // Legacy/Manual fields
    genre: { type: String, required: true },
    rating: { type: Number, default: 0 },
    image: { type: String }, // Legacy field for manual movies

    // Admin control fields
    isEnabled: { type: Boolean, default: false }, // Admin enables for booking
    isTMDBImport: { type: Boolean, default: false }, // Auto-imported from TMDB

    // Booking fields
    // cities: { type: [String], default: [] }, // Removed
    showtimes: [ShowtimeSchema],
    defaultPrice: { type: Number, default: 200 },

    // Additional metadata
    runtime: { type: Number }, // in minutes
    language: { type: String, default: 'English' },
    voteAverage: { type: Number }, // TMDB rating
}, { timestamps: true });

// Virtual for poster URL
MovieSchema.virtual('posterUrl').get(function () {
    if (this.poster) {
        return `https://image.tmdb.org/t/p/w500${this.poster}`;
    }
    return this.image; // Fallback to legacy image
});

// Virtual for backdrop URL
MovieSchema.virtual('backdropUrl').get(function () {
    if (this.backdrop) {
        return `https://image.tmdb.org/t/p/original${this.backdrop}`;
    }
    return null;
});

MovieSchema.set('toJSON', { virtuals: true });
MovieSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Movie', MovieSchema);