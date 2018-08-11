'use strict';

// Import app-ui-data to the database.

const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const mongoose = require('mongoose'); // Helper libray for MongoDB. http://mongoosejs.com/ 
const appConfigOld = require(`${appRoot}/server.config`); // Load app configuration settings server.config.js
const logger = require(`${appRoot}/server-api/logger`); // Create logging helper
const getAppConfigSiteCode = require(`${appRoot}/server-api/models/appConfigModel`);

mongoose.Promise = global.Promise;

const args = process.argv; 
var siteCode = appConfigOld.defaultSite; // The current default in HLS-MA in server.config.js

// if a site code is passed in on the command-line then use it. For example:
// node ./server-api/dataImports/importappConfigs.js HLS-MA
// appConfigOld: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }

const fileName = `app-ui-data-${siteCode}.txt`;

let AppConfig = getAppConfigSiteCode(siteCode);


const delyInSecs = 3;
const timer = setInterval(() => doAppConfigsImport(), delyInSecs * 1000); // Ensures db connection is established in getappConfigSiteCode since it's an async operation.



function doAppConfigsImport() {

    try {
        clearInterval(timer);

        var fileData = fs.readFileSync(`./server-api/dataImports/dataFiles/${fileName}`).toString()
        
        var result = extractAppConfig(fileData);
        if (result.success) {

            if (result.appConfig == null || result.appConfig == undefined) {
                logger.info('No appConfig got extracted from the data file!');
                process.exit();
            }
            logger.info(result.appConfig);
            
            createAppConfig(result.appConfig);
        } else {
            process.exit();
        }

    } catch (err) {
        logger.error(`ADMIN: Error importing the appConfigs collection into the database! Error: ${err}`);
        mongoose.disconnect();
        process.exit();
    }
}


function extractAppConfig(fileData) {

    var result = null;
    var errorEncountered = false;
    var currentPropName = null;

    //Create singular appconfig
    var newAppConfig = new AppConfig({});

    //split by each line
    fileData.split(/\r?\n/).every((line) => {

        logger.info(`Processing line: ${line}`);

        try {
        if (line.indexOf("--") > -1) {

            currentPropName = line;
            // Remove dashes and dots:
            currentPropName = currentPropName.replace('--', '').replace(/\./g,'');
            currentPropName = currentPropName[0].toLowerCase() + currentPropName.slice(1);
            currentPropName = currentPropName.trim();

        } else if (line != null && line != "" && 
                   line.indexOf("--") == -1 && currentPropName != null) {

            //After current property is found, set the current property's value from one or more lines.

            var alreadyAssignedValue = newAppConfig.get(currentPropName);
            if (alreadyAssignedValue == undefined || alreadyAssignedValue == null) {
                newAppConfig.set(currentPropName, line);
            } else {
                if (line == '[LINEBREAK]') {
                    newAppConfig.set(currentPropName, alreadyAssignedValue  + line);
                } else {
                    newAppConfig.set(currentPropName, alreadyAssignedValue + '[LINEBREAK]' + line);
                }
            }

        }
        } catch (err) {
            logger.error(`ADMIN: Error Processing line: ${line}, Error: ${err}`);
            errorEncountered = true;
            return false;
        }

        return true; // tell the every loop to continue processing.
    });


    // Check to see if there's one last pending new one to be collected.
    if (errorEncountered == false && newAppConfig != null) {
        var success = validateAppConfig(newAppConfig);
        if (!success) {
            errorEncountered = true;
        }
    }

    result = {
        success: true,
        appConfig: newAppConfig
    }

    if (errorEncountered == true) {
        result.success = false;
    } 
    
    return result;
}


function validateAppConfig(newAppConfig) {

    var validationErr = newAppConfig.validateSync();
    if (validationErr != null) {
        for (var prop in validationErr.errors) {
            logger.error(`ADMIN: validateAppConfig - create new newAppConfig validation error: ${validationErr.errors[prop]}`);
            console.log(`ADMIN: validateAppConfig - create new newAppConfig validation error: ${validationErr.errors[prop]}`)
        }
        var errMsg = `ADMIN: validateAppConfig - create new newAppConfig failed validation. ${validationErr}`;
        logger.error(errMsg);
        return false;
    }
    return true;
}


function createAppConfig(newAppConfig) {

    logger.info(`ADMIN: Adding appConfig (${newAppConfig}) to the database.`);

    newAppConfig.save()
        .then((appConfig) => {
            logger.info(`ADMIN: createAppConfig - appConfig.save success:\n${appConfig}`);

            mongoose.disconnect((err) => {
                if (err) {
                    logger.error(`ADMIN: appConfigs.createAppConfig failed for site: ${siteCode}! Error: ${err}`);
                } else {
                    logger.info(`ADMIN: Disconnected from database for site: ${siteCode}.`);
                }
                process.exit();
            });          
        })
        .catch((err) => {
            var errMsg = `ADMIN: createAppConfig - appConfigs.save failed. Error: ${err}`
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        }); 
    };
