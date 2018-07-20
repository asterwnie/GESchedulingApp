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
        type: Number,
        required: [true, 'Room seating capacity is required!']
    },

    floor: {
        type: String,
        required: [true, 'Room floor is required!']
    },

    building: {
        type: String,
        required: [true, 'Room building is required!']
    },

    roomNumber: {
        type: String //Use string in case of mixed numbers like 11B
    },

    roomPhone: {
        type: String
    },

    addressGAL: {
        type: String
    },

    specialNote: {
        type: String
    },

    capabilities: {
        type: [String]
    },

    configurations: {
        type: [String]
    },

    selectedConfig: {
        type: String
    },

    seqNum: {
        type: Number
    }

}, 
{
    timestamps: true // auto-add createdAt and updatedAt
});

module.exports.RoomSchema = RoomSchema;


// Object to hold a room model per site.
var roomModelBySite = {};


// Return a room model using the corresponding site database connection.
module.exports.getRoomType = function (siteCode) {   

    let siteCodeUpper = siteCode.toUpperCase();
    if (roomModelBySite[siteCodeUpper] == null) {
        let dbConnection = getDbConnection(siteCodeUpper);       
        // Mongoose automatically creates a room collection if one does not exist.
        roomModelBySite[siteCodeUpper] = dbConnection.model(`room`, RoomSchema);
    }
    return roomModelBySite[siteCodeUpper];

}