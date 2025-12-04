const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Create admin user
const createAdminUser = async () => {
    try {
        // Admin credentials
        const adminData = {
            name: 'Admin',
            email: 'vinitpandey858@gmail.com',
            password: 'admin123',  // Change this to your desired password
            isAdmin: true
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });

        if (existingAdmin) {
            console.log('\n⚠️  Admin user already exists!');
            console.log('================================');
            console.log(`Name: ${existingAdmin.name}`);
            console.log(`Email: ${existingAdmin.email}`);
            console.log(`Admin: ${existingAdmin.isAdmin ? '✅ Yes' : '❌ No'}`);
            console.log('\n💡 If you forgot the password, run:');
            console.log('   node backend/scripts/resetAdminPassword.js');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        adminData.password = await bcrypt.hash(adminData.password, salt);

        // Create admin user
        const admin = await User.create(adminData);

        console.log('\n✅ Admin user created successfully!');
        console.log('================================');
        console.log(`Name: ${admin.name}`);
        console.log(`Email: ${admin.email}`);
        console.log(`Password: admin123`);
        console.log(`Admin: ${admin.isAdmin ? '✅ Yes' : '❌ No'}`);
        console.log('\n🔐 Login Credentials:');
        console.log('   Email: admin@movieflix.com');
        console.log('   Password: admin123');
        console.log('\n⚠️  IMPORTANT: Change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
};

createAdminUser();
