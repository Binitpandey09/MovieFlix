const mongoose = require('mongoose');

const ShowtimeSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    totalSeats: { type: Number, default: 50 },
    availableSeats: { type: Number, default: 50 },
});

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: { type: String, required: true },
    rating: { type: Number, required: true },
    image: { type: String, required: true },
    cities: { type: [String], required: true },
    releaseDate: { type: Date, required: true },
    showtimes: [ShowtimeSchema],
}, { timestamps: true });

module.exports = mongoose.model('Movie', MovieSchema);