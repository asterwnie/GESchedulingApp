'use strict';

// Import caterers to the database.

const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const mongoose = require('mongoose'); // Helper libray for MongoDB. http://mongoosejs.com/ 
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings server.config.js
const logger = require(`${appRoot}/server-api/logger`); // Create logging helper
const getCatererType = require(`${appRoot}/server-api/models/CatererModel`);

mongoose.Promise = global.Promise;

const args = process.argv; 
var siteCode = appConfig.defaultSite; // The current default in HLS-MA in server.config.js

// if a site code is passed in on the command-block then use it. For example:
// node ./server-api/dataImports/importCaterers.js HLS-MA
// Note: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }

const fileName = `Caterers-${siteCode}.txt`;

let Caterer = getCatererType(siteCode);

var totalNumOfCaterers = 0;
var totalNumOfCaterersCreated = 0;

const delyInSecs = 3;
const timer = setInterval(() => doCatererImport(), delyInSecs * 1000); // Ensures db connection is established in getCatererType since it's an async operation.



function doCatererImport() {

    try {
        clearInterval(timer);

        var fileData = fs.readFileSync(`${appRoot}/server-api/dataImports/dataFiles/${fileName}`).toString()
        
        var result = extractCatererItems(fileData);
        if (result.success) {
            logger.info(`Total number of caterers parsed: ${result.caterers.length}`);

            if (result.caterers.length == 0) {
                logger.info('No caterer got extracted from the data file!');
                process.exit();
            }
            logger.info(result.caterers);
            
            result.caterers.forEach((caterer) => createCaterer(caterer));
        } else {
            process.exit();
        }

    } catch (err) {
        logger.error(`ADMIN: Error importing the Caterer collection into the database! Error: ${err}`);
        mongoose.disconnect();
        process.exit();
    }
}


function extractCatererItems(fileData) {
    var result = null;
    var catererItems = [];
    var newCaterer = null;
    var errorEncountered = false;
    var currentItemSeq = 0;

    fileData.split(/\r?\n/).every((block) => {

        var directive = null;
        var blockProcessed = false;

        logger.info(`Processing block: ${block}`);

        directive = "--Caterer.Name:";
        if (block.search(directive) > -1) {            
            // Complete and store the previous pending caterer object if exist.
            if (newCaterer != null) {
                var success = validateAndCollectCaterer(newCaterer, catererItems);
                if (!success) {
                    errorEncountered = true;
                    return false; // Return false to stop additional block processing.
                }
            }

            
            var catererName = block.replace(directive, "").trim();
            // Start a new caterer instance to gather its properties.
            if (catererName != "") {

                currentItemSeq += 1;

                newCaterer = new Caterer({ 
                    seqNum: currentItemSeq,
                    name: catererName 
                });
                
            } else {
                logger.error("ERROR: The caterer name is required!");
                errorEncountered = true;
                return false; // Return false to stop additional block processing.
            }

            blockProcessed = true;
        }

        directive = "--Caterer.Address:"; // Note, there can be multiple address blocks.
        if (!blockProcessed && block.search(directive) > -1) {
            var catererAddressBlock = block.replace(directive, "").trim();
            if (catererAddressBlock != "") {
                // Add address block to the array:
                newCaterer.address.push(catererAddressBlock);
            }
        }

        directive = "--Caterer.Phone:";
        if (!blockProcessed && block.search(directive) > -1) {
            var catererPhone = block.replace(directive, "").trim();
            if (catererPhone != "") {
                newCaterer.phone = catererPhone;
            }
        }

        directive = "--Caterer.Website:";
        if (!blockProcessed && block.search(directive) > -1) {
            var catererWebsite = block.replace(directive, "").trim();
            if (catererWebsite != "") {
                newCaterer.website = catererWebsite;
            }
        }

        return true; // Return true to continue processing for the next block item.
    })

    // Check to see if there's one last pending new one to be collected.
    if (errorEncountered == false && newCaterer != null) {
        var success = validateAndCollectCaterer(newCaterer, catererItems);
        if (!success) {
            errorEncountered = true;
        }
    }

    result = {
        success: true,
        caterers: catererItems
    }

    if (errorEncountered == true) {
        result.success = false;
    } 

    return result;
}


function validateAndCollectCaterer(newCaterer, catererItems) {
    var valid = validateCaterer(newCaterer);
    if (valid) {
        catererItems.push(newCaterer);
        totalNumOfCaterers += 1;
        return true;
    } else {
        return false;
    }
}


function validateCaterer(newCaterer) {

    var validationErr = newCaterer.validateSync();
    if (validationErr != null) {
        for (var prop in validationErr.errors) {
            logger.error(`ADMIN: validateCaterer - create new newCaterer validation error: ${validationErr.errors[prop]}`);
        }
        var errMsg = `ADMIN: validateCaterer - create new newCaterer failed validation. ${validationErr}`;
        logger.error(errMsg);
        return false;
    }
    return true;
}


function createCaterer(newCaterer) {

    logger.info(`ADMIN: Adding caterer (${newCaterer.name}) to the database.`);

    newCaterer.save()
        .then((caterer) => {
            logger.info(`ADMIN: createCaterer - Caterer.save success:\n${caterer}`);
            totalNumOfCaterersCreated += 1;

            if (totalNumOfCaterersCreated == totalNumOfCaterers) {
                // All accounted for therefore it can disconnect from the database.
                logger.info(`ADMIN: All ${totalNumOfCaterersCreated} caterers are created for site: ${siteCode}.`);

                mongoose.disconnect((err) => {
                    if (err) {
                        logger.error(`ADMIN: newCaterer.save failed for site: ${siteCode}! Error: ${err}`);
                    } else {
                        logger.info(`ADMIN: Disconnected from database for site: ${siteCode}.`);
                    }
                    process.exit();
                });  
            }
        })
        .catch((err) => {
            var errMsg = `ADMIN: createCaterer - Caterer.save failed. Error: ${err}`
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        });

};
