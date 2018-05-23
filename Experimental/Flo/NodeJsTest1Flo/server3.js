const express = require('express');         // info: simplifies web app programming. 
const appRoot = require('app-root-path');   // info: https://github.com/inxilpro/node-app-root-path
const morgan = require('morgan');           // info: lib for http logging.
const winston = require('winston');         // info: lib for app level logging. https://github.com/winstonjs/winston
require('winston-daily-rotate-file');       // info: lib for log file handing.  https://github.com/winstonjs/winston-daily-rotate-file

//const { body, validationResult } = require('express-validator/check');
//const { sanitizeBody } = require('express-validator/filter');


var portNum = 900; // The port 80 is already used for web browsing on your machine, pick another unique/unused port.
var appName = "Web Server3";
var noPageCaching = true; // During developmnet avoid page caching at the end-user/client machine

var app = express();
app.use(morgan('dev'));

if (noPageCaching) {
    app.disable('etag'); // Prevent web pages from being cached on the client machine
}


const fs = require('fs'); 
const env = process.env.NODE_ENV || 'development'; // If the NODE_ENV environment variable is defined use that first. If not, default to development.
const logDir = 'log'; 

// Create the log directory if it does not exist 
if (!fs.existsSync(logDir)) { fs.mkdirSync(logDir); } 
// Use local time for log timestamp
const tsFormat = () => (new Date()).toLocaleTimeString(); 


// Define the custom settings for each logging transport
var loggingOptions = {
    rotatinglogFileConfig: {
        level: env === 'development' ? 'verbose' : 'info', // Don't log verbose calls in Production mode
        filename: `${appRoot}/log/trace-%DATE%.log`,
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d' 
    },
    logFileConfig: {
        level: env === 'development' ? 'verbose' : 'info',
        filename: `${appRoot}/log/trace.log`,
        handleExceptions: true,
        json: true,
        maxsize: 2048,
        maxFiles: 5,
        colorize: false,
    },
    consoleConfig: {
        level: 'verbose',
        handleExceptions: true,
        json: false,
        colorize: true,
    },
};

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console(loggingOptions.consoleConfig),
        new winston.transports.DailyRotateFile(loggingOptions.rotatinglogFileConfig)
        //new winston.transports.File(loggingOptions.logFileConfig)
    ],
    exitOnError: false, // do not exit on handled exceptions
});



// Intercept all requests to adjust headers
app.use(function(req, res, next){
    if (noPageCaching) {
        // Add these 'no page caching' meta tags:
        res.header("Cache-Control", "no-cache, no-store, must-revalidate");
        res.header("Pragma", "no-cache");
        res.header("Expires", 0);  
    } 
    res.header("MyCustomHeader", "SomeValue");  

    // Continue to next down stream route handler.
    next();
 });


// Setup Routes:

app.get('/', homePageHandler); // Show how you can call a separately defined function by name.
app.get('/Home', homePageHandler); 

function homePageHandler(req, res) {
    var now = new Date();  
    var msg = `HOME - Hello World from ${appName} [${now.toLocaleTimeString()}]`;
    logger.info("Responding with: " + msg);
    res.send(msg);
}

app.get('/About', function (req, res) {
    logger.verbose("Returning about.html");
    res.sendFile(`${appRoot}/about.html`);
});


app.get('/Spaces', function (req, res) {
    logger.verbose("Returning spaces.json");
    res.sendFile(`${appRoot}/data/spaces.json`);
});

app.get('/registration', function (req, res) {
    logger.verbose("Returning registration.html");
    res.sendFile(`${appRoot}/registration.html`);
});

app.post('/register', function (req, res) {
    logger.verbose("About to process the registration form.");
    //sanitizeBody('name').trim();
    //body('name', 'Empty name').isLength({ min: 1 });

    //var errors = validationResult(req);
    //if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        // Error messages can be returned in an array using `errors.array()`.
    //} else {
        // Data from form is valid.
        //var name = req.post.name;
        //var isMale = req.body.male.checked;
        //var preferredColor = req.body.preferredColor;
    //}


    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<b>Register!</b>');
});



var server = app.listen(portNum, function () {
    var port = server.address().port
    console.log("%s listening on port %s", appName, port)
});