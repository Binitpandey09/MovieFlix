const Banner = require('../models/Banner');

exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true }).populate('movie', 'title');
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.addBanner = async (req, res) => {
    const { movie, bannerImage, title } = req.body;
    
    // Validation
    if (!movie) {
        return res.status(400).json({ message: 'Movie is required' });
    }
    if (!bannerImage) {
        return res.status(400).json({ message: 'Banner image URL is required' });
    }
    
    try {
        const banner = new Banner({ movie, bannerImage, title });
        const createdBanner = await banner.save();
        res.status(201).json(createdBanner);
    } catch (error) {
        console.error('Error adding banner:', error);
        res.status(500).json({ 
            message: 'Failed to add banner', 
            error: error.message 
        });
    }
};

exports.deleteBanner = async (req, res) => {
    try {
        const banner = await Banner.findById(req.params.id);
        if (banner) {
            await banner.deleteOne();
            res.json({ message: 'Banner removed' });
        } else {
            res.status(404).json({ message: 'Banner not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};