'use strict';

var logger = require('../logger');

// Use the callback functions defined in requestPromptController.js
var requestPromptController = require('../controllers/requestPromptController');


module.exports = function (app) {

    logger.verbose('Setting up API routes for the RequestPrompt entity.');

    try {
        // Note: For POST, PUT & PATCH the client caller must set a http header with
        // Content-Type = application/json; charset=UTF-8

        app.route('/api/RequestPrompts')
            .get(requestPromptController.getRequestPrompts)
            .post(requestPromptController.createRequestPrompt)
            .put(requestPromptController.updateRequestPrompt)
            .patch(requestPromptController.updateRequestPrompt);

        app.route('/api/RequestPrompts/:id')
            .get(requestPromptController.getRequestPrompt)
            .delete(requestPromptController.deleteRequestPrompt);
            
    } catch (err) {
        logger.error(`Set up API routes for the RequestPrompt entity failed. Error: ${err}`);
    }

};