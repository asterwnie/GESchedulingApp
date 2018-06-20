'use strict';

var logger = require('../logger');

// Use the callback functions defined in AppconfigController.js
var AppConfigController = require('../controllers/AppConfigController');


module.exports = function (app) {

    logger.verbose('Setting up RESTful API routes for the AppConfig entity.');

    try {
        // AppConfig: For POST, PUT & PATCH the client caller must set a http header with
        // Content-Type = application/json; charset=UTF-8

        app.route('/api/notes')
            .get(AppConfigController.getAppConfigs)
            .post(AppConfigController.createAppConfig)
            .put(AppConfigController.updateAppConfig)
            .patch(AppConfigController.updateAppConfig);

        app.route('/api/notes/:id')
            .get(AppConfigController.getAppConfig)
            .delete(AppConfigController.deleteAppConfig);
            
    } catch (err) {
        logger.error(`Set up API routes for the AppConfig entity failed. Error: ${err}`);
    }

};