const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: ''
    },
    isCompleted: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Todo',todoSchema);