const mongoose = require('mongoose');
const User = require('./models/User'); 
require('dotenv').config();

const migrateUsers = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

    const result = await User.updateMany(
        { name: { $exists: false } },
        { $set: { name: 'Default User' } }
    );

    console.log(`Updated ${result.modifiedCount} users to have a default name.`);
    await mongoose.disconnect();
};

migrateUsers().catch(console.error);
