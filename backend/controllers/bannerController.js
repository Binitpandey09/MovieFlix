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
    try {
        const banner = new Banner({ movie, bannerImage, title });
        const createdBanner = await banner.save();
        res.status(201).json(createdBanner);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
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