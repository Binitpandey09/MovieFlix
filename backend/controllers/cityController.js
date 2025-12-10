const City = require('../models/City');

// @desc    Get all cities
// @route   GET /api/cities
// @access  Public
const getCities = async (req, res) => {
    try {
        const cities = await City.find({});
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a city
// @route   POST /api/cities
// @access  Private/Admin
const addCity = async (req, res) => {
    try {
        const { name } = req.body;
        const cityExists = await City.findOne({ name });

        if (cityExists) {
            res.status(400);
            throw new Error('City already exists');
        }

        const city = await City.create({ name });
        res.status(201).json(city);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a city
// @route   DELETE /api/cities/:id
// @access  Private/Admin
const deleteCity = async (req, res) => {
    try {
        const city = await City.findById(req.params.id);
        if (city) {
            await city.deleteOne();
            res.json({ message: 'City removed' });
        } else {
            res.status(404).json({ message: 'City not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCities, addCity, deleteCity };