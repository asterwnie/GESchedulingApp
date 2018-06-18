'use strict';

const appRoot = require('app-root-path');
const getDbConnection = require(`${appRoot}/server-api/databaseManager`);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The schema definition for a user entity

const UserSchema = new Schema({

    email: {
        type: String,
        required: [true, 'Email address is required!']
    },

    name: {
        type: String
    },

    phone: {
        type: String
    },

    isAdmin: {
        type: Boolean
    },

    lastLoggedInAt: {
        type: Date
    }


}, 
{
    timestamps: true // auto-add createdAt and updatedAt
});


// Object to hold a user model per site.
var userModelBySite = {};


// Return a user model using the corresponding site database connection.
module.exports = function (siteCode) {   

    if (siteCode == null  || siteCode.length === 0) {
        throw "A site code must be passed to get the User model!"
    }
    let siteCodeUpper = siteCode.toUpperCase();
    if (userModelBySite[siteCodeUpper] == null) {
        let dbConnection = getDbConnection(siteCodeUpper);       
        // Mongoose automatically creates a user collection if one does not exist.
        userModelBySite[siteCodeUpper] = dbConnection.model(`user`, UserSchema);
    }
    return userModelBySite[siteCodeUpper];

}