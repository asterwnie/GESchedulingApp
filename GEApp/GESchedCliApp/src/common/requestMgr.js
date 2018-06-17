//
// Request Manager for request initialization and validation.
//

import { centralStore } from '@/common/centralStore.js'


export const validateRequest = (request, currentScreenNum) => {

    //debugger; // Uncomment to trigger breakpoint.

    var hasInvalidData = false;

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

            if (requestPrompt.isRequired != undefined && requestPrompt.isRequired == true) {
                var ctrlDataId = requestPrompt.inputType.ctrlDataId;
                var validInput = null;

                try {
                    var inputVal = request[ctrlDataId]
                    inputVal = inputVal.trim();
                    var atLeastOneCharRegEx = /.+/;
                    validInput = inputVal.match(atLeastOneCharRegEx);
                } catch (err) {
                    console.warn("validateRequest error: " + err);
                }

                if (validInput == null) {
                    currentFieldInvalid = true;
                    hasInvalidData = true;
                    var requiredMsg = $('#REQUIRED-MSG-FOR-' + ctrlDataId)
                    if (requiredMsg != null) {
                        requiredMsg.show();
                    }
                }
            }

            if (!currentFieldInvalid && requestPrompt.inputType.ctrlType == 'email') {
                var ctrlDataId = requestPrompt.inputType.ctrlDataId;
                var email = null;

                try {
                    var inputVal = request[ctrlDataId]
                    var emailRegEx = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i;
                    email = inputVal.match(emailRegEx);
                } catch (err) {
                    console.warn("validateRequest error: " + err);
                }

                if (email == null) {
                    currentFieldInvalid = true;
                    hasInvalidData = true;
                    var invalidMsg = $('#INVALID-MSG-FOR-' + ctrlDataId)
                    if (invalidMsg != null) {
                        invalidMsg.show();
                    }
                }
            }

        }
    });

    return hasInvalidData;
}

export const bindUiValuesFromRequest = (request, currentScreenNum) => {

    debugger; // Uncomment to trigger breakpoint.

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