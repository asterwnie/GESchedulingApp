'use strict';

// Import hotels to the database.

const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const mongoose = require('mongoose'); // Helper libray for MongoDB. http://mongoosejs.com/ 
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings server.config.js
const logger = require(`${appRoot}/server-api/logger`); // Create logging helper
const getHotelType = require(`${appRoot}/server-api/models/hotelModel`);

mongoose.Promise = global.Promise;

const args = process.argv; 
var siteCode = appConfig.defaultSite; // The current default in HLS-MA in server.config.js

// if a site code is passed in on the command-line then use it. For example:
// node ./server-api/dataImports/importHotels.js HLS-MA
// Note: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }

const fileName = `hotelsSheet-${siteCode}.json`;

let Hotel = getHotelType(siteCode);

var totalNumOfHotels = 0;
var totalNumOfHotelsCreated = 0;

const delyInSecs = 3;
setInterval(() => doSheetImport(), delyInSecs * 1000); // Ensures db connection is established in getHotelType since it's an async operation.



function doSheetImport() {

    try {
        const jsonData = fs.readFileSync(`./server-api/dataImports/dataFiles/${fileName}`);
        const hotelsFromSheet = JSON.parse(jsonData);

        // Count the total first.
        hotelsFromSheet.forEach((hotelFromSheet) => totalNumOfHotels += 1 );

        hotelsFromSheet.forEach((hotelFromSheet) => createHotel(hotelFromSheet));

    } catch (err) {
        logger.error(`ADMIN: Error importing the Hotel collection into the database! Error: ${err}`);
        mongoose.disconnect();
        return;
    }
}



function createHotel(hotelFromSheet) {

    try {
        logger.info(`ADMIN: Adding hotel (${hotelFromSheet.Name}) to the database.`);

        // The properies from the import spreedsheet does not match directly 
        // so map them to a object that conforms to the Hotel schema.
        var hotelInDBFormat = {
            seqNum: hotelFromSheet.SeqNum,
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
            mongoose.disconnect();
            return;
        }

    } catch (err) {
        var errMsg = `ADMIN: createHotel - problem with creating a new Hotel. Error: ${err}`;
        logger.error(errMsg);
        mongoose.disconnect();
        return;
    }

    newHotel.save()
        .then((hotel) => {
            logger.info(`ADMIN: createHotel - Hotel.save success:\n${hotel}`);
            totalNumOfHotelsCreated += 1;

            if (totalNumOfHotelsCreated == totalNumOfHotels) {
                // All accounted for therefore it can disconnect from the database.
                logger.info(`ADMIN: All ${totalNumOfHotelsCreated} hotels are created for site: ${siteCode}.`);

                mongoose.disconnect((err) => {
                    if (err) {
                        logger.error(`ADMIN: Hotel.deleteMany failed for site: ${siteCode}! Error: ${err}`);
                    } else {
                        logger.info(`ADMIN: Disconnected from database for site: ${siteCode}.`);
                    }
                    process.exit();
                });  
            }
        })
        .catch((err) => {
            var errMsg = `ADMIN: createHotel - Hotel.save failed. Error: ${err}`
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        });

};
