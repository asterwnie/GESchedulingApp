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

        if (!currentFieldInvalid && prompt.inputType.ctrlType == 'email') {
            var ctrlDataId = prompt.inputType.ctrlDataId;
            var inputVal = $("#" + ctrlDataId).val();
            isValid = validateEmailPrompt(ctrlDataId, inputVal);
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

    try {
        inputVal = inputVal.trim();
        var atLeastOneCharRegEx = /.+/;
        validInput = inputVal.match(atLeastOneCharRegEx);
    } catch (err) {
        console.warn("validateIsRequiredPrompt error: " + err);
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
                    allValid = false;
                    currentFieldInvalid = true;
                }
            }

            if (!currentFieldInvalid && requestPrompt.inputType.ctrlType == 'email') {
                var ctrlDataId = requestPrompt.inputType.ctrlDataId;
                var inputVal = $("#" + ctrlDataId).val();
                isValid = validateEmailPrompt(ctrlDataId, inputVal);
                if (!isValid) {
                    allValid = false;
                    currentFieldInvalid = true;
                }
            }

        }
    });

    return allValid;
}


export const bindUiValuesFromRequest = (request, currentScreenNum) => {

    //debugger; // Uncomment to trigger breakpoint.

    var assignmentCount = 0;

    var ctrls = $('.is-request-data');
    $.each(ctrls, function (index, inputCtrl) {
        var ctrl = $(inputCtrl);
        if (ctrl != null && ctrl.attr('screenNum') == currentScreenNum) {
            ctrl.val(request[inputCtrl.id]); //TODO: boolean value - checkbox or radio button is assign differently
            assignmentCount += 1;
        }
    });

    return assignmentCount;
}