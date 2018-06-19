'use strict';

const appRoot = require('app-root-path');
const getDbConnection = require(`${appRoot}/server-api/databaseManager`);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The schema definition for a note entity

const AppconfigSchema = new Schema({

    siteCode: {
        type: String,
        required: [true, 'Appconfig siteCode is required!']
    },

    siteName: {
        type: String,
        required: [true, 'Appconfig siteName is required!']
    },
    
    siteAddress: {
        type: String,
        required: [true, 'Appconfig siteAddress is required!']
    },
    
    appTitle: {
        type: String,
        required: [true, 'Appconfig siteTitle is required!']
    }, 
  
    aboutViewTitle: {
        type: String,
        required: [true, 'Appconfig aboutViewTitle is required!']
    }, 
    
    aboutViewDescription: {
        type: String,
        required: [true, 'Appconfig aboutViewDescription is required!']
    }, 
   
    techSupportViewTitle: {
        type: String,
        required: [true, 'Appconfig techSupportViewTitle is required!']
    }, 
   
    techSupportViewDescription: {
        type: String,
        required: [true, 'Appconfig techSupportViewDescription is required!']
    },
   
    CaterersViewTitle: { 
        type: String,
        required: [true, 'Appconfig  CaterersViewTitle is required!']
    }, 
   
    CaterersViewDescription: {  
        type: String,
        required: [true, 'Appconfig CaterersViewDescription is required!']
    }, 
    
    HotelsViewTitle: {  
        type: String,
        required: [true, 'Appconfig HotelsViewTitle is required!']
    },

    HotelsViewDescription: { 
        type: String,
        required: [true, 'Appconfig HotelsViewDescription is required!']
    },

    GuestWiFiAccessViewTitle: {
        type: String,
        required: [true, 'Appconfig GuestWiFiAccessViewTitle is required!']
    },

    GuestWiFiAccessViewDescription: {  
        type: String,
        required: [true, 'Appconfig GuestWiFiAccessViewDescription is required!']
    },

    RequestStatusMessageUnderReview: {  
        type: String,
        required: [true, 'Appconfig RequestStatusMessageUnderReview is required!']
    },

    RequestStatusMessageApproved: {  
        type: String,
        required: [true, 'Appconfig RequestStatusMessageApproved is required!']
    },

    RequestStatusMessageRejected: { 
        type: String,
        required: [true, 'Appconfig RequestStatusMessageRejected is required!']
    },
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