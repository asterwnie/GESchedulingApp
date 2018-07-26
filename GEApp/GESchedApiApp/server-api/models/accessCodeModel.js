'use strict';

const appRoot = require('app-root-path');
const getDbConnection = require(`${appRoot}/server-api/databaseManager`);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The schema definition for an accessCode entity

const AccessCodeSchema = new Schema({

    
    code: {
        type: String,
        required: [true, 'Code is required!']
    },
    
    isForAdmin: {
        type: Boolean,
    
    }
},
{
    timestamps: true // auto-add createdAt and updatedAt
    });


// Object to hold a notes model per site.
var accessCodeModelBySite = {};


// Return a notes model using the corresponding site database connection.
module.exports = function (siteCode) {   

    let siteCodeUpper = siteCode.toUpperCase();
    if (accessCodeModelBySite[siteCodeUpper] == null) {
        let dbConnection = getDbConnection(siteCodeUpper);       
        // Mongoose automatically creates a notes collection if one does not exist.
        accessCodeModelBySite[siteCodeUpper] = dbConnection.model(`accessCode`, AccessCodeSchema);
    }
    return accessCodeModelBySite[siteCodeUpper];

}