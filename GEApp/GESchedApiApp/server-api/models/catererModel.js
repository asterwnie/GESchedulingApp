'use strict';

const appRoot = require('app-root-path');
const getDbConnection = require(`${appRoot}/server-api/databaseManager`);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The schema definition for a caterer entity

const CatererSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Caterer name is required!']
    },

    address: {
        type: [String],
        required: [true, 'Caterer address is required!']
    },

    phone: {
        type: String
    },

    website: {
        type: String
    },

    seqNum: {
        type: Number
    }

}, 
{
    timestamps: true // auto-add createdAt and updatedAt
});


// Object to hold a caterer model per site.
var catererModelBySite = {};


// Return a caterer model using the corresponding site database connection.
module.exports = function (siteCode) {   

    let siteCodeUpper = siteCode.toUpperCase();
    if (catererModelBySite[siteCodeUpper] == null) {
        let dbConnection = getDbConnection(siteCodeUpper);       
        // Mongoose automatically creates a caterer collection if one does not exist.
        catererModelBySite[siteCodeUpper] = dbConnection.model(`caterer`, CatererSchema);
    }
    return catererModelBySite[siteCodeUpper];

}