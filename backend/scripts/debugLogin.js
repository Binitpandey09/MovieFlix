const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const debugLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'vinitpandey858@gmail.com';
        const password = 'admin123';

        const user = await User.findOne({ email });

        if (!user) {
            console.log('❌ User not found in database!');
            process.exit(1);
        }

        console.log('Found user:', user.email);
        console.log('Stored hash:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            console.log('✅ Password MATCHES!');
        } else {
            console.log('❌ Password DOES NOT MATCH!');

            // Let's try to generate a new hash and see what it looks like
            const salt = await bcrypt.genSalt(10);
            const newHash = await bcrypt.hash(password, salt);
            console.log('New hash for "admin123":', newHash);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

debugLogin();
