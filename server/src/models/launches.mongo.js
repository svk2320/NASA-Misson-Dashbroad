const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: { 
        type:Number, 
        required: true, 
        // default: 100, 
        // min: 100, 
        // max: 999
    },
    mission: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    launchDate: {
        type: Date,
        required: true
    },
    target: {
        type: String,
        // required: true
    },
    customers: [ String ],
    upcoming: {
        type: Boolean,
        required: true,
        // default: true
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    }
});

// Connets launchesSchema with the "launches" collection
// first parameters should always be singular because it will be converted to plural
module.exports = mongoose.model('Launch', launchesSchema);