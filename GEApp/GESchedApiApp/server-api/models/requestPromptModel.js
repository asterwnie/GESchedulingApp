'use strict';

const appRoot = require('app-root-path');
const getDbConnection = require(`${appRoot}/server-api/databaseManager`);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const InputTypeSchema = new Schema({

    ctrlDataId: {
        type: String,
        required: [true, 'ctrlDataId is required!']
    },
    ctrlType: {
        type: String,
        required: [true, 'ctrlType is required!'],
        // values: text, textarea, yesno, checkbox, choices, custom
        // for this: check if type is = to these values ***********************************************************
        // if not, return back "invalid ctrlType"
    },
    valueChoices: {
        type: [String],
    },
    isValueBoolean: {
        type: Boolean, //(default: false) - for .yesno and .checkbox
        // is this a check for this.ctrlType.type == yesno or checkbox? *******************************************
    },
    isValueNumber: {
        type: Boolean, //(default: false) for .numeric
        // is this a check for this.ctrlType.type == numeric ******************************************************
    },
    maxTextLen: {
        type: Number // (optional)
    },
    numberRange: {
        type: [Number], //(2 items)
    },
    validatorId: {
        type: String //(optional - identify special stocked validators.e.g. email)
    },
    validationRegEx: {
        type: String //(optional)
    },
    customCtrlId: {
        type: String // optional
    }
});

// The schema definition for a RequestPrompt entity

const RequestPromptSchema = new Schema({

    seqNum: {
        type: Number,
        required: [true, 'Sequence Number is required!']
    },

    type: {
        type: String,
        required: [true, 'Type is required!']
    },

    label: {
        type: String,
        required: [true, 'Label is required!']
    },

    inputType: {
        type: InputTypeSchema // object of InputType
        //required: [true, 'Input Type is required!']
    },

    screenNum: {
        type: Number,
        required: [true, 'Sequence Number is required!']
    },
   // subInputType: {
      //  type: InputType,
        //(optional - enablement automatically depends on inputType state. This sub-control is mainly used for the special request prompt.)
   // }
    dependsOn: {
        type: String,
        ctrlDataId: Number
    }
});






// Object to cache a request prompt model per site.
var requestPromptModelBySite = {};


// Return a request prompt model using the corresponding site database connection.
module.exports = function (siteCode) {   

    if (siteCode == null  || siteCode.length === 0) {
        throw "A site code must be passed to get the Request Prompt model!"
    }
    let siteCodeUpper = siteCode.toUpperCase();
    if (requestPromptModelBySite[siteCodeUpper] == null) {
        let dbConnection = getDbConnection(siteCodeUpper);       
        // Mongoose automatically creates a request prompt collection if one does not exist.
        requestPromptModelBySite[siteCodeUpper] = dbConnection.model(`requestPrompts`, RequestPromptSchema);
    }
    return requestPromptModelBySite[siteCodeUpper];

}