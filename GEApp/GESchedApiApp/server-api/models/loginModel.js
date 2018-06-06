'use strict';

const appRoot = require('app-root-path');
const getDbConnection = require(`${appRoot}/server-api/databaseManager`);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The schema definition for a Login entity

const LoginSchema = new Schema({   

    email: {
        type: String,
        required: [true, 'The Email address is required!']
    },

    accessCode: {
        type: String,
        required: [true, 'The Access Code is required!']
    }
});


// Object to cache a login model per site.
var loginModelBySite = {};


// Return a user model using the corresponding site database connection.
module.exports = function (siteCode) {   

    if (siteCode == null  || siteCode.length === 0) {
        throw "A site code must be passed to get the Login model!"
    }
    let siteCodeUpper = siteCode.toUpperCase();
    if (loginModelBySite[siteCodeUpper] == null) {
        let dbConnection = getDbConnection(siteCodeUpper);       
        // Mongoose automatically creates a login collection if one does not exist.
        loginModelBySite[siteCodeUpper] = dbConnection.model(`login`, LoginSchema);
    }
    return loginModelBySite[siteCodeUpper];

}