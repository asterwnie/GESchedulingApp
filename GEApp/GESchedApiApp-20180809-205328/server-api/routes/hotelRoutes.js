'use strict';

var logger = require('../logger');

// Use the callback functions defined in hotelController.js
var hotelController = require('../controllers/hotelController');


module.exports = function (app) {

    logger.verbose('Setting up RESTful API routes for the Hotel entity.');

    try {
        // Note: For POST, PUT & PATCH the client caller must set a http header with
        // Content-Type = application/json; charset=UTF-8

        app.route('/api/hotels')
            .get(hotelController.getHotels)
            .post(hotelController.createHotel)
            .put(hotelController.updateHotel)
            .patch(hotelController.updateHotel);

        app.route('/api/hotels/:id')
            .get(hotelController.getHotel)
            .delete(hotelController.deleteHotel);
            
    } catch (err) {
        logger.error(`Set up API routes for the Hotel entity failed. Error: ${err}`);
    }

};