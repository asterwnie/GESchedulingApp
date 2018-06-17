'use strict';

var logger = require('../logger');

// Use the callback functions defined in catererController.js
var catererController = require('../controllers/catererController');


module.exports = function (app) {

    logger.verbose('Setting up RESTful API routes for the Caterer entity.');

    try {
        // Note: For POST, PUT & PATCH the client caller must set a http header with
        // Content-Type = application/json; charset=UTF-8

        app.route('/api/caterers')
            .get(catererController.getCaterers)
            .post(catererController.createCaterer)
            .put(catererController.updateCaterer)
            .patch(catererController.updateCaterer);

        app.route('/api/caterers/:id')
            .get(catererController.getCaterer)
            .delete(catererController.deleteCaterer);
            
    } catch (err) {
        logger.error(`Set up API routes for the Caterer entity failed. Error: ${err}`);
    }

};