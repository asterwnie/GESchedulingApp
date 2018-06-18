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
        enum: [
            'text',     // A single-line text control.
            'email',    // A single-line text control for entering a email address only.
            'number',   // A single-line text control for entering a number only.
            'textArea', // A multi-line text box.
            'yesNo',    // Two toggle radio buttons. One for Yes another for No. Maps to a boolean value.
            'checkbox', // A checkbox control. Maps to a boolean value.
            'choices',  // A dropdown choice control to pick a single option
            'custom'    // A custom UI for more advanced UI
        ],
        required: [true, 'ctrlType is required!']
    },

    // optional
    valueChoices: {
        type: [String],
    },

    // optional
    isValueBoolean: {
        type: Boolean, // default: false - guide validation for this.ctrlType.type == yesno or checkbox
    },

    // optional
    isValueNumber: {
        type: Boolean, // default: false - guide validation for this.ctrlType.type == number. It's a text control for entering a number only.
    },

    // optional
    maxTextLen: {
        type: Number
    },

    // optional
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

    // optional - identify special stocked validators.e.g. email
    validatorId: {
        type: String 
    },

    // optional
    validationRegEx: {
        type: String 
    },

    // optional
    customCtrlId: {
        type: String
    },

    // optional
    dependsOn: {
        type: String,
        ctrlDataId: Number
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

    isRequired: {
        type: Boolean
    },

    screenNum: {
        type: Number,
        required: [true, 'Screen number is required!']
    }
   // subInputType: {
      //  type: InputType,
        //(optional - enablement automatically depends on inputType state. This sub-control is mainly used for the special request prompt.)
   // }

}, 
{
    timestamps: true,   // auto-add createdAt and updatedAt
    strict: false       // Can add other fields not enforced by the schema
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
        let requestPromptModel = dbConnection.model(`requestPrompts`, RequestPromptSchema);
        requestPromptModel.InputType = dbConnection.model(`inputTypes`, InputTypeSchema);
        requestPromptModelBySite[siteCodeUpper] = requestPromptModel;
    }
    return requestPromptModelBySite[siteCodeUpper];

}