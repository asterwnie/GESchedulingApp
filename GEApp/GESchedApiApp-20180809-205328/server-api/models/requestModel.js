'use strict';

const appRoot = require('app-root-path');
const getDbConnection = require(`${appRoot}/server-api/databaseManager`);

const roomModel = require(`${appRoot}/server-api/models/roomModel`);
let RoomSchema = roomModel.RoomSchema;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const EventDateTimeSchema = new Schema({

    startDateTime: {
        type: Date,
        required: [true, 'Start Date is required!']
    },
    endDateTime: {
        type: Date,
        required: [true, 'End Date is required!']
    },

});

// The schema definition for a request entity

const RequestSchema = new Schema({

    processingStatus: {
        type: String,
        enum: ['newUnsubmitted', 'underReview', 'approved', 'rejected', 'cancelled']
    },

    // Note, the required fields below are now remove from the schema
    // since when newUnsubmitted this might not be filled in yet.
    // The checking is now move to the requestController and only enforced 
    // when the request's processinStatus is not newUnsubmitted.

    eventTitle: {
        type: String
        //required: [true, 'Title is required!'] 
    },

    eventSchedule: {
        type: EventDateTimeSchema
        //required: [true, 'The event schedule is required!']
    },

    locationOfEvent: {
        type: RoomSchema
        //required: [true, 'The location of the event is required!']
    },

    eventGEContactPersonEmail: {
        type: String
        //required: [true, 'Requester email is required!']
    },

    eventGEContactPersonName: {
        type: String
        //required: [true, 'Requester name is required!']
    },

    eventGEContactPersonPhone: {
        type: String
    },
    
    numOfGeEmpAttending: {
        type: Number
        //required: [true, 'Number of GE Employees attending is required!']
    }
}, 
{
    timestamps: true,   // auto-add createdAt and updatedAt
    strict: false       // Can add other fields not enforced by the schema
});


// Object to hold a request model per site.
var requestModelBySite = {};


// Return a request model using the corresponding site database connection.
module.exports = function (siteCode) {   

    let siteCodeUpper = siteCode.toUpperCase();
    if (requestModelBySite[siteCodeUpper] == null) {
        let dbConnection = getDbConnection(siteCodeUpper);       
        // Mongoose automatically creates a request collection if one does not exist.
        requestModelBySite[siteCodeUpper] = dbConnection.model(`request`, RequestSchema);
    }
    return requestModelBySite[siteCodeUpper];

}