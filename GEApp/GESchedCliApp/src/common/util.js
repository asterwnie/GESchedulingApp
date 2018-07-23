
//
// General utility functions.
//

import * as util from '@/common/util.js';
const centralStore = require('@/common/centralStore.js').centralStore;


export const getDateTimeDisplay = (inDateTime) => {
    //debugger; // Uncomment to trigger breakpoint. 

    var parts = getDateTimeParts(inDateTime);
    return parts.fullDateTimeDispLabel;
}

export const getDateTimeParts = (inDateTime) => {
    //debugger; // Uncomment to trigger breakpoint. 

    var dateTimeParts = {};

    var theDateTime = null;
    try {
        theDateTime = new Date(inDateTime);
    } catch (err) {
        util.logDebugMsg("getDateTimeParts new Date failed - " + inDateTime + " Error: " + err);
    }

    if (theDateTime == null) {
        return null;
    }

    var dd = null;
    var mm = null;
    var yyyy = null;
    var hrs = null;
    var mins = null;

    try {
        dd = theDateTime.getDate();
        mm = theDateTime.getMonth() + 1; //January is 0!
        yyyy = theDateTime.getFullYear();
        hrs = theDateTime.getHours();
        mins = theDateTime.getMinutes();

        dateTimeParts.date = dd;
        dateTimeParts.Month = mm;
        dateTimeParts.year = yyyy;
        dateTimeParts.hrs = hrs;
        dateTimeParts.mins = mins;

    } catch (err) {
        util.logDebugMsg("getDateTimeParts - get Date parts failed - Error: " + err);
    }
    var ampm = "AM";
    if (hrs > 12) {
        hrs -= 12;
        ampm = "PM";
    }

    var ddStr = dd.toString();
    var mmStr = mm.toString();

    var dateDispVal =  mmStr + '/' + ddStr + '/' + yyyy;         
    dateTimeParts.fullDateDisplayUsingSlashes = dateDispVal;

    var hrsStr = hrs.toString();
    if (hrs == 0) { hrsStr = "00"; }
    var minsStr = mins.toString();
    if (mins < 10) { minsStr = '0'+ minsStr; } 

    var dispValue = dateDispVal + ' ' + hrsStr + ':' + minsStr + ' ' + ampm;

    dateTimeParts.fullDateTimeDispLabel = dispValue;


    if (dd < 10) { dd = '0'+ dd; } 
    if (mm < 10) { mm = '0'+ mm; }

    var dateVal = yyyy +  '/' + mm + '/' + dd;
    dateTimeParts.fullDateUsingSlashes = dateVal;

    var dateInputFormat = yyyy +  '-' + mm + '-' + dd;
    dateTimeParts.fullDateUsingDashes = dateInputFormat;


    var hrsStr = hrs.toString();
    var minsStr = mins.toString();
    if (hrs < 10) { hrsStr = '0'+ hrsStr; } 
    if (mins < 10) { minsStr = '0'+ minsStr; }  

    var timeValue = hrsStr + ':' + minsStr + ':00';
    dateTimeParts.timeOption = timeValue;

    return dateTimeParts;
}

export const logDebugMsg = (msg) => {
    if (centralStore.state.isInDebugMode) {
        centralStore.state.cliDebugMsgSqeNum += 1;
        $('#debugOutput ul').append("<li>[" + centralStore.state.cliDebugMsgSqeNum + "] " + msg + "</li>");
    }
    console.log(msg);
}