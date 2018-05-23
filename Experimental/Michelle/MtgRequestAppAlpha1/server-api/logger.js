const winston = require('winston');         // info: lib for app level logging. https://github.com/winstonjs/winston
const appRoot = require('app-root-path');   // info: https://github.com/inxilpro/node-app-root-path
require('winston-daily-rotate-file');       // info: lib for log file handing.  https://github.com/winstonjs/winston-daily-rotate-file


const fs = require('fs'); 
const env = process.env.NODE_ENV || 'development'; // If the NODE_ENV environment variable is defined use that first. If not, default to development.
const logDir = `${appRoot}/log`; 

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

    ],
    exitOnError: false, // do not exit on handled exceptions
});

module.exports = logger;