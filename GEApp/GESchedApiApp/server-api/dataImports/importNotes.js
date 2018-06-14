'use strict';

// Import notes to the database.

const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const mongoose = require('mongoose'); // Helper libray for MongoDB. http://mongoosejs.com/ 
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings server.config.js
const logger = require(`${appRoot}/server-api/logger`); // Create logging helper
const getNotesType = require(`${appRoot}/server-api/models/notesModel`);

mongoose.Promise = global.Promise;

const args = process.argv; 
var siteCode = appConfig.defaultSite; // The current default in HLS-MA in server.config.js

// if a site code is passed in on the command-block then use it. For example:
// node ./server-api/dataImports/importNotess.js HLS-MA
// Note: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }

const fileName = `notes-${siteCode}.txt`;

let Notes = getNotesType(siteCode);

var totalNumOfNotess = 0;
var totalNumOfNotessCreated = 0;

const delyInSecs = 3;
const timer = setInterval(() => doNotesImport(), delyInSecs * 1000); // Ensures db connection is established in getNotesType since it's an async operation.



function doNotesImport() {

    try {
        clearInterval(timer);

        var fileData = fs.readFileSync(`./server-api/dataImports/dataFiles/${fileName}`).toString()
        
        var result = extractNotesItems(fileData);
        if (result.success) {
            logger.info(`Total number of notes parsed: ${result.notes.length}`);

            if (result.notes.length == 0) {
                logger.info('No notes got extracted from the data file!');
                process.exit();
            }
            logger.info(result.notes);
            
            result.notes.forEach((notes) => createNotes(notes));
        } else {
            process.exit();
        }

    } catch (err) {
        logger.error(`ADMIN: Error importing the Notes collection into the database! Error: ${err}`);
        mongoose.disconnect();
        process.exit();
    }
}


function extractNotesItems(fileData) {
    var result = null;
    var notesItems = [];
    var newNotes = null;
    var errorEncountered = false;
    var currentItemSeq = 0;

    fileData.split(/\r\n\r\n/).every((block) => {

        var directive = null;
        var blockProcessed = false;

        logger.info(`Processing block: ${block}`);

        //split into two lines (directive and the text itself)
        var blockArray = block.split(/\r\n/);

        directive = "--Note.";
        if (block.search(directive) > -1) {            
            // Complete and store the previous pending notes object if exist.
            if (newNotes != null) {
                var success = validateAndCollectNotes(newNotes, notesItems);
                if (!success) {
                    errorEncountered = true;
                    return false; // Return false to stop additional block processing.
                }
            }

            var notetype = blockArray[0].replace(directive, "").trim();
            // Start a new notes instance to gather its properties.
            if (notetype != "") {

                currentItemSeq += 1;

                newNotes = new Notes({ 
                    seqNum: currentItemSeq,
                    type: notetype, 
                    text: blockArray[1]
                });
                
            } else {
                logger.error("ERROR: The notes name is required!");
                errorEncountered = true;
                return false; // Return false to stop additional block processing.
            }

            blockProcessed = true;
        }

      

       

        return true; // Return true to continue processing for the next block item.
    })

    // Check to see if there's one last pending new one to be collected.
    if (errorEncountered == false && newNotes != null) {
        var success = validateAndCollectNotes(newNotes, notesItems);
        if (!success) {
            errorEncountered = true;
        }
    }

    result = {
        success: true,
        notes: notesItems
    }

    if (errorEncountered == true) {
        result.success = false;
    } 

    return result;
}


function validateAndCollectNotes(newNotes, notesItems) {
    var valid = validateNotes(newNotes);
    if (valid) {
        notesItems.push(newNotes);
        totalNumOfNotess += 1;
        return true;
    } else {
        return false;
    }
}


function validateNotes(newNotes) {

    var validationErr = newNotes.validateSync();
    if (validationErr != null) {
        for (var prop in validationErr.errors) {
            logger.error(`ADMIN: validateNotes - create new newNotes validation error: ${validationErr.errors[prop]}`);
        }
        var errMsg = `ADMIN: validateNotes - create new newNotes failed validation. ${validationErr}`;
        logger.error(errMsg);
        return false;
    }
    return true;
}


function createNotes(newNotes) {

    logger.info(`ADMIN: Adding notes (${newNotes.name}) to the database.`);

    newNotes.save()
        .then((notes) => {
            logger.info(`ADMIN: createNotes - Notes.save success:\n${notes}`);
            totalNumOfNotessCreated += 1;

            if (totalNumOfNotessCreated == totalNumOfNotess) {
                // All accounted for therefore it can disconnect from the database.
                logger.info(`ADMIN: All ${totalNumOfNotessCreated} notes are created for site: ${siteCode}.`);

                mongoose.disconnect((err) => {
                    if (err) {
                        logger.error(`ADMIN: Notes.deleteMany failed for site: ${siteCode}! Error: ${err}`);
                    } else {
                        logger.info(`ADMIN: Disconnected from database for site: ${siteCode}.`);
                    }
                    process.exit();
                });  
            }
        })
        .catch((err) => {
            var errMsg = `ADMIN: createNotes - Notes.save failed. Error: ${err}`
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        });

};
