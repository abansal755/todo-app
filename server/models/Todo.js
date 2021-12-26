const mongoose = require('mongoose');
const { createCipheriv, randomBytes, createDecipheriv } = require('crypto');

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

const key = process.env.TODO_TEXT_SECRET || '3F442A472D4B6150645367566B59703373367639792442264529482B4D625165';

const cipher = (message,key) => {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes256',Buffer.from(key,'hex'),iv);
    const encryptedMessage = cipher.update(message,'utf-8','hex') + cipher.final('hex');
    return `${encryptedMessage}:${iv.toString('hex')}`;
}

const decipher = (message,key) => {
    const [encryptedMessage,iv] = message.split(':');
    const decipher = createDecipheriv('aes256',Buffer.from(key,'hex'),Buffer.from(iv,'hex'));
    const decryptedMessage = decipher.update(encryptedMessage,'hex','utf-8') + decipher.final('utf-8');
    return decryptedMessage;
}

const encrypt = doc => {
    const encryptedMessage = cipher(doc.text,key);
    doc.text = encryptedMessage;
}

const decrypt = doc => {
    const decryptedMessage = decipher(doc.text,key);
    doc.text = decryptedMessage;
}

todoSchema.pre('save', function(next) {
    encrypt(this);
    next();
})

todoSchema.post('save', function(doc,next) {
    decrypt(doc);
    next();
})

todoSchema.post('findOne', function(doc,next) {
    decrypt(doc)
    next();
})

module.exports = mongoose.model('Todo',todoSchema);