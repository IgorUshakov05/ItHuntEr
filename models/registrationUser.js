const mongoose = require('mongoose');
const { Schema } = mongoose;

const registrationSchema = new Schema({
    id: {
        type: Number,
        required: false,
        unique:true
    },
    name: {
        type: String,
        required: false,
        unique: false // Убрали ограничение уникальности для поля name
    },
    lastname: {
        type: String,
        required: false,
        unique: false
    },
    date: {
        type: String,
        required: false,
        unique: false
    },
    role: {
        type: String,
        required: false,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true // Оставили ограничение уникальности для поля email
    },
    password: {
        type: String,
        required: false,
        unique: false
    },
    policy: {
        type: String,
        required: false,
        unique: false
    },
    photo: {
        type:String,
        required: false,
        default: null
    }
});

const User = mongoose.model('User', registrationSchema);
module.exports = User;