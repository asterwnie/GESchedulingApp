
//
// General utility functions.
//

import * as util from '@/common/util.js';
const centralStore = require('@/common/centralStore.js').centralStore;


export const getDateTimeDisplay = (inDateTime) => {
    //debugger; // Uncomment to trigger breakpoint. 

    var theDateTime = null;
    try {
        theDateTime = new Date(inDateTime);
    } catch (err) {
        util.logDebugMsg("getDateTimeDisplay new Date failed - " + inDateTime + " Error: " + err);
    }

    if (theDateTime == null) {
        return "...";
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
    } catch (err) {
        util.logDebugMsg("getDateTimeDisplay - get Date parts failed - Error: " + err);
    }
    var ampm = "AM";
    if (hrs > 12) {
        hrs -= 12;
        ampm = "PM";
    }

    var ddStr = dd.toString();
    var mmStr = mm.toString();
    var dateDispVal =  mmStr + '/' + ddStr + '/' + yyyy;                       
    
    var hrsStr = hrs.toString();
    if (hrs == 0) { hrsStr = "00"; }
    var minsStr = mins.toString();
    if (mins < 10) { minsStr = '0'+ minsStr; } 

    var dispValue = dateDispVal + ' ' + hrsStr + ':' + minsStr + ' ' + ampm;

    return dispValue;
}

export const logDebugMsg = (msg) => {
    if (centralStore.state.isInDebugMode) {
        centralStore.state.cliDebugMsgSqeNum += 1;
        $('#debugOutput ul').append("<li>[" + centralStore.state.cliDebugMsgSqeNum + "] " + msg + "</li>");
    }
    console.log(msg);
}