const mongoose = require('mongoose');
const validator = require('validator');

const todoSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        minlength: 1,
        validate: {
            validator: text => validator.isAlphanumeric(text),
            msg: 'not alphanumeric'
        }
    },
    isCompleted: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = mongoose.model('Todo',todoSchema);