'use strict';

const appRoot = require('app-root-path');
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings.

const requestHelper = require(`${appRoot}/server-api/requestHelper`);
const logger = require(`${appRoot}/server-api/logger`);
const getRequestType = require(`${appRoot}/server-api/models/requestModel`);



exports.getRequests = function (req, res) {
    logger.verbose('requestController.getRequests begin');

    let siteCode = requestHelper.getSite(req);
    let Request = getRequestType(siteCode);

    var sortDirective = { "name": 1}; //default, order by name, ascending
    if (req.query.orderby != null) {
        if (req.query.orderby.toLowerCase() == 'seqnum:1') {
            sortDirective = { "seqNum": 1};  //ascending order
        } else if (req.query.orderby.toLowerCase() == 'seqnum:-1') {
            sortDirective = { "seqNum": -1}; //descending order
        }
    }

    var filterDirective = {}; //default, no filering
    if (req.query.namecontains != null) {    
        const regExpression = new RegExp(`(${req.query.namecontains})`);
        filterDirective = { "name": regExpression};        
    }

    Request.find(filterDirective).sort(sortDirective)
        .then((requests) => {
            logger.info(`requestController.getRequests - Request.find success. About to send back http response with ${requests.length} requests`);
            res.status(200).json(requests);  // 200 - OK
        })
        .catch((err) => {
            var errMsg = `requestController.getRequests - Request.find failed. Error: ${err}`;
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        });
};



exports.createRequest = function (req, res) {
    logger.verbose('requestController.createRequest begin');

    try {
        let siteCode = requestHelper.getSite(req); 
        let Request = getRequestType(siteCode);
        var newRequest = new Request(req.body);

        var validationErr = newRequest.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`requestController.createRequest - create new Request validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `requestController.createRequest - create new Request failed validation. ${validationErr}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `requestController.createRequest - problem with creating a new Request. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    }

    newRequest.save()
    .then((request) => {
        logger.info(`requestController.createRequest - Request.save success. About to send back http response with request called ${request}`);
        res.status(201).json(request); // 201 - CREATED
    })
    .catch((err) => {
        var errMsg = `requestController.createRequest - Request.save failed. Error: ${err}`
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
    });

};



exports.updateRequest = function (req, res) {
    logger.verbose('requestController.updateRequest begin');

    try {

        let siteCode = requestHelper.getSite(req);
        var Request = getRequestType(siteCode);

        var toUpdateRequest = new Request(req.body);

        var validationErr = toUpdateRequest.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`requestController.updateRequest - the updated Request validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `requestController.updateRequest - the updated Request failed validation. ${validationErr}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `requestController.updateRequest - problem with updating Request. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    };

   /* // Create a set of object properties to be updated and excluding the special ones such as timestamps and version managed internally by MongoDB.
    var updateWith = {
        name: toUpdateRequest.name, 
        address: toUpdateRequest.address 
    };
    if (toUpdateRequest.phone != null) { updateWith.phone = toUpdateRequest.phone; }
    if (toUpdateRequest.corporateRates != null) { updateWith.corporateRates = toUpdateRequest.corporateRates; }
    if (toUpdateRequest.seqNum != null) { updateWith.seqNum = toUpdateRequest.seqNum; } */


    Request.update({"_id": toUpdateRequest._id }, { $set: updateWith }, function (err) {
        if (err) {
            var errMsg = `requestController.updateRequest - Request.find failed. Error: ${err}`
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        } else {

            Request.findById(toUpdateRequest._id)
            .then((request) => {
                if (request == null) {
                    var errMsg = `requestController.updateRequest - unable to find the updated Request by id ${toUpdateRequest._id}. Error: ${err}`;
                    logger.error(errMsg);
                    res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
                } else {
                    logger.info(`requestController.updateRequest - found updated request by id ${toUpdateRequest._id}. About to send back http response with request:\n ${request}`);
                    res.status(200).json(request);  // 200 - OK
                }
            })
            .catch((err) => {
                var errMsg = `requestController.updateRequest - error finding the updated Request by id ${toUpdateRequest._id}. Error: ${err}`;
                logger.error(errMsg);
                res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
            });

        }
    });

};



exports.getRequest = function (req, res) {
    logger.verbose('requestController.getRequest begin');

    let siteCode = requestHelper.getSite(req);
    let Request = getRequestType(siteCode);

    Request.findById(req.params.id)
        .then((request) => {
            if (request == null) {
                var errMsg = `requestController.getRequest - Request.findById did not find a request with id ${req.params.id}.`;
                logger.error(errMsg);
                res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
            } else {
                logger.info(`requestController.getRequest - Request.findById success. About to to send back http response with request:\n ${request}`);
                res.status(200).json(request);  // 200 - OK
            }
        })
        .catch((err) => {
            var errMsg = `requestController.getRequest - Request.findById failed. Error: ${err}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        });

};



exports.deleteRequest = function (req, res) {
    logger.verbose('requestController.deleteRequest begin');

    let siteCode = requestHelper.getSite(req);
    let Request = getRequestType(siteCode);

    Request.findByIdAndRemove(req.params.id)
    .then((request) => {
        if (request == null) {
            var errMsg = `requestController.deleteRequest - Did not find the request to be deleted by id ${req.params.id}.`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        } else {
            logger.info(`requestController.deleteRequest - Request.findByIdAndRemove ${req.params.id} success. Deleted request called ${request.name}`);
            res.status(204).send();  // 204 - NO CONTENT 
        }
    })
    .catch((err) => {
        var errMsg = `requestController.deleteRequest - Request.findByIdAndRemove ${req.params.id} failed. Error: ${err}`;
        logger.error(errMsg);
        res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
    });
};