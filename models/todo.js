const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    isCompleted: {
        type: Boolean,
        required: true
    }
})

module.exports = mongoose.model('Todo', todoSchema);