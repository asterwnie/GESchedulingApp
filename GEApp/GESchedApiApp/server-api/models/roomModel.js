'use strict';

const appRoot = require('app-root-path');
const getDbConnection = require(`${appRoot}/server-api/databaseManager`);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// The schema definition for a room entity

const RoomSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Room name is required!']
    },

    sizeType: {
        type: String,
        required: [true, 'Room size type is required!']
    },

    seatingCapacity: {
        type: String,
        required: [true, 'Room seating capacity is required!']
    },

    floor: {
        type: String,
        required: [true, 'Room building is required!']
    },

    building: {
        type: String,
        required: [true, 'Room building is required!']
    },

    roomNumber: {
        type: String, //in case of mixed numbers like 11B
        required: [true, 'Room building is required!']
    },

    roomPhone: {
        type: String,
        required: [true, 'Room phone is required!']
    },

    addressGAL: {
        type: String,
        required: [true, 'Room address in GAL is required!']
    },

    specialNote: {
        type: String
    },

    capability: {
        type: [String]
    },

    configuration: {
        type: [String]
    },

    seqNum: {
        type: Number
    }

}, 
{
    timestamps: true // auto-add createdAt and updatedAt
});


// Object to hold a room model per site.
var roomModelBySite = {};


// Return a room model using the corresponding site database connection.
module.exports = function (siteCode) {   

    let siteCodeUpper = siteCode.toUpperCase();
    if (roomModelBySite[siteCodeUpper] == null) {
        let dbConnection = getDbConnection(siteCodeUpper);       
        // Mongoose automatically creates a room collection if one does not exist.
        roomModelBySite[siteCodeUpper] = dbConnection.model(`room`, RoomSchema);
    }
    return roomModelBySite[siteCodeUpper];

}