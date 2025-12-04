const mongoose = require('mongoose');

const BannerSchema = new mongoose.Schema({
    movie: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Movie', 
        required: true 
    },
    bannerImage: { 
        type: String, 
        required: true 
    },
    title: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Banner', BannerSchema);