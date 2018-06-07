'use strict';

var logger = require('../logger');

// Use the callback functions defined in requestController.js
var requestController = require('../controllers/requestController');


module.exports = function (app) {

    logger.verbose('Setting up RESTful API routes for the Request entity.');

    try {
        // Note: For POST, PUT & PATCH the client caller must set a http header with
        // Content-Type = application/json; charset=UTF-8

        app.route('/api/requests')
            .get(requestController.getRequests)
            .post(requestController.createRequest)
            .put(requestController.updateRequest)
            .patch(requestController.updateRequest);

        app.route('/api/requests/:id')
            .get(requestController.getRequest)
            .delete(requestController.deleteRequest);
            
    } catch (err) {
        logger.error(`Set up API routes for the Request entity failed. Error: ${err}`);
    }

};