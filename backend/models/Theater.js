const mongoose = require('mongoose');

const TheaterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
    location: { type: String, required: true }, // e.g., "Phoenix Mall, Viman Nagar"
}, { timestamps: true });

module.exports = mongoose.model('Theater', TheaterSchema);
