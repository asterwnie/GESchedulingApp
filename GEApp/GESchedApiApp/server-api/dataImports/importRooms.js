//currently under revision for rooms

'use strict';

// Import rooms to the database.

const fs = require('fs'); // File system.
const appRoot = require('app-root-path'); 
const mongoose = require('mongoose'); // Helper libray for MongoDB. http://mongoosejs.com/ 
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings server.config.js
const logger = require(`${appRoot}/server-api/logger`); // Create logging helper
const getRoomType = require(`${appRoot}/server-api/models/roomModel`);

mongoose.Promise = global.Promise;

const args = process.argv; 
var siteCode = appConfig.defaultSite; // The current default in HLS-MA in server.config.js

// if a site code is passed in on the command-line then use it. For example:
// node ./server-api/dataImports/importRooms.js HLS-MA
// Note: currently in VS Code debug mode you have to rely on using the appConfig.defaultSite setting.
if (args.length == 3 && args[2] != null) { siteCode = args[2]; }

const fileName = `rooms-${siteCode}.txt`;

let Room = getRoomType(siteCode);

var totalNumOfRooms = 0;
var totalNumOfRoomsCreated = 0;

const delyInSecs = 3;
const timer = setInterval(() => doRoomImport(), delyInSecs * 1000); // Ensures db connection is established in getRoomType since it's an async operation.



function doRoomImport() {

    try {
        clearInterval(timer);

        var fileData = fs.readFileSync(`./server-api/dataImports/dataFiles/${fileName}`).toString()
        
        var result = extractRoomItems(fileData);
        if (result.success) {
            logger.info(`Total number of rooms parsed: ${result.rooms.length}`);

            if (result.rooms.length == 0) {
                logger.info('No room got extracted from the data file!');
                process.exit();
            }
            logger.info(result.rooms);
            
            result.rooms.forEach((room) => createRoom(room)); //populate rooms

           
        } else {
            process.exit();
        }

    } catch (err) {
        logger.error(`ADMIN: Error importing the Room collection into the database! Error: ${err}`);
        mongoose.disconnect();
        process.exit();
    }
}


function extractRoomItems(fileData) {
    var result = null;
    var roomItems = [];
    var newRoom = null;
    var errorEncountered = false;
    var currentItemSeq = 0;

    fileData.split(/\r?\n/).every((line) => { // for every line break

        var directive = null;
        var lineProcessed = false;

        logger.info(`Processing line: ${line}`);

        directive = "--Room.Name:";
        if (line.search(directive) > -1) {            
            // Complete and store the previous pending room object if exist.
            if (newRoom != null) {
                var success = ValidateAndCollectRoom(newRoom, roomItems);
                if (!success) {
                    errorEncountered = true;
                    return false; // Return false to stop additional line processing.
                }
            }

            var roomName = line.replace(directive, "").trim();
            // Start a new room instance to gather its properties.
            if (roomName != "") {

                currentItemSeq += 1;

                newRoom = { 
                    seqNum: currentItemSeq,
                    name: roomName 
                }
            } else {
                logger.error("ERROR: The room name is required!");
                errorEncountered = true;
                return false; // Return false to stop additional line processing.
            }

            lineProcessed = true;
        }


        directive = "--Room.SizeType:";
        if (!lineProcessed && line.search(directive) > -1) {
            var roomSizeType = line.replace(directive, "").trim();
            if (roomSizeType != "") {
                newRoom.sizeType = roomSizeType;
            }
        }

        directive = "--Room.SeatingCapacity:";
        if (!lineProcessed && line.search(directive) > -1) {
            var roomSeatingCapacity = line.replace(directive, "").trim();
            if (roomSeatingCapacity != "") {
                newRoom.seatingCapacity = roomSeatingCapacity;
            }
        }
        
        directive = "--Room.Floor:";
        if (!lineProcessed && line.search(directive) > -1) {
            var roomFloor = line.replace(directive, "").trim();
            if (roomFloor != "") {
                newRoom.floor = roomFloor;
            }
        }
        
        directive = "--Room.Building:";
        if (!lineProcessed && line.search(directive) > -1) {
            var roomBuilding = line.replace(directive, "").trim();
            if (roomBuilding != "") {
                newRoom.building = roomBuilding;
            }
        }
        
        directive = "--Room.RoomNumber:";
        if (!lineProcessed && line.search(directive) > -1) {
            var roomNumber = line.replace(directive, "").trim();
            if (roomNumber != "") {
                newRoom.roomNumber = roomNumber;
            }
        }

        directive = "--Room.RoomPhone:";
        if (!lineProcessed && line.search(directive) > -1) {
            var roomPhone = line.replace(directive, "").trim();
            if (roomPhone != "") {
                newRoom.roomPhone = roomPhone;
            }
        }
        
        directive = "--Room.AddressGAL:";
        if (!lineProcessed && line.search(directive) > -1) {
            var roomAddressGAL = line.replace(directive, "").trim();
            if (roomAddressGAL != "") {
                newRoom.addressGAL = roomAddressGAL;
            }
        }

        directive = "--Room.SpecialNote:";
        if (!lineProcessed && line.search(directive) > -1) {
            var roomSpecialNote = line.replace(directive, "").trim();
            if (roomSpecialNote != "") {
                newRoom.specialNote = roomSpecialNote;
            }
        }
        
        directive = "--Room.Capability:"; // Note, there can be multiple capability lines.
        if (!lineProcessed && line.search(directive) > -1) {
            var roomCapabilityLine = line.replace(directive, "").trim();

            if (roomCapabilityLine != "") {

                if (!newRoom.hasOwnProperty("capability")) {
                    newRoom.capability = []; // Create the capability line array.               
                }
                
                // Deparate capabilities by | if needed.
                if (roomCapabilityLine.search("|") > -1){
                        var capabilityArray = roomCapabilityLine.split("|");
                        for(let capabilityItem of capabilityArray){ //for each item in the array
                            newRoom.capability.push(capabilityItem); //add it to the capability array in the db
                        }
                }else{
                        newRoom.capability.push(roomCapabilityLine); //if it is a one-liner, add the one item
                }
            }
        }

        directive = "--Room.Configuration:"; // Note, there can be multiple configuration lines.
        if (!lineProcessed && line.search(directive) > -1) {
            var roomConfigurationLine = line.replace(directive, "").trim();
            if (roomConfigurationLine != "") {
                if (!newRoom.hasOwnProperty("configuration")) {
                    newRoom.configuration = []; // Create the configuration line array.               
                }
                newRoom.configuration.push(roomConfigurationLine);
            }
        }

        return true; // Return true to continue processing for the next line item.
    })

    // Check to see if there's one last pending new one to be collected.
    if (errorEncountered == false && newRoom != null) {
        var success = ValidateAndCollectRoom(newRoom, roomItems);
        if (!success) {
            errorEncountered = true;
        }
    }

    result = {
        success: true,
        rooms: roomItems
    }

    if (errorEncountered == true) {
        result.success = false;
    } 

    return result;
}


