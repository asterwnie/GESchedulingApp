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
        enum: ['text', 'email', 'number', 'textArea', 'yesNo', 'checkbox', 'choices', 'custom'],
        required: [true, 'ctrlType is required!']
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
        type: [Number], 
        required: function(){
            if (this.numberRange == null) {
                return true;
            } else if (this.numberRange.length == 2) {
                return true;
            } else {
                return false;
            }
        }
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
        enum: ['standard', 'special'],
        required: [true, 'Type is required!']
    },

    label: {
        type: String,
        required: [true, 'Label is required!']
    },

    inputType: {
        type: InputTypeSchema,
        required: [true, 'Input Type is required!']
    },

    screenNum: {
        type: Number,
        required: [true, 'Screen number is required!']
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