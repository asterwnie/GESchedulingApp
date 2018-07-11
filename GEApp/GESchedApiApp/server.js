// This is the entry script for the Meeting & Event Request and Management app.

const express = require('express');             // info: simplifies web app programming. 
const appRoot = require('app-root-path');       // info: https://github.com/inxilpro/node-app-root-path
const morgan = require('morgan');               // info: lib for http logging. https://www.npmjs.com/package/morgan
const mongoose = require('mongoose');           // Helper libray for MongoDB. http://mongoosejs.com/
const bodyParser = require('body-parser');      // Help convert JSON data in the http request body into a Javascript object.
const cookieParser = require('cookie-parser')   // Help parse name/value pairs in request cookie. https://www.npmjs.com/package/cookie-parser
const appConfig = require('./server.config');   // Load app configuration settings.
const logger = require('./server-api/logger');  // Create logging helper
const cors = require('cors');                     // Enables Cross-origin resource sharing. https://github.com/expressjs/cors#enabling-cors-pre-flight
const fs = require('fs');                       // File system.


const portNum = appConfig.port;
const appName = appConfig.appServerName;

const app = express();

const httpRequestHelper = require(`${appRoot}/server-api/httpRequestHelper`);
var roomController = require(`${appRoot}/server-api/controllers/roomController`);

if (appConfig.devMode) {
    app.use(morgan('combined'));
    mongoose.set('debug', true);
}


app.use(cors())
app.use(cookieParser())

// Help convert JSON data in the http request body into a Javascript object and assigned it to req.body.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (appConfig.noPageCaching) {
    app.disable('etag'); // Prevent web pages from being cached on the client machine
}


// Intercept all requests to adjust headers
app.use(function(req, res, next){
    if (appConfig.noPageCaching) {
        // Add these 'no page caching' meta tags:
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);  
    }

    // Continue to next down stream route handler.
    next();
 });


// Setup the SPA (Vue.js) home page route:

app.get('/', homePageGetHandler);
app.get('/Home', homePageGetHandler); 

function homePageGetHandler(req, res) {
    logger.verbose("Returning index.html");
    // Note: the Vue.js built files is in the dist folder. 
    //       This Vue.js index.html file has been modified to use the Node.js route /clientapp
    //       to reference the ccs/js files: clientapp/main.css & clientapp/build.js
    res.sendFile(`${appRoot}/index.html`);
}

// The Vue.js built files need to be treated as static content.
// To build Vue.js file for deployment use, you need torun: npm run build.
// The build file will be added to the dist folder.
app.use('/static', express.static(`${appRoot}/client-ui`));

//Note: when debugging the node server.js the built version of the
//      client UI Vue.js's SPA index.html can be used to test the REST APIs.



// Set up API routes for the User entity:
var userRoutes = require('./server-api/routes/userRoutes');
userRoutes(app);

// Set up API routes for the hotel entity:
var hotelRoutes = require('./server-api/routes/hotelRoutes');
hotelRoutes(app);

// Set up API routes for the caterer entity:
var catererRoutes = require('./server-api/routes/catererRoutes');
catererRoutes(app);

// Set up API routes for the RequestPrompt entity:
var requestPromptRoutes = require('./server-api/routes/requestPromptRoutes');
requestPromptRoutes(app);

// Set up API routes for the Request entity:
var requestRoutes = require('./server-api/routes/requestRoutes');
requestRoutes(app);

// Set up API routes for the Room entity:
var roomRoutes = require('./server-api/routes/roomRoutes');
roomRoutes(app);

// Set up API routes for the Note entity:
var noteRoutes = require('./server-api/routes/noteRoutes');
noteRoutes(app);

// Set up API routes for the AppConfig entity:
var appConfigRoutes = require('./server-api/routes/appConfigRoutes');
appConfigRoutes(app);





// Temporary for returning mock data:

app.get('/api/appconfigs', async (req, res) => {
 
    const jsonData = fs.readFileSync(`${appRoot}/server-api/temp/appConfig.json`);
    const appConfigForSite = JSON.parse(jsonData);

    appConfigForSite.sites = appConfig.sites;
    appConfigForSite.defaultSite = appConfig.defaultSite;

    let siteCode = httpRequestHelper.getSite(req);
   
    // get distinct room capabilities
    await roomController.queryRoomCapabilities(siteCode, (result) => {
        if (result.success) {
            logger.info(`roomController.getCapabilities - Rooms.distinct success. About to send back http response with ${result.capabilities.length} capabilities`);
            appConfigForSite.roomCapabilities = result.capabilities;
        } else {
            logger.error(`roomController.getCapabilities failed. Error: ${result.errMsg}`);
            res.status(500).json({ error: result.errMsg });
        }
    });
    


    // Getting all the min & max seating capacity per room size type:
    // More info: https://docs.mongodb.com/manual/reference/operator/aggregation/max/

    await roomController.queryMinMaxSeatingCapacityGrpBySizeType(siteCode, (result) => {
        if (result.success) {
            logger.info(`roomController.queryMaxSeatingCapacityGrpBySizeType success. found ${result.minMaxSeatingCapacityItems.length} items.`);
            var minMaxSeatingCapacityItems = result.minMaxSeatingCapacityItems;
            appConfigForSite.sizeTypes = minMaxSeatingCapacityItems;
        } else {
            logger.error(`roomController.queryMaxSeatingCapacityGrpBySizeType failed. Error: ${result.errMsg}`);
            res.status(500).json({ error: result.errMsg });
        }
    });

    // get distinct buildings
    await roomController.queryBuildings(siteCode, (result) => {
        if (result.success) {
            logger.info(`roomController.getBuildings - Rooms.distinct success. About to send back http response with ${result.buildings.length} buildings`);
            appConfigForSite.buildings = result.buildings;
        } else {
            logger.error(`roomController.getBuildings failed. Error: ${result.errMsg}`);
            res.status(500).json({ error: result.errMsg });
        }
     });
   

    res.json(appConfigForSite);

}); 


// Start web server:

var server = app.listen(portNum, function () {
    var port = server.address().port
    logger.info(`${appName} listening on port ${port}`);
});