function ValidateAndCollectRoom(newRoom, roomItems) {
    var valid = ValidateRoom(newRoom);
    if (valid) {
        roomItems.push(newRoom);
        totalNumOfRooms += 1;
        return true;
    } else {
        return false;
    }
}


function ValidateRoom(newRoom) {
    if (!newRoom.hasOwnProperty("name") || newRoom.name == "") {
        logger.error("ERROR: The room name is required!");
        return false;
    }
    if (!newRoom.hasOwnProperty("sizeType") || newRoom.sizeType == "") {
        logger.error("ERROR: The room size type is required!");
        return false;
    }
    if (!newRoom.hasOwnProperty("seatingCapacity") || newRoom.seatingCapacity == "") {
        logger.error("ERROR: The room seating capacity is required!");
        return false;
    }
    if (!newRoom.hasOwnProperty("floor") || newRoom.floor == "") {
        logger.error("ERROR: The room floor is required!");
        return false;
    }
    if (!newRoom.hasOwnProperty("building") || newRoom.building == "") {
        logger.error("ERROR: The room building is required!");
        return false;
    }
    if (!newRoom.hasOwnProperty("roomNumber") || newRoom.roomNumber == "") {
        logger.error("ERROR: The room number is required!");
        return false;
    }
    if (!newRoom.hasOwnProperty("roomPhone") || newRoom.roomPhone == "") {
        logger.error("ERROR: The room phone is required!");
        return false;
    }
    if (!newRoom.hasOwnProperty("addressGAL") || newRoom.addressGAL == "") {
        logger.error("ERROR: The room address in the GAL is required!");
        return false;
    }
   /* if (!newRoom.hasOwnProperty("capability") || newRoom.capability.length == 0) {
        logger.error("ERROR: The room capability is required!");
        return false;
    }*/
    return true;
}


function createRoom(room) {

    try {
        logger.info(`ADMIN: Adding room (${room.name}) to the database.`);

        var newRoom = new Room(room);

        var validationErr = newRoom.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`ADMIN: createRoom - create new Room validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `ADMIN: createRoom - create new Room failed validation. ${validationErr}`;
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        }

    } catch (err) {
        var errMsg = `ADMIN: createRoom - problem with creating a new Room. Error: ${err}`;
        logger.error(errMsg);
        mongoose.disconnect();
        return;
    }

    newRoom.save()
        .then((room) => {
            logger.info(`ADMIN: createRoom - Room.save success:\n${room}`);
            totalNumOfRoomsCreated += 1;

            if (totalNumOfRoomsCreated == totalNumOfRooms) {
                // All accounted for therefore it can disconnect from the database.
                logger.info(`ADMIN: All ${totalNumOfRoomsCreated} rooms are created for site: ${siteCode}.`);

                mongoose.disconnect((err) => {
                    if (err) {
                        logger.error(`ADMIN: Room.deleteMany failed for site: ${siteCode}! Error: ${err}`);
                    } else {
                        logger.info(`ADMIN: Disconnected from database for site: ${siteCode}.`);
                    }
                    process.exit();
                });  
            }
        })
        .catch((err) => {
            var errMsg = `ADMIN: createRoom - Room.save failed. Error: ${err}`
            logger.error(errMsg);
            mongoose.disconnect();
            return;
        });

};
