const mongoose = require('mongoose')
const { Schema } = mongoose;

const Email = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    code: {
        type: Number,
        required: false,
        unique: true
    },
    status: {
        type: Boolean,
        required: false,
        unique: false
    }
})

const emailverefy = mongoose.model('emailverefy', Email);
module.exports = emailverefy;