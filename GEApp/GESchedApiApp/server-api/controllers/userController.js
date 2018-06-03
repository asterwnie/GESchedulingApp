'use strict';

const appRoot = require('app-root-path');
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings.

const requestHelper = require(`${appRoot}/server-api/requestHelper`);
const logger = require(`${appRoot}/server-api/logger`);
const getUserType = require(`${appRoot}/server-api/models/userModel`);
const getLoginType = require(`${appRoot}/server-api/models/loginModel`);



exports.getUsers = function (req, res) {
    logger.verbose('userController.getUsers begin');

    let siteCode = requestHelper.getSite(req);
    let User = getUserType(siteCode);

    var sortDirective = { "name": 1}; //default, order by name, ascending

    var filterDirective = {}; //default, no filering
    if (req.query.namecontains != null) {    
        const regExpression = new RegExp(`(${req.query.namecontains})`);
        filterDirective = { "name": regExpression};        
    }

    User.find(filterDirective).sort(sortDirective)
        .then((users) => {
            logger.info(`userController.getUsers - User.find success. About to send back http response with ${users.length} users`);
            res.status(200).json(users);  // 200 - OK
        })
        .catch((err) => {
            var errMsg = `userController.getUsers - User.find failed. Error: ${err}`;
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        });
};



exports.createUser = function (req, res) {
    logger.verbose('userController.createUser begin');

    try {
        let siteCode = requestHelper.getSite(req); 
        let User = getUserType(siteCode);
        var newUser = new User(req.body);

        var validationErr = newUser.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`userController.createUser - create new User validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `userController.createUser - create new User failed validation. ${validationErr}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `userController.createUser - problem with creating a new User. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    }

    newUser.save()
    .then((user) => {
        logger.info(`userController.createUser - User.save success. About to send back http response with user called ${user}`);
        res.status(201).json(user); // 201 - CREATED
    })
    .catch((err) => {
        var errMsg = `userController.createUser - User.save failed. Error: ${err}`
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
    });

};



exports.updateUser = function (req, res) {
    logger.verbose('userController.updateUser begin');

    try {

        let siteCode = requestHelper.getSite(req);
        var User = getUserType(siteCode);

        var toUpdateUser = new User(req.body);

        var validationErr = toUpdateUser.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`userController.updateUser - the updated User validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `userController.updateUser - the updated User failed validation. ${validationErr}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `userController.updateUser - problem with updating User. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    };

    // Create a set of object properties to be updated and excluding the special ones such as timestamps and version managed internally by MongoDB.
    var updateWith = {
        name: toUpdateUser.name, 
        address: toUpdateUser.address 
    };
    if (toUpdateUser.phone != null) { updateWith.phone = toUpdateUser.phone; }
    if (toUpdateUser.corporateRates != null) { updateWith.corporateRates = toUpdateUser.corporateRates; }
    if (toUpdateUser.seqNum != null) { updateWith.seqNum = toUpdateUser.seqNum; }


    User.update({"_id": toUpdateUser._id }, { $set: updateWith }, function (err) {
        if (err) {
            var errMsg = `userController.updateUser - User.find failed. Error: ${err}`
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        } else {

            User.findById(toUpdateUser._id)
            .then((user) => {
                if (user == null) {
                    var errMsg = `userController.updateUser - unable to find the updated User by id ${toUpdateUser._id}. Error: ${err}`;
                    logger.error(errMsg);
                    res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
                } else {
                    logger.info(`userController.updateUser - found updated user by id ${toUpdateUser._id}. About to send back http response with user:\n ${user}`);
                    res.status(200).json(user);  // 200 - OK
                }
            })
            .catch((err) => {
                var errMsg = `userController.updateUser - error finding the updated User by id ${toUpdateUser._id}. Error: ${err}`;
                logger.error(errMsg);
                res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
            });

        }
    });

};



exports.getUser = function (req, res) {
    logger.verbose('userController.getUser begin');

    let siteCode = requestHelper.getSite(req);
    let User = getUserType(siteCode);

    User.findById(req.params.id)
        .then((user) => {
            if (user == null) {
                var errMsg = `userController.getUser - User.findById did not find a user with id ${req.params.id}.`;
                logger.error(errMsg);
                res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
            } else {
                logger.info(`userController.getUser - User.findById success. About to to send back http response with user:\n ${user}`);
                res.status(200).json(user);  // 200 - OK
            }
        })
        .catch((err) => {
            var errMsg = `userController.getUser - User.findById failed. Error: ${err}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        });

};



exports.deleteUser = function (req, res) {
    logger.verbose('userController.deleteUser begin');

    let siteCode = requestHelper.getSite(req);
    let User = getUserType(siteCode);

    User.findByIdAndRemove(req.params.id)
    .then((user) => {
        if (user == null) {
            var errMsg = `userController.deleteUser - Did not find the user to be deleted by id ${req.params.id}.`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        } else {
            logger.info(`userController.deleteUser - User.findByIdAndRemove ${req.params.id} success. Deleted user called ${user.name}`);
            res.status(204).send();  // 204 - NO CONTENT 
        }
    })
    .catch((err) => {
        var errMsg = `userController.deleteUser - User.findByIdAndRemove ${req.params.id} failed. Error: ${err}`;
        logger.error(errMsg);
        res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
    });
};



exports.loginUser = function (req, res) {
    logger.verbose('userController.loginUser begin');

    try {
        var siteCode = requestHelper.getSite(req);
        var User = getUserType(siteCode);
        var Login = getLoginType(siteCode);

        var login = new Login(req.body);

        if (login.email == null || login.email.length === 0) {
            var errMsg = "userController.loginUser - login email cannot be null.";
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }
    } catch (err) {
        var errMsg = `userController.loginUser failed. Error: ${err}`;
        logger.error(errMsg);
        res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
        return;
    }
     
    // TODO: AccessCode.findOne({ accessCode: login.accessCode })

    User.findOne({ 'email': login.email })
        .then((user) => {
            if (user != null) {
                logger.info(`userController.loginUser - User.findOne success. About to send back http response with user: ${user}`);
                res.status(200).json(user);  // 200 - OK
            } else {
                // Create new user to save user's name and phone for future defaulting.

                // placeholder
                var status = { message: "User Unauthorized!" }
                res.status(401).json(status);
            }
        })
        .catch((err) => {
            var errMsg = `userController.loginUser - User.findOne failed. Error: ${err}`;
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        });

};

