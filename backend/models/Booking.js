const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater' }, // Optional for now if legacy data exists
    showtime: {
        date: String,
        time: String,
    },
    seats: { type: [String], required: true }, // Changed to String to support "A1", "B2"
    quantity: { type: Number, default: 1 },
    totalAmount: { type: Number, default: 0 },
    status: { type: String, default: 'Confirmed' }, // Pending, Confirmed, Cancelled
    bookingTime: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);