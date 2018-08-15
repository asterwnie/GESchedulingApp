'use strict';

// Import caterers to the database.

const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const mongoose = require('mongoose'); // Helper libray for MongoDB. http://mongoosejs.com/ 
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings server.config.js
const logger = require(`${appRoot}/server-api/logger`); // Create logging helper
const getUserType = require(`${appRoot}/server-api/models/UserModel`);

mongoose.Promise = global.Promise;

const args = process.argv; 
var siteCode = appConfig.defaultSite; // The current default in HLS-MA in server.config.js

// if a site code is passed in on the command-block then use it. For example:
// node ./server-api/dataImports/importUsers.js HLS-MA
// Note: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }

const fileName = `admin-users-${siteCode}.txt`;

let User = getUserType(siteCode);

var totalNumOfUsers = 0;
var totalNumOfUsersCreated = 0;

const delyInSecs = 3;
const timer = setInterval(() => doUserImport(), delyInSecs * 1000); // Ensures db connection is established in getUserType since it's an async operation.



function doUserImport() {

    try {
        clearInterval(timer);

        var fileData = fs.readFileSync(`${appRoot}/server-api/dataImports/dataFiles/${fileName}`).toString()
        
        var result = extractUserItems(fileData);
        if (result.success) {
            logger.info(`Total number of users parsed: ${result.users.length}`);

            if (result.users.length == 0) {
                logger.info('No users got extracted from the data file!');
                process.exit();
            }
            logger.info(result.users);
            
            result.users.forEach((user) => createUser(user));
        } else {
            process.exit();
        }

    } catch (err) {
        logger.error(`ADMIN: Error importing the User collection into the database! Error: ${err}`);
        mongoose.disconnect();
        process.exit();
    }
}


function extractUserItems(fileData) {
    var result = null;
    var userItems = [];
    var newUser = null;
    var errorEncountered = false;

    fileData.split(/\r?\n/).every((block) => {

        var directive = null;
        var blockProcessed = false;

        logger.info(`Processing block: ${block}`);

        directive = "--Admin.Email:";
        if (block.search(directive) > -1) {            
            // Complete and store the previous pending caterer object if exist.
            if (newUser != null) {
                var success = validateAndCollectUser(newUser, userItems);
                if (!success) {
                    errorEncountered = true;
                    return false; // Return false to stop additional block processing.
                }
            }
    
            var userEmail = block.replace(directive, "").trim();
            // Start a new user instance to gather its properties.
            if (userEmail != "") {

                newUser = new User({ 
                    email: userEmail,
                    isAdmin: true
                });
                
            } else {
                logger.error("ERROR: The user's email is required!");
                errorEncountered = true;
                return false; // Return false to stop additional block processing.
            }

            blockProcessed = true;
        }

        directive = "--Admin.Name:";
        if (!blockProcessed && block.search(directive) > -1) {
            var name = block.replace(directive, "").trim();
            if (name != "") {
                newUser.name = name;
            }
        }

        directive = "--Admin.Phone:";
        if (!blockProcessed && block.search(directive) > -1) {
            var phone = block.replace(directive, "").trim();
            if (phone != "") {
                newUser.phone = phone;
            }
        }

        return true; // Return true to continue processing for the next block item.
    })

    // Check to see if there's one last pending new one to be collected.
    if (errorEncountered == false && newUser != null) {
        var success = validateAndCollectUser(newUser, userItems);
        if (!success) {
            errorEncountered = true;
        }
    }

    result = {
        success: true,
        users: userItems
    }

    if (errorEncountered == true) {
        result.success = false;
    } 

    return result;
}


function validateAndCollectUser(newUser, userItems) {
    var valid = validateUser(newUser);
    if (valid) {
        userItems.push(newUser);
        totalNumOfUsers += 1;
        return true;
    } else {
        return false;
    }
}


function validateUser(newUser) {

    var validationErr = newUser.validateSync();
    if (validationErr != null) {
        for (var prop in validationErr.errors) {
            logger.error(`ADMIN: validateUser - create new User validation error: ${validationErr.errors[prop]}`);
        }
        var errMsg = `ADMIN: validateUser - create new User failed validation. ${validationErr}`;
        logger.error(errMsg);
        return false;
    }
    return true;
}


function createUser(newUser) {

    logger.info(`ADMIN: Adding user (${newUser.email}) to the database.`);

    newUser.save()
        .then((user) => {
            logger.info(`ADMIN: createUser - User.save success:\n${user}`);
            totalNumOfUsersCreated += 1;

            if (totalNumOfUsersCreated == totalNumOfUsers) {
                // All accounted for therefore it can disconnect from the database.
                logger.info(`ADMIN: All ${totalNumOfUsersCreated} users are created for site: ${siteCode}.`);

                mongoose.disconnect((err) => {
                    if (err) {
                        logger.error(`ADMIN: newUser.save failed for site: ${siteCode}! Error: ${err}`);
                    } else {
                        logger.info(`ADMIN: Disconnected from database for site: ${siteCode}.`);
                    }
                    process.exit();
                });  
            }
        })
        .catch((err) => {
            var errMsg = `ADMIN: createUser - User.save failed. Error: ${err}`
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        });

};
