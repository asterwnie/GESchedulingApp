// This is the entry script for the Meeting & Event Request and Management app.

const express = require('express');         // info: simplifies web app programming. 
const appRoot = require('app-root-path');   // info: https://github.com/inxilpro/node-app-root-path
const morgan = require('morgan');           // info: lib for http logging. https://www.npmjs.com/package/morgan
const mongoose = require('mongoose');       // Helper libray for MongoDB. http://mongoosejs.com/
const bodyParser = require('body-parser');  // Help convert JSON data in the http request body into a Javascript object.

const appConfig = require('./server.config');   // Load app configuration settings.
const logger = require('./server-api/logger');  // Create logging helper

const dbUrlRefix = appConfig.dbUrlRefix;
const defaultSite = appConfig.defaultSite;

mongoose.Promise = global.Promise;
var dbUrl = `${dbUrlRefix}-${defaultSite}`;

// Connect to the database:
mongoose.connect(dbUrl)
    .then(function () { 
        logger.info(`The MongoDB connected: ${dbUrl}`); 
    })
    .catch(function (err) { 
        logger.error(`The MongoDB connection ${dbUrl} failed! Error: ${err}`);
        exit; 
    });

const portNum = appConfig.port;
const appName = appConfig.appServerName;

const app = express();

if (appConfig.devMode) {
    app.use(morgan('combined'));
    mongoose.set('debug', true);
}

if (appConfig.noPageCaching) {
    app.disable('etag'); // Prevent web pages from being cached on the client machine
}

// Help convert JSON data in the http request body into a Javascript object and assigned it to req.body.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Intercept all requests to adjust headers
app.use(function(req, res, next){
    if (appConfig.noPageCaching) {
        // Add these 'no page caching' meta tags:
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);  
    } 
    res.header("CurrentSite", `${defaultSite}`);  

    // Continue to next down stream route handler.
    next();
 });


// Setup the SPA home page route:

app.get('/', homePageGetHandler);
app.get('/Home', homePageGetHandler); 

function homePageGetHandler(req, res) {
    logger.verbose("Returning index.html");
    res.sendFile(`${appRoot}/index.html`);
}


// Set up API routes for the Hotel entity:
var hotelRoutes = require('./server-api/routes/hotelRoutes');
hotelRoutes(app);



// Start web server:

var server = app.listen(portNum, function () {
    var port = server.address().port
    logger.info(`${appName} listening on port ${port}`);
});