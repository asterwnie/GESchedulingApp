'use strict';

const appRoot = require('app-root-path');
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings.

const httpRequestHelper = require(`${appRoot}/server-api/httpRequestHelper`);
const logger = require(`${appRoot}/server-api/logger`);
const getAppConfigType = require(`${appRoot}/server-api/models/appConfigModel`);


// GET AppConfigs
// Sample GET requests:
// http://localhost:9090/api/appConfigs
// http://localhost:9090/api/appConfigs?orderBy=seqNum:1

exports.getAppConfigs = async function (req, res) {
    logger.verbose('appConfigController.getAppConfigs begin');

    let siteCode = httpRequestHelper.getSite(req);
    
    await queryAppConfigs(siteCode, req.query.orderBy, req.query.typeContains, (result) => {
        if (result.success) {
            logger.info(`appConfigController.getAppConfigs - AppConfig.find success. About to send back http response with ${result.appConfigs.length} appConfigs`);
            res.status(200).json(result.appConfigs);
        } else {
            logger.error(`appConfigController.getAppConfigs failed. Error: ${result.errMsg}`);
            res.status(500).json({ error: result.errMsg });
        }
    });

    logger.verbose('appConfigController.getAppConfigs ends.');        
};


async function queryAppConfigs (siteCode, orderBy, typeContains, callback) {

    let AppConfig = getAppConfigType(siteCode);

    var sortDirective = {}; //default, no filtering
    if (orderBy != null) {
        if (orderBy == 'seqNum:1') {
            sortDirective = { "seqNum": 1};  //ascending order
        } else if (orderBy == 'seqNum:-1') {
            sortDirective = { "seqNum": -1}; //descending order
        }
    }

    var filterDirective = {}; //default, no filering
    if (typeContains != null) {    
        const regExpression = new RegExp(`(${typeContains})`);
        filterDirective = { "type": regExpression };        
    }

    await AppConfig.find(filterDirective).sort(sortDirective)
        .then((appConfigs) => {
            logger.info(`appConfigController.queryAppConfigs - AppConfig.find success. Got back ${appConfigs.length} appConfigs`);           
            callback({ success: true, appConfigs: appConfigs });
        })
        .catch((err) => {
            var errMsg = `appConfigController.queryAppConfigs - AppConfig.find failed. Error: ${err}`;
            logger.error(errMsg);
            callback({ success: false, errMsg: errMsg });
        });
}


exports.queryAppConfigs = queryAppConfigs;


// POST (create) a new appConfig.
exports.createAppConfig = function (req, res) {
    logger.verbose('appConfigController.createAppConfig begin');

    try {
        let siteCode = httpRequestHelper.getSite(req); 
        let AppConfig = getAppConfigType(siteCode);
        var newAppConfig = new AppConfig(req.body);

        var validationErr = newAppConfig.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`appConfigController.createAppConfig - got create new AppConfig validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `createAppConfig failed on validation. Error: ${validationErr}`;
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `appConfigController.createAppConfig - problem with creating a new AppConfig. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    }

    newAppConfig.save()
        .then((appConfig) => {
            logger.info(`appConfigController.createAppConfig - AppConfig.save success. About to send back http response with appConfig called ${appConfig}`);
            res.status(201).json(appConfig); // 201 - CREATED
        })
        .catch((err) => {
            var errMsg = `appConfigController.createAppConfig - AppConfig.save failed. Error: ${err}`
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        });

};


// PUT (update) a appConfig using it's id.
exports.updateAppConfig = function (req, res) {
    logger.verbose('appConfigController.updateAppConfig begin');

    try {
        let siteCode = httpRequestHelper.getSite(req);
        var AppConfig = getAppConfigType(siteCode);

        var toUpdateAppConfig = new AppConfig(req.body);

        var validationErr = toUpdateAppConfig.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`appConfigController.updateAppConfig - the updated AppConfig validation error: ${validationErr.errors[prop]}`);
            }

            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `appConfigController.updateAppConfig - problem with updating AppConfig. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    };

    toUpdateAppConfig.updatedAt = Date.now();

    AppConfig.update({"_id": toUpdateAppConfig._id }, { $set: toUpdateAppConfig }, function (err) {
        if (err) {
            var errMsg = `appConfigController.updateAppConfig - AppConfig.find failed. Error: ${err}`
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        } else {

            AppConfig.findById(toUpdateAppConfig._id)
            .then((appConfig) => {
                if (appConfig == null) {
                    var errMsg = `appConfigController.updateAppConfig - unable to find the updated AppConfig by id ${toUpdateAppConfig._id}. Error: ${err}`;
                    logger.error(errMsg);
                    res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
                } else {
                    logger.info(`appConfigController.updateAppConfig - found updated appConfig by id ${toUpdateAppConfig._id}. About to send back http response with appConfig:\n ${appConfig}`);
                    res.status(200).json(appConfig);  // 200 - OK
                }
            })
            .catch((err) => {
                var errMsg = `appConfigController.updateAppConfig - error finding the updated AppConfig by id ${toUpdateAppConfig._id}. Error: ${err}`;
                logger.error(errMsg);
                res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
            });

        }
    });

};


// GET a appConfig by id.
exports.getAppConfig = function (req, res) {
    logger.verbose('appConfigController.getAppConfig begin');

    let siteCode = httpRequestHelper.getSite(req);
    let AppConfig = getAppConfigType(siteCode);

    AppConfig.findById(req.params.id)
        .then((appConfig) => {
            if (appConfig == null) {
                var errMsg = `appConfigController.getAppConfig - AppConfig.findById did not find a appConfig with id ${req.params.id}.`;
                logger.error(errMsg);
                res.status(404).json({ error: errMsg }); // 404 - Not Found
            } else {
                logger.info(`appConfigController.getAppConfig - AppConfig.findById success. About to to send back http response with appConfig:\n ${appConfig}`);
                res.status(200).json(appConfig);  // 200 - OK
            }
        })
        .catch((err) => {
            var errMsg = `appConfigController.getAppConfig - AppConfig.findById failed. Error: ${err}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        });

};


// DELETE a appConfig by id.
exports.deleteAppConfig = function (req, res) {
    logger.verbose('appConfigController.deleteAppConfig begin');

    let siteCode = httpRequestHelper.getSite(req);
    let AppConfig = getAppConfigType(siteCode);

    AppConfig.findByIdAndRemove(req.params.id)
    .then((appConfig) => {
        if (appConfig == null) {
            var errMsg = `appConfigController.deleteAppConfig - Did not find the appConfig to be deleted by id ${req.params.id}.`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        } else {
            logger.info(`appConfigController.deleteAppConfig - AppConfig.findByIdAndRemove ${req.params.id} success. Deleted appConfig called ${appConfig.type}`);
            res.status(204).send();  // 204 - NO CONTENT 
        }
    })
    .catch((err) => {
        var errMsg = `appConfigController.deleteAppConfig - AppConfig.findByIdAndRemove ${req.params.id} failed. Error: ${err}`;
        logger.error(errMsg);
        res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
    });
};