'use strict';

// Import users to the database.

const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const mongoose = require('mongoose'); // Helper libray for MongoDB. http://mongoosejs.com/ 
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings server.config.js
const logger = require(`${appRoot}/server-api/logger`); // Create logging helper
const getUserType = require(`${appRoot}/server-api/models/userModel`);

mongoose.Promise = global.Promise;

const args = process.argv; 
var siteCode = appConfig.defaultSite; // The current default in HLS-MA in server.config.js

// if a site code is passed in on the command-line then use it. For example:
// node ./server-api/dataImports/importUsers.js HLS-MA
// Note: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }

const fileName = `users-temp-${siteCode}.json`;

let User = getUserType(siteCode);

var totalNumOfUsers = 0;
var totalNumOfUsersCreated = 0;

const delyInSecs = 3;
const timer = setInterval(() => doUsersImport(), delyInSecs * 1000); // Ensures db connection is established in getUserType since it's an async operation.



function doUsersImport() {

    try {
        clearInterval(timer);

        const jsonData = fs.readFileSync(`./server-api/dataImports/dataFiles/${fileName}`);
        const users = JSON.parse(jsonData);

        // Count the total first.
        users.forEach((user) => totalNumOfUsers += 1 );

        users.forEach((user) => createUser(user));

    } catch (err) {
        logger.error(`ADMIN: Error importing the User collection into the database! Error: ${err}`);
        mongoose.disconnect();
        return;
    }
}



function createUser(user) {

    try {
        logger.info(`ADMIN: Adding user (${user.Name}) to the database.`);

        // The properies from the import spreedsheet does not match directly 
        // so map them to a object that conforms to the User schema.
        var userInDBFormat = {
            email: user.email,
            name: user.name,  
            phone: user.phone,
            isAdmin: user.isAdmin
        };

        var newUser = new User(userInDBFormat);

        var validationErr = newUser.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`ADMIN: createUser - create new User validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `ADMIN: createUser - create new User failed validation. ${validationErr}`;
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        }

    } catch (err) {
        var errMsg = `ADMIN: createUser - problem with creating a new User. Error: ${err}`;
        logger.error(errMsg);
        mongoose.disconnect();
        return;
    }

    newUser.save()
        .then((user) => {
            logger.info(`ADMIN: createUser - User.save success:\n${user}`);
            totalNumOfUsersCreated += 1;

            if (totalNumOfUsersCreated == totalNumOfUsers) {
                // All accounted for therefore it can disconnect from the database.
                logger.info(`ADMIN: All ${totalNumOfUsersCreated} users are created for site: ${siteCode}.`);

                mongoose.disconnect((err) => {
                    if (err) {
                        logger.error(`ADMIN: User.deleteMany failed for site: ${siteCode}! Error: ${err}`);
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
