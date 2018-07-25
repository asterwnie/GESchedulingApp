'use strict';

var logger = require('../logger');

// Use the callback functions defined in catererController.js
var accessCodeController = require('../controllers/accessCodeController');


module.exports = function (app) {

    logger.verbose('Setting up RESTful API routes for the accessCode entity.');

    try {
        // Note: For POST, PUT & PATCH the client caller must set a http header with
        // Content-Type = application/json; charset=UTF-8

        app.route('/api/accessCodes')
            .get(accessCodeController.getaccessCodes)
            .post(accessCodeController.createAccessCode)
            .put(accessCodeController.updateAccessCode)
            .patch(accessCodeController.updateAccessCode);

        app.route('/api/accessCodes/:id')
            .get(accessCodeController.getAccessCode)
            .delete(accessCodeController.deleteAccessCode);
            
    } catch (err) {
        logger.error(`Set up API routes for the accessCode entity failed. Error: ${err}`);
    }

};