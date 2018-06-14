'use strict';

var logger = require('../logger');

// Use the callback functions defined in roomController.js
var roomController = require('../controllers/roomController');


module.exports = function (app) {

    logger.verbose('Setting up RESTful API routes for the Room entity.');

    try {
        // Note: For POST, PUT & PATCH the client caller must set a http header with
        // Content-Type = application/json; charset=UTF-8

        app.route('/api/rooms')
            .get(roomController.getRooms)
            .post(roomController.createRoom)
            .put(roomController.updateRoom)
            .patch(roomController.updateRoom);

        app.route('/api/rooms/sizes')
            .get(roomController.getRoomSizes);

        app.route('/api/rooms/capabilities')
            .get(roomController.getCapabilities);

        app.route('/api/rooms/:id')
            .get(roomController.getRoom)
            .delete(roomController.deleteRoom);
            

    } catch (err) {
        logger.error(`Set up API routes for the Room entity failed. Error: ${err}`);
    }

};