'use strict';

// Import app-ui-data to the database.

const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const mongoose = require('mongoose'); // Helper libray for MongoDB. http://mongoosejs.com/ 
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings server.config.js
const logger = require(`${appRoot}/server-api/logger`); // Create logging helper
const getAppConfigType = require(`${appRoot}/server-api/models/appConfigModel`);

mongoose.Promise = global.Promise;

const args = process.argv; 
var siteCode = appConfig.defaultSite; // The current default in HLS-MA in server.config.js

// if a site code is passed in on the command-line then use it. For example:
// node ./server-api/dataImports/importappConfigs.js HLS-MA
// appConfig: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }

const fileName = `appConfigs-${siteCode}.txt`;

let appConfig = getAppConfigType(siteCode);

var totalNumOfAppConfigs = 0;
var totalNumOfAppConfigsCreated = 0;

const delyInSecs = 3;
const timer = setInterval(() => doAppConfigsImport(), delyInSecs * 1000); // Ensures db connection is established in getappConfigType since it's an async operation.



function doAppConfigsImport() {

    try {
        clearInterval(timer);

        var fileData = fs.readFileSync(`./server-api/dataImports/dataFiles/${fileName}`).toString()
        
        var result = extractAppConfigItems(fileData);
        if (result.success) {
            logger.info(`Total number of appConfigs parsed: ${result.appConfigs.length}`);

            if (result.appConfigs.length == 0) {
                logger.info('No appConfigs got extracted from the data file!');
                process.exit();
            }
            logger.info(result.appConfigs);
            
            result.appConfigs.forEach((appConfig) => createAppConfigs(appConfig));
        } else {
            process.exit();
        }

    } catch (err) {
        logger.error(`ADMIN: Error importing the appConfigs collection into the database! Error: ${err}`);
        mongoose.disconnect();
        process.exit();
    }
}


function extractAppConfigItems(fileData) {
    var result = null;
    var appConfigItems = [];
    var newAppConfigs = null;
    var errorEncountered = false;
    var currentItemSeq = 0;
    var currentItem = null;

    //Create singular appconfig
    newAppConfig = new AppConfig({});

    //split by each line
    fileData.split(/\r?\n/).every((line) => {

        var directive = null;
        var lineProcessed = false;

        logger.info(`Processing line: ${line}`);
        
        //Find current item
        directive = "--SiteCode";
        if (line.search(directive) > -1) {            
            currentItem = 'siteCode';
            }

        directive="--DoFirst.";
        if (line.search(directive) > -1) {            
            var doFirst= line.replace(directive,"").trim();
            if (doFirst=="ViewTitle"){
                currentItem = 'doFirstViewTitle';
            } else if (doFirst=="ViewDescription"){
                currentItem= 'doFirstViewDescription';
            }
        }
        
        directive= "--NewRequest";
        if (line.search(directive)>-1){
            var newRequest= line.replace (directive,"").trim();
            if (newRequest="ViewTitle"){
                currentItem='newRequestViewTitle';
            }
        }
       
        directive= "--EditRequest";
        if (line.search(directive)>-1){
            var editRequest= line.replace (directive,"").trim();
            if (editRequest="ViewTitle"){
                currentItem='editRequestViewTitle';
            }
        }

        directive= "--SubmitRequest";
        if (line.search(directive)>-1){
            var submitRequest= line.replace (directive,"").trim();
            if (submitRequest="ViewTitle"){
                currentItem='submitRequestViewTitle';
            }
        }

        directive= "--AttentionNotes";
        if (line.search(directive)>-1){
            var attentionNotes= line.replace (directive,"").trim();
            if (attentionNotes="ViewTitle"){
                currentItem='attentionNotesViewTitle';
            }
        }

        directive= "--About";
        if (line.search(directive)>-1){
            var about= line.replace (directive,"").trim();
            if (about="ViewTitle"){
                currentItem='aboutViewTitle';
            } else if (about="ViewDescription"){
                currentItem='aboutViewDescription';
            }
        }

        directive= "--TechSupport";
        if (line.search(directive)>-1){
            var techSupport= line.replace (directive,"").trim();
            if (techSupport="ViewTitle"){
                currentItem='techSupportViewTitle';
            } else if (techSupport="ViewDescription"){
                currentItem='techSupportViewDescription';
            }
        }

        directive= "--Caterers";
        if (line.search(directive)>-1){
            var caterers= line.replace (directive,"").trim();
            if (caterers="ViewTitle"){
                currentItem='caterersViewTitle';
            } else if (caterers="ViewDescription"){
                currentItem='caterersViewDescription';
            }
        }

        directive= "--Hotels";
        if (line.search(directive)>-1){
            var hotels= line.replace (directive,"").trim();
            if (hotels="ViewTitle"){
                currentItem='HotelsViewTitle';
            } else if (hotels="ViewDescription"){
                currentItem='HotelsViewDescription';
            }
        }

        directive= "--GuestWiFiAccess";
        if (line.search(directive)>-1){
            var guestWiFiAccess= line.replace (directive,"").trim();
            if (guestWiFiAccess="ViewTitle"){
                currentItem='guestWiFiAccessViewTitle';
            } else if (guestWiFiAccess="ViewDescription"){
                currentItem='guestWiFiAccessViewDescription';
            }
        }

        directive= "--FindRoom";
        if (line.search(directive)>-1){
            var findRoom= line.replace (directive,"").trim();
            if (findRoom="ViewTitle"){
                currentItem='FindRoomViewTitle';
            }
        }

        directive= "--RequestStatusTag";
        if (line.search(directive)>-1){
            var requestStatusTag= line.replace (directive,"").trim();
            if (requestStatusTag="UnderReview"){
                currentItem='requestStatusTagUnderReview';
            } else if (requestStatusTag="Approved"){
                currentItem='requestStatusTagApproved';
            }
        }

        directive= "--RequestStatusTag";
        if (line.search(directive)>-1){
            var requestStatusTag= line.replace (directive,"").trim();
            if (requestStatusTag="UnderReview"){
                currentItem='requestStatusTagUnderReview';
            } else if (requestStatusTag="Approved"){
                currentItem='requestStatusTagApproved';
            } else if (requestStatusTag="Rejected"){
                currentItem='requestStatusTagRejected';
            }
        }

        directive= "--RequestStatusMessageTag";
        if (line.search(directive)>-1){
            var requestStatusMessageTag= line.replace (directive,"").trim();
            if (requestStatusMessageTag="UnderReview"){
                currentItem='requestStatusMessageTagUnderReview';
            } else if (requestStatusMessageTag="Approved"){
                currentItem='requestStatusMessageTagApproved';
            } else if (requestStatusMessageTag="Rejected"){
                currentItem='requestStatusMessageTagRejected'
            }
        }
        //keep searching...

        //After current item is found, set the current item's value to the next line
        if (currentItem!=null){
            newAppConfig.currentItem=line;
            currentItem=null;
        }
        
        return true; // Return true to continue processing for the next line item.
         
    })

    //save notes....
    result = {
        success: true,
        appConfig: newAppConfig
    }

    return result;
}

function validateAndCollectAppConfigs(newAppConfigs, appConfigItems) {
    var valid = validateAppConfigs(newAppConfigs);
    if (valid) {
        appConfigItems.push(newAppConfigs);
        totalNumOfAppConfigs += 1;
        return true;
    } else {
        return false;
    }
}


function validateAppConfigs(newappConfigs) {

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
            var errMsg = `ADMIN: createAppConfigs - appConfigs.save failed. Error: ${err}`
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        });
}