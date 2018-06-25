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

exports.getRooms = async function (req, res) {
    logger.verbose('roomController.getRooms begin');

    let siteCode = httpRequestHelper.getSite(req);

    await queryRooms(siteCode, req.query, (result) => {
        if (result.success) {
            logger.info(`roomController.getRooms - Room.find success. About to send back http response with ${result.rooms.length} rooms`);
            res.status(200).json(result.rooms);
        } else {
            logger.error(`roomController.getRooms failed. Error: ${result.errMsg}`);
            res.status(500).json({ error: result.errMsg });
        }
    });

};

async function queryRooms (siteCode, query, callback) {

    const queryAsJSON = JSON.stringify(query);
    logger.info(`roomController.getRooms - passed in query:  ${queryAsJSON}`);

    let Room = getRoomType(siteCode);

    var sortDirective = { "name": 1}; //default, order by name, ascending
    if (query.orderBy != null) {
        if (query.orderBy == 'seqNum:1') {
            sortDirective = { "seqNum": 1};  //ascending order
        } else if (query.orderBy == 'seqNum:-1') {
            sortDirective = { "seqNum": -1}; //descending order
        }

        if (query.orderBy == 'seatCapacity:1') {
            sortDirective = { "seatCapacity": 1};  //ascending order
        } else if (query.orderBy == 'seatCapacity:-1') {
            sortDirective = { "seatCapacity": -1}; //descending order
        }
    }

    var filterDirective = {}; //default is no filering
    if (query.nameContains != null) {    
        const regExpression = new RegExp(`(${query.nameContains})`);
        filterDirective.name = regExpression;        
    }

    if (query.buildingContains != null) {    
        const regExpression = new RegExp(`(${query.buildingContains})`);
        filterDirective.building = regExpression;        
    }

    if (query.sizeTypeContains != null) {    
        const regExpression = new RegExp(`(${query.sizeTypeContains})`);
        filterDirective.sizeType = regExpression;        
    }

    if (query.hasTheseCapabilities != null) {    
        var capabilitiesToMatch = query.hasTheseCapabilities.split('|');
        var matchTheseAnds = [];
        capabilitiesToMatch.forEach((capability) => {           
            matchTheseAnds.push(capability);
        });
        filterDirective.capabilities = { $all: matchTheseAnds }
    }

    if (query.seatingCapacityGreaterOrEqual != null) {    
        const strVal = query.seatingCapacityGreaterOrEqual;
        let requestedSeatingCapacity = parseInt(strVal);        
        filterDirective.seatingCapacity = {$gte: requestedSeatingCapacity};        
    }

    await Room.find(filterDirective).sort(sortDirective)
        .then((rooms) => {
            logger.info(`roomController.getRooms - Room.find success. About to send back http response with ${rooms.length} rooms`);
            callback({ success: true, rooms: rooms });
        })
        .catch((err) => {
            var errMsg = `roomController.getRooms - Room.find failed. Error: ${err}`;
            logger.error(errMsg);
            callback({ success: false, errMsg: errMsg });
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
            var errMsg = `createRoom failed on validation. Error: ${validationErr}`;
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


//create distinct capabiltiy list
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

    await Room.distinct("capabilities")
    .then((capabilities) => {
        if (capabilities == null) {
            var errMsg = `roomController.queryRoomCapabilities - Room.distinct did not find any capabilities.`;
            logger.error(errMsg);
            callback({ success: false, errMsg: errMsg });
        } else {
            logger.info(`roomController.queryRoomCapabilities - Room.distinct success. About to to send back http response with capabilities:\n ${capabilities}`);
            callback({ success: true, capabilities: capabilities.sort() });
        }
    })
    .catch((err) => {
        var errMsg = `roomController.queryRoomCapabilities - Room.distinct failed. Error: ${err}`;
        logger.error(errMsg);
        callback({ success: false, errMsg: errMsg });
    });
}

exports.queryRoomCapabilities = queryRoomCapabilities;



//create distinct sizetype list
exports.getSizeTypes = async function (req, res) {
    logger.verbose('roomController.getSizeTypes begin');

    let siteCode = httpRequestHelper.getSite(req);
   
    await queryRoomSizeTypes(siteCode, (result) => {
        if (result.success) {
            logger.info(`roomController.getSizeTypes - Rooms.distinct success. About to send back http response with ${result.sizeTypes.length} sizeTypes`);
            res.status(200).json(result.sizeTypes);
        } else {
            logger.error(`roomController.getSizeTypes failed. Error: ${result.errMsg}`);
            res.status(500).json({ error: result.errMsg });
        }
        });
            
    
};

async function queryRoomSizeTypes(siteCode, callback) {

    let Room = getRoomType(siteCode);

    await Room.distinct("sizeType")
    .then((sizeTypes) => {
        if (sizeTypes == null) {
            var errMsg = `roomController.queryRoomSizeTypes - Room.distinct did not find any sizeTypes.`;
            logger.error(errMsg);
            callback({ success: false, errMsg: errMsg });
        } else {
            logger.info(`roomController.queryRoomSizeTypes - Room.distinct success. About to to send back http response with sizeTypes:\n ${sizeTypes}`);
            callback({ success: true, sizeTypes: sizeTypes.sort() });
        }
    })
    .catch((err) => {
        var errMsg = `roomController.queryRoomSizeTypes - Room.distinct failed. Error: ${err}`;
        logger.error(errMsg);
        callback({ success: false, errMsg: errMsg });
    });
}

exports.queryRoomSizeTypes = queryRoomSizeTypes;



//create distinct building list
exports.getBuildings = async function (req, res) {
    logger.verbose('roomController.getBuildings begin');

    let siteCode = httpRequestHelper.getSite(req);
   
    await queryBuildings(siteCode, (result) => {
        if (result.success) {
            logger.info(`roomController.getBuildings - Rooms.distinct success. About to send back http response with ${result.buildings.length} buildings`);
            res.status(200).json(result.buildings);
        } else {
            logger.error(`roomController.getBuildings failed. Error: ${result.errMsg}`);
            res.status(500).json({ error: result.errMsg });
        }
        });
            
    
};

async function queryBuildings(siteCode, callback) {

    let Room = getRoomType(siteCode);

    await Room.distinct("building")
    .then((buildings) => {
        if (buildings == null) {
            var errMsg = `roomController.queryBuildings - Room.distinct did not find any buildings.`;
            logger.error(errMsg);
            callback({ success: false, errMsg: errMsg });
        } else {
            logger.info(`roomController.queryBuildings - Room.distinct success. About to to send back http response with buildings:\n ${buildings}`);
            callback({ success: true, buildings: buildings.sort() });
        }
    })
    .catch((err) => {
        var errMsg = `roomController.queryBuildings - Room.distinct failed. Error: ${err}`;
        logger.error(errMsg);
        callback({ success: false, errMsg: errMsg });
    });
}

exports.queryBuildings = queryBuildings;