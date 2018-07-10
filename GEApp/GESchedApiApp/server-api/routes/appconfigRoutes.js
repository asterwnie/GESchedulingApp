'use strict';

var logger = require('../logger');

// Use the callback functions defined in AppconfigController.js
var appConfigController = require('../controllers/appConfigController');


module.exports = function (app) {

    logger.verbose('Setting up RESTful API routes for the AppConfig entity.');

    try {
        // AppConfig: For POST, PUT & PATCH the client caller must set a http header with
        // Content-Type = application/json; charset=UTF-8

        app.route('/api/notes')
            .get(appConfigController.getAppConfigs)
            .post(appConfigController.createAppConfig)
            .put(appConfigController.updateAppConfig)
            .patch(appConfigController.updateAppConfig);

        app.route('/api/notes/:id')
            .get(appConfigController.getAppConfig)
            .delete(appConfigController.deleteAppConfig);
            
    } catch (err) {
        logger.error(`Set up API routes for the AppConfig entity failed. Error: ${err}`);
    }

};