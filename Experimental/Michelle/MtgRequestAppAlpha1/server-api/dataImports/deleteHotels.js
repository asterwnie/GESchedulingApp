'use strict';

const mongoose = require('mongoose');   // Helper libray for MongoDB. http://mongoosejs.com/ 
const logger = require('../logger');    // Create logging helper
const fs = require('fs');

const appConfig = require('../../server.config'); // Load app configuration settings.
const Hotel = require('../models/hotelModel');

const fileName = 'hotelsSheet.json';

const dbUrlRefix = appConfig.dbUrlRefix;
const defaultSite = appConfig.defaultSite;


mongoose.Promise = global.Promise;
var dbUrl = `${dbUrlRefix}-${defaultSite}`;

// Connect to the database:
mongoose.connect(dbUrl)
    .then(function () { 
        logger.info(`ADMIN: The MongoDB connected: ${dbUrl}`); 
        removeAllExistinHotels();
    })
    .catch(function (err) { 
        logger.error(`ADMIN: The MongoDB connection ${dbUrl} failed! Error: ${err}`);
        exit; 
    });



function removeAllExistinHotels () {
    Hotel.find({})
        .then((hotels) => {
            hotels.forEach((hotel) => deleteHotel(hotel._id));
        })
        .catch((err) => {
            var errMsg = `ADMIN: removeAllExistinHotels failed. Error: ${err}`;
            logger.error(errMsg);
        });
}



function deleteHotel (hotelId) {
    logger.verbose(`About to delete hotel ${hotelId}`);

    Hotel.findByIdAndRemove(hotelId)
    .then((hotel) => {
        if (hotel == null) {
            var errMsg = `ADMIN: deleteHotel - did not find the hotel to be deleted by id ${hotelId}.`;
            logger.error(errMsg);
        } else {
            logger.info(`ADMIN: deleteHotel - Hotel.findByIdAndRemove ${hotelId} success. Deleted hotel called ${hotel.name}`);
        }
    })
    .catch((err) => {
        var errMsg = `ADMIN: deleteHotel - Hotel.findByIdAndRemove ${hotelId} failed. Error: ${err}`;
        logger.error(errMsg);
    });
};

