const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    originalName: {
        type: String,
        required: true
    },
    safeName: {
        type: String,
        required: true,
        unique: true
    },
    path: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    password: {
        type: String, // Plaintext for simplicity as requested, or hashed if we want to be fancy. Let's stick to simple first.
        default: null
    },
    burnOnRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('File', fileSchema);
