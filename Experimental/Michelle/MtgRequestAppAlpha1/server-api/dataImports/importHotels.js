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
        doSheetImport();
    })
    .catch(function (err) { 
        logger.error(`ADMIN: The MongoDB connection ${dbUrl} failed! Error: ${err}`);
        exit; 
    });



function doSheetImport() {

    try {
        const jsonData = fs.readFileSync(`./server-api/dataImports/dataFiles/${fileName}`);
        const hotelsFromSheet = JSON.parse(jsonData);

        hotelsFromSheet.forEach((hotelFromSheet) => createHotel(hotelFromSheet));

    } catch (err) {
        logger.error(`ADMIN: Error importing the Hotel collection into the database! Error: ${err}`);
        return;
    }

    logger.info(`ADMIN: Hotel collection importing from ${fileName} to the database. Press Ctrl+C to exit.`);
    //mongoose.disconnect();
}


function createHotel (hotelFromSheet) {

    try {
        logger.info(`ADMIN: Adding hotel (${hotelFromSheet.Name}) to the database.`);

        var hotelInDBFormat = {
            name: hotelFromSheet.Name, 
            address: hotelFromSheet.Address, 
            phone: hotelFromSheet.Phone,
            corporateRates: hotelFromSheet.CorporateRates
        };

        var newHotel = new Hotel(hotelInDBFormat);

        var validationErr = newHotel.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`ADMIN: createHotel - create new Hotel validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `ADMIN: createHotel - create new Hotel failed validation. ${validationErr}`;
            logger.error(errMsg);
            return;
        }

    } catch (err) {
        var errMsg = `ADMIN: createHotel - problem with creating a new Hotel. Error: ${err}`;
        logger.error(errMsg);
        return;
    }

    newHotel.save()
        .then((hotel) => {
            logger.info(`ADMIN: createHotel - Hotel.save success:\n${hotel}`);
        })
        .catch((err) => {
            var errMsg = `ADMIN: createHotel - Hotel.save failed. Error: ${err}`
            logger.error(errMsg);
        });

};
