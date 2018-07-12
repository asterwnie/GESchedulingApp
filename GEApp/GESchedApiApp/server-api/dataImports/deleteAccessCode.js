'use strict';
///delete all appConfigs

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
// node ./server-api/dataImports/deleteappConfigs.js HLS-MA
// appConfig: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }


let accessCode = getAccessCode(siteCode);

const delyInSecs = 3;
const timer = setInterval(() => deleteAccessCodes(), delyInSecs * 1000); // Ensures db connection is established in getappConfigType since it's an async operation.



function deleteAccessCodes() {

    clearInterval(timer);
    
    // Match any name therefore, deleting all.
    accessCode.deleteMany({ siteCode: /(.*?)/ }) 
        .then(function () {
            logger.info(`ADMIN: All accessCodes deleted for site: ${siteCode}`);

            mongoose.disconnect((err) => {
                if (err) {
                    logger.error(`ADMIN: accessCode.deleteMany failed for site: ${siteCode}! Error: ${err}`);
                } else {
                    logger.info(`ADMIN: Disconnected from database for site: ${siteCode}.`);
                }
                process.exit();
            });            
           
        })
        .catch (function (err) { 
            logger.error(`ADMIN: accessCode.deleteMany failed for site: ${siteCode}! Error: ${err}`);
            
            mongoose.disconnect();
            logger.info(`ADMIN: Disconnect from database for site: ${siteCode}`);
        });
}

