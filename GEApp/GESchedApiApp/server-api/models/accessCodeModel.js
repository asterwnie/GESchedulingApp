'use strict';

const appRoot = require('app-root-path');
const getDbConnection = require(`${appRoot}/server-api/databaseManager`);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The schema definition for a note entity

const accessCodeSchema = new Schema({

    _id: {
        type: String,
        required: [true, 'accessCode _id is required!']
    },

    code: {
        type: String,
        required: [true, 'accessCode code is required!']
    },
    
    isForAdmin: {
        type: String,
        required: [true, 'accessCode isForAdmin is required!']
    },

    timestamps: true // auto-add createdAt and updatedAt
    });


// Object to hold a notes model per site.
var accessCodeModelBySite = {};


// Return a notes model using the corresponding site database connection.
module.exports = function (siteCode) {   

    let siteCodeUpper = siteCode.toUpperCase();
    if (appConfigModelBySite[siteCodeUpper] == null) {
        let dbConnection = getDbConnection(siteCodeUpper);       
        // Mongoose automatically creates a notes collection if one does not exist.
        accessCodeModelBySite[siteCodeUpper] = dbConnection.model(`accessCodes`, accessCodeSchema);
    }
    return accessCodeModelBySite[siteCodeUpper];

}