
const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const logger = require(`${appRoot}/server-api/logger`);  // Create logging helper from logger.js

exports.appSettingOverrides = null;

exports.processOverridesIfExist = function (appConfig) {
    var overrides = this.readOverrides();

    var props = Object.getOwnPropertyNames(overrides);
    props.forEach((prop, index) => {
      try {
        if (overrides[prop] != undefined && overrides[prop] != null && overrides[prop] != "") {
            appConfig._doc[prop] = overrides[prop];
        }
      } catch (err) {}
    });

}

exports.findOverridesFile = function () {

    var overridesFile = null;
    var filepathSuffix = ':\\GESchedulingApp\\app-setting-overrides.txt'; 
    var drives = ['C','D','E','F','G','H','I','X','Y','Z'];
    var foundPath = false;

    drives.forEach((drive) => {
        if (!foundPath) {
            overridesFile = drive + filepathSuffix;
            if (fs.existsSync(overridesFile)) {
                foundPath = true;
            }
        }
    });

    if (!foundPath) {
        overridesFile = null;
    }
    return overridesFile;
}


exports.readOverrides = function () {

    if (this.appSettingOverrides != null) {
        return this.appSettingOverrides;
    }

    try {
        var overridesFile = this.findOverridesFile();
        if (overridesFile == null) {
            this.appSettingOverrides = {}
            return this.appSettingOverrides;
        }

        var fileData = fs.readFileSync(overridesFile).toString()
        
        var result = this.extractOverrideSettings(fileData);
        if (result.success) {

            if (result.overrideSettings == null || result.overrideSettings == undefined) {
                logger.info('No app override settings got extracted from the data file!');
            } else {
                logger.info('Loaded app override settings:');
                logger.info(result.overrideSettings);
                this.appSettingOverrides = result.overrideSettings;
            }
        } else {
            logger.info('No app override settings got extracted from the data file!');
        }

    } catch (err) {
        logger.error(`Error importing the app override settings! Error: ${err}`);
    }

    return this.appSettingOverrides;
}


exports.extractOverrideSettings = function (fileData) {

    var result = null;
    var errorEncountered = false;
    var currentPropName = null;
    var overrideSettings = {};

    logger.info(`extractOverrideSettings begins.`);

    //split by each line
    fileData.split(/\r?\n/).every((line) => {

        logger.info(`Processing line: ${line}`);

        try {
            if (line.indexOf("--") > -1) {

                currentPropName = line;
                // Remove dashes and dots:
                currentPropName = currentPropName.replace('--', '').replace(/\./g,'');
                currentPropName = currentPropName[0].toLowerCase() + currentPropName.slice(1);
                currentPropName = currentPropName.trim();

            } else if (line != null && line != "" && 
                    line.indexOf("--") == -1 && currentPropName != null) {

                //After current property is found, set the current property's value from one or more lines.

                var alreadyAssignedValue = overrideSettings[currentPropName];
                if (alreadyAssignedValue == undefined || alreadyAssignedValue == null) {
                    overrideSettings[currentPropName] = line;
                } else {
                    if (line == '[LINEBREAK]') {
                        overrideSettings[currentPropNam] = alreadyAssignedValue + line;
                    } else {
                        overrideSettings[currentPropName] = alreadyAssignedValue + '[LINEBREAK]' + line;
                    }
                }

            }
        } catch (err) {
            logger.error(`extractOverrideSettings - Error Processing line: ${line}, Error: ${err}`);
            errorEncountered = true;
            return false;
        }

        return true; // tell the every loop to continue processing.
    });

    if (overrideSettings.appPort != undefined && overrideSettings.appPort != null) {
        overrideSettings.appPort = parseInt( overrideSettings.appPort);
    }

    result = {
        success: true,
        overrideSettings: overrideSettings
    }

    if (errorEncountered == true) {
        result.success = false;
    } 
    
    return result;
}