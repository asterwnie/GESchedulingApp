//
// Request Manager for request initialization and validation.
//

import { centralStore } from '@/common/centralStore.js'


export const inferNumOfRequestScreens = (prompts) => {
    //debugger; // Uncomment to trigger breakpoint.
    var highestScreenNum = 0;

    $.each(prompts, function (index, prompt) {
        if (prompt.screenNum > highestScreenNum) {
            highestScreenNum = prompt.screenNum;
        }
    });

    centralStore.state.numOfRequestScreens = highestScreenNum;
}


export const validatePrompts = (prompts) => {
    //debugger; // Uncomment to trigger breakpoint.

    // Hide all existing errors since the fields will be re-validated.
    $.each(prompts, function (index, prompt) {

        var ctrlDataId = prompt.inputType.ctrlDataId;

        var invalidMsg = $('#INVALID-MSG-FOR-' + ctrlDataId)
        if (invalidMsg != null) {
            invalidMsg.hide();
        }

        var requiredMsg = $('#REQUIRED-MSG-FOR-' + ctrlDataId)
        if (requiredMsg != null) {
            requiredMsg.hide();
        }

    });

    var allValid = true;

    $.each(prompts, function (index, prompt) {

        var currentFieldInvalid = false;
        var isValid = true;

        if (prompt.isRequired != undefined && prompt.isRequired == true) {
            var ctrlDataId = prompt.inputType.ctrlDataId;
            var inputVal = $("#" + ctrlDataId).val();
            isValid = validateIsRequiredPrompt(ctrlDataId, inputVal);
            if (!isValid) {
                allValid = false;
                currentFieldInvalid = true;
            }
            
        }

        /* if (!currentFieldInvalid && (prompt.inputType.ctrlType == 'eventSchedule')) {
            debugger;
            var ctrlDataId = prompt.inputType.ctrlDataId;
            var inputVal = $("#" + ctrlDataId).val();
            isValid = validateEventSchedulePrompt(ctrlDataId, inputVal);
            if (!isValid) {
                //debugger;
                allValid = false;
                currentFieldInvalid = true;
            }
        }  */

        if (!currentFieldInvalid && prompt.inputType.ctrlType == 'email') {
            var ctrlDataId = prompt.inputType.ctrlDataId;
            var inputVal = $("#" + ctrlDataId).val();
            isValid = validateEmailPrompt(ctrlDataId, inputVal);
            if (!isValid) {
                allValid = false;
                currentFieldInvalid = true;
            }
        }

        if (!currentFieldInvalid && prompt.inputType.ctrlType == 'number') {
            var ctrlDataId = prompt.inputType.ctrlDataId;
            var inputVal = $("#" + ctrlDataId).val();
            isValid = validateNumberPrompt(ctrlDataId, inputVal);
            if (!isValid) {
                allValid = false;
                currentFieldInvalid = true;
            }
        }

        if (!currentFieldInvalid && (prompt.inputType.ctrlType == 'yesNo' || prompt.inputType.ctrlType == 'yesNoWithComment')) {
            var ctrlDataId = prompt.inputType.ctrlDataId;
            var currObject = $("#" + ctrlDataId);
            inputVal = currObject[0].checked;
            isValid = validateYesNoPrompt(ctrlDataId, inputVal);
            if (!isValid) {
                allValid = false;
                currentFieldInvalid = true;
            }
        }
        

    });

    return allValid;
}


export const validateIsRequiredPrompt = (ctrlDataId, inputVal) => {

    let isValid = true;
    let validInput = null;

    if ((typeof inputVal) == "string") {
        try {
            inputVal = inputVal.trim();
            var atLeastOneCharRegEx = /.+/;
            validInput = inputVal.match(atLeastOneCharRegEx);
        } catch (err) {
            console.warn("validateIsRequiredPrompt error: " + err);
        }
    } else if (inputVal != null && inputVal != undefined) {
        //for datetime, check if inner values are null
        if(inputVal.startDateTime !== undefined && inputVal.endDateTime !== undefined){
            if(inputVal.startDateTime == null || inputVal.endDateTime == null){
                validInput = null;
            }
        } else {
            validInput = inputVal;
        }
    }

    if (validInput == null) {
        isValid = false;
        var requiredMsg = $('#REQUIRED-MSG-FOR-' + ctrlDataId)
        if (requiredMsg != null) {
            requiredMsg.show();
        }
    }

    return isValid;
}


