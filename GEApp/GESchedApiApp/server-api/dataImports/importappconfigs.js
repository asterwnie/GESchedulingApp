'use strict';

// Import app-ui-data to the database.

const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const mongoose = require('mongoose'); // Helper libray for MongoDB. http://mongoosejs.com/ 
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings server.config.js
const logger = require(`${appRoot}/server-api/logger`); // Create logging helper
const getappConfigType = require(`${appRoot}/server-api/models/appConfigModel`);

mongoose.Promise = global.Promise;

const args = process.argv; 
var siteCode = appConfig.defaultSite; // The current default in HLS-MA in server.config.js

// if a site code is passed in on the command-line then use it. For example:
// node ./server-api/dataImports/importappConfigs.js HLS-MA
// appConfig: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }

const fileName = `appConfigs-${siteCode}.txt`;

let appConfig = getappConfigType(siteCode);

var totalNumOfappConfigs = 0;
var totalNumOfappConfigsCreated = 0;

const delyInSecs = 3;
const timer = setInterval(() => doappConfigsImport(), delyInSecs * 1000); // Ensures db connection is established in getappConfigType since it's an async operation.



function doappConfigsImport() {

    try {
        clearInterval(timer);

        var fileData = fs.readFileSync(`./server-api/dataImports/dataFiles/${fileName}`).toString()
        
        var result = extractappConfigItems(fileData);
        if (result.success) {
            logger.info(`Total number of appConfigs parsed: ${result.appConfigs.length}`);

            if (result.appConfigs.length == 0) {
                logger.info('No appConfigs got extracted from the data file!');
                process.exit();
            }
            logger.info(result.appConfigs);
            
            result.appConfigs.forEach((appConfig) => createappConfigs(appConfig));
        } else {
            process.exit();
        }

    } catch (err) {
        logger.error(`ADMIN: Error importing the appConfigs collection into the database! Error: ${err}`);
        mongoose.disconnect();
        process.exit();
    }
}


function extractappConfigItems(fileData) {
    var result = null;
    var appConfigItems = [];
    var newappConfigs = null;
    var errorEncountered = false;
    var currentItemSeq = 0;

    //split by each line
    fileData.split(/\r?\n/).every((line) => {

        var directive = null;
        var lineProcessed = false;

        logger.info(`Processing line: ${line}`);

        directive = "--SiteCode:";
        if (!blockProcessed && block.search(directive) > -1) {
            var SiteCode = block.replace(directive, "").trim();
            if (SiteCode != "") {
                newSiteCode = SiteCode;
            }
        }

        directive = "--SiteName:";
        if (!blockProcessed && block.search(directive) > -1) {
            varSiteName = block.replace(directive, "").trim();
            if (SiteName != "") {
                newSiteName = SiteName;
            }
        }

        directive = "--SiteAddress:";
        if (!blockProcessed && block.search(directive) > -1) {
            var SiteAddress = block.replace(directive, "").trim();
            if (SiteAddress != "") {
                newSiteAddress = SiteAddress;
            }
        }
        
        directive = "--AppTitle:";
        if (!blockProcessed && block.search(directive) > -1) {
            var AppTitle = block.replace(directive, "").trim();
            if (AppTitle != "") {
                newAppTitle = AppTitle;
            }
        }
        //test if the line is a new appConfig
        directive = "--About.";
        if (line.search(directive) > -1) {            
            // Complete and store the previous pending appConfigs object if exist.
            if (newAbout != null) {
                var success = validateAndCollectAbout(newAbout, AboutItems);
                if (!success) {
                    errorEncountered = true;
                    return false; // Return false to stop additional line processing.
                }
            }

            var abouttype = line.replace(directive, "").trim();
            // Start a new appConfig instance to gather its properties.
            if (abouttype != "") {

                currentItemSeq += 1;

                newAbout = new About({ 
                    seqNum: currentItemSeq,
                    type: abouttype, 
                });
                
            } else {
                logger.error("ERROR: The about type is required!");
                errorEncountered = true;
                return false; // Return false to stop additional line processing.
            }

            lineProcessed = true;
        } else { // if the line is not a beginning to a new appConfig, add the line to the text property.
            if (newAbout.text == null){
                newAbout.text = line;
            } else {
                newAbout.text += ` ${line}`; //add a space to separate each appConfig
            }
            newAbout.text.trim(); //trim to remove extra whitespace
        }

        return true; // Return true to continue processing for the next line item.
    })

    // Check to see if there's one last pending new one to be collected.
    if (errorEncountered == false && newappConfigs != null) {
        var success = validateAndCollectappConfigs(newappConfigs, appConfigItems);
        if (!success) {
            errorEncountered = true;
        }
    }

    result = {
        success: true,
        appConfigs: appConfigItems
    }

    if (errorEncountered == true) {
        result.success = false;
    } 

    return result;
}


function validateAndCollectappConfigs(newappConfigs, appConfigItems) {
    var valid = validateappConfigs(newappConfigs);
    if (valid) {
        appConfigItems.push(newappConfigs);
        totalNumOfappConfigs += 1;
        return true;
    } else {
        return false;
    }
}


function validateappConfigs(newappConfigs) {

    var validationErr = newappConfigs.validateSync();
    if (validationErr != null) {
        for (var prop in validationErr.errors) {
            logger.error(`ADMIN: validateappConfigs - create new newappConfigs validation error: ${validationErr.errors[prop]}`);
        }
        var errMsg = `ADMIN: validateappConfigs - create new newappConfigs failed validation. ${validationErr}`;
        logger.error(errMsg);
        return false;
    }
    return true;
}


function createappConfigs(newappConfigs) {

    logger.info(`ADMIN: Adding appConfigs (${newappConfigs.name}) to the database.`);

    newappConfigs.save()
        .then((appConfigs) => {
            logger.info(`ADMIN: createappConfigs - appConfigs.save success:\n${appConfigs}`);
            totalNumOfappConfigsCreated += 1;

            if (totalNumOfappConfigsCreated == totalNumOfappConfigs) {
                // All accounted for therefore it can disconnect from the database.
                logger.info(`ADMIN: All ${totalNumOfappConfigsCreated} appConfigs are created for site: ${siteCode}.`);

                mongoose.disconnect((err) => {
                    if (err) {
                        logger.error(`ADMIN: appConfigs.createappConfigs failed for site: ${siteCode}! Error: ${err}`);
                    } else {
                        logger.info(`ADMIN: Disconnected from database for site: ${siteCode}.`);
                    }
                    process.exit();
                });  
            }
        })
        .catch((err) => {
            var errMsg = `ADMIN: createappConfigs - appConfigs.save failed. Error: ${err}`
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        });

};
