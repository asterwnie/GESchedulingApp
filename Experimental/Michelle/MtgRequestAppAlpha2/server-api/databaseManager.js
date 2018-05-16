const appRoot = require('app-root-path');   // info: https://github.com/inxilpro/node-app-root-path
const mongoose = require('mongoose');       // Helper libray for MongoDB. http://mongoosejs.com/

const appConfig = require(`${appRoot}/server.config`);   // Load app configuration settings from server.config.js.
const logger = require(`${appRoot}/server-api/logger`);  // Create logging helper from logger.js

const dbUrlRefix = appConfig.dbUrlRefix;
mongoose.Promise = global.Promise;


// Object to hold and track database connection per site.
var databaseBySite = {};


// Export function to get a database connection by site code:
module.exports = function (siteCode) {
    
    let siteCodeUpper = siteCode.toUpperCase();
    if (databaseBySite[siteCodeUpper] == null) {
        
        let dbUrl = `${dbUrlRefix}-${siteCodeUpper}`;
        databaseBySite[siteCodeUpper] = mongoose.createConnection(dbUrl);
    }
    return databaseBySite[siteCodeUpper];

}
