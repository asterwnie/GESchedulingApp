'use strict';

const appRoot = require('app-root-path');
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings.
var accessCodeController = require(`${appRoot}/server-api/controllers/accessCodeController`);

const httpRequestHelper = require(`${appRoot}/server-api/httpRequestHelper`);
const logger = require(`${appRoot}/server-api/logger`);
const getUserType = require(`${appRoot}/server-api/models/userModel`);
const getLoginType = require(`${appRoot}/server-api/models/loginModel`);



exports.getUsers = function (req, res) {
    logger.verbose('userController.getUsers begin');

    let siteCode = httpRequestHelper.getSite(req);
    let User = getUserType(siteCode);

    var sortDirective = { "name": 1}; //default, order by name, ascending

    var filterDirective = {}; //default, no filering
    if (req.query.nameContains != null) {    
        const regExpression = new RegExp(`(${req.query.nameContains})`, "i");
        filterDirective.name = regExpression;        
    }
    if (req.query.isAdmin != null) {    
        filterDirective.isAdmin = req.query.isAdmin;        
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


async function queryUsers (siteCode, query, callback) {
    
}

exports.queryUsers = queryUsers;


async function createNewUser(siteCode, newUser, callback) {
    logger.verbose('userController.createNewUser begin');

    try {
        var validationErr = newUser.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`userController.createNewUser - create new User validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `createNewUser failed on validation. Error: ${validationErr}`;
            callback({ success: false, statusCode: 400, errMsg: errMsg }); // 400 - INVALID REQUEST 
            return;
        }

    } catch (err) {
        var errMsg = `userController.createNewUser - problem with creating a new User. Error: ${err}`;
        logger.error(errMsg);
        callback({ success: false,  statusCode: 500, errMsg: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    }

    newUser.save()
        .then((user) => {
            logger.info(`userController.createNewUser - User.save success. About to send back http response with user called ${user}`);
            callback({ success: true, statusCode: 201, user: user }); // 201 - CREATED
        })
        .catch((err) => {
            var errMsg = `userController.createNewUser - User.save failed. Error: ${err}`
            logger.error(errMsg);
            callback({ success: false,  statusCode: 500, errMsg: errMsg }); // 500 - INTERNAL SERVER ERROR
        });

};



exports.createUser = async function (req, res) {
    logger.verbose('userController.createUser begin');

    let siteCode = httpRequestHelper.getSite(req);
    let User = getUserType(siteCode);
    var newUser = new User(req.body);
    
    await createNewUser(siteCode, newUser, (result) => {
        if (result.success) {
            logger.info(`userController.createUser success. About to send back http response with the new user (${result.user.email})`);
            res.status(result.statusCode).json(result.hotels);
        } else {
            logger.error(`userController.createUser failed. Error: ${result.errMsg}`);
            res.status(result.statusCode).json({ error: result.errMsg });
        }
    });

};



// PUT (update) a user using it's id.
exports.updateUser = function (req, res) {
    logger.verbose('userController.updateUser begin');

    try {
        let siteCode = httpRequestHelper.getSite(req);
        var User = getUserType(siteCode);

        var toUpdateUser = new User(req.body);

        var validationErr = toUpdateUser.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`userController.updateUser - the updated User validation error: ${validationErr.errors[prop]}`);
            }
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `userController.updateUser - problem with updating User. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    };

    toUpdateUser.updatedAt = Date.now();

    User.update({"_id": toUpdateUser._id }, { $set: toUpdateUser }, function (err) {
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


// GET a user by id.
exports.getUser = function (req, res) {
    logger.verbose('userController.getUser begin');

    let siteCode = httpRequestHelper.getSite(req);
    let User = getUserType(siteCode);

    User.findById(req.params.id)
        .then((user) => {
            if (user == null) {
                var errMsg = `userController.getUser - User.findById did not find a user with id ${req.params.id}.`;
                logger.error(errMsg);
                res.status(404).json({ error: errMsg }); // 404 - Not Found 
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


// DELETE a user by id.
exports.deleteUser = function (req, res) {
    logger.verbose('userController.deleteUser begin');

    let siteCode = httpRequestHelper.getSite(req);
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


// Do user login
exports.loginUser = async function (req, res) {
    logger.verbose('userController.loginUser begin');

    let siteCode = null;
    let Login = null;
    let User = null;
    let login = null;

    try {
        siteCode = httpRequestHelper.getSite(req);
        User = getUserType(siteCode);
        Login = getLoginType(siteCode);

        login = new Login(req.body);

        if (login.email == null || login.email.length === 0) {
            var errMsg = "userController.loginUser - login email cannot be null.";
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }
    } catch (err) {
        let errMsg = `userController.loginUser failed. Error: ${err}`;
        logger.error(errMsg);
        res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
        return;
    }
     
    var needToCreateUser = false;
    var foundUser = null;

    const regExpression = new RegExp(`(${login.email})`, "i");
    await User.findOne({ 'email': regExpression })
        .then((user) => {
            if (user != null) {
                logger.info(`userController.loginUser - User.findOne success. About to send back http response with user: ${user}`);
                //res.status(200).json(user);  // 200 - OK
                //return;
                foundUser = user;
            } else {               
                needToCreateUser = true;
            }
        })
        .catch((err) => {
            let errMsg = `userController.loginUser - User.findOne failed. Error: ${err}`;
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        });


    var matchedAccessCode = false;
    var isForAdmin = null;
    if (foundUser != null && foundUser.isAdmin) {
        isForAdmin = "true";
    }

    await accessCodeController.queryAccessCodes(siteCode, login.accessCode, isForAdmin, (result) => {
        if (result.success) {
            logger.info(`accessCodeController.queryAccessCodes success`);
            if (result.accessCodes == null || result.accessCodes.length == 0) {
                matchedAccessCode = false;
            } else {
                matchedAccessCode = true;
            }
        } else {
            logger.error(`accessCodeController.queryAccessCodes failed. Error: ${result.errMsg}`);
            res.status(500).json({ error: result.errMsg });
        }
    });


    if (!matchedAccessCode) {
        let status = { message: "User Unauthorized!" }
        res.status(401).json(status);
        return;
    }

    if (foundUser != null) {
        logger.info(`userController.loginUser success. About to send back http response with logged in user: ${foundUser}`);
        res.status(200).json(foundUser);  // 200 - OK
        return;
    }


    if (needToCreateUser) {
        // Create new user object in the database to save user's name and phone for future defaulting.

        let newUser = new User(req.body);

        createNewUser(siteCode, newUser, (result) => {
            if (result.success) {
                logger.info(`userController.createUser success. About to send back http response with the new logged in user (${result.user.email})`);
                res.status(result.statusCode).json(result.user);
            } else {
                logger.error(`userController.createUser failed. Error: ${result.errMsg}`);
                res.status(result.statusCode).json({ error: result.errMsg });
            }
        });
    }

};

