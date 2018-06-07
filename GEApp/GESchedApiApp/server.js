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

// Set up API routes for the RequestPrompt entity:
var requestPromptRoutes = require('./server-api/routes/requestPromptRoutes');
requestPromptRoutes(app);

<<<<<<< HEAD
// Set up API routes for the RequestPrompt entity:
var requestPromptRoutes = require('./server-api/routes/requestPromptRoutes');
requestRoutes(app);
=======
// Set up API routes for the Request entity:
var requestRoutes = require('./server-api/routes/requestRoutes');
requestRoutes(app);


>>>>>>> 1d1531b85eb881e7a33ff471e234e2d59fb07c41


// Temporary for returning mock data:

app.get('/api/appconfigs', (req, res) => {
 
    const jsonData = fs.readFileSync(`${appRoot}/server-api/temp/appConfig.json`);
    const appConfigForSite = JSON.parse(jsonData);

    appConfigForSite.sites = appConfig.sites;
    appConfigForSite.defaultSite = appConfig.defaultSite;
    res.json(appConfigForSite);

}); 

app.get('/api/notes', (req, res) => { //was previously attentions
 
    const jsonData = fs.readFileSync(`${appRoot}/server-api/temp/notes.json`);
    const notes = JSON.parse(jsonData);
    res.json(notes);

}); 


// Start web server:

var server = app.listen(portNum, function () {
    var port = server.address().port
    logger.info(`${appName} listening on port ${port}`);
});