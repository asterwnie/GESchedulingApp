<template>
    <div class="container-fluid">
 
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-3 col-xl-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4" style="width:100%;">
          <div align="center" style="padding-bottom:10px;"><span v-if="requestProcessingStatus != null" :class="requestProcessingStatus">{{requestProcessingStatusLabel}}</span></div>

          <form class="needs-validation" novalidate>
            <p class="text-danger" :hidden="!showPleaseReviewCommentsMsg">{{requestStatusMessageRejectedViewDescription}}</p>

            <div class="mb-3" v-for="(requestPrompt, index) in requestPrompts" :key="index">

              <template v-if="(requestPrompt.inputType.ctrlType == 'text' && requestPrompt.screenNum == currentScreenNum)"> 
                <text-input 
                  :isRequired="requestPrompt.isRequired"
                  :inAdminMode="inAdminMode&&!isNewRequest"
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label"
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></text-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'textArea' && requestPrompt.screenNum == currentScreenNum)"> 
                <text-area-input 
                  :isRequired="requestPrompt.isRequired"                
                  :inAdminMode="inAdminMode&&!isNewRequest"
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label"
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></text-area-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'email' && requestPrompt.screenNum == currentScreenNum)"> 
                <email-input 
                  :isRequired="requestPrompt.isRequired"               
                  :inAdminMode="inAdminMode&&!isNewRequest"
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></email-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'number' && requestPrompt.screenNum == currentScreenNum)"> 
                <number-input 
                  :isRequired="requestPrompt.isRequired"               
                  :inAdminMode="inAdminMode&&!isNewRequest"
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataOutOfBoundsMsgId="'OUTOFBOUNDS-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></number-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'yesNoWithComment' && requestPrompt.screenNum == currentScreenNum)"> 
                <yes-no-with-comment-input 
                  :isRequired="requestPrompt.isRequired"               
                  :inAdminMode="inAdminMode&&!isNewRequest"
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></yes-no-with-comment-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'yesNo' && requestPrompt.screenNum == currentScreenNum)"> 
                <yes-no-input 
                  :isRequired="requestPrompt.isRequired"
                  :inAdminMode="inAdminMode&&!isNewRequest"
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></yes-no-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'selectRoom' && requestPrompt.screenNum == currentScreenNum)"> 
                <event-location-input
                  :isRequired="requestPrompt.isRequired"
                  :inAdminMode="inAdminMode&&!isNewRequest" 
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></event-location-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'eventSchedule' && requestPrompt.screenNum == currentScreenNum)"> 
                <event-date-time-input 
                  :isRequired="requestPrompt.isRequired"
                  :inAdminMode="inAdminMode&&!isNewRequest"
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></event-date-time-input>
              </template>

            </div>
            <br>
            <div class="mb-3">
              <button type="button" id="continueBtn" class="btn btn-primary btn-sm" @click.prevent="onContinue">Save&nbsp;&amp;&nbsp;Continue&nbsp;<i class="fas fa-arrow-right"></i></button>
            </div>
            <p class="text-danger" id="viewLevelExtendedErrorMsg" :hidden="enoughRoomCapacity">The total number of attendees exceeds the room capacity.</p>
            <p class="text-danger" id="viewLevelErrorMsg" :hidden="!hasValidationError">Please correct your input above.</p>
            <br>
            <br>
          </form>
        </div>

      </div>

    </div>
</template>

<script>
import axios from 'axios'
import * as util from '@/common/util.js';
import * as apiMgr from '@/common/apiMgr.js';
import * as localCacheMgr from '@/common/localCacheMgr.js';

import { clearValidationMessages, validateRequest, manageProcessingStatus, bindUiValuesFromRequest, applyBadgeColorBasedOnProcessingStatus, isTotalAttendeesLessThanOrEqualToRoomCapacity } from '@/common/requestMgr.js'

