const mongoose = require('mongoose');
const config = require('./keys');

// TODO: Set up MongoDB connection using Mongoose
const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // TODO: Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
