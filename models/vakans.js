const mongoose = require('mongoose')
const { Schema } = mongoose;

const Vakans = new Schema({
    title: {
        type: String,
        required: false,
        unique: true
    },
    date: {
        type: Date,
        required: false,
        unique: false
    }
})

const vakans = mongoose.model('vakans', Vakans);
module.exports = vakans;