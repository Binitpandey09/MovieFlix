const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movieId: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    showtime: {
        date: String,
        time: String,
    },
    seats: { type: [Number], required: true },
    bookingTime: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);