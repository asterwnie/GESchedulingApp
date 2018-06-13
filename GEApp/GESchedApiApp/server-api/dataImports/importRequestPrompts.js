//THESE DO NOT WORK RIGHT NOW, AND NEED TO BE REVISED FOR REQUEST PROMPTS

'use strict';

// Import requestPrompts to the database.

const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const mongoose = require('mongoose'); // Helper libray for MongoDB. http://mongoosejs.com/ 
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings server.config.js
const logger = require(`${appRoot}/server-api/logger`); // Create logging helper
const getRequestPromptType = require(`${appRoot}/server-api/models/requestPromptModel`);

mongoose.Promise = global.Promise;

const args = process.argv; 
var siteCode = appConfig.defaultSite; // The current default in HLS-MA in server.config.js

// if a site code is passed in on the command-line then use it. For example:
// node ./server-api/dataImports/importRequestPrompts.js HLS-MA
// Note: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }

const fileName = `request-prompts-${siteCode}.txt`;

let RequestPrompt = getRequestPromptType(siteCode);

var totalNumOfRequestPrompts = 0;
var totalNumOfRequestPromptsCreated = 0;

const delyInSecs = 3;
const timer = setInterval(() => doRequestPromptsImport(), delyInSecs * 1000); // Ensures db connection is established in getRequestPromptType since it's an async operation.



function doRequestPromptsImport() {

    try {
        clearInterval(timer);

        var fileData = fs.readFileSync(`./server-api/dataImports/dataFiles/${fileName}`).toString()
        
        var result = extractRequestPromptItems(fileData);
        if (result.success) {

            logger.info(`Total number of requestPrompts parsed: ${result.requestPrompts.length}`);

            if (result.requestPrompts.length == 0) {
                logger.info('No requestPrompts got extracted from the data file!');
                process.exit();
            }
         
            logger.info(result.requestPrompts);

            result.requestPrompts.forEach((requestPrompt) => createRequestPrompt(requestPrompt));
        } else {
            process.exit();
        }

    } catch (err) {
        logger.error(`ADMIN: Error importing the RequestPrompt collection into the database! Error: ${err}`);
        mongoose.disconnect();
        process.exit();
    }
}


function extractRequestPromptItems(fileData) {
    var result = null;
    var requestPromptItems = [];
    var newRequestPrompt = null;
    var errorEncountered = false;
    var currentItemSeq = 0;

    fileData.split(/\r?\n/).every((line) => {

        var directive = null;
        var lineProcessed = false;

        logger.info(`Processing line: ${line}`);

        directive = "--Prompt.Type.Standard";
        if (line.search(directive) > -1) {            
            // Complete and store the previous pending requestPrompt object if exist.
            if (newRequestPrompt != null) {
                var success = validateAndCollectRequestPrompt(newRequestPrompt, requestPromptItems);
                if (!success) {
                    errorEncountered = true;
                    return false; // Return false to stop additional line processing.
                }
            }
            currentItemSeq += 1;

            newRequestPrompt = new RequestPrompt({ 
                type: "standard",
                seqNum: currentItemSeq
            });
            lineProcessed = true;
        }

        directive = "--Prompt.Label:";
        if (!lineProcessed && line.search(directive) > -1) {
            var requestPromptLabel = line.replace(directive, "").trim();
            if (requestPromptLabel != "") {
                newRequestPrompt.label = requestPromptLabel;
            }
        }

        directive = "--Prompt.OnScreen:";
        if (!lineProcessed && line.search(directive) > -1) {
            var requestOnScreeen = line.replace(directive, "").trim();
            if (requestOnScreeen != "") {
                try {
                newRequestPrompt.screenNum = parseInt(requestOnScreeen);
                } catch (err) {
                    logger.error(`ERROR: Unable to parse ${requestOnScreeen} to a number!`);
                    errorEncountered = true;
                    return false; // Return false to stop additional line processing.
                }
            }
        }

        return true; // Return true to continue processing for the next line item.
    })

    // Check to see if there's one last pending new one to be collected.
    if (errorEncountered == false && newRequestPrompt != null) {
        var success = validateAndCollectRequestPrompt(newRequestPrompt, requestPromptItems);
        if (!success) {
            errorEncountered = true;
        }
    }

    result = {
        success: true,
        requestPrompts: requestPromptItems
    }

    if (errorEncountered == true) {
        result.success = false;
    } 

    return result;
}


function validateAndCollectRequestPrompt(newRequestPrompt, requestPromptItems) {
    var valid = ValidateRequestPrompt(newRequestPrompt);
    if (valid) {
        requestPromptItems.push(newRequestPrompt);
        totalNumOfRequestPrompts += 1;
        return true;
    } else {
        return false;
    }
}


function validateRequestPrompt(newRequestPrompt) {
    // if (!newRequestPrompt.hasOwnProperty("label") || newRequestPrompt.name == "") {
    //     logger.error("ERROR: The request Prompt.Label is required!");
    //     return false;
    // }
    // if (!newRequestPrompt.hasOwnProperty("screenNum") || newRequestPrompt.screenNum < 1) {
    //     logger.error("ERROR: The request Prompt.OnScreen property is required!");
    //     return false;
    // }   

    var validationErr = newRequestPrompt.validateSync();
    if (validationErr != null) {
        for (var prop in validationErr.errors) {
            logger.error(`ADMIN: validateRequestPrompt - create new RequestPrompt validation error: ${validationErr.errors[prop]}`);
        }
        var errMsg = `ADMIN: validateRequestPrompt - create new RequestPrompt failed validation. ${validationErr}`;
        logger.error(errMsg);
        return false;
    }

    return true;
}


function createRequestPrompt(requestPrompt) {

    try {
        logger.info(`ADMIN: Adding requestPrompt (${requestPrompt.name}) to the database.`);

        var newRequestPrompt = new RequestPrompt(requestPrompt);

        var validationErr = newRequestPrompt.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`ADMIN: createRequestPrompt - create new RequestPrompt validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `ADMIN: createRequestPrompt - create new RequestPrompt failed validation. ${validationErr}`;
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        }

    } catch (err) {
        var errMsg = `ADMIN: createRequestPrompt - problem with creating a new RequestPrompt. Error: ${err}`;
        logger.error(errMsg);
        mongoose.disconnect();
        return;
    }

    newRequestPrompt.save()
        .then((requestPrompt) => {
            logger.info(`ADMIN: createRequestPrompt - RequestPrompt.save success:\n${requestPrompt}`);
            totalNumOfRequestPromptsCreated += 1;

            if (totalNumOfRequestPromptsCreated == totalNumOfRequestPrompts) {
                // All accounted for therefore it can disconnect from the database.
                logger.info(`ADMIN: All ${totalNumOfRequestPromptsCreated} requestPrompts are created for site: ${siteCode}.`);

                mongoose.disconnect((err) => {
                    if (err) {
                        logger.error(`ADMIN: RequestPrompt.deleteMany failed for site: ${siteCode}! Error: ${err}`);
                    } else {
                        logger.info(`ADMIN: Disconnected from database for site: ${siteCode}.`);
                    }
                    process.exit();
                });  
            }
        })
        .catch((err) => {
            var errMsg = `ADMIN: createRequestPrompt - RequestPrompt.save failed. Error: ${err}`
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        });

};
