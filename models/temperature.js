const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const temperatureSchema = new Schema({
    record: {
        type: String,
        required: true,
        unique: true
    },
    lng: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    air: {
        type: String,
        default: ''
    },
    water: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Temperature = mongoose.model('Temperature', temperatureSchema);

module.exports = Temperature;