export const validateEmailPrompt = (ctrlDataId, inputVal) => {
    
    let isValid = true;
    var email = null;

    try {
        var emailRegEx = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i;
        email = inputVal.match(emailRegEx);
    } catch (err) {
        console.warn("validateEmailPrompt error: " + err);
    }

    if (email == null) {
        isValid = false;
        var invalidMsg = $('#INVALID-MSG-FOR-' + ctrlDataId)
        if (invalidMsg != null) {
            invalidMsg.show();
        }
    }

    return isValid;
}

/* export const validateEventSchedulePrompt = (ctrlDataId, inputVal) => {
    
    let isValid = true;
    debugger;
    if (inputVal == "") {
        isValid = false;
        var invalidMsg = $('#INVALID-MSG-FOR-' + ctrlDataId)
        if (invalidMsg != null) {
            invalidMsg.show();
        }
    }

    return isValid;
} */


export const validateNumberPrompt = (ctrlDataId, inputVal) => {
    
    let isValid = true;
    var inVal = 0;

    try {
        inVal = parseInt(inputVal);
    } catch (err) {
        console.warn("validateNumberPrompt error: " + err);
        isValid = false;
    }

    if (!isValid) {
        var invalidMsg = $('#INVALID-MSG-FOR-' + ctrlDataId)
        if (invalidMsg != null) {
            invalidMsg.show();
        }
    }

    return isValid;
}


export const validateYesNoPrompt = (ctrlDataId, inputVal) => {
    
    let isValid = true;
    if(!(inputVal === true | inputVal === false)){
        isValid = false;
    }

    if (!isValid) {
        var invalidMsg = $('#INVALID-MSG-FOR-' + ctrlDataId)
        if (invalidMsg != null) {
            invalidMsg.show();
        }
    }

    return isValid;
}


export const validateRequest = (request, currentScreenNum) => {

    //debugger; // Uncomment to trigger breakpoint.

    var allValid = true;

    // Hide all existing errors since the fields will be re-validated.
    $.each(centralStore.state.requestPrompts, function (index, requestPrompt) {
        if (requestPrompt.screenNum == currentScreenNum) {

            var ctrlDataId = requestPrompt.inputType.ctrlDataId;

            var invalidMsg = $('#INVALID-MSG-FOR-' + ctrlDataId)
            if (invalidMsg != null) {
                invalidMsg.hide();
            }

            var requiredMsg = $('#REQUIRED-MSG-FOR-' + ctrlDataId)
            if (requiredMsg != null) {
                requiredMsg.hide();
            }
         
        }
    });

    $.each(centralStore.state.requestPrompts, function (index, requestPrompt) {
        if (requestPrompt.screenNum == currentScreenNum) {

            var currentFieldInvalid = false;
            var isValid = true;

            if (requestPrompt.isRequired != undefined && requestPrompt.isRequired == true) {
                var ctrlDataId = requestPrompt.inputType.ctrlDataId;
                var inputVal = request[ctrlDataId]
                isValid = validateIsRequiredPrompt(ctrlDataId, inputVal);
                if (!isValid) {
                    //debugger;
                    allValid = false;
                    currentFieldInvalid = true;
                }
            }

            /* if (!currentFieldInvalid && (requestPrompt.inputType.ctrlType == 'eventSchedule')) {
                debugger;
                var ctrlDataId = requestPrompt.inputType.ctrlDataId;
                var inputVal = $("#" + ctrlDataId).val();
                isValid = validateEventSchedulePrompt(ctrlDataId, inputVal);
                if (!isValid) {
                    //debugger;
                    allValid = false;
                    currentFieldInvalid = true;
                }
            }  */

            if (!currentFieldInvalid && requestPrompt.inputType.ctrlType == 'email') {
                var ctrlDataId = requestPrompt.inputType.ctrlDataId;
                var inputVal = $("#" + ctrlDataId).val();
                isValid = validateEmailPrompt(ctrlDataId, inputVal);
                if (!isValid) {
                    //debugger;
                    allValid = false;
                    currentFieldInvalid = true;
                }
            }

            if (!currentFieldInvalid && requestPrompt.inputType.ctrlType == 'number') {
                var ctrlDataId = requestPrompt.inputType.ctrlDataId;
                var inputVal = $("#" + ctrlDataId).val();
                isValid = validateNumberPrompt(ctrlDataId, inputVal);
                if (!isValid) {
                    //debugger;
                    allValid = false;
                    currentFieldInvalid = true;
                }
            }

            if (!currentFieldInvalid && (requestPrompt.inputType.ctrlType == 'yesNo' || requestPrompt.inputType.ctrlType == 'yesNoWithComment')) {
                var ctrlDataId = requestPrompt.inputType.ctrlDataId;
                var currObject = $("#" + ctrlDataId);
                inputVal = currObject[0].checked;
                isValid = validateYesNoPrompt(ctrlDataId, inputVal);
                if (!isValid) {
                    //debugger;
                    allValid = false;
                    currentFieldInvalid = true;
                }
            }

        }
    });

    return allValid;
}


