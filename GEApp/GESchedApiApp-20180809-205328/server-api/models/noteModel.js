'use strict';

const appRoot = require('app-root-path');
const getDbConnection = require(`${appRoot}/server-api/databaseManager`);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The schema definition for a note entity

const NoteSchema = new Schema({

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
var noteModelBySite = {};


// Return a notes model using the corresponding site database connection.
module.exports = function (siteCode) {   

    let siteCodeUpper = siteCode.toUpperCase();
    if (noteModelBySite[siteCodeUpper] == null) {
        let dbConnection = getDbConnection(siteCodeUpper);       
        // Mongoose automatically creates a notes collection if one does not exist.
        noteModelBySite[siteCodeUpper] = dbConnection.model(`notes`, NoteSchema);
    }
    return noteModelBySite[siteCodeUpper];

}