const Theater = require('../models/Theater');

// @desc    Get all theaters or filter by city
// @route   GET /api/theaters?city=cityId
// @access  Public
const getTheaters = async (req, res) => {
    try {
        const query = {};
        if (req.query.city) {
            query.city = req.query.city;
        }
        const theaters = await Theater.find(query).populate('city', 'name');
        res.json(theaters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a theater
// @route   POST /api/theaters
// @access  Private/Admin
const addTheater = async (req, res) => {
    try {
        const { name, city, location } = req.body;
        const theater = new Theater({ name, city, location });
        const createdTheater = await theater.save();
        res.status(201).json(createdTheater);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a theater
// @route   DELETE /api/theaters/:id
// @access  Private/Admin
const deleteTheater = async (req, res) => {
    try {
        const theater = await Theater.findById(req.params.id);
        if (theater) {
            await theater.deleteOne();
            res.json({ message: 'Theater removed' });
        } else {
            res.status(404).json({ message: 'Theater not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTheaters, addTheater, deleteTheater };