import textInputCtrl from '@/components/requestPrompts/TextInput.vue'
import textAreaInputCtrl from '@/components/requestPrompts/TextAreaInput.vue'
import emailInputCtrl from '@/components/requestPrompts/EmailInput.vue'
import numberInputCtrl from '@/components/requestPrompts/NumberInput.vue'
import yesNoInputCtrl from '@/components/requestPrompts/YesNoInput.vue'
import yesNoWithCommentInputCtrl from '@/components/requestPrompts/YesNoWithCommentInput.vue'
import eventLocInputCtrl from '@/components/requestPrompts/EventLocationInput.vue'
import eventDateTimeInputCtrl from '@/components/requestPrompts/EventDateTimeInput.vue'

export default {

  props: ['currentScreenNum', 'requestId'],

  components: {
    textInput: textInputCtrl,
    textAreaInput: textAreaInputCtrl,
    emailInput: emailInputCtrl,
    numberInput: numberInputCtrl,
    yesNoInput: yesNoInputCtrl,
    yesNoWithCommentInput: yesNoWithCommentInputCtrl,
    eventLocationInput: eventLocInputCtrl,
    eventDateTimeInput: eventDateTimeInputCtrl
  },

    data () {
    return {  
      hasValidationError: false,
      enoughRoomCapacity: true,
      showPleaseReviewCommentsMsg: false,
      requestStatusMessageRejectedViewDescription: this.$store.state.appConfig.RequestStatusMessageRejectedViewDescription
    }
  },

  computed: {

    requestPrompts() {
      return this.$store.state.requestPrompts;
    },

    currentUserEmail() {
      var email = null;
      if (this.$store.state.currentUser != null) {
        email = this.$store.state.currentUser.email;
      }
      return email;
    },

    currentUserName() {
      var name = null;
      if (this.$store.state.currentUser != null) {
        name = this.$store.state.currentUser.name;
      }
      return name;
    },

    currentUserPhone() {
      var phone = null;
      if (this.$store.state.currentUser != null) {
        phone = this.$store.state.currentUser.phone;
      }
      return phone;
    },

    canEditEmail() {
      var canEdit = false;
      if (this.inAdminMode && this.isNewRequest) {
        canEdit = true;
      }
      return canEdit;
    },

    requestProcessingStatus() {
      var status = null;
      var storeState = this.$store.state;
      if (storeState.currentRequest != null && storeState.currentRequest.processingStatus != null) {
        status = storeState.currentRequest.processingStatus;
      }
      return status;
    },

    requestProcessingStatusLabel() {
      var label = null;
      var storeState = this.$store.state;
      if (storeState.currentRequest != null && storeState.currentRequest.processingStatusLabel != null) {
        label = storeState.currentRequest.processingStatusLabel;
      }
      return label;
    },

    isNewRequest() {
      var isNew = true;
      var storeState = this.$store.state;
      if (storeState.currentRequest != null && storeState.currentRequest._id != undefined && storeState.currentRequest._id != null) {
        isNew = false;
      }
      return isNew;
    },

    inAdminMode() {
      return this.$store.state.inAdminMode;
    },

    canEditRequest() {

      var canEdit = false;
      var storeState = this.$store.state;

      if (this.isNewRequest) {
        canEdit = true;
      } else if (storeState.currentRequest != null) {
        if (this.inAdminMode) {
          canEdit = storeState.currentRequest.adminCanEdit;
        } else {
          canEdit = storeState.currentRequest.userCanEdit;
        }
      }
      return canEdit;
    }

  },

  
  updated() {
      applyBadgeColorBasedOnProcessingStatus();
  },


  activated() {
    util.logDebugMsg('RequestCommon.vue activated.');
    var storeState = this.$store.state;

    if (storeState.appConfig.newRequestViewTitle == null) {
      this.$router.push('/login'); // Config data lost, force back to login to refetch data.
      return;
    }

    this.hasValidationError = false;
    this.showPleaseReviewCommentsMsg = false;

    clearValidationMessages(storeState.requestPrompts, this.currentScreenNum);

    this.checkIfUserNeedToReviewComment();

    $('.is-admin-comment').hide();
    if (this.isNewRequest) {
      $('.is-admin-comment').val("");
      util.logDebugMsg('RequestCommon.vue - isNewRequest == true, so clear all is-admin-comment ctrl values.');
    }

    if (this.isNewRequest) {
      storeState.currentViewTitle = storeState.appConfig.newRequestViewTitle;
    } else {
      storeState.currentViewTitle = storeState.appConfig.editRequestViewTitle;
    }
    storeState.enableNavBar = true;

    if (storeState.currentRequest == null) {
      //xx scan of newUnsubmitted
      // let workingNewRequest = localCacheMgr.getCachedItem(util.makeWorkingNewRequestCacheKey(storeState.loginContext.requesterEmail));
      // if (workingNewRequest != undefined && workingNewRequest != null) {

      //   storeState.currentRequest = workingNewRequest;
      // } else {
        storeState.currentRequest = {};
        storeState.currentRequest.userCanEdit = true;
        storeState.currentRequest.adminCanEdit = false; 
      //}
    } 

    this.InitDependsOnControls();

    if (this.canEditRequest && this.currentUserEmail != null) {
      storeState.currentRequest["eventGEContactPersonEmail"] = this.currentUserEmail;
    }

    if (this.canEditRequest && this.currentUserName != null) {
      storeState.currentRequest["eventGEContactPersonName"] = this.currentUserName;
    }

    if (this.canEditRequest && this.currentUserPhone != null) {
      storeState.currentRequest["eventGEContactPersonPhone"] = this.currentUserPhone;
    }

    if (storeState.currentRequest.locationOfEvent == null && storeState.selectedRoom != null) { 
      util.logDebugMsg('RequestCommon.vue - currentRequest.locationOfEvent is null and storeState.selectedRoom is available to be assigned.');
      storeState.currentRequest.locationOfEvent = storeState.selectedRoom;
      storeState.selectedRoom = null;
      util.logDebugMsg('RequestCommon.vue - storeState.selectedRoom is now consumed, set selectedRoom to null.');      
    }

    bindUiValuesFromRequest(storeState.currentRequest, this.currentScreenNum, (this.inAdminMode && !this.isNewRequest));

    var emailCtrl = $("#eventGEContactPersonEmail");
    if (emailCtrl != null) {
      if (this.canEditEmail) {
        emailCtrl.prop('readonly', false);
        emailCtrl.prop('disabled', false);    
      } else {
        emailCtrl.prop('readonly', true);
        emailCtrl.prop('disabled', true);
        emailCtrl.css("background-color", "white")
      }
    }

    // FOrce update to ensure newly assigned room rebind to the UI.
    this.$forceUpdate();

    this.$nextTick(function () {
      if (this.isNewRequest) {
        if (storeState.currentRequest.eventSchedule == null || storeState.currentRequest.eventSchedule.startDateTime == null) {
          $('#eventScheduleStartTime').val(this.$store.state.defaultTimeOption);
          $('#eventScheduleEndTime').val(this.$store.state.defaultTimeOption); 
        }
      } else {
        try {
          var timeParts = util.getDateTimeParts(storeState.currentRequest.eventSchedule.startDateTime);
          var fullDateUsingDashes = timeParts.fullDateUsingDashes;
          var timeOption = timeParts.timeOption;
          $('#eventScheduleStartDate').val(fullDateUsingDashes);
          $('#eventScheduleStartTime').val(timeOption);
        } catch (err) {}

        try {
          var timeParts = util.getDateTimeParts(storeState.currentRequest.eventSchedule.endDateTime);
          var fullDateUsingDashes = timeParts.fullDateUsingDashes;
          var timeOption = timeParts.timeOption;
          $('#eventScheduleEndDate').val(fullDateUsingDashes);
          $('#eventScheduleEndTime').val(timeOption);
        } catch (err) {}
      }
    });

  },

  deactivated() {
      util.logDebugMsg('RequestCommon.vue deactivated.');

      var vm = this;
      var storeState = vm.$store.state;

      this.bindCtrlValuesToRequestProperties();   
      
      // //xx
      // try {
      //   if (this.isNewRequest) {
      //     localCacheMgr.cacheItem(util.makeWorkingNewRequestCacheKey(storeState.loginContext.requesterEmail), storeState.currentRequest);
      //   } else {
      //     localCacheMgr.cacheItem(util.makeRevisingRequestCacheKey(storeState.loginContext.requesterEmail, storeState.currentRequest._id), storeState.currentRequest);
      //   }
      // } catch (err) {
      //   console.log("Not able to locally cache the working request");
      // }

      if (vm.currentScreenNum == 1 && storeState.currentUser != null) {
          var usersUrl = apiMgr.getUsersUrl();

          storeState.currentUser.email = storeState.currentRequest.eventGEContactPersonEmail;
          storeState.currentUser.name = storeState.currentRequest.eventGEContactPersonName;
          storeState.currentUser.phone = storeState.currentRequest.eventGEContactPersonPhone;

          axios.put(usersUrl, storeState.currentUser)
            .then(res => {           
                console.log("Successfully saved the user's profile: " + res.status);
                if (res.data != null) {
                  storeState.currentUser = res.data;
                }               
            })
            .catch((err) => {             
                console.log("Not able to save user profile: " + err);
                // But should not stop the UI from going to the next screen.
                vm.isSubmitting = false;
                vm.hasFailure = false;
                vm.$router.push('/attentionNotes');
            })
      }
  },

  methods: {

    onContinue (evt) {

      var vm = this;
      var storeState = vm.$store.state;

      this.bindCtrlValuesToRequestProperties();
 
      var allValid = validateRequest(storeState.currentRequest, vm.currentScreenNum);

      vm.enoughRoomCapacity = isTotalAttendeesLessThanOrEqualToRoomCapacity(vm.$store.state.currentRequest);
      
      if (allValid && vm.enoughRoomCapacity) {

        this.hasValidationError = false;

        this.saveRequest(request);

        var nextScreenNum = vm.currentScreenNum + 1;
        if (nextScreenNum <= vm.$store.state.numOfRequestScreens) {
          vm.$router.push('/request/' + nextScreenNum);          
        } else {
          vm.$router.push('/attentionNotes');
        }
        
      } else {
        this.hasValidationError = true;       
        //Ensures the view is at the bottom to show the view-level validation error message.
        window.scrollTo(0,document.body.scrollHeight);
      }
    },

    returnHome() {
      if (this.$store.state.inAdminMode) {
        util.logDebugMsg("RequestCommon - $router.push: /admin/home");
        this.$router.push("/admin/home");
      } else {
        util.logDebugMsg("RequestCommon - $router.push: /home");
        this.$router.push("/home");
      }
    },


    saveRequest(request) {

      var url = apiMgr.getRequestsUrl();
      var neverGotSaved = false;

      if (request.processingStatus == undefined || request.processingStatus == null) {
        request.processingStatus = "newUnsubmitted";
        neverGotSaved = true;
      }

      if (neverGotSaved) {

        axios.post(url, request)
        .then(res => {
              if (res.status == 200 && res.data != null) {
                util.logDebugMsg(`Successfully saved the new request: ${request.eventTitle}, status: ${res.status}`);
              } else {
                let errMsg = `unable to saved the new request with newUnsubmitted: ${request.eventTitle}, status: ${res.status}`;
                util.logDebugMsg(errMsg);
                util.centralEvent.$emit('OnRequestBackgroundSaveError', errMsg);
              }             
          })
          .catch((err) => {   
            let errMsg = `unable to saved the new request: ${request.eventTitle}, error: ${err}`;        
            util.logDebugMsg(errMsg);
            util.centralEvent.$emit('OnRequestBackgroundSaveError', errMsg);
          })

      } else {

        axios.put(url, request)
        .then(res => {
              if (res.status == 200 && res.data != null) {
                util.logDebugMsg(`Successfully saved the editing request: ${request.eventTitle}, status: ${res.status}`);
              } else {
                let errMsg = `unable to saved the editing request with newUnsubmitted: ${request.eventTitle}, status: ${res.status}`;
                util.logDebugMsg(errMsg);
                util.centralEvent.$emit('OnRequestBackgroundSaveError', errMsg);
              }             
          })
          .catch((err) => {   
            let errMsg = `unable to saved the editing request: ${request.eventTitle}, error: ${err}`;        
            util.logDebugMsg(errMsg);
            util.centralEvent.$emit('OnRequestBackgroundSaveError', errMsg);
          })
      }

    },

    checkIfUserNeedToReviewComment() {

      var storeState = this.$store.state;
      this.showPleaseReviewCommentsMsg = false;

      if (this.currentScreenNum == 1 && 
      !this.inAdminMode &&
      storeState.currentRequest != null) {
        var properties = Object.getOwnPropertyNames(storeState.currentRequest);

        properties.forEach((property, index) => {
          if (property.indexOf('AdminComment') > -1) {
            let comment = storeState.currentRequest[property];
            if (comment != null && comment != "") {
              this.showPleaseReviewCommentsMsg = true;
            }
        }
        });
      }

    },


    bindCtrlValuesToRequestProperties() {

      var storeState = this.$store.state; 
      var vm = this;

      if (this.canEditRequest) {

        var ctrls = $('.is-request-data');
        let foundStartDate = null;
        let foundEndDate = null;
        $.each(ctrls, function (index, inputCtrl) {

          //index becomes a property (obj1['prop1'] acts like obj1.prop1)
          if ($(inputCtrl).attr('screenNum') == vm.currentScreenNum) {

            var ctrlVal = $(inputCtrl).val();
            if (ctrlVal != null && typeof ctrlVal == "string") {
              ctrlVal = ctrlVal.trim();
            }

            if ($(inputCtrl).attr('isBoolean') == "true") {

                let tempVal = $(inputCtrl);
                storeState.currentRequest[inputCtrl.id] = tempVal[0].checked;  

            } else if ($(inputCtrl).attr('isNumeric') == "true") {
              
              try {
                if (ctrlVal == null || ctrlVal == "") {
                  try {
                    storeState.currentRequest[inputCtrl.id] = null;
                  } catch (err) {}
                } else {
                  storeState.currentRequest[inputCtrl.id] = parseInt(ctrlVal);               
                }
              } catch (err) {
                util.logDebugMsg(`bindCtrlValuesToRequestProperties - Unable to assign ${ctrlVal} to ${inputCtrl.id}`);
              }

            } else if ($(inputCtrl).attr('isRoom') == "true") {

              if (storeState.selectedRoom != null && storeState.currentRequest[inputCtrl.id] == null) {

                storeState.currentRequest[inputCtrl.id] = storeState.selectedRoom;
                util.logDebugMsg(`bindCtrlValuesToRequestProperties - assign selectedRoom (${storeState.selectedRoom.name}) to currentRequest (${storeState.currentRequest.eventTitle})`);
                storeState.selectedRoom = null;
                util.logDebugMsg('bindCtrlValuesToRequestProperties - reset selectedRoom back to null since its consumed');
              }

            } else if ($(inputCtrl).attr('isEventDateTime') == "true") {

                util.logDebugMsg("bindCtrlValuesToRequestProperties - isEventDateTime - ctrl id: " + inputCtrl.id);

                let startDateCtrlId = inputCtrl.id + "StartDate";
                let startTimeCtrlId = inputCtrl.id + "StartTime";
                let endDateCtrlId = inputCtrl.id + "EndDate";
                let endTimeCtrlId = inputCtrl.id + "EndTime";
                
                var startDateVal = $('#' + startDateCtrlId).val();
                var startTimeVal = $('#' + startTimeCtrlId).val();

                var endDateVal = $('#' + endDateCtrlId).val();
                if (endDateVal == null || endDateVal == "") {
                  endDateVal = startDateVal;
                }
                var endTimeVal = $('#' + endTimeCtrlId).val();

                var providedStartDateTime = null;
                var providedEndDateTime = null;

                if (startDateVal != null && startDateVal != "" &&
                    startTimeVal != null && startTimeVal != "") {

                  let selectStartDateTimeStr = startDateVal + " " + startTimeVal;
                  selectStartDateTimeStr = selectStartDateTimeStr.replace(new RegExp('-', 'g'), '/');
                  util.logDebugMsg("providedStartDateTime - selectStartDateTimeStr: " + selectStartDateTimeStr);
                  providedStartDateTime = Date.parse(selectStartDateTimeStr);                 
                  util.logDebugMsg("providedStartDateTime - Date: " + providedStartDateTime.toString());

                }

                if (endDateVal != null && endDateVal != "" &&
                    endTimeVal != null && endTimeVal != "") {
                  
                  let selectEndDateTimeStr = endDateVal + " " + endTimeVal;
                  selectEndDateTimeStr = selectEndDateTimeStr.replace(new RegExp('-', 'g'), '/');  
                  util.logDebugMsg("providedStartDateTime - selectEndDateTimeStr: " + selectEndDateTimeStr);
                  providedEndDateTime = Date.parse(selectEndDateTimeStr);
                  util.logDebugMsg("providedStartDateTime - Date: " + providedEndDateTime.toString());

                }

                if (providedStartDateTime == null && providedEndDateTime == null) {
                  util.logDebugMsg("providedStartDateTime - both providedStartDateTime & providedEndDateTime are null!");
                  try {
                    storeState.currentRequest[inputCtrl.id] = null;
                  } catch (err) {}

                } else {
                  storeState.currentRequest[inputCtrl.id] = {
                    startDateTime: providedStartDateTime,
                    endDateTime: providedEndDateTime,
                  }

                  util.logDebugMsg(inputCtrl.id + " - assigned startDateTime: " + util.getDateTimeDisplay(storeState.currentRequest[inputCtrl.id].startDateTime));
                  util.logDebugMsg(inputCtrl.id + " - assigned endDateTime: " + util.getDateTimeDisplay(storeState.currentRequest[inputCtrl.id].startDateTime));
                }

              } else {
                if (ctrlVal == null || ctrlVal == "") {
                  try {
                    storeState.currentRequest[inputCtrl.id] = null;
                  } catch (err) {}
                } else {
                  storeState.currentRequest[inputCtrl.id] = ctrlVal;
                }
              } 

          }        
        });
      }
      

      if (this.inAdminMode) {
        var adminCommentctrls = $('.is-admin-comment');
        $.each(adminCommentctrls, function (index, inputCtrl) {

          if ($(inputCtrl).attr('screenNum') == vm.currentScreenNum) {
            var ctrlVal = $(inputCtrl).val();
            if (ctrlVal != null && typeof ctrlVal == "string") {
              ctrlVal = ctrlVal.trim();
            }
            if (ctrlVal == null || ctrlVal == "") {
              try {
                storeState.currentRequest[inputCtrl.id] = null;
              } catch (err) {}
            } else {
              storeState.currentRequest[inputCtrl.id] = ctrlVal;
            }
          }

        });
      }
    },


    InitDependsOnControls() {

      var vm = this;
      var storeState = this.$store.state; 

      $.each(this.requestPrompts, function (index, prompt) {
        var dependsOn = prompt.inputType.dependsOn;
        if (prompt.screenNum == vm.currentScreenNum && dependsOn != undefined && dependsOn != null) {
          if (storeState.currentRequest[dependsOn] == true) {
            $("#"+prompt.inputType.ctrlDataId+"Container").show();
          } else {
            $("#"+prompt.inputType.ctrlDataId+"Container").hide();
            if (storeState.currentRequest[prompt.inputType.ctrlDataId] != undefined) {
              storeState.currentRequest[prompt.inputType.ctrlDataId] = null;
            }
          }
          $("#"+dependsOn).attr("dependentCtrlId", prompt.inputType.ctrlDataId);
        }
      });

      var ctrls = $('[dependentCtrlId]');
      $.each(ctrls, function (index, ctrl) {
        $(ctrl).change(function() { 
            var isChecked = $(this).is(':checked')
            var dependentCtrlId = $(this).attr("dependentCtrlId");
            var ctrl = $("#"+dependentCtrlId);
            var ctrlContainer = $("#"+dependentCtrlId+"Container");
            if (isChecked) {          
              ctrlContainer.show();
            } else {
              ctrlContainer.hide();
              var checkedAttr = ctrl.prop('checked');
              if (checkedAttr != undefined && checkedAttr != "") {
                ctrl.prop('checked', false);
              } else {
                ctrl.val("");
              }
              if (storeState.currentRequest[dependentCtrlId] != undefined) {
                storeState.currentRequest[dependentCtrlId] = null;
              }
            }
        });
      });
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footerBar {
  display: inline-block;
  margin: 16px;
}
.container{
  flex-direction: column;
  display: flex;
}
</style>