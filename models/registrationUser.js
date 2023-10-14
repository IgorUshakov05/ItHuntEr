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
    country: {
        type: String,
        required: true,
        unique: false,
        default:"Не определено"
    },
    Region: {
        type: String,
        required: true,
        unique: false,
        default:"Не определено"

    },
    City: {
        type: String,
        required: true,
        unique: false,
        default:"Не определено"
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
    },
    premium: {
        type:Boolean,
        required: false,
        default: false
    },
    specialls: {
        type:String,
        required: false,
        default: "Не определено"
    },
    skills: {
        type: Array,
        required: false
    },

    description: {
        type: String,
        required: false,
        default: "Пусто"
    }

});

const User = mongoose.model('User', registrationSchema);
module.exports = User;