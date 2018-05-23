'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var HotelSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Hotel name is required!']
    },

    address: {
        type: String,
        required: [true, 'Hotel address is required!']
    },

    phone: {
        type: String
    },

    corporateRates: {
        type: String
    }

}, 
{
    timestamps: true // auto-add createdAt and updatedAt

});

module.exports = mongoose.model('hotel', HotelSchema);