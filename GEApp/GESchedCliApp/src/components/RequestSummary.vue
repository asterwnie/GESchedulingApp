<template>
<div>
  <div class="container-fluid" style="width:100%">
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">
          
          <div class="card">
            <div class="card-header bg-info text-light">
              Request Summary &nbsp;&nbsp;
              <span class="badge badge-warning" v-if="canEditAdminGeneralComment" @click.prevent="onAddAdminComment"><span class="far fa-comment-dots"></span></span>
              &nbsp;
              <span class="badge badge-warning" v-if="canEditPreparationInfo" @click.prevent="onAddPreparationNotes">Preparation Notes&nbsp;<span class="far fa-comment-dots"></span></span>
            </div>

            <div>  
              <label id="generalAdminCommentLabel" for="generalAdminComment" style="display:none;">&nbsp;&nbsp;General Comment:</label>
              <textarea id="generalAdminComment" style="display:none; border: 2px solid orange;" placeholder="Add General Comment" class="is-admin-comment form-control form-control-sm"></textarea>
            </div>

            <div>  
              <label id="generalPreparationNotesLabel" for="generalPreparationNotes" style="display:none;">&nbsp;&nbsp;Preparation Notes:</label>
              <textarea id="generalPreparationNotes" style="display:none; border: 2px solid orange;" placeholder="Add Preparation Notes" class="is-admin-comment form-control form-control-sm"></textarea>
            </div>            
            <div align="center" style="padding-top:6px;"><span v-if="requestProcessingStatus != null" :class="requestProcessingStatus">{{requestProcessingStatusLabel}}</span></div>
            <div class="card-body">
                <div style="width:100%" v-for="(requestReadOnlyProperty, index) in requestReadOnlyProperties" :key="index">
                  <div v-if="(requestReadOnlyProperty.value != '' && requestReadOnlyProperty.value != null) || requestReadOnlyProperty.value === false">
                    <span class="request-summary-label">  <!--Convert to Sentence Case-->
                      {{requestReadOnlyProperty.label}}
                    </span>
                    <br>
                    <div v-if="requestReadOnlyProperty.value.sizeType != null">
                      <div class="card">
                        <div class="card-body">
                          <h6 class="card-title">{{requestReadOnlyProperty.value.name}}</h6>
                          <div class="card-text" :hidden="requestReadOnlyProperty.value.building == null || requestReadOnlyProperty.value.building == ''">Building: {{requestReadOnlyProperty.value.building}}</div>
                          <div class="card-text" :hidden="requestReadOnlyProperty.value.sizeType == null || requestReadOnlyProperty.value.sizeType == ''">Size Type: {{requestReadOnlyProperty.value.sizeType}}</div>
                          <div class="card-text" :hidden="requestReadOnlyProperty.value.seatingCapacity == null || requestReadOnlyProperty.value.seatingCapacity == ''">Seating Capacity: {{requestReadOnlyProperty.value.seatingCapacity}}</div>
                          <div class="card-text" :hidden="requestReadOnlyProperty.value.capabilities == null || requestReadOnlyProperty.value.capabilities.length == 0">
                            <hr>
                            <span v-for="(capability, index) in requestReadOnlyProperty.value.capabilities" :key="index" style="padding:1px">
                              <span class="badge badge-secondary">
                                {{capability}}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div v-if="requestReadOnlyProperty.value['selectedConfig'] != null">
                        <div class="card">
                          <div class="card-body">
                            <table>
                              <tr>
                                <td style="padding:0px 10px 0px 0px; width:100%">
                                  <h6>Configuration</h6>
                                  <div>{{requestReadOnlyProperty.value['selectedConfig'].replace(/\-/g, " ")}}</div>
                                </td>
                                <td>
                                  <div style="text-align:center">
                                    <img style="height:100px" :src="require(`@/assets/roomconfig/${requestReadOnlyProperty.value.name.replace(/\'|\s+/g, '')}/${requestReadOnlyProperty.value['selectedConfig']}.png`)"/>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else-if="requestReadOnlyProperty.value.isEventSchedule">
                      <span class="font-italic">
                        <div><i class="label-icon fas fa-calendar-check" style="margin-left:6px;"></i>&nbsp;&nbsp;{{requestReadOnlyProperty.value.eventDateTimeDisp}}</div>
                      </span>
                    </div>
                    <div v-else>
                      {{requestReadOnlyProperty.value}}

                    </div>
                    <div v-if="requestReadOnlyProperty.adminComment != null">
                      <span class="font-italic" style="background-color:lightyellow">
                      Comment:  {{requestReadOnlyProperty.adminComment}}
                      </span>
                    </div>
                  </div>
                  <div style="height:10px"></div>
                </div>
            </div>
          </div>

         
          <br>
          <div v-if="canEditRequest">
            <div v-if="inAdminMode && !isNewRequest">
              <div v-if="!isApproved">
                <button type="button" class="btn btn-primary btn-sm" 
                  :disabled="isSubmitting" 
                  @click.prevent="onApproveRequest">Approve</button>

                <button type="button" class="btn btn-primary btn-sm" 
                  :disabled="isSubmitting" 
                  @click.prevent="onRejectRequest">{{rejectedLabel}}</button>
              </div>
              <div v-else>
                <button type="button" class="btn btn-primary btn-sm" 
                  :disabled="isSubmitting" 
                  @click.prevent="onSubmitRequest">Update</button>
                <button type="button" class="btn btn-primary btn-sm float-right" 
                  @click.prevent="onPrint"><span class="fas fa-print"></span>&nbsp;Print</button>                  
              </div>
            </div>
            <div v-else>
              <button type="button" class="btn btn-primary btn-sm" 
                :disabled="isSubmitting" 
                @click.prevent="onSubmitRequest">Submit Request</button>
            </div>
          </div>
          <div v-else>
            <button type="button" class="btn btn-primary btn-sm" 
              @click.prevent="onReturnHome">Return</button>
            <button type="button" class="btn btn-primary btn-sm float-right" 
              @click.prevent="onPrint"><span class="fas fa-print"></span>&nbsp;Print</button>   
            <span class="float-right">&nbsp;</span>
            <button v-if="!inAdminMode" type="button" class="btn btn-primary btn-sm float-right" 
              @click.prevent="$router.push('/attentionNotes')"><i class="fas fa-exclamation-circle"></i></button>           
          </div>         
          <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
          <br>
          <br>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal" id="sendEmailConfirmDialog" tabindex="-1" role="dialog" aria-labelledby="sendEmailConfirmLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="sendEmailConfirmLabel">{{sendEmailConfirmDialogTitle}}</h5>
          <button @click.prevent="onDontSendEmail" type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>{{sendEmailConfirmDialogMessage}}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click.prevent="onDontSendEmail">No</button>
          <button type="button" class="btn btn-primary" @click.prevent="onSendEmailToNotifyStatus">Yes</button>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import axios from 'axios'
