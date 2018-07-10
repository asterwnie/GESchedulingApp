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
    },

    siteName: {
        type: String,
        required: [true, 'appConfig siteName is required!']
    },
    
    siteAddress: {
        type: String,
        required: [true, 'appConfig siteAddress is required!']
    },
    
    appTitle: {
        type: String,
        required: [true, 'appConfig siteTitle is required!']
    },
    
    doFirstViewTitle: {
        type:String,
        required:[true, 'appConfig doFirstViewTitle is required!']
    },

    doFirstViewTitleDescription: {
        type:String,
        required:[true, 'appConfig doFirstViewTitleDescription is required!']
    },
  
    aboutViewTitle: {
        type: String,
        required: [true, 'appConfig aboutViewTitle is required!']
    }, 
    
    aboutViewDescription: {
        type: String,
        required: [true, 'appConfig aboutViewDescription is required!']
    }, 
   
    techSupportViewTitle: {
        type: String,
        required: [true, 'appConfig techSupportViewTitle is required!']
    }, 
   
    techSupportViewDescription: {
        type: String,
        required: [true, 'appConfig techSupportViewDescription is required!']
    },
   
    caterersViewTitle: { 
        type: String,
        required: [true, 'appConfig  caterersViewTitle is required!']
    }, 
   
    caterersViewDescription: {  
        type: String,
        required: [true, 'appConfig caterersViewDescription is required!']
    }, 
    
    hotelsViewTitle: {  
        type: String,
        required: [true, 'appConfig hotelsViewTitle is required!']
    },

    hotelsViewDescription: { 
        type: String,
        required: [true, 'appconfig hotelsViewDescription is required!']
    },

    guestWiFiAccessViewTitle: {
        type: String,
        required: [true, 'appConfig guestWiFiAccessViewTitle is required!']
    },

    guestWiFiAccessViewDescription: {  
        type: String,
        required: [true, 'appConfig guestWiFiAccessViewDescription is required!']
    },

    requestStatusMessageUnderReview: {  
        type: String,
        required: [true, 'appConfig requestStatusMessageUnderReview is required!']
    },

    requestStatusMessageApproved: {  
        type: String,
        required: [true, 'appConfig requestStatusMessageApproved is required!']
    },

    requestStatusMessageRejected: { 
        type: String,
        required: [true, 'appConfig requestStatusMessageRejected is required!']
    }
},
    
    { 
    timestamps: true // auto-add createdAt and updatedAt
    });


// Object to hold a notes model per site.
var appConfigModelBySite = {};


// Return a notes model using the corresponding site database connection.
module.exports = function (siteCode) {   

    let siteCodeUpper = siteCode.toUpperCase();
    if (appConfigModelBySite[siteCodeUpper] == null) {
        let dbConnection = getDbConnection(siteCodeUpper);       
        // Mongoose automatically creates a notes collection if one does not exist.
        appConfigModelBySite[siteCodeUpper] = dbConnection.model(`appConfigs`, appConfigSchema);
    }
    return appConfigModelBySite[siteCodeUpper];

}