'use strict';

const appRoot = require('app-root-path');
const getDbConnection = require(`${appRoot}/server-api/databaseManager`);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The schema definition for a hotel entity

const HotelSchema = new Schema({

    title: {
        type: String,
        required: [true, 'Title name is required!']
    },

    reqestEmail: {
        type: String,
        required: [true, 'Request Email is required!']
    },

    reqestName: {
        type: String,
        required: [true, 'Request Name is required!']
    },

    numOfGeEmpAttending: {
        type: String,
        required: [true, 'number of GE employee Attending is required!']
    },

    numOfNonGeAttending: {
        type: String,
        required: [true, 'number of non GE employee  Attending is required!']
    },
}, 
{
    timestamps: true // auto-add createdAt and updatedAt
});


// Object to hold a hotel model per site.
var hotelModelBySite = {};


// Return a hotel model using the corresponding site database connection.
module.exports = function (siteCode) {   

    let siteCodeUpper = siteCode.toUpperCase();
    if (hotelModelBySite[siteCodeUpper] == null) {
        let dbConnection = getDbConnection(siteCodeUpper);       
        // Mongoose automatically creates a hotel collection if one does not exist.
        hotelModelBySite[siteCodeUpper] = dbConnection.model(`hotel`, HotelSchema);
    }
    return hotelModelBySite[siteCodeUpper];

}