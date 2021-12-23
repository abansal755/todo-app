const mongoose = require('mongoose')

module.exports = async () => {
    const dbUrl = process.env.DB_URL || 'mongodb://localhost/todo-app';
    await mongoose.connect(dbUrl);
    console.log('MongoDB is running...');
}