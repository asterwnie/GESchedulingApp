'use strict';

const appRoot = require('app-root-path');
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings.

const httpRequestHelper = require(`${appRoot}/server-api/httpRequestHelper`);
const logger = require(`${appRoot}/server-api/logger`);
const getRequestPromptType = require(`${appRoot}/server-api/models/requestPromptModel`);



exports.getRequestPrompts = function (req, res) {
    logger.verbose('requestPromptController.getRequestPrompts begin');

    let siteCode = httpRequestHelper.getSite(req);
    let RequestPrompt = getRequestPromptType(siteCode);

    var sortDirective = { "seqNum": 1}; //default, order by sequence number, ascending

    var filterDirective = {}; //default, no filering
    if (req.query.screenNum != null) {    
        //looking for exact match of screennum
        filterDirective = { "screenNum": req.query.screenNum};        
    }

    RequestPrompt.find(filterDirective).sort(sortDirective)
        .then((requestPrompts) => {
            logger.info(`requestPromptController.getRequestPrompts - RequestPrompt.find success. About to send back http response with ${requestPrompts.length} requestPrompts`);
            res.status(200).json(requestPrompts);  // 200 - OK
        })
        .catch((err) => {
            var errMsg = `requestPromptController.getRequestPrompts - RequestPrompt.find failed. Error: ${err}`;
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        });
};



exports.createRequestPrompt = function (req, res) {
    logger.verbose('requestPromptController.createRequestPrompt begin');

    try {
        let siteCode = httpRequestHelper.getSite(req); 
        let RequestPrompt = getRequestPromptType(siteCode);
        var newRequestPrompt = new RequestPrompt(req.body);

        var validationErr = newRequestPrompt.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`requestPromptController.createRequestPrompt - create new RequestPrompt validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `requestPromptController.createRequestPrompt - create new RequestPrompt failed validation. ${validationErr}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `requestPromptController.createRequestPrompt - problem with creating a new RequestPrompt. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    }

    newRequestPrompt.save()
    .then((requestPrompt) => {
        logger.info(`requestPromptController.createRequestPrompt - RequestPrompt.save success. About to send back http response with requestPrompt called ${requestPrompt}`);
        res.status(201).json(requestPrompt); // 201 - CREATED
    })
    .catch((err) => {
        var errMsg = `requestPromptController.createRequestPrompt - RequestPrompt.save failed. Error: ${err}`
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
    });

};



exports.updateRequestPrompt = function (req, res) {
    logger.verbose('requestPromptController.updateRequestPrompt begin');

    try {

        let siteCode = httpRequestHelper.getSite(req);
        var RequestPrompt = getRequestPromptType(siteCode);

        var toUpdateRequestPrompt = new RequestPrompt(req.body);

        var validationErr = toUpdateRequestPrompt.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`requestPromptController.updateRequestPrompt - the updated RequestPrompt validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `requestPromptController.updateRequestPrompt - the updated RequestPrompt failed validation. ${validationErr}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `requestPromptController.updateRequestPrompt - problem with updating RequestPrompt. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    };

    toUpdateRequestPrompt.updatedAt = Date.now();

    RequestPrompt.update({"_id": toUpdateRequestPrompt._id }, { $set: updateWith }, function (err) {
        if (err) {
            var errMsg = `requestPromptController.updateRequestPrompt - RequestPrompt.find failed. Error: ${err}`
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        } else {

            RequestPrompt.findById(toUpdateRequestPrompt._id)
            .then((requestPrompt) => {
                if (requestPrompt == null) {
                    var errMsg = `requestPromptController.updateRequestPrompt - unable to find the updated RequestPrompt by id ${toUpdateRequestPrompt._id}. Error: ${err}`;
                    logger.error(errMsg);
                    res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
                } else {
                    logger.info(`requestPromptController.updateRequestPrompt - found updated requestPrompt by id ${toUpdateRequestPrompt._id}. About to send back http response with requestPrompt:\n ${requestPrompt}`);
                    res.status(200).json(requestPrompt);  // 200 - OK
                }
            })
            .catch((err) => {
                var errMsg = `requestPromptController.updateRequestPrompt - error finding the updated RequestPrompt by id ${toUpdateRequestPrompt._id}. Error: ${err}`;
                logger.error(errMsg);
                res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
            });

        }
    });

};



exports.getRequestPrompt = function (req, res) {
    logger.verbose('requestPromptController.getRequestPrompt begin');

    let siteCode = httpRequestHelper.getSite(req);
    let RequestPrompt = getRequestPromptType(siteCode);

    RequestPrompt.findById(req.params.id)
        .then((requestPrompt) => {
            if (requestPrompt == null) {
                var errMsg = `requestPromptController.getRequestPrompt - RequestPrompt.findById did not find a requestPrompt with id ${req.params.id}.`;
                logger.error(errMsg);
                res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
            } else {
                logger.info(`requestPromptController.getRequestPrompt - RequestPrompt.findById success. About to to send back http response with requestPrompt:\n ${requestPrompt}`);
                res.status(200).json(requestPrompt);  // 200 - OK
            }
        })
        .catch((err) => {
            var errMsg = `requestPromptController.getRequestPrompt - RequestPrompt.findById failed. Error: ${err}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        });

};



exports.deleteRequestPrompt = function (req, res) {
    logger.verbose('requestPromptController.deleteRequestPrompt begin');

    let siteCode = httpRequestHelper.getSite(req);
    let RequestPrompt = getRequestPromptType(siteCode);

    RequestPrompt.findByIdAndRemove(req.params.id)
    .then((requestPrompt) => {
        if (requestPrompt == null) {
            var errMsg = `requestPromptController.deleteRequestPrompt - Did not find the requestPrompt to be deleted by id ${req.params.id}.`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        } else {
            logger.info(`requestPromptController.deleteRequestPrompt - RequestPrompt.findByIdAndRemove ${req.params.id} success. Deleted requestPrompt called ${requestPrompt.name}`);
            res.status(204).send();  // 204 - NO CONTENT 
        }
    })
    .catch((err) => {
        var errMsg = `requestPromptController.deleteRequestPrompt - RequestPrompt.findByIdAndRemove ${req.params.id} failed. Error: ${err}`;
        logger.error(errMsg);
        res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
    });
};