import * as util from '@/common/util.js';
import * as apiMgr from '@/common/apiMgr.js';
import * as localCacheMgr from '@/common/localCacheMgr.js';
import { manageProcessingStatus, applyBadgeColorBasedOnProcessingStatus } from '@/common/requestMgr.js'

export default {
  data () {
    return {  
      isSubmitting: false,
      hasFailure: false,
      failureMessage: null,
      sendEmailConfirmDialogTitle: null,
      sendEmailConfirmDialogMessage: null,
      requestReadOnlyProperties: [],
      rejectedLabel: this.$store.state.appConfig.requestStatusTagRejected,
      approvedLabel: this.$store.state.appConfig.requestStatusTagApproved
    }
  },

  computed: {

    isNewRequest() {
      var isNew = true;
      var storeState = this.$store.state;
      if (storeState.currentRequest != null &&
          storeState.currentRequest.processingStatus != undefined && 
          storeState.currentRequest.processingStatus != null && 
          storeState.currentRequest.processingStatus != "newUnsubmitted") {
        isNew = false;
      }
      return isNew;
    },


    inAdminMode() {
      let isAdmin = this.$store.state.inAdminMode;
      util.logDebugMsg('RequestSummary.vue - inAdminMode: ' + isAdmin);
      return isAdmin;
    },


    requestProcessingStatus() {
      var status = null;
      var storeState = this.$store.state;
      if (storeState.currentRequest != null && storeState.currentRequest.processingStatus != null) {
        status = storeState.currentRequest.processingStatus;
      }
      util.logDebugMsg('RequestSummary.vue - requestProcessingStatus: ' + status);
      return status;
    },


    requestProcessingStatusLabel() {
      var label = null;
      var storeState = this.$store.state;
      if (storeState.currentRequest != null && storeState.currentRequest.processingStatusLabel != null) {
        label = storeState.currentRequest.processingStatusLabel;
      }
      util.logDebugMsg('RequestSummary.vue - requestProcessingStatusLabel: ' + label);
      return label;
    },


    canEditPreparationInfo() {
      var status = false;
      var storeState = this.$store.state;
      if (this.inAdminMode && storeState.currentRequest != null && 
          storeState.currentRequest.processingStatus != null &&
          storeState.currentRequest.processingStatus != "underReview" &&
          storeState.currentRequest.processingStatus != "rejected") {
        status = true;
      } else {
        status = false;
      }
      util.logDebugMsg('RequestSummary.vue - canEditPreparationInfo: ' + status);
      return status;
    },


    canEditAdminGeneralComment() {
      let status = false;
      var storeState = this.$store.state;
      if (this.inAdminMode && storeState.currentRequest != null && 
          storeState.currentRequest.processingStatus != null &&
          storeState.currentRequest.processingStatus != 'rejected') {
        status = true;
      } else {
        status = false;
      }
      util.logDebugMsg('RequestSummary.vue - canEditAdminGeneralComment: ' + status);
      return status;
    },


    canEditRequest() {
      var canEdit = false;
      var storeState = this.$store.state;

      if (this.isNewRequest) {
        canEdit = true;
      } else if (!this.inAdminMode && storeState.currentRequest != null && storeState.currentRequest.userCanEdit != undefined && storeState.currentRequest.userCanEdit == true) {
        canEdit = true;
      } else if (this.inAdminMode && storeState.currentRequest != null && 
                 storeState.currentRequest.processingStatus != null && 
                 storeState.currentRequest.adminCanEdit != undefined && 
                 storeState.currentRequest.adminCanEdit == true) {
        canEdit = true;
      }
      util.logDebugMsg('RequestSummary.vue - canEditRequest: ' + canEdit);
      return canEdit;
    },


    isNewRequest() {
      var isNew = true;
      var storeState = this.$store.state;
      if (storeState.currentRequest != null &&
          storeState.currentRequest.processingStatus != undefined && 
          storeState.currentRequest.processingStatus != null && 
          storeState.currentRequest.processingStatus != "newUnsubmitted") {
        isNew = false;
      }
      util.logDebugMsg('RequestSummary.vue - isNewRequest: ' + isNew);
      return isNew;
    },


    isApproved() {
      var approved = false;
      var storeState = this.$store.state;
      if (storeState.currentRequest != null && 
          storeState.currentRequest.processingStatus != undefined && 
          storeState.currentRequest.processingStatus == "approved") {
        approved = true;
      }
      util.logDebugMsg('RequestSummary.vue - isApproved: ' + approved);
      return approved;
    },


    adminCommentCtrlId() {
      return this.ctrlId + "AdminComment";
    },

    adminPreparationInfoCtrlId() {
      return this.ctrlId + "PreparationInfo";
    }

  },

  updated() {
      applyBadgeColorBasedOnProcessingStatus();
  },

  activated() {
    util.logDebugMsg('RequestSummary.vue activated.');
    let vm = this;
    var storeState = this.$store.state;

    if (storeState.appConfig.submitRequestViewTitle == null) {
      this.$router.push('/login'); // Config data lost, force back to login to refetch data.
      return;
    }

    if (this.inAdminMode) {

      util.logDebugMsg('RequestSummary.vue - inAdminMode == true, about to manage setting the generalAdminComment and generalPreparationNotes control value');

      var commentCtrl = $("#generalAdminComment");
      if (storeState.currentRequest.generalAdminComment != undefined && storeState.currentRequest.generalAdminComment != "") {
        commentCtrl.val(storeState.currentRequest.generalAdminComment);
        util.logDebugMsg('RequestSummary.vue - finished setting generalAdminComment ctrl with: ' + storeState.currentRequest.generalAdminComment);
      } else {
        commentCtrl.val(null);
        util.logDebugMsg('RequestSummary.vue - finished setting generalAdminComment ctrl with null.');
      }

      var notesCtrl = $("#generalPreparationNotes");
      if (storeState.currentRequest.generalPreparationNotes != undefined && storeState.currentRequest.generalPreparationNotes != "") {
        notesCtrl.val(storeState.currentRequest.generalPreparationNotes);
        util.logDebugMsg('RequestSummary.vue - finished setting generalPreparationNotes ctrl with: ' + storeState.currentRequest.generalPreparationNotes);
      } else {
        notesCtrl.val(null);
        util.logDebugMsg('RequestSummary.vue - finished setting generalPreparationNotes ctrl with null.');
      }

    }

    if (this.canEditRequest) {
      storeState.currentViewTitle = storeState.appConfig.submitRequestViewTitle;
    } else {
      storeState.currentViewTitle = storeState.appConfig.viewRequestViewTitle;
    }

    this.showHideLabeledTextArea(this.canEditAdminGeneralComment, "generalAdminComment");
    this.showHideLabeledTextArea(this.canEditPreparationInfo, "generalPreparationNotes");

    storeState.enableNavBar = true;

    let requestPrompts = storeState.requestPrompts;
    let currentRequest = storeState.currentRequest;

    this.requestReadOnlyProperties = [];
    requestPrompts.forEach(function(requestPrompt) {

      var val = currentRequest[requestPrompt.inputType.ctrlDataId];

      util.logDebugMsg("Preparing read-only request item - id: " + requestPrompt.inputType.ctrlDataId);
      util.logDebugMsg("Preparing read-only request item - ctrlType: " + requestPrompt.inputType.ctrlType);

      if (val === null || val === "") {
        util.logDebugMsg("Preparing read-only request item - value NOT assigned!");
      } else {
        util.logDebugMsg("Preparing read-only request item - JSON value: " + JSON.stringify(val)); 
      }

      if (val != undefined && val != null && val != "") {
        var reqProperty = { label: requestPrompt.label, value: val, adminComment: null };
        
        if (requestPrompt.inputType.isValueBoolean) {
          
          if (currentRequest[requestPrompt.inputType.ctrlDataId] == true) {
            reqProperty.value = "Yes";
          } else {
            reqProperty.value = "No";
          }
        }

        if (requestPrompt.inputType.ctrlType == "eventSchedule") {
          
          util.logDebugMsg("Preparing eventSchedule start & end time display for: " + requestPrompt.inputType.ctrlDataId);

          var schedValue = currentRequest[requestPrompt.inputType.ctrlDataId];

          var eventDateTimeDisp = util.makeEventDateTimeDisplay(currentRequest.eventSchedule.startDateTime, currentRequest.eventSchedule.endDateTime);

          var schedDispValue = {
            startDateTime: null,
            endDateTime: null,
            eventDateTimeDisp: eventDateTimeDisp,
            isEventSchedule: true
          };

          if (schedValue.startDateTime != null) {
            schedDispValue.startDateTime = util.getDateTimeDisplay(schedValue.startDateTime);
          } else {
            util.logDebugMsg("Preparing eventSchedule startDateTime - value is null!");
          }
          if (schedValue.endDateTime != null) {
            schedDispValue.endDateTime = util.getDateTimeDisplay(schedValue.endDateTime);
          } else {
            util.logDebugMsg("Preparing eventSchedule endDateTime - value is null!");
          }

          reqProperty.value = schedDispValue;
        }

        var additionalComment = currentRequest[requestPrompt.inputType.ctrlDataId + "AdditionalComment"]; 
        if (additionalComment != undefined && additionalComment != null && additionalComment != "") {
          reqProperty.value += (": " + additionalComment);
        }

        var adminComment = currentRequest[requestPrompt.inputType.ctrlDataId + 'AdminComment'];
        if (adminComment != undefined && adminComment != null && adminComment != "") {
          reqProperty.adminComment = adminComment;
        }
        vm.requestReadOnlyProperties.push(reqProperty);
      }
    });
  },

  created() {
      console.log('RequestSummary.vue created.');
  },

  methods: {

    updateSendEmailConfirmDialogTitle(request) {
      if (request.processingStatus == "approved") {
        this.sendEmailConfirmDialogTitle = this.$store.state.appConfig.requestApprovedEmailViewTitle;
      } else if (request.processingStatus == "rejected") {
        this.sendEmailConfirmDialogTitle = this.$store.state.appConfig.requestNeedMoreInfoEmailViewTitle;
      } else if (request.processingStatus == "underReview"){
        this.sendEmailConfirmDialogTitle = this.$store.state.appConfig.requestSubmittedEmailViewTitle;
      }
    },


    updateSendEmailConfirmDialogMessage(request) {
      if (request.processingStatus == "approved") {
        this.sendEmailConfirmDialogMessage = this.$store.state.appConfig.requestApprovedEmailAsk;
      } else if (request.processingStatus == "rejected") {
        this.sendEmailConfirmDialogMessage = this.$store.state.appConfig.requestNeedMoreInfoEmailAsk;
      } else if (request.processingStatus == "underReview"){
        this.sendEmailConfirmDialogMessage = this.$store.state.appConfig.requestSubmittedEmailAsk;
      }
    },


    onDontSendEmail() {
      $('#sendEmailConfirmDialog').modal('hide');
      this.$store.state.isModalBeingDisplayed = false;
      this.$store.state.currentRequest = null;
      util.logDebugMsg('RequestSummary - onDontSendEmail - set currentRequest to null.');
      this.onReturnHome();
    },


    onSendEmailToNotifyStatus() {
      let currentRequest = this.$store.state.currentRequest;
      if (currentRequest == null) { return; }

      $('#sendEmailConfirmDialog').modal('hide');
      this.$store.state.isModalBeingDisplayed = false;
      if (currentRequest.processingStatus == "approved") {
        this.onEmailOutApproval();
      } else if (currentRequest.processingStatus == "rejected") {
        this.onEmailOutNeedMoreInfo();
      } else if (currentRequest.processingStatus == "underReview"){
        this.onEmailOutUnderReview();
      }
    },


    onEmailOutApproval() {

      var storeState = this.$store.state;
      let currentRequest = this.$store.state.currentRequest;
      storeState.defRecipientNameForSendEmail = currentRequest.eventGEContactPersonName;
      storeState.defRecipientEmailForSendEmail = currentRequest.eventGEContactPersonEmail;
      storeState.currentRequest = null;
      util.logDebugMsg('RequestSummary - onEmailOutApproval - set currentRequest to null.');

      this.$router.push('/admin/sendapprovedemail'); 
    },


    onEmailOutNeedMoreInfo() {

      var storeState = this.$store.state;
      let currentRequest = this.$store.state.currentRequest;
      storeState.defRecipientNameForSendEmail = currentRequest.eventGEContactPersonName;
      storeState.defRecipientEmailForSendEmail = currentRequest.eventGEContactPersonEmail;
      storeState.currentRequest = null;
      util.logDebugMsg('RequestSummary - onEmailOutNeedMoreInfo - set currentRequest to null.');

      this.$router.push('/admin/sendneedmoreinfoemail'); 
    },


    onEmailOutUnderReview() {

      var storeState = this.$store.state;
      let currentRequest = this.$store.state.currentRequest;
      storeState.defRecipientNameForSendEmail = currentRequest.eventGEContactPersonName;
      storeState.defRecipientEmailForSendEmail = currentRequest.eventGEContactPersonEmail;
      //storeState.currentRequest = null;
      util.logDebugMsg('RequestSummary - onEmailOutUnderReview');

      this.$router.push('/sendsubmittedemail'); 
    },


    showHideLabeledTextArea(canEditRequest, ctrlId) {

      var adminCtrlLabel = $("#" + ctrlId + "Label");
      var adminCtrl = $("#" + ctrlId);

      if (canEditRequest) {

        util.logDebugMsg('showHideLabeledTextArea - canEditRequest == true - ctrlId: ' + ctrlId);

        adminCtrl.prop('readonly', false);
        adminCtrl.prop('disabled', false);

        var needToShow = false;

        var adminCtrlVal = adminCtrl.val();
        if (adminCtrlVal != null && adminCtrlVal != "") {
          needToShow = true;
        }

        util.logDebugMsg('showHideLabeledTextArea - needToShow == ' + needToShow.toString() + ' - value: ' + adminCtrlVal.toString());

        if (needToShow) {
          adminCtrlLabel.show();
          adminCtrl.show();
        } else {
          adminCtrlLabel.hide();
          adminCtrl.hide();
        }
        
      } else {

        util.logDebugMsg('showHideLabeledTextArea - canEditRequest == false - ctrlId: ' + ctrlId);

        adminCtrl.prop('readonly', true);
        adminCtrl.prop('disabled', true);
        adminCtrl.css("background-color", "white")

        var adminCtrlVal = adminCtrl.val();
        if (adminCtrlVal != null && adminCtrlVal != "") {
          needToShow = true;
        }

        util.logDebugMsg('showHideLabeledTextArea - needToShow == ' + needToShow + ' - value: ' + adminCtrlVal);

        if (needToShow) {
          adminCtrlLabel.show();
          adminCtrl.show();
        } else {
          adminCtrlLabel.hide();
          adminCtrl.hide();
        }
      }
    },


    onAddAdminComment(evt) {  

      util.logDebugMsg('RequestSummary.vue - onAddAdminComment');
      var storeState = this.$store.state;
      var adminCtrlLabel = $("#generalAdminCommentLabel");
      var adminCtrl = $("#generalAdminComment");

      if (!adminCtrl.is(':visible')) {

        util.logDebugMsg('onAddAdminComment - generalAdminComment is not visible. About to show control.');
        adminCtrlLabel.show();
        adminCtrl.show();

      } else {

        util.logDebugMsg('onAddAdminComment - generalAdminComment is visible. About to hide control and set control value to null.');
        adminCtrlLabel.hide();
        adminCtrl.hide();
        adminCtrl.val(null);
        if (storeState.currentRequest != null && 
            storeState.currentRequest['generalAdminComment'] != undefined) {
          storeState.currentRequest['generalAdminComment'] = null;
          util.logDebugMsg("RequestSummary.vue - set currentRequest's generalAdminComment to null.");
        }
      }
    },


    onAddPreparationNotes(evt) {  

      util.logDebugMsg('RequestSummary.vue - onAddPreparationNotes');
      var storeState = this.$store.state;
      var adminCtrlLabel = $("#generalPreparationNotesLabel");
      var adminCtrl = $("#generalPreparationNotes");

      if (!adminCtrl.is(':visible')) {

        util.logDebugMsg('onAddPreparationNotes - generalPreparationNotes is not visible. About to show control.');
        adminCtrlLabel.show();
        adminCtrl.show();
      } else {

        util.logDebugMsg('onAddPreparationNotes - generalPreparationNotes is visible. About to hide control and set control value to null.');
        adminCtrlLabel.hide();
        adminCtrl.hide();
        adminCtrl.val(null);

        if (storeState.currentRequest != null && 
            storeState.currentRequest['generalPreparationNotes'] != undefined) {
          storeState.currentRequest['generalPreparationNotes'] = null;
          util.logDebugMsg("RequestSummary.vue - set currentRequest's generalPreparationNotes to null.");
        }
      }
    },


    onApproveRequest(evt) {

      util.logDebugMsg('RequestSummary.vue - onApproveRequest'); 
      var storeState = this.$store.state;
      var currRequest = storeState.currentRequest;
      if (currRequest != null) {
        currRequest.processingStatus = "approved";
        util.logDebugMsg('onApproveRequest - setting currRequest.processingStatus to approved.');
      }
      this.onSubmitRequest(evt);
    },


    onRejectRequest(evt) {

      util.logDebugMsg('RequestSummary.vue - onRejectRequest'); 
      var storeState = this.$store.state;
      var currRequest = storeState.currentRequest;
      if (currRequest != null) {
        currRequest.processingStatus = "rejected";
        util.logDebugMsg('onRejectRequest - setting currRequest.processingStatus to rejected.');
      }
      this.onSubmitRequest(evt);
    },


    onSubmitRequest(evt) {
      util.logDebugMsg('RequestSummary.vue - onSubmitRequest'); 

      var vm = this;
      var storeState = vm.$store.state;
      var currRequest = storeState.currentRequest;

      if (this.inAdminMode) {

        util.logDebugMsg('onSubmitRequest - inAdminMode == true'); 

        var comment = $("#generalAdminComment").val();
        comment = comment.trim();
        if (comment != null && comment != "") {

          currRequest.generalAdminComment = comment;
          util.logDebugMsg('onSubmitRequest - generalAdminComment ctrl value is not null, set currRequest.generalAdminComment: ' + currRequest.generalAdminComment); 

        } else if (currRequest.generalAdminComment != undefined) {
          try {
            currRequest.generalAdminComment = null;
            util.logDebugMsg('onSubmitRequest - set currRequest.generalAdminComment to null.'); 
          } catch (err) {}
        }

        var notes = $("#generalPreparationNotes").val();
        notes = notes.trim();
        if (notes != null && notes != "") {

          currRequest.generalPreparationNotes = notes;
          util.logDebugMsg('onSubmitRequest - generalPreparationNotes ctrl value is not null, set currRequest.generalPreparationNotes: ' + currRequest.generalPreparationNotes); 


        } else if (currRequest.generalPreparationNotes != undefined) {
          try {
            currRequest.generalPreparationNotes = null;
            util.logDebugMsg('onSubmitRequest - set currRequest.generalPreparationNotes to null.'); 
          } catch (err) {}
        }        

      }

      var requestsUrl = apiMgr.getRequestsUrl();

      if (storeState.currentRequest._id == undefined || storeState.currentRequest._id == null) {

        util.logDebugMsg('onSubmitRequest - isNewRequest == true, about to call submitNewRequest.'); 
        this.submitNewRequest(requestsUrl, storeState.currentRequest);

      } else {
       
       util.logDebugMsg('onSubmitRequest - isNewRequest == false, about to call getRequestByIdUrl to Check if item with that id exists.');
        //Check if item with that id exists
        vm.isSubmitting = true;
        var requestsUrlById = apiMgr.getRequestByIdUrl(storeState.currentRequest._id);

        axios.get(requestsUrlById)
          .then(res => {

              console.log("getRequestsUrl return status: " + res.status);

              if (res.status == 200) {
                util.logDebugMsg("onSubmitRequest - Existing request found. About to call submitUpdatedRequest.");             
                this.submitUpdatedRequest(requestsUrl, storeState.currentRequest, false);
              } else {
                util.logDebugMsg("onSubmitRequest - status code is not 200, assume request not found. Creating new request.");
                delete storeState.currentRequest._id;
                this.submitNewRequest(requestsUrl, storeState.currentRequest);
              }          
          })
          .catch((err) => {
              if(err.response != null && err.response.status == 404) { //If that id is not found
                util.logDebugMsg("onSubmitRequest - No existing request found with id. About to call submitNewRequest. id: " + storeState.currentRequest._id);
                this.submitNewRequest(requestsUrl, storeState.currentRequest);
              } else {
                vm.hasFailure = true;
                vm.failureMessage = "Server unavailable or not working at this time. Please try later.";   
                util.logDebugMsg(vm.failureMessage);     
              }
              vm.isSubmitting = false;                   
          })
      }
    },


    submitNewRequest(requestsUrl, request) {

      util.logDebugMsg("submitNewRequest begins");
      var vm = this;
      vm.isSubmitting = true;
      const storeState = vm.$store.state;

      if (request._id == undefined || request._id == null || request.processingStatus == "newUnsubmitted") {
        request.processingStatus = "underReview";
        util.logDebugMsg("submitNewRequest - update request.processingStatus to underReview.");
      }
      manageProcessingStatus(request);

      if (request.processingStatusLabel != undefined && request.processingStatusLabel != null) {
        delete request.processingStatusLabel;
        util.logDebugMsg("submitNewRequest - deleted request.processingStatusLabel");
      }
      if (request.processingStatusMessage != undefined && request.processingStatusMessage != null) {
        delete request.processingStatusMessage;
        util.logDebugMsg("submitNewRequest - deleted request.processingStatusMessage");
      }

      util.logDebugMsg("submitNewRequest - for new request, null properties should be deleted and not saved.");
      var reqProps = Object.getOwnPropertyNames(request);
      reqProps.forEach((prop, index) => {
        try {
          if (request[prop] == undefined || request[prop] == null || request[prop] == "") {
            delete request[prop];
          }
        } catch (err) {}
      });

      axios.post(requestsUrl, request)
      .then(res => {
          util.logDebugMsg("submitNewRequest response status: " + res.status);
          vm.isSubmitting = false;
          vm.hasFailure = false;
          vm.failureMessage = null;
          
          if (res.status == 201 && res.data != null) {
              var requestCreated = res.data;

              storeState.currentRequest = null;
              util.logDebugMsg("submitNewRequest - set currentRequest to null. about to call onReturnHome.");

              $('#sendEmailConfirmDialog').modal('show');
              this.$store.state.isModalBeingDisplayed = true;
              //vm.onReturnHome();

          } else {
                vm.hasFailure = true;
                vm.failureMessage = "Unable to create the meeting request. Please try again.";
                util.logDebugMsg(vm.failureMessage);
          }       
      })
      .catch((err) => {
          util.logDebugMsg("Create request failed: " + err);
          vm.isSubmitting = false;
          vm.hasFailure = true;

          if (err.response != null && err.response.status == 401) { //401 - Unauthorized.                  
              vm.failureMessage = "You're not authorized to create a meeting request.";
              util.logDebugMsg(vm.failureMessage);
            
          } else if (err.response != null && err.response.status == 400) { //400 - Bad Request.                  
              vm.failureMessage = "The Meeting Request server received a bad request. Please contact your administrator if this problem persists.";
              util.logDebugMsg(vm.failureMessage);

          } else {
              vm.failureMessage = "The Meeting Request server is unavailable or not working at this time.";
              util.logDebugMsg(vm.failureMessage);
          }
      })
    },


    submitUpdatedRequest(requestsUrl, request, justUpdateApprovalNotified) {

      util.logDebugMsg("RequestSummary - submitUpdatedRequest");
      var vm = this;
      vm.isSubmitting = true;
      const storeState = vm.$store.state;

      if (request.processingStatus == "newUnsubmitted") {
        request.processingStatus = "underReview";
        util.logDebugMsg("submitNewRequest - update request.processingStatus to underReview.");
      }
      manageProcessingStatus(request);

      if (justUpdateApprovalNotified == undefined || justUpdateApprovalNotified == null) {
        justUpdateApprovalNotified = false;
      }

      if (request._id == undefined || request._id == null || request.processingStatus == "newUnsubmitted") {
        request.processingStatus = "underReview";
        util.logDebugMsg("submitNewRequest - update request.processingStatus to underReview.");
      }

      if (!justUpdateApprovalNotified && request.processingStatus == "rejected" && !this.inAdminMode) {
        util.logDebugMsg("submitUpdatedRequest - request.processingStatus is rejected and not inAdminMode, set request.processingStatus to underReview.");
        request.processingStatus = "underReview";
      }

      if (request.processingStatusLabel != undefined && request.processingStatusLabel != null) {
        delete request.processingStatusLabel;
        util.logDebugMsg("submitUpdatedRequest - delete request.processingStatusLabel");
      }

      if (request.processingStatusMessage != undefined && request.processingStatusMessage != null) {
        delete request.processingStatusMessage;
        util.logDebugMsg("submitUpdatedRequest - delete request.processingStatusMessage");
      }

      axios.put(requestsUrl, request)
      .then(res => {
          util.logDebugMsg("submitUpdatedRequest - submit request for update response status: " + res.status);
          vm.isSubmitting = false;
          vm.hasFailure = false;
          
          if (res.status == 200 && res.data != null) {
              var requestUpdated = res.data;

              let canGoHome = true;
              if (justUpdateApprovalNotified) {
                canGoHome = false;
              }

              if (!justUpdateApprovalNotified && 
                  (requestUpdated.processingStatus == "approved" || requestUpdated.processingStatus == "rejected" || requestUpdated.processingStatus == "underReview")) {
 
                let canDoNotify = true;

                if (requestUpdated.approvalNotified != undefined && requestUpdated.approvalNotified == true) {
                  canDoNotify = false;
                }

                if (canDoNotify) {
                  canGoHome = false;
                  util.logDebugMsg("submitUpdatedRequest - requestUpdated.processingStatus: " + requestUpdated.processingStatus);

                  util.logDebugMsg("submitUpdatedRequest - calling updateSendEmailConfirmDialogTitle & updateSendEmailConfirmDialogMessage");
                  this.updateSendEmailConfirmDialogTitle(requestUpdated);
                  this.updateSendEmailConfirmDialogMessage(requestUpdated);
                  this.$forceUpdate();

                  util.logDebugMsg("submitUpdatedRequest - About to sendEmailConfirmDialog.modal('show')");
                  $('#sendEmailConfirmDialog').modal('show');
                  this.$store.state.isModalBeingDisplayed = true;

                  //Update requestUpdated.approvalNotified = true and call server to save it.
                  requestUpdated.approvalNotified = true;
                  justUpdateApprovalNotified = true;
                  this.submitUpdatedRequest(requestsUrl, requestUpdated, justUpdateApprovalNotified);

                } else {
                  canDoNotify = true;
                }

              } 
              
              if (canGoHome) {
                util.logDebugMsg("submitUpdatedRequest - setting currentRequest to null before calling onReturnHome.");
                storeState.currentRequest = null;
                vm.onReturnHome();
              }         

          } else {
                vm.hasFailure = true;
                vm.failureMessage = "Unable to update the meeting request. Please try again.";
                util.logDebugMsg(vm.failureMessage);
          }       
      })
      .catch((err) => {
          console.log("submitUpdatedRequest - Update request failed: " + err);
          //prevent spam clicking
          vm.isSubmitting = false;
          vm.hasFailure = true;

          if (err.response != null && err.response.status == 401) { //401 - Unauthorized.                  
              vm.failureMessage = "You're not authorized to update a meeting request.";
              util.logDebugMsg("submitUpdatedRequest - " + vm.failureMessage);
            
          } else if (err.response != null && err.response.status == 400) { //400 - Bad Request.                  
              vm.failureMessage = "The Meeting Request server received a bad request. Please contact your administrator if this problem persist.";
              util.logDebugMsg("submitUpdatedRequest - " + vm.failureMessage);
          } else {
              vm.failureMessage = "The Meeting Request server is unavailable or not working at this time.";
              util.logDebugMsg("submitUpdatedRequest - " + vm.failureMessage);
          }
      })
    },


    onPrint(evt) {
      util.logDebugMsg("RequestSummary - launchPrint");
      util.launchPrint();
    },


    onReturnHome() {
      util.logDebugMsg("RequestSummary - onReturnHome, set currentRequest to null.");
      this.$store.state.currentRequest = null;

      if(this.$store.state.inAdminMode){
        util.logDebugMsg("RequestSummary - $router.push: /admin/home");
        this.$router.push("/admin/home");
      } else {
        util.logDebugMsg("RequestSummary - $router.push: /home");
        this.$router.push("/home");
      }
    }

  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.request-summary-label {
  color:#17a2b8 !important;
  font-size:110%;
}
</style>