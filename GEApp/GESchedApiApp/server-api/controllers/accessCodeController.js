'use strict';

const appRoot = require('app-root-path');
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings.

const httpRequestHelper = require(`${appRoot}/server-api/httpRequestHelper`);
const logger = require(`${appRoot}/server-api/logger`);
const getAccessCodeType = require(`${appRoot}/server-api/models/accessCodeModel`);


// GET AccessCodes
// Sample GET requests:
// http://localhost:9090/api/accessCodes
// http://localhost:9090/api/accessCodes?orderBy=seqNum:1

exports.getAccessCodes = async function (req, res) {
    logger.verbose('accessCodeController.getAccessCodes begin');

    let siteCode = httpRequestHelper.getSite(req);
    
    await queryAccessCodes(siteCode, req.query.code, req.query.isForAdmin, (result) => {
        if (result.success) {
            logger.info(`accessCodeController.getaccessCodes - queryAccessCodes success. About to send back http response with ${result.accessCodes.length} accessCodes`);
            res.status(200).json(result.accessCodes);
        } else {
            logger.error(`accessCodeController.getAccessCodes failed. Error: ${result.errMsg}`);
            res.status(500).json({ error: result.errMsg });
        }
    });

    logger.verbose('accessCodeController.getAccessCodes ends.');        
};


exports.isAccessCodeExist = async function (req, res) {
    logger.verbose('accessCodeController.isAccessCodeExist begin');

    let siteCode = httpRequestHelper.getSite(req);
    
    await queryAccessCodes(siteCode, req.params.code, null, (result) => {
        if (result.success) {
            logger.info(`accessCodeController.isAccessCodeExist - queryAccessCodes success. About to send back http response.`);

            if (result.accessCodes == null || result.accessCodes.length == 0) {
                res.status(404).json({ exist: false }); // 404 NOT FOUND!
            } else {
                res.status(200).json({ exist: true });
            }

        } else {
            logger.error(`accessCodeController.isAccessCodeExist failed. Error: ${result.errMsg}`);
            res.status(500).json({ error: result.errMsg });
        }
    });

    logger.verbose('accessCodeController.isAccessCodeExist ends.');        
};


async function queryAccessCodes (siteCode, code, isForAdmin, callback) {

    let AccessCode = getAccessCodeType(siteCode);

    var filterDirective = {}; //default, no filering
    if (code != null) {    
        filterDirective.code = code;        
    }
    if (isForAdmin != null) {    
        filterDirective.isForAdmin = (isForAdmin == "true");        
    } else {
        filterDirective.isForAdmin = null;
    }

    await AccessCode.find(filterDirective)
        .then((accessCodes) => {
            logger.info(`accessCodeController.queryAccessCodes - AccessCode.find success. Got back ${accessCodes.length} accessCodes`);           
            callback({ success: true, accessCodes: accessCodes });
        })
        .catch((err) => {
            var errMsg = `accessCodeController.queryAccessCodes - AccessCode.find failed. Error: ${err}`;
            logger.error(errMsg);
            callback({ success: false, errMsg: errMsg });
        });
}


exports.queryAccessCodes = queryAccessCodes;


// POST (create) a new accessCode.
exports.createAccessCode = function (req, res) {
    logger.verbose('accessCodeController.createAccessCode begin');

    try {
        let siteCode = httpRequestHelper.getSite(req); 
        let AccessCode = getAccessCodeType(siteCode);
        var newAccessCode = new AccessCode(req.body);

        var validationErr = newAccessCode.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`accessCodeController.createAccessCode - got create new AccessCode validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `createAccessCode failed on validation. Error: ${validationErr}`;
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `accessCodeController.createAccessCode - problem with creating a new AccessCode. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    }

    newAccessCode.save()
        .then((accessCode) => {
            logger.info(`accessCodeController.createAccessCode - AccessCode.save success. About to send back http response with accessCode called ${accessCode}`);
            res.status(201).json(accessCode); // 201 - CREATED
        })
        .catch((err) => {
            var errMsg = `accessCodeController.createAccessCode - AccessCode.save failed. Error: ${err}`
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        });

};


