'use strict';

const appRoot = require('app-root-path');
const getDbConnection = require(`${appRoot}/server-api/databaseManager`);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The schema definition for a notes entity

const NotesSchema = new Schema({

    type: {
        type: String,
        required: [true, 'Note type is required!']
    },

    text: {
        type: String,
        required: [true, 'Note text is required!']
    },

    seqNum: {
        type: Number
    }

}, 
{
    timestamps: true // auto-add createdAt and updatedAt
});


// Object to hold a notes model per site.
var notesModelBySite = {};


// Return a notes model using the corresponding site database connection.
module.exports = function (siteCode) {   

    let siteCodeUpper = siteCode.toUpperCase();
    if (notesModelBySite[siteCodeUpper] == null) {
        let dbConnection = getDbConnection(siteCodeUpper);       
        // Mongoose automatically creates a notes collection if one does not exist.
        notesModelBySite[siteCodeUpper] = dbConnection.model(`notes`, NotesSchema);
    }
    return notesModelBySite[siteCodeUpper];

}