const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Check admin users
const checkAdminUsers = async () => {
    try {
        const adminUsers = await User.find({ isAdmin: true }).select('name email isAdmin');
        
        console.log('\n📋 Admin Users in Database:');
        console.log('================================');
        
        if (adminUsers.length === 0) {
            console.log('❌ No admin users found!');
            console.log('\n💡 You need to create an admin user.');
            console.log('   Run: node backend/scripts/createAdminUser.js');
        } else {
            adminUsers.forEach((user, index) => {
                console.log(`\n${index + 1}. Name: ${user.name}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Admin: ${user.isAdmin ? '✅ Yes' : '❌ No'}`);
            });
            
            console.log('\n================================');
            console.log(`\n✅ Found ${adminUsers.length} admin user(s)`);
            console.log('\n💡 Use the email above to login');
            console.log('   If you forgot the password, run:');
            console.log('   node backend/scripts/resetAdminPassword.js');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkAdminUsers();
