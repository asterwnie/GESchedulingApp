'use strict';

// Import app-ui-data to the database.

const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const mongoose = require('mongoose'); // Helper libray for MongoDB. http://mongoosejs.com/ 
const appConfigOld = require(`${appRoot}/server.config`); // Load app configuration settings server.config.js
const logger = require(`${appRoot}/server-api/logger`); // Create logging helper
const getAppConfigSiteCode = require(`${appRoot}/server-api/models/appConfigModel`);
const svrAppConfig = require(`${appRoot}/server.config`);

mongoose.Promise = global.Promise;

const args = process.argv; 
var siteCode = appConfigOld.defaultSite; // The current default in HLS-MA in server.config.js

// if a site code is passed in on the command-line then use it. For example:
// node ./server-api/dataImports/importappConfigs.js HLS-MA
// appConfigOld: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }

const fileName = `app-ui-data-${siteCode}.txt`;

let AppConfig = getAppConfigSiteCode(siteCode);

var totalNumOfAppConfigs = 0;
var totalNumOfAppConfigsCreated = 0;

const delyInSecs = 3;
const timer = setInterval(() => doAppConfigsImport(), delyInSecs * 1000); // Ensures db connection is established in getappConfigSiteCode since it's an async operation.



function doAppConfigsImport() {

    try {
        clearInterval(timer);

        var fileData = fs.readFileSync(`./server-api/dataImports/dataFiles/${fileName}`).toString()
        
        var result = extractAppConfigItems(fileData);
        if (result.success) {
            //logger.info(`Total number of appConfigs parsed: ${result.appConfigs.length}`);

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


function extractAppConfigItems(fileData) {
    var result = null;
    var appConfigItems = [];
    var newAppConfig = null;
    var errorEncountered = false;
    var currentItemSeq = 0;
    var currentItem = null;
   

    //Create singular appconfig
    newAppConfig = new AppConfig({});

    //split by each line
    fileData.split(/\r?\n/).every((line) => {

        var directive = null;
        var lineProcessed = false;
        var propName = propName.replace("--", "").replace(".","")
        var propName = propName(0).toLowerCase() + propName.slice(1);

        logger.info(`Processing line: ${line}`);
    
        //Find current item
       
        directive = "--SiteCode";
        if (line.search(directive) > -1) {     
           propName = 'siteCode';
        }
        
        directive = "--SiteName";
        if (line.search(directive)>-1) {
            propName = 'siteName';
        }

        directive = "--SiteAddress";
        if (line.search(directive)>-1) {
            propName = 'siteAddress';
        }

        directive = "--AppTitle";
        if (line.search(directive)>-1) {
            propName = 'appTitle';
        }
        
       directive = "DoFirstViewTitle";
       if (line.search(directive) >-1){
            propName = 'doFirstViewTitle';
       }
        
        directive = "--DoFirstViewDecription";
        if (line.search(directive) > -1) {           
         propName = 'doFirstViewDescription';
        }
        
        directive = "--AboutViewTitle";
        if (line.search(directive) > -1) {
        propName = 'aboutViewTitle';
        }

        directive = "AboutViewDescription";
        if (line.search(description) > -1) {
            propName = 'aboutViewDescription';
        }

        directive = "--TechSupportViewTitle";
        if (line.search(directive) > -1){
            propName = 'techSupportViewTitle';
        }

        directive = "--TechSupportViewDescription";
        if (line.search(directive) > -1){
            propName = 'techSupportViewDescription';
        }
        
        directive = "--CaterersViewTitle";
        if (line.search(directive) > -1){
            propName = 'caterersViewTitle';
        }

        directive = "--CaterersViewDescription";
        if (line.search(directive) > -1){
            propName = 'caterersViewDescription';
        }

        directive = "--HotelsViewTitle";
        if (line.search(directive) > -1){
            propName = 'hotelsViewTitle';
        }

        directive = "--HotelsViewDescription";
        if (line.search(directive) > -1){
            propName = 'hotelsViewDescription';
        }

        directive = "--GuestWifiAccessViewTitle";
        if(line.search(directive) > -1){
            propName = 'guestWifiAccessViewTitle';
        }

        directive = "--GuestWifiAccessViewDescription";
        if(line.search(directive) > -1){
            propName = 'guestWifiAccessViewDescription';
        }

       directive= "--NewRequestViewTitle";
       if (line.search(directive)>-1){
           propName = 'newRequestViewTitle';
        }
     
       directive= "--EditRequestViewTitle";
       if (line.search(directive)>-1){
           propName = 'editRequestViewTitle';
           }
       
       directive= "--SubmitRequestViewTitle";
       if (line.search(directive)>-1){
          propName = 'submitRequestViewTitle';
           }
       

       directive= "--AttentionNotesViewTitle";
       if (line.search(directive)>-1){
          propName = 'attentionNotesViewTitle';
           }
       
       directive= "--FindRoomViewTitle";
       if (line.search(directive)>-1){
        propName= 'findRoomViewTitle';  
       }

       directive = "--RequestStatusTagUnderReview";
       if(line.search(directive) > -1){
           propName = 'requestStatusTagUnderReview';
       }
       
       directive = "--RequestStatusTagApproved";
       if(line.search(directive) > -1){
        propName = 'requestStatusTagApproved';
       }
      
       directive = "--RequestStatusTagUnderRejected";
       if(line.search(directive) > -1){
           propName = 'requestStatusTagUnderRejected';
       }

       directive = "--RequestStatusMessageUnderReview";
       if(line.search(directive) > -1){
           propName = 'requestStatusMessageUnderReview';
       }

       directive = "--RequestStatusMessageApproved";
       if(line.search(directive) > -1){
           propName = 'requestStatusMessageApproved';
       }
       
       directive = "--RequestStatusMessageRejected";
       if(line.search(directive) > -1){
           propName = 'requestStatusMessageRejected';
       }
       
       directive = "--AdminHomeViewTitle";
       if(line.search(directive) > -1){
           propName = 'adminHomeViewTitle';
       }

       directive = "--AdminHomeViewDescription";
       if(line.search(directive) > -1){
           propName = 'adminHomeViewDescription';
       }

       directive = "--AdminRequestViewTitle";
       if(line.search(directive) > -1){
           propName = 'adminRequestViewTitle';
       }

       directive = "--AdminSendViewTitle"; 
       if(line.search(directive) > -1){
           propName = 'adminSendViewTitle';
       }

       directive = "--AdminSendViewDescription";
       if(line.search(directive) > -1){
           propName = 'adminSendViewDescription';
       }

       directive = "--SendInviteEmailTemplate"; 
       if(line.search(directive) > -1){
           propName = 'sendInviteEmailTemplate';
       }

       directive = "--SendInviteEmailSubject";
       if(line.search(directive) > -1){
           propName = 'sendInviteEmailSubject';
       }

       directive = "--AddAdminEmailTemplate"; 
       if(line.search(directive) > -1){
           propName = 'addAdminEmailTemplate';
       }

       directive = "--DeleteOlderThanNumDays"; 
       if(line.search(directive) > -1){
           propName = 'deleteOlderThanNumDays';
       }

       directive = "--AdminMaintenanceViewTitle";
       if(line.search(directive) > -1){
           propName = 'adminMaintenanceViewTitle';
       }

       directive = "--AdminAddViewTitle";
       if(line.search(directive) > -1){
           propName = 'adminAddViewTitle';
       }
       
        //After current item is found, set the current item's value to the next line
        if (propName != null){
            if(line.indexOf("--") == -1){
                newAppConfig[propName] = line;
                propName = null;
            }
        }

        return true; // Return true to continue processing for the next line item.
    });



    // Check to see if there's one last pending new one to be collected.
    if (errorEncountered == false && newAppConfig != null) {
        var success = validateAndCollectAppConfig(newAppConfig, appConfigItems);
        if (!success) {
            errorEncountered = true;
        }
    }

    //save notes
    result = {
        success: true,
        appConfig: newAppConfig
    }

    if (errorEncountered == true) {
        result.success = false;
    } 
    
    return result;
}

function validateAndCollectAppConfig(newAppConfig, appConfigItems) {
    var valid = validateAppConfig(newAppConfig);
    if (valid) {
        appConfigItems.push(newAppConfig);
        totalNumOfAppConfigs += 1;
        return true;
    } else {
        return false;
    }
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
            totalNumOfAppConfigsCreated += 1;

            if (totalNumOfAppConfigsCreated == totalNumOfAppConfigs) {
                // All accounted for therefore it can disconnect from the database.
                logger.info(`ADMIN: All ${totalNumOfAppConfigsCreated} appConfigs are created for site: ${siteCode}.`);

                mongoose.disconnect((err) => {
                    if (err) {
                        logger.error(`ADMIN: appConfigs.createAppConfig failed for site: ${siteCode}! Error: ${err}`);
                    } else {
                        logger.info(`ADMIN: Disconnected from database for site: ${siteCode}.`);
                    }
                    process.exit();
                });  
            }
        })
        .catch((err) => {
            var errMsg = `ADMIN: createAppConfig - appConfigs.save failed. Error: ${err}`
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        }); 
    };
