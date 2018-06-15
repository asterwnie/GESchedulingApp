'use strict';

var logger = require('../logger');

// Use the callback functions defined in NoteController.js
var NoteController = require('../controllers/NoteController');


module.exports = function (app) {

    logger.verbose('Setting up RESTful API routes for the Note entity.');

    try {
        // Note: For POST, PUT & PATCH the client caller must set a http header with
        // Content-Type = application/json; charset=UTF-8

        app.route('/api/Notes')
            .get(NoteController.getRequestPrompts)
            .post(NoteController.createRequestPrompt)
            .put(NoteController.updateRequestPrompt)
            .patch(NoteController.updateRequestPrompt);

        app.route('/api/Notes/:id')
            .get(NoteController.getRequestPrompt)
            .delete(NoteController.deleteRequestPrompt);
            
    } catch (err) {
        logger.error(`Set up API routes for the Note entity failed. Error: ${err}`);
    }

};