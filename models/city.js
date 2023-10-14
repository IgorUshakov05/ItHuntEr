const mongoose = require("mongoose");

const areaSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    parent_id: String,
    name: {
        type: String,
        required: true
    },
    areas: [{
        id: {
            type: String,
            required: true
        },
        parent_id: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        areas: [{
            id: {
                type: String,
                required: true
            },
            parent_id: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            }
        }]
    }]
});

const Area = mongoose.model("city", areaSchema);

module.exports = Area;
