'use strict';

var logger = require('../logger');

// Use the callback functions defined in userController.js
var userController = require('../controllers/userController');


module.exports = function (app) {

    logger.verbose('Setting up RESTful API routes for the User entity.');

    try {
        // Note: For POST, PUT & PATCH the client caller must set a http header with
        // Content-Type = application/json; charset=UTF-8

        app.route('/api/users')
            .get(userController.getUsers)
            .post(userController.createUser)
            .put(userController.updateUser)
            .patch(userController.updateUser);

        app.route('/api/userscount')
            .get(userController.getUsersCount);

        app.route('/api/users/:id')
            .get(userController.getUser)
            .delete(userController.deleteUser);

        app.route('/api/users/login')
            .post(userController.loginUser)

            
    } catch (err) {
        logger.error(`Set up API routes for the User entity failed. Error: ${err}`);
    }

};