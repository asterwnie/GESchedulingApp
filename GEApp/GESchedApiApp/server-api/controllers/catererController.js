'use strict';
///WILL BE UPDATED SOON FOR CATERERING

const appRoot = require('app-root-path');
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings.

const httpRequestHelper = require(`${appRoot}/server-api/httpRequestHelper`);
const logger = require(`${appRoot}/server-api/logger`);
const getCatererType = require(`${appRoot}/server-api/models/hotelModel`);


// GET Caterers
// Sample GET requests:
// http://localhost:9090/api/hotels
// http://localhost:9090/api/hotels?orderBy=seqNum:1

exports.getCaterers = async function (req, res) {
    logger.verbose('catererController.getCaterers begin');

    let siteCode = httpRequestHelper.getSite(req);
    
    await queryCaterers(siteCode, req.query.orderBy, req.query.nameContains, (result) => {
        if (result.success) {
            logger.info(`catererController.getCaterers - Caterer.find success. About to send back http response with ${result.caterers.length} caterers`);
            res.status(200).json(result.hotels);
        } else {
            logger.error(`catererController.getCaterers failed. Error: ${result.errMsg}`);
            res.status(500).json({ error: result.errMsg });
        }
    });

    logger.verbose('catererController.getCaterers ends.');        
};


async function queryCaterers (siteCode, orderBy, nameContains, callback) {

    let Caterer = getCatererType(siteCode);

    var sortDirective = { "name": 1}; //default, order by name, ascending
    if (orderBy != null) {
        if (orderBy == 'seqNum:1') {
            sortDirective = { "seqNum": 1};  //ascending order
        } else if (orderBy == 'seqNum:-1') {
            sortDirective = { "seqNum": -1}; //descending order
        }
    }

    var filterDirective = {}; //default, no filering
    if (nameContains != null) {    
        const regExpression = new RegExp(`(${nameContains})`);
        filterDirective = { "name": regExpression };        
    }

    await Caterer.find(filterDirective).sort(sortDirective)
        .then((hotels) => {
            logger.info(`catererController.queryCaterers - Caterer.find success. Got back ${hotels.length} hotels`);           
            callback({ success: true, hotels: hotels });
        })
        .catch((err) => {
            var errMsg = `hotelController.queryCaterers - Caterer.find failed. Error: ${err}`;
            logger.error(errMsg);
            callback({ success: false, errMsg: errMsg });
        });
}


exports.queryCaterers = queryCaterers;


// POST (create) a new hotel.
exports.createCaterer = function (req, res) {
    logger.verbose('hotelController.createCaterer begin');

    try {
        let siteCode = httpRequestHelper.getSite(req); 
        let Caterer = getCatererType(siteCode);
        var newCaterer = new Caterer (req.body);

        var validationErr = newCaterer .validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`hotelController.createCaterer  - got create new Caterer  validation error: ${validationErr.errors[prop]}`);
            }

            var errMsg = `createCaterer  failed on validation. Error: ${validationErr}`;
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `hotelController.createCaterer  - problem with creating a new Caterer . Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    }

    newCaterer .save()
        .then((hotel) => {
            logger.info(`hotelController.createCaterer  - Caterer .save success. About to send back http response with hotel called ${hotel}`);
            res.status(201).json(hotel); // 201 - CREATED
        })
        .catch((err) => {
            var errMsg = `hotelController.createCaterer  - Caterer .save failed. Error: ${err}`
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        });

};


// PUT (update) a hotel using it's id.
exports.updateCaterer  = function (req, res) {
    logger.verbose('hotelController.updateCaterer  begin');

    try {
        let siteCode = httpRequestHelper.getSite(req);
        var Caterer  = getCatererType(siteCode);

        var toUpdateCaterer  = new Caterer (req.body);

        var validationErr = toUpdateCaterer .validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`hotelController.updateCaterer  - the updated Caterer  validation error: ${validationErr.errors[prop]}`);
            }

            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `hotelController.updateCaterer  - problem with updating Caterer . Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    };

    toUpdateCaterer .updatedAt = Date.now();

    Caterer .update({"_id": toUpdateCaterer ._id }, { $set: toUpdateCaterer  }, function (err) {
        if (err) {
            var errMsg = `hotelController.updateCaterer  - Caterer .find failed. Error: ${err}`
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        } else {

            Caterer .findById(toUpdateCaterer ._id)
            .then((hotel) => {
                if (hotel == null) {
                    var errMsg = `hotelController.updateCaterer  - unable to find the updated Caterer  by id ${toUpdateCaterer ._id}. Error: ${err}`;
                    logger.error(errMsg);
                    res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
                } else {
                    logger.info(`hotelController.updateCaterer  - found updated hotel by id ${toUpdateCaterer ._id}. About to send back http response with hotel:\n ${hotel}`);
                    res.status(200).json(hotel);  // 200 - OK
                }
            })
            .catch((err) => {
                var errMsg = `hotelController.updateCaterer  - error finding the updated Caterer  by id ${toUpdateCaterer ._id}. Error: ${err}`;
                logger.error(errMsg);
                res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
            });

        }
    });

};


// GET a hotel by id.
exports.getCaterer  = function (req, res) {
    logger.verbose('hotelController.getCaterer  begin');

    let siteCode = httpRequestHelper.getSite(req);
    let Caterer  = getCatererType(siteCode);

    Caterer .findById(req.params.id)
        .then((hotel) => {
            if (hotel == null) {
                var errMsg = `hotelController.getCaterer  - Caterer .findById did not find a hotel with id ${req.params.id}.`;
                logger.error(errMsg);
                res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
            } else {
                logger.info(`hotelController.getCaterer  - Caterer .findById success. About to to send back http response with hotel:\n ${hotel}`);
                res.status(200).json(hotel);  // 200 - OK
            }
        })
        .catch((err) => {
            var errMsg = `hotelController.getCaterer  - Caterer .findById failed. Error: ${err}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        });

};


// DELETE a hotel by id.
exports.deleteCaterer  = function (req, res) {
    logger.verbose('hotelController.deleteCaterer  begin');

    let siteCode = httpRequestHelper.getSite(req);
    let Caterer  = getCatererType(siteCode);

    Caterer .findByIdAndRemove(req.params.id)
    .then((hotel) => {
        if (hotel == null) {
            var errMsg = `hotelController.deleteCaterer  - Did not find the hotel to be deleted by id ${req.params.id}.`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        } else {
            logger.info(`hotelController.deleteCaterer  - Caterer .findByIdAndRemove ${req.params.id} success. Deleted hotel called ${hotel.name}`);
            res.status(204).send();  // 204 - NO CONTENT 
        }
    })
    .catch((err) => {
        var errMsg = `hotelController.deleteCaterer  - Caterer .findByIdAndRemove ${req.params.id} failed. Error: ${err}`;
        logger.error(errMsg);
        res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
    });
};