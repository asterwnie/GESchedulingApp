'use strict';

// Import Access Code  to the database.

const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const mongoose = require('mongoose'); // Helper libray for MongoDB. http://mongoosejs.com/ 
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings server.config.js
const logger = require(`${appRoot}/server-api/logger`); // Create logging helper
const getAccessCode = require(`${appRoot}/server-api/models/accessCodeModel`);


mongoose.Promise = global.Promise;

const args = process.argv; 
var siteCode = appConfig.defaultSite; // The current default in HLS-MA in server.config.js

// if a site code is passed in on the command-line then use it. For example:
// node ./server-api/dataImports/importaccessCodes.js HLS-MA
// Note: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }

const fileName = `access-${siteCode}.txt`;

let AccessCode = getAccessCode(siteCode);

var totalNumOfAccessCodes = 0;
var totalNumOfAccessCodesCreated = 0;

const delyInSecs = 3;
const timer = setInterval(() => doAccessCodeImport(), delyInSecs * 1000); // Ensures db connection is established in getAccessCode since it's an async operation.



function doAccessCodeImport() {

    try {
        clearInterval(timer);

        var fileData = fs.readFileSync(`./server-api/dataImports/dataFiles/${fileName}`).toString()
        
        var result = extractAccessCodeItems(fileData);
        if (result.success) {
            logger.info(`Total number of accessCode parsed: ${result.accessCodes.length}`);

            if (result.accessCodes.length == 0) {
                logger.info('No accessCode got extracted from the data file!');
                process.exit();
            }
            logger.info(result.accessCodes);
            
            result.accessCodes.forEach((accessCode) => createAccessCode(accessCode));
        } else {
            process.exit();
        }

    } catch (err) {
        logger.error(`ADMIN: Error importing the accessCode collection into the database! Error: ${err}`);
        mongoose.disconnect();
        process.exit();
    }
}


function extractAccessCodeItems(fileData) {
    var result = null;
    var accessCodeItems = [];
    var newAccessCode = null;
    var errorEncountered = false;
    var currentItemSeq = 0;
    

   /// UPDATE to ACCESS CODE
    fileData.split(/\r?\n/).every((line) => {

        var directive = null;
        var lineProcessed = false;

        logger.info(`Processing line: ${line}`);

       //test if the line is a new accessCode
       directive = "--AccessCode."; 
       if (line.search(directive) > -1) {
            // Complete and store the previous pending notes object if exist.
            if (newAccessCode != null) {
                var success = validateAndCollectAccessCodes(newAccessCode, accessCodeItems);
                if (!success) {
                    errorEncountered = true;
                    return false; // Return false to stop additional line processing.
                }
            }
            
            var accessCodetype = line.substring(0, line.indexOf(":")).replace(directive, "").trim();
            var accessCode = line.substring(line.indexOf(":")+1, line.length).trim();
            // Start a new access code instance to gather its properties.
            if (accessCodetype == "ForUsers") {

                currentItemSeq += 1;

                newAccessCode = new AccessCode({
                    seqNum: currentItemSeq,
                    code: accessCode, 
                });
                
            } else if (accessCodetype == "ForAdministrators") {

                currentItemSeq += 1;

                newAccessCode = new AccessCode({
                    seqNum: currentItemSeq,
                    code: accessCode, 
                    isForAdmin: true,
                });

            } else {
                logger.error("ERROR: Code type is required!");
                errorEncountered = true;
                return false; // Return false to stop additional line processing.
            }

            lineProcessed = true;
        }

        /* directive = "--Admin.";  ///For the Admin directive
        if (line.search(directive) > -1) {            
            if (newAdmin != null) {
                var success = validateAndCollectAdmin(newAdmin, adminItems);
                if (!success) {
                    errorEncountered = true;
                    return false; // Return false to stop additional line processing.
                }
            }

            var accessCodetype = line.replace(directive, "").trim();
            // Start a new access code instance to gather its properties.
            if (accessCodetype != "") {

                currentItemSeq += 1;

                newAccessCode = new AccessCode({
                    seqNum: currentItemSeq,
                    type: accessCodetype, 
                });
                
            } else {
                logger.error("ERROR: Code is required!");
                errorEncountered = true;
                return false; // Return false to stop additional line processing.
            }

            lineProcessed = true;
        } */
        

        return true; // Return true to continue processing for the next line item.
    })

    // Check to see if there's one last pending new one to be collected.
    if (errorEncountered == false && newAccessCode != null) {
        var success = validateAndCollectAccessCodes(newAccessCode, accessCodeItems);
        if (!success) {
            errorEncountered = true;
        }
    }

    result = {
        success: true,
        accessCodes: accessCodeItems
    }

    if (errorEncountered == true) {
        result.success = false;
    } 

    return result;
}


function validateAndCollectAccessCodes (newAccessCode, accessCodeItems) {
    var valid = validateAccessCode(newAccessCode);
    if (valid) {
        accessCodeItems.push(newAccessCode);
        totalNumOfAccessCodes += 1;
        return true;
    } else {
        return false;
    }
}


function validateAccessCode(newAccessCode) {

    var validationErr = newAccessCode.validateSync();
    if (validationErr != null) {
        for (var prop in validationErr.errors) {
            logger.error(`ADMIN: validateAccessCode - create new newAccessCode validation error: ${validationErr.errors[prop]}`);
        }
        var errMsg = `ADMIN: validateAccessCode - create new newAccessCode failed validation. ${validationErr}`;
        logger.error(errMsg);
        return false;
    }
    return true;
}


function createAccessCode(newAccessCode) {

    logger.info(`ADMIN: Adding accessCode (${newAccessCode.name}) to the database.`);

    newAccessCode.save()
        .then((accessCode) => {
            logger.info(`ADMIN: createAccessCode - AccessCode.save success:\n${accessCode}`);
            totalNumOfAccessCodesCreated += 1;

            if (totalNumOfAccessCodesCreated == totalNumOfAccessCodes) {
                // All accounted for therefore it can disconnect from the database.
                logger.info(`ADMIN: All ${totalNumOfAccessCodesCreated} accessCodes are created for site: ${siteCode}.`);

                mongoose.disconnect((err) => {
                    if (err) {
                        logger.error(`ADMIN: AccessCode.deleteMany failed for site: ${siteCode}! Error: ${err}`);
                    } else {
                        logger.info(`ADMIN: Disconnected from database for site: ${siteCode}.`);
                    }
                    process.exit();
                });  
            }
        })
        .catch((err) => {
            var errMsg = `ADMIN: createAccessCode - AccessCode.save failed. Error: ${err}`
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        });

};
