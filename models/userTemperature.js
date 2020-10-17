const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userTemperatureSchema = new Schema({
    user:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    meteo:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temperature'
    }]
}, {
    timestamps: true
});

var UserTemperature = mongoose.model('UserTemperature', userTemperatureSchema);

module.exports = UserTemperature;