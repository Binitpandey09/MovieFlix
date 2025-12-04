const City = require('../models/City');

exports.getCities = async (req, res) => {
    try {
        const cities = await City.find({}).sort({ name: 1 });
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

exports.addCity = async (req, res) => {
    const { name } = req.body;
    try {
        const cityExists = await City.findOne({ name });
        if (cityExists) {
            return res.status(400).json({ message: 'City already exists' });
        }
        const city = new City({ name });
        const createdCity = await city.save();
        res.status(201).json(createdCity);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};