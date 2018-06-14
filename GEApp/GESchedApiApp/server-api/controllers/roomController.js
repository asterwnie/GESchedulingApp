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

        if (req.query.orderBy == 'seatCapacity:1') {
            sortDirective = { "seatCapacity": 1};  //ascending order
        } else if (req.query.orderBy == 'seatCapacity:-1') {
            sortDirective = { "seatCapacity": -1}; //descending order
        }
    }

    var filterDirective = {}; //default is no filering
    if (req.query.nameContains != null) {    
        const regExpression = new RegExp(`(${req.query.nameContains})`);
        filterDirective.name = regExpression;        
    }

    if (req.query.buildingContains != null) {    
        const regExpression = new RegExp(`(${req.query.buildingContains})`);
        filterDirective.building = regExpression;        
    }

    if (req.query.sizeTypeContains != null) {    
        const regExpression = new RegExp(`(${req.query.sizeTypeContains})`);
        filterDirective.sizeType = regExpression;        
    }

    //modify for multiple
    if (req.query.hasTheseCapabilities != null) {    
        const regExpression = new RegExp(`(${req.query.hasTheseCapabilities})`);
        filterDirective.capabilities = regExpression;        
    }

    if (req.query.seatingCapacityGreaterOrEqual != null) {    
        const strVal = req.query.seatingCapacityGreaterOrEqual;
        let requestedSeatingCapacity = parseInt(strVal);
        
        filterDirective.seatingCapacity = {$gte: requestedSeatingCapacity};        
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


//create distinct lists
exports.getCapabilities = async function (req, res) {
    logger.verbose('roomController.getCapabilities begin');

    let siteCode = httpRequestHelper.getSite(req);
   
    await queryRoomCapabilities(siteCode, (result) => {
        if (result.success) {
            logger.info(`roomController.getCapabilities - Rooms.distinct success. About to send back http response with ${result.capabilities.length} capabilities`);
            res.status(200).json(result.capabilities);
        } else {
            logger.error(`roomController.getCapabilities failed. Error: ${result.errMsg}`);
            res.status(500).json({ error: result.errMsg });
        }
        });
            
    
};

async function queryRoomCapabilities(siteCode, callback) {

    let Room = getRoomType(siteCode);

    // note: .sort() does not work with distinct
    // make your own manual sort
    await Room.distinct("capabilities") //Room.find().distinct() may work/be needed instead
    .then((capabilities) => {
        if (capabilities == null) {
            var errMsg = `roomController.getCapabilities - Room.distinct did not find any capabilities.`;
            logger.error(errMsg);
            callback({ success: false, errMsg: errMsg });
        } else {
            logger.info(`roomController.getCapabilities - Room.distinct success. About to to send back http response with capabilities:\n ${capabilities}`);
            callback({ success: true, capabilities: capabilities.sort() });
        }
    })
    .catch((err) => {
        var errMsg = `roomController.getCapabilities - Room.distinct failed. Error: ${err}`;
        logger.error(errMsg);
        callback({ success: false, errMsg: errMsg });
    });
}

exports.queryRoomCapabilities = queryRoomCapabilities;



exports.getRoomSizes = function (req, res) {
    logger.verbose('roomController.getRoomSizes begin');

    let siteCode = httpRequestHelper.getSite(req);
    let Room = getRoomType(siteCode);

            Room.distinct("sizeType")
            .then((list) => {
                if (list == null) {
                    var errMsg = `roomController.getRoomSizes - Room.distinct did not find any sizeTypes.`;
                    logger.error(errMsg);
                    res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
                } else {
                    logger.info(`roomController.getRoomSizes - Room.distinct success. About to to send back http response with list:\n ${list}`);
                    res.status(200).json(list);  // 200 - OK
                }
            })
            .catch((err) => {
                var errMsg = `roomController.getRoomSizes - Room.distinct failed. Error: ${err}`;
                logger.error(errMsg);
                res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
            });
    

            /*
            await queryHotels(siteCode, req.query.orderBy, req.query.nameContains, (result) => {
                if (result.success) {
                    logger.info(`hotelController.getHotels - Hotel.find success. About to send back http response with ${result.hotels.length} hotels`);
                    res.status(200).json(result.hotels);
                } else {
                    logger.error(`hotelController.getHotels failed. Error: ${result.errMsg}`);
                    res.status(500).json({ error: result.errMsg });
                }
             });
            */
};




exports.getRoomBuildings = function (req, res) {
    logger.verbose('roomController.getRoomBuildings begin');

    let siteCode = httpRequestHelper.getSite(req);
    let Room = getRoomType(siteCode);

            Room.distinct("building")
            .then((list) => {
                if (list == null) {
                    var errMsg = `roomController.getRoomBuildings - Room.distinct did not find any room buildings.`;
                    logger.error(errMsg);
                    res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
                } else {
                    logger.info(`roomController.getRoomBuildings - Room.distinct success. About to to send back http response with list:\n ${list}`);
                    res.status(200).json(list);  // 200 - OK
                }
            })
            .catch((err) => {
                var errMsg = `roomController.getRoomBuildings - Room.distinct failed. Error: ${err}`;
                logger.error(errMsg);
                res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
            });
    
};