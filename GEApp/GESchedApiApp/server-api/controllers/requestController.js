'use strict';

const appRoot = require('app-root-path');
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings.

const httpRequestHelper = require(`${appRoot}/server-api/httpRequestHelper`);
const logger = require(`${appRoot}/server-api/logger`);
const getRequestType = require(`${appRoot}/server-api/models/requestModel`);



exports.getRequests = async function (req, res) {
    logger.verbose('requestController.getRequests begin');

    let siteCode = httpRequestHelper.getSite(req);

    await queryRequests(siteCode, req, (result) => {
        if (result.success) {
            logger.info(`requestController.getRequests - Request.find success. About to send back http response with ${result.requests.length} requests`);
            res.status(200).json(result.requests);
        } else {
            logger.error(`requestController.getRequests failed. Error: ${result.errMsg}`);
            res.status(500).json({ error: result.errMsg });
        }
    });

    logger.verbose('requestController.getRequests ends.');    

};

async function queryRequests (siteCode, req, callback) {

    let Request = getRequestType(siteCode);

    var sortDirective = { "updatedAt": -1}; //default, order by createdAt, ascending

    var filterDirective = {}; //default, no filering
    if (req.query.locationContains != null) {    
        const locationName = new RegExp(`(${req.query.locationContains})`, "i");
        filterDirective = {"locationOfEvent.name": locationName};
    }
    if (req.query.requestNameContains != null) {    
        const regExpression = new RegExp(`(${req.query.requestNameContains})`, "i");
        filterDirective.eventTitle = regExpression;      
    }
    if (req.query.requesterEmailContains != null) {    
        const regExpression = new RegExp(`(${req.query.requesterEmailContains})`, "i");
        filterDirective.eventGEContactPersonEmail = regExpression;       
    }
    if (req.query.requesterNameContains != null) {    
        const regExpression = new RegExp(`(${req.query.requesterNameContains})`, "i");
        filterDirective.eventGEContactPersonName = regExpression;       
    }
    if (req.query.processingStatusContains != null) {    
        const regExpression = new RegExp(`(${req.query.processingStatusContains})`);
        filterDirective.processingStatus = regExpression;        
    }
    if (req.query.requestIdContains != null) {     
        const regExpression = new RegExp(`(${req.query.requestIdContains})`);
        filterDirective._id = regExpression;         
    }

    var selectedFields = {};
    if (req.query.summaryFieldsOnly != null && req.query.summaryFieldsOnly == "true") {
        selectedFields = { 
            processingStatus: 1,
            processingStatusLabel: 1,
            processingStatusMessage: 1,
            eventTitle: 1,
            eventSchedule: 1,
            eventGEContactPersonName: 1,
            eventGEContactPersonEmail: 1,
            eventDateTimeData: 1,
            locationOfEvent: 1,
            updatedAt: 1,
            userCanEdit: 1,
            adminCanEdit: 1
        };
    }

    var numOfItemsToSkip = 0;
    var numOfItemsPerPage = 100000;

    if (req.query.numOfItemsToSkip != null) {    
        numOfItemsToSkip = parseInt(req.query.numOfItemsToSkip);      
    }
    if (req.query.numOfItemsPerPage != null) {    
        numOfItemsPerPage = parseInt(req.query.numOfItemsPerPage);         
    }

    await Request.find(filterDirective).sort(sortDirective).select(selectedFields).limit(numOfItemsPerPage).skip(numOfItemsToSkip)
        .then((requests) => {
            logger.info(`requestController.getRequests - Request.find success. About to send back http response with ${requests.length} requests`);
            callback({ success: true, requests: requests });
        })
        .catch((err) => {
            var errMsg = `requestController.getRequests - Request.find failed. Error: ${err}`;
            logger.error(errMsg);
            callback({ success: false, errMsg: errMsg });
        });
}