// PUT (update) a accessCode using it's id.
exports.updateAccessCode = function (req, res) {
    logger.verbose('accessCodeController.updateAccessCode begin');

    try {
        let siteCode = httpRequestHelper.getSite(req);
        var AccessCode = getAccessCodeType(siteCode);

        var toUpdateAccessCode = new AccessCode(req.body);

        var validationErr = toUpdateAccessCode.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`accessCodeController.updateAccessCode - the updated AccessCode validation error: ${validationErr.errors[prop]}`);
            }

            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `accessCodeController.updateAccessCode - problem with updating AccessCode. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    };

    toUpdateAccessCode.updatedAt = Date.now();

    AccessCode.update({"_id": toUpdateAccessCode._id }, { $set: toUpdateAccessCode }, function (err) {
        if (err) {
            var errMsg = `accessCodeController.updateAccessCode - AccessCode.find failed. Error: ${err}`
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        } else {

            AccessCode.findById(toUpdateAccessCode._id)
            .then((accessCode) => {
                if (accessCode == null) {
                    var errMsg = `accessCodeController.updateAccessCode - unable to find the updated AccessCode by id ${toUpdateAccessCode._id}. Error: ${err}`;
                    logger.error(errMsg);
                    res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
                } else {
                    logger.info(`accessCodeController.updateAccessCode - found updated accessCode by id ${toUpdateAccessCode._id}. About to send back http response with accessCode:\n ${accessCode}`);
                    res.status(200).json(accessCode);  // 200 - OK
                }
            })
            .catch((err) => {
                var errMsg = `accessCodeController.updateAccessCode - error finding the updated AccessCode by id ${toUpdateAccessCode._id}. Error: ${err}`;
                logger.error(errMsg);
                res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
            });

        }
    });

};


// GET a accessCode by id.
exports.getAccessCode = function (req, res) {
    logger.verbose('accessCodeController.getAccessCode begin');

    let siteCode = httpRequestHelper.getSite(req);
    let AccessCode = getAccessCodeType(siteCode);

    AccessCode.findById(req.params.id)
        .then((accessCode) => {
            if (accessCode == null) {
                var errMsg = `accessCodeController.getAccessCode - AccessCode.findById did not find a accessCode with id ${req.params.id}.`;
                logger.error(errMsg);
                res.status(404).json({ error: errMsg }); // 404 - Not Found
            } else {
                logger.info(`accessCodeController.getAccessCode - AccessCode.findById success. About to to send back http response with accessCode:\n ${accessCode}`);
                res.status(200).json(accessCode);  // 200 - OK
            }
        })
        .catch((err) => {
            var errMsg = `accessCodeController.getAccessCode - AccessCode.findById failed. Error: ${err}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        });

};


// DELETE a accessCode by id.
exports.deleteAccessCode = function (req, res) {
    logger.verbose('AccessCodeController.deleteAccessCode begin');

    let siteCode = httpRequestHelper.getSite(req);
    let AccessCode = getAccessCodeType(siteCode);

    AccessCode.findByIdAndRemove(req.params.id)
    .then((accessCode) => {
        if (accessCode == null) {
            var errMsg = `accessCodeController.deleteAccessCode - Did not find the accessCode to be deleted by id ${req.params.id}.`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        } else {
            logger.info(`accessCodeController.deleteAccessCode - AccessCode.findByIdAndRemove ${req.params.id} success. Deleted accessCode called ${accessCode.type}`);
            res.status(204).send();  // 204 - NO CONTENT 
        }
    })
    .catch((err) => {
        var errMsg = `accessCodeController.deleteAccessCode - AccessCode.findByIdAndRemove ${req.params.id} failed. Error: ${err}`;
        logger.error(errMsg);
        res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
    });
};