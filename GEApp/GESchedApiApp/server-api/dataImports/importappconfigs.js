'use strict';

// Import app-ui-data to the database.

const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const mongoose = require('mongoose'); // Helper libray for MongoDB. http://mongoosejs.com/ 
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings server.config.js
const logger = require(`${appRoot}/server-api/logger`); // Create logging helper
const getAppconfigType = require(`${appRoot}/server-api/models/appconfigModel`);

mongoose.Promise = global.Promise;

const args = process.argv; 
var siteCode = AppConfig.defaultSite; // The current default in HLS-MA in server.config.js

// if a site code is passed in on the command-line then use it. For example:
// node ./server-api/dataImports/importAppconfigs.js HLS-MA
// Appconfig: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }

const fileName = `appconfigs-${siteCode}.txt`;

let Appconfig = getAppConfigType(siteCode);

var totalNumOfAppConfigs = 0;
var totalNumOfAppConfigsCreated = 0;

const delyInSecs = 3;
const timer = setInterval(() => doAppConfigsImport(), delyInSecs * 1000); // Ensures db connection is established in getAppconfigType since it's an async operation.



function doAppConfigsImport() {

    try {
        clearInterval(timer);

        var fileData = fs.readFileSync(`./server-api/dataImports/dataFiles/${fileName}`).toString()
        
        var result = extractAppConfigItems(fileData);
        if (result.success) {
            logger.info(`Total number of appconfigs parsed: ${result.appconfigs.length}`);

            if (result.appconfigs.length == 0) {
                logger.info('No appconfigs got extracted from the data file!');
                process.exit();
            }
            logger.info(result.appconfigs);
            
            result.appconfigs.forEach((appconfig) => createAppConfigs(appconfig));
        } else {
            process.exit();
        }

    } catch (err) {
        logger.error(`ADMIN: Error importing the AppConfigs collection into the database! Error: ${err}`);
        mongoose.disconnect();
        process.exit();
    }
}


function extractAppconfigItems(fileData) {
    var result = null;
    var appconfigItems = [];
    var newApponfigs = null;
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
        //test if the line is a new appconfig
        directive = "--About.";
        if (line.search(directive) > -1) {            
            // Complete and store the previous pending appconfigs object if exist.
            if (newAbout != null) {
                var success = validateAndCollectAbout(newAbout, AboutItems);
                if (!success) {
                    errorEncountered = true;
                    return false; // Return false to stop additional line processing.
                }
            }

            var abouttype = line.replace(directive, "").trim();
            // Start a new appconfig instance to gather its properties.
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
        } else { // if the line is not a beginning to a new appconfig, add the line to the text property.
            if (newAbout.text == null){
                newAbout.text = line;
            } else {
                newAbout.text += ` ${line}`; //add a space to separate each appconfig
            }
            newAbout.text.trim(); //trim to remove extra whitespace
        }

        return true; // Return true to continue processing for the next line item.
    })

    // Check to see if there's one last pending new one to be collected.
    if (errorEncountered == false && newAppconfigs != null) {
        var success = validateAndCollectAppconfigs(newAppconfigs, appconfigItems);
        if (!success) {
            errorEncountered = true;
        }
    }

    result = {
        success: true,
        appconfigs: appconfigItems
    }

    if (errorEncountered == true) {
        result.success = false;
    } 

    return result;
}


function validateAndCollectAppConfigs(newAppConfigs, appconfigItems) {
    var valid = validateAppConfigs(newAppConfigs);
    if (valid) {
        appconfigItems.push(newAppConfigs);
        totalNumOfAppConfigs += 1;
        return true;
    } else {
        return false;
    }
}


function validateAppconfigs(newAppConfigs) {

    var validationErr = newAppConfigs.validateSync();
    if (validationErr != null) {
        for (var prop in validationErr.errors) {
            logger.error(`ADMIN: validateAppConfigs - create new newAppConfigs validation error: ${validationErr.errors[prop]}`);
        }
        var errMsg = `ADMIN: validateAppConfigs - create new newAppConfigs failed validation. ${validationErr}`;
        logger.error(errMsg);
        return false;
    }
    return true;
}


function createAppConfigs(newAppConfigs) {

    logger.info(`ADMIN: Adding appconfigs (${newAppConfigs.name}) to the database.`);

    newAppConfigs.save()
        .then((appconfigs) => {
            logger.info(`ADMIN: createAppConfigs - AppConfigs.save success:\n${appconfigs}`);
            totalNumOfAppConfigsCreated += 1;

            if (totalNumOfAppConfigsCreated == totalNumOfAppConfigs) {
                // All accounted for therefore it can disconnect from the database.
                logger.info(`ADMIN: All ${totalNumOfAppConfigsCreated} appconfigs are created for site: ${siteCode}.`);

                mongoose.disconnect((err) => {
                    if (err) {
                        logger.error(`ADMIN: AppConfigs.createAppConfigs failed for site: ${siteCode}! Error: ${err}`);
                    } else {
                        logger.info(`ADMIN: Disconnected from database for site: ${siteCode}.`);
                    }
                    process.exit();
                });  
            }
        })
        .catch((err) => {
            var errMsg = `ADMIN: createAppConfigs - AppConfigs.save failed. Error: ${err}`
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        });

};