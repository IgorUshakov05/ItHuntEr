const mongoose = require('mongoose');
const { Schema } = mongoose;

const Token = new Schema({
    token: {
        type: String,
        required: true,
        unique: true
    }
});

const token = mongoose.model('Token', Token);
module.exports = token;