exports.getRequestsCount = function (req, res) {
    logger.verbose('requestController.getRequestsCount begin');

    let siteCode = httpRequestHelper.getSite(req); 
    let Request = getRequestType(siteCode);

    var filterDirective = {}; //default, no filering
    if (req.query.locationContains != null) {    
        const locationName = new RegExp(`(${req.query.locationContains})`, "i");
        filterDirective = {"locationOfEvent.name": locationName};
    }
    if (req.query.requestNameContains != null) {    
        const regExpression = new RegExp(`(${req.query.requestNameContains})`, "i");
        filterDirective.eventTitle = regExpression;      
    }
    if (req.query.requesterEmailContains != null) {    
        const regExpression = new RegExp(`(${req.query.requesterEmailContains})`, "i");
        filterDirective.eventGEContactPersonEmail = regExpression;       
    }
    if (req.query.requesterNameContains != null) {    
        const regExpression = new RegExp(`(${req.query.requesterNameContains})`, "i");
        filterDirective.eventGEContactPersonName = regExpression;       
    }
    if (req.query.processingStatusContains != null) {    
        const regExpression = new RegExp(`(${req.query.processingStatusContains})`);
        filterDirective.processingStatus = regExpression;        
    }

    var numOfPages = 0;
    var numOfItemsPerPage = 0;
    if (req.query.numOfItemsPerPage != null) {    
        numOfItemsPerPage = parseInt(req.query.numOfItemsPerPage);         
    }  

    Request.count(filterDirective)
    .then((count) => {
        logger.info(`requestController.getRequestsCount success. About to send back http response with count ${count}`);
 
        if (numOfItemsPerPage > 0 && count > 0) {
            numOfPages = count / numOfItemsPerPage; 
            // Drop decimal - Use bitwise OR with int 0 in front, which drops all the values after the decimal.
            var droppedDecimal = 0 | numOfPages; 
            if (numOfPages > droppedDecimal) {
                numOfPages = droppedDecimal + 1; // Round up            
            } else {
                numOfPages = droppedDecimal;
            }
        }
 
        if (numOfPages > 0) {
            res.status(200).json({ count: count, numOfPages: numOfPages }); // 200 - Sucess
        } else {
            res.status(200).json({ count: count }); // 200 - Sucess
        }
    })
    .catch((err) => {
        var errMsg = `requestController.getRequestsCount failed. Error: ${err}`
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
    });

}

exports.createRequest = function (req, res) {
    logger.verbose('requestController.createRequest begin');

    try {
        let siteCode = httpRequestHelper.getSite(req); 
        let Request = getRequestType(siteCode);
        var newRequest = new Request(req.body);

        var validationErr = newRequest.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`requestController.createRequest - create new Request validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `createRequest failed on validation. Error: ${validationErr}`;
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

        let siteCode = httpRequestHelper.getSite(req);
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

    toUpdateRequest.updatedAt = Date.now();

    Request.update({"_id": toUpdateRequest._id }, { $set: toUpdateRequest }, function (err) {
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

    let siteCode = httpRequestHelper.getSite(req);
    let Request = getRequestType(siteCode);

    Request.findById(req.params.id)
        .then((request) => {
            if (request == null) {
                var errMsg = `requestController.getRequest - Request.findById did not find a request with id ${req.params.id}.`;
                logger.error(errMsg);
                res.status(404).json({ error: errMsg }); // 404 - Not found 
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

    let siteCode = httpRequestHelper.getSite(req);
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


exports.deleteMultipleRequests = function (req, res) {
    logger.verbose('requestController.deleteMultipleRequests begin');

    let siteCode = httpRequestHelper.getSite(req);
    let Request = getRequestType(siteCode);
   
    let filterDirective = {}
    var hasFilter = false;

    try {
        let daysOld = parseInt(req.query.daysOld);
        let dateForFilter = new Date(Date.now() - (daysOld * 24*60*60*1000));
        filterDirective.updatedAt = {$lt: dateForFilter};
        hasFilter = true;
    } catch (err) {}

    let eventName = req.query.requestNameContains;
    if (eventName != null && eventName != "") {
        const regExpression = new RegExp(`(${eventName})`, "i");
        filterDirective.eventTitle = regExpression;
        hasFilter = true;
    }

    let processingStatus = req.query.processingStatusContains;
    if (processingStatus != null && processingStatus != "") {
        filterDirective.processingStatus = new RegExp(`(${processingStatus})`, "i");;
        hasFilter = true;
    }

    let requesterEmail = req.query.requesterEmailContains;
    if (requesterEmail != null && requesterEmail != "") {
        const regExpression = new RegExp(`(${requesterEmail})`, "i");
        filterDirective.eventGEContactPersonEmail = regExpression;
        hasFilter = true;
    }

    if (!hasFilter) {
        var errMsg = `requestController.deleteMultipleRequests error. Error: missing filter(s).`;
        logger.error(errMsg);
        res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        return;
    }

    Request.remove(filterDirective)
    .then((status) => {
        if (status.ok == 1) {
            res.status(200).json({ deletedCount: status.n });
        } else {
            var errMsg = "requestController.deleteMultipleRequests - Remove requests failed.";
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        }
    })
    .catch((err) => {
        var errMsg = `requestController.deleteMultipleRequests - Remove requests failed. Error: ${err}`;
        logger.error(errMsg);
        res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
    });
};