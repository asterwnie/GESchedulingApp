'use strict';

const appRoot = require('app-root-path');
const getDbConnection = require(`${appRoot}/server-api/databaseManager`);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The schema definition for a note entity

const appConfigSchema = new Schema({

    siteCode: {
        type: String,
        required: [true, 'appConfig siteCode is required!']
    }
},
{ 
    timestamps: true, // auto-add createdAt and updatedAt
    strict: false     // Can add other fields not enforced by the schema
});


// Object to hold a notes model per site.
var appConfigModelBySite = {};


// Return a appConfig model using the corresponding site database connection.
module.exports = function (siteCode) {   

    let siteCodeUpper = siteCode.toUpperCase();
    if (appConfigModelBySite[siteCodeUpper] == null) {
        let dbConnection = getDbConnection(siteCodeUpper);       
        // Mongoose automatically creates a notes collection if one does not exist.
        appConfigModelBySite[siteCodeUpper] = dbConnection.model(`appConfigs`, appConfigSchema);
    }
    return appConfigModelBySite[siteCodeUpper];

}