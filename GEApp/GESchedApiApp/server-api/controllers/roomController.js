'use strict';

const appRoot = require('app-root-path');
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings.

const httpRequestHelper = require(`${appRoot}/server-api/httpRequestHelper`);
const logger = require(`${appRoot}/server-api/logger`);
const getRoomType = require(`${appRoot}/server-api/models/roomModel`);


// GET Rooms
// Sample GET requests:
// http://localhost:9090/api/rooms
// http://localhost:9090/api/rooms?orderBy=seqNum:1

exports.getRooms = function (req, res) {
    logger.verbose('roomController.getRooms begin');

    let siteCode = httpRequestHelper.getSite(req);
    let Room = getRoomType(siteCode);

    var sortDirective = { "name": 1}; //default, order by name, ascending
    if (req.query.orderBy != null) {
        if (req.query.orderBy == 'seqNum:1') {
            sortDirective = { "seqNum": 1};  //ascending order
        } else if (req.query.orderBy == 'seqNum:-1') {
            sortDirective = { "seqNum": -1}; //descending order
        }
    }

    var filterDirective = {}; //default, no filering
    if (req.query.nameContains != null) {    
        const regExpression = new RegExp(`(${req.query.nameContains})`);
        filterDirective = { "name": regExpression};        
    }

    Room.find(filterDirective).sort(sortDirective)
        .then((rooms) => {
            logger.info(`roomController.getRooms - Room.find success. About to send back http response with ${rooms.length} rooms`);
            res.status(200).json(rooms);  // 200 - OK
        })
        .catch((err) => {
            var errMsg = `roomController.getRooms - Room.find failed. Error: ${err}`;
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        });
};


// POST (create) a new room.
exports.createRoom = function (req, res) {
    logger.verbose('roomController.createRoom begin');

    try {
        let siteCode = httpRequestHelper.getSite(req); 
        let Room = getRoomType(siteCode);
        var newRoom = new Room(req.body);

        var validationErr = newRoom.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`roomController.createRoom - got create new Room validation error: ${validationErr.errors[prop]}`);
            }

            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `roomController.createRoom - problem with creating a new Room. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    }

    newRoom.save()
        .then((room) => {
            logger.info(`roomController.createRoom - Room.save success. About to send back http response with room called ${room}`);
            res.status(201).json(room); // 201 - CREATED
        })
        .catch((err) => {
            var errMsg = `roomController.createRoom - Room.save failed. Error: ${err}`
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        });

};


// PUT (update) a room using its id.
exports.updateRoom = function (req, res) {
    logger.verbose('roomController.updateRoom begin');

    try {
        let siteCode = httpRequestHelper.getSite(req);
        var Room = getRoomType(siteCode);

        var toUpdateRoom = new Room(req.body);

        var validationErr = toUpdateRoom.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`roomController.updateRoom - the updated Room validation error: ${validationErr.errors[prop]}`);
            }

            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `roomController.updateRoom - problem with updating Room. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    };

    toUpdateRoom.updatedAt = Date.now();

    Room.update({"_id": toUpdateRoom._id }, { $set: toUpdateRoom }, function (err) {
        if (err) {
            var errMsg = `roomController.updateRoom - Room.find failed. Error: ${err}`
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        } else {

            Room.findById(toUpdateRoom._id)
            .then((room) => {
                if (room == null) {
                    var errMsg = `roomController.updateRoom - unable to find the updated Room by id ${toUpdateRoom._id}. Error: ${err}`;
                    logger.error(errMsg);
                    res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
                } else {
                    logger.info(`roomController.updateRoom - found updated room by id ${toUpdateRoom._id}. About to send back http response with room:\n ${room}`);
                    res.status(200).json(room);  // 200 - OK
                }
            })
            .catch((err) => {
                var errMsg = `roomController.updateRoom - error finding the updated Room by id ${toUpdateRoom._id}. Error: ${err}`;
                logger.error(errMsg);
                res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
            });

        }
    });

};


// GET a room by id.
exports.getRoom = function (req, res) {
    logger.verbose('roomController.getRoom begin');

    let siteCode = httpRequestHelper.getSite(req);
    let Room = getRoomType(siteCode);

    Room.findById(req.params.id)
        .then((room) => {
            if (room == null) {
                var errMsg = `roomController.getRoom - Room.findById did not find a room with id ${req.params.id}.`;
                logger.error(errMsg);
                res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
            } else {
                logger.info(`roomController.getRoom - Room.findById success. About to to send back http response with room:\n ${room}`);
                res.status(200).json(room);  // 200 - OK
            }
        })
        .catch((err) => {
            var errMsg = `roomController.getRoom - Room.findById failed. Error: ${err}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        });

};


// DELETE a room by id.
exports.deleteRoom = function (req, res) {
    logger.verbose('roomController.deleteRoom begin');

    let siteCode = httpRequestHelper.getSite(req);
    let Room = getRoomType(siteCode);

    Room.findByIdAndRemove(req.params.id)
    .then((room) => {
        if (room == null) {
            var errMsg = `roomController.deleteRoom - Did not find the room to be deleted by id ${req.params.id}.`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        } else {
            logger.info(`roomController.deleteRoom - Room.findByIdAndRemove ${req.params.id} success. Deleted room called ${room.name}`);
            res.status(204).send();  // 204 - NO CONTENT 
        }
    })
    .catch((err) => {
        var errMsg = `roomController.deleteRoom - Room.findByIdAndRemove ${req.params.id} failed. Error: ${err}`;
        logger.error(errMsg);
        res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
    });
};


//create distinct capabilities
exports.getDistinct = function (req, res) { // shouldn't this be done at the end of every operation, so the capabilities are updated?
    logger.verbose('roomController.getDistinct begin');

    let siteCode = httpRequestHelper.getSite(req);
    let Room = getRoomType(siteCode);

    //will continue work
    if (req.query.orderBy != null) {
        if(req.query.orderBy == "capability"){

            Room.rooms.distinct("capability")
            .then((list) => {
                if (list == null) {
                    var errMsg = `roomController.getDistinct - Room.rooms.distinct did not find any capabilities.`;
                    logger.error(errMsg);
                    res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
                } else {
                    logger.info(`roomController.getDistinct - Room.fingetDistinctdById success. About to to send back http response with list:\n ${list}`);
                    res.status(200).json(list);  // 200 - OK
                }
            })
            .catch((err) => {
                var errMsg = `roomController.getDistinct - Room.rooms.distinct failed. Error: ${err}`;
                logger.error(errMsg);
                res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
            });

        }
        if(req.query.orderBy == "sizeType"){

        }
        if(req.query.orderBy == "building"){

        }

    }
    
};