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

// Reset admin password
const resetAdminPassword = async () => {
    try {
        // Find admin user (change email if needed)
        const adminEmail = 'binitpandey950@gmail.com';
        const newPassword = 'admin123';  // Change this to your desired password
        
        const admin = await User.findOne({ email: adminEmail, isAdmin: true });
        
        if (!admin) {
            console.log('\n❌ Admin user not found!');
            console.log(`   Looking for: ${adminEmail}`);
            console.log('\n💡 Available options:');
            console.log('   1. Check existing admins: node backend/scripts/checkAdminUser.js');
            console.log('   2. Create new admin: node backend/scripts/createAdminUser.js');
            process.exit(1);
        }
        
        // Hash new password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);
        
        // Save updated user
        await admin.save();
        
        console.log('\n✅ Admin password reset successfully!');
        console.log('================================');
        console.log(`Name: ${admin.name}`);
        console.log(`Email: ${admin.email}`);
        console.log(`New Password: ${newPassword}`);
        console.log('\n🔐 Login Credentials:');
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${newPassword}`);
        console.log('\n⚠️  IMPORTANT: Change the password after login!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting password:', error);
        process.exit(1);
    }
};

resetAdminPassword();
