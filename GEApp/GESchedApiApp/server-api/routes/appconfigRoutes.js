'use strict';

var logger = require('../logger');

// Use the callback functions defined in AppconfigController.js
var AppconfigController = require('../controllers/AppconfigController');


module.exports = function (app) {

    logger.verbose('Setting up RESTful API routes for the Appconfig entity.');

    try {
        // Appconfig: For POST, PUT & PATCH the client caller must set a http header with
        // Content-Type = application/json; charset=UTF-8

        app.route('/api/notes')
            .get(AppconfigController.getAppconfigs)
            .post(AppconfigController.createAppconfig)
            .put(AppconfigController.updateAppconfig)
            .patch(AppconfigController.updateAppconfig);

        app.route('/api/notes/:id')
            .get(AppconfigController.getAppconfig)
            .delete(AppconfigController.deleteAppconfig);
            
    } catch (err) {
        logger.error(`Set up API routes for the Appconfig entity failed. Error: ${err}`);
    }

};