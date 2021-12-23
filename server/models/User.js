const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo'
    }]
});
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',userSchema);