export const bindUiValuesFromRequest = (request, currentScreenNum, inAdminMode) => {

    //debugger; // Uncomment to trigger breakpoint.

    var assignmentCount = 0;

    var ctrls = $('.is-request-data');
    $.each(ctrls, function (index, inputCtrl) {
        var ctrl = $(inputCtrl);
        if (ctrl != null && ctrl.attr('screenNum') == currentScreenNum) {
            ctrl.val(null);
            var val = request[inputCtrl.id];
            if (val != undefined && val != null && val != "") {
                if(val.startDateTime != undefined && val.startDateTime != undefined){
                    
                    if(ctrl.hasClass("start-date")){
                        ctrl.val(val.startDateTime);

                    } else if (ctrl.hasClass("end-date")) {
                        ctrl.val(val.endDateTime);

                    } else if (ctrl.hasClass("start-time")) {
                        var startDateTime = new Date(val.startDateTime);
                        var hours = startDateTime.getHours();
                        /* //currently the UI only supports hours. 
                        var minutes = startDateTime.getMinutes();*/

                        if($(ctrl).hasClass(`H-${hours}`)){  
                            debugger;
                            ctrl.selected = true;
                        } else {
                            ctrl.selected = false;
                        }


                    } else if(ctrl.hasClass("end-time")){
                        var endDateTime = new Date(val.endDateTime);
                        var hours = endDateTime.getHours();
                        var minutes = endDateTime.getMinutes();
                        var timeHelper = "AM";

                        if(hours > 12){
                            hours -= 12;
                            timeHelper = "PM";
                        }

                        var timeString = `${hours}:${minutes} ${timeHelper}`;
                        ctrl.val(timeString);
                    }

                } else {
                    ctrl.val(val);
                    assignmentCount += 1;
                }
            }
        }
    });

    ctrls = $('.is-admin-comment');
    $.each(ctrls, function (index, inputCtrl) {
        var ctrl = $(inputCtrl);
        if (ctrl != null && ctrl.attr('screenNum') == currentScreenNum) {
            ctrl.val(null);
            var val = request[inputCtrl.id];
            if (val != undefined && val != null && val != "") {
                ctrl.val(val);

                if (!inAdminMode) {
                    ctrl.prop('readonly', true);
                } 
                ctrl.show();
            }

            assignmentCount += 1;
        }
    });

    return assignmentCount;
}