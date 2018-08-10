'use strict';

const appRoot = require('app-root-path');
const appConfig = require(`${appRoot}/server.config`); // Load app configuration settings.

const httpRequestHelper = require(`${appRoot}/server-api/httpRequestHelper`);
const logger = require(`${appRoot}/server-api/logger`);
const getNoteType = require(`${appRoot}/server-api/models/noteModel`);


// GET Notes
// Sample GET requests:
// http://localhost:9090/api/notes
// http://localhost:9090/api/notes?orderBy=seqNum:1

exports.getNotes = async function (req, res) {
    logger.verbose('noteController.getNotes begin');

    let siteCode = httpRequestHelper.getSite(req);
    
    await queryNotes(siteCode, req.query.orderBy, req.query.typeContains, (result) => {
        if (result.success) {
            logger.info(`noteController.getNotes - Note.find success. About to send back http response with ${result.notes.length} notes`);
            res.status(200).json(result.notes);
        } else {
            logger.error(`noteController.getNotes failed. Error: ${result.errMsg}`);
            res.status(500).json({ error: result.errMsg });
        }
    });

    logger.verbose('noteController.getNotes ends.');        
};


async function queryNotes (siteCode, orderBy, typeContains, callback) {

    let Note = getNoteType(siteCode);

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

    await Note.find(filterDirective).sort(sortDirective)
        .then((notes) => {
            logger.info(`noteController.queryNotes - Note.find success. Got back ${notes.length} notes`);           
            callback({ success: true, notes: notes });
        })
        .catch((err) => {
            var errMsg = `noteController.queryNotes - Note.find failed. Error: ${err}`;
            logger.error(errMsg);
            callback({ success: false, errMsg: errMsg });
        });
}


exports.queryNotes = queryNotes;


// POST (create) a new note.
exports.createNote = function (req, res) {
    logger.verbose('noteController.createNote begin');

    try {
        let siteCode = httpRequestHelper.getSite(req); 
        let Note = getNoteType(siteCode);
        var newNote = new Note(req.body);

        var validationErr = newNote.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`noteController.createNote - got create new Note validation error: ${validationErr.errors[prop]}`);
            }
            var errMsg = `createNote failed on validation. Error: ${validationErr}`;
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `noteController.createNote - problem with creating a new Note. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    }

    newNote.save()
        .then((note) => {
            logger.info(`noteController.createNote - Note.save success. About to send back http response with note called ${note}`);
            res.status(201).json(note); // 201 - CREATED
        })
        .catch((err) => {
            var errMsg = `noteController.createNote - Note.save failed. Error: ${err}`
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        });

};


// PUT (update) a note using its id.
exports.updateNote = function (req, res) {
    logger.verbose('noteController.updateNote begin');

    try {
        let siteCode = httpRequestHelper.getSite(req);
        var Note = getNoteType(siteCode);

        var toUpdateNote = new Note(req.body);

        var validationErr = toUpdateNote.validateSync();
        if (validationErr != null) {
            for (var prop in validationErr.errors) {
                logger.error(`noteController.updateNote - the updated Note validation error: ${validationErr.errors[prop]}`);
            }

            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST
            return;
        }

    } catch (err) {
        var errMsg = `noteController.updateNote - problem with updating Note. Error: ${err}`;
        logger.error(errMsg);
        res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        return;
    };

    toUpdateNote.updatedAt = Date.now();

    Note.update({"_id": toUpdateNote._id }, { $set: toUpdateNote }, function (err) {
        if (err) {
            var errMsg = `noteController.updateNote - Note.find failed. Error: ${err}`
            logger.error(errMsg);
            res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR
        } else {

            Note.findById(toUpdateNote._id)
            .then((note) => {
                if (note == null) {
                    var errMsg = `noteController.updateNote - unable to find the updated Note by id ${toUpdateNote._id}. Error: ${err}`;
                    logger.error(errMsg);
                    res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
                } else {
                    logger.info(`noteController.updateNote - found updated note by id ${toUpdateNote._id}. About to send back http response with note:\n ${note}`);
                    res.status(200).json(note);  // 200 - OK
                }
            })
            .catch((err) => {
                var errMsg = `noteController.updateNote - error finding the updated Note by id ${toUpdateNote._id}. Error: ${err}`;
                logger.error(errMsg);
                res.status(500).json({ error: errMsg }); // 500 - INTERNAL SERVER ERROR 
            });

        }
    });

};


// GET a note by id.
exports.getNote = function (req, res) {
    logger.verbose('noteController.getNote begin');

    let siteCode = httpRequestHelper.getSite(req);
    let Note = getNoteType(siteCode);

    Note.findById(req.params.id)
        .then((note) => {
            if (note == null) {
                var errMsg = `noteController.getNote - Note.findById did not find a note with id ${req.params.id}.`;
                logger.error(errMsg);
                res.status(404).json({ error: errMsg }); // 404 - Not Found
            } else {
                logger.info(`noteController.getNote - Note.findById success. About to to send back http response with note:\n ${note}`);
                res.status(200).json(note);  // 200 - OK
            }
        })
        .catch((err) => {
            var errMsg = `noteController.getNote - Note.findById failed. Error: ${err}`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        });

};


// DELETE a note by id.
exports.deleteNote = function (req, res) {
    logger.verbose('noteController.deleteNote begin');

    let siteCode = httpRequestHelper.getSite(req);
    let Note = getNoteType(siteCode);

    Note.findByIdAndRemove(req.params.id)
    .then((note) => {
        if (note == null) {
            var errMsg = `noteController.deleteNote - Did not find the note to be deleted by id ${req.params.id}.`;
            logger.error(errMsg);
            res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
        } else {
            logger.info(`noteController.deleteNote - Note.findByIdAndRemove ${req.params.id} success. Deleted note called ${note.type}`);
            res.status(204).send();  // 204 - NO CONTENT 
        }
    })
    .catch((err) => {
        var errMsg = `noteController.deleteNote - Note.findByIdAndRemove ${req.params.id} failed. Error: ${err}`;
        logger.error(errMsg);
        res.status(400).json({ error: errMsg }); // 400 - INVALID REQUEST 
    });
};