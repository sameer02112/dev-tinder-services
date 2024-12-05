const mongoose = require('mongoose');
const url = "mongodb+srv://sameer02112:8BudVrYZ8vJQrQ6j@devtindercluster.5bgzu.mongodb.net/devTinder";

const connectDB = async () => {
    await mongoose.connect(url);
}

module.exports = connectDB;
