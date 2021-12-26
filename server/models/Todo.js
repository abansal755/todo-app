const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 1
    },
    isCompleted: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Todo',todoSchema);