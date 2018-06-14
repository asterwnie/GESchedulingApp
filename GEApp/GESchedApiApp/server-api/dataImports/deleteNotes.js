//THESE DO NOT WORK RIGHT NOW, AND NEED TO BE REVISED FOR REQUEST PROMPTS
'use strict';

// Delete all requestPrompts for a site.

const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const mongoose = require('mongoose'); // Helper libray for MongoDB. http://mongoosejs.com/ 
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings server.config.js
const logger = require(`${appRoot}/server-api/logger`); // Create logging helper
const getNoteType = require(`${appRoot}/server-api/models/requestPromptModel`);

mongoose.Promise = global.Promise;

const args = process.argv; 
var siteCode = appConfig.defaultSite; // The current default in HLS-MA in server.config.js

// if a site code is passed in on the command-line then use it. For example:
// node ./server-api/dataImports/deleteNotes.js HLS-MA
// Note: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }


let Note = getNoteType(siteCode);

const delyInSecs = 3;
const timer = setInterval(() => deleteNotes(), delyInSecs * 1000); // Ensures db connection is established in getNoteType since it's an async operation.



function deleteNotes() {

    clearInterval(timer);
    
    // Match any name therefore, deleting all.
    Note.deleteMany({ type: /(.*?)/ }) 
        .then(function () {
            logger.info(`ADMIN: All requestPrompts deleted for site: ${siteCode}`);

            mongoose.disconnect((err) => {
                if (err) {
                    logger.error(`ADMIN: Note.deleteMany failed for site: ${siteCode}! Error: ${err}`);
                } else {
                    logger.info(`ADMIN: Disconnected from database for site: ${siteCode}.`);
                }
                process.exit();
            });            
           
        })
        .catch (function (err) { 
            logger.error(`ADMIN: Note.deleteMany failed for site: ${siteCode}! Error: ${err}`);
            
            mongoose.disconnect();
            logger.info(`ADMIN: Disconnect from database for site: ${siteCode}`);
        });
}

