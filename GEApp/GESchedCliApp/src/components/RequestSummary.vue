<template>
  <div class="container-fluid" style="width:100%">
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">

          <div class="card">
            <div class="card-header bg-info text-light">
              Request Summary &nbsp;&nbsp;
              <span class="badge badge-warning" v-if="canEditAdminGeneralComment" @click.prevent="onAddAdminComment"><span class="far fa-comment-dots"></span></span>
              &nbsp;
              <span class="badge badge-warning" v-if="canEditPreparationInfo" @click.prevent="onAddPreparationNotes">Preparation Notes</span>
            </div>

            <div>  
              <label id="generalAdminCommentLabel" for="generalAdminComment" style="display:none;">&nbsp;&nbsp;General Comment:</label>
              <textarea id="generalAdminComment" style="display:none; border: 2px solid orange;" placeholder="Add General Comment" class="is-admin-comment form-control form-control-sm"></textarea>
            </div>

            <div>  
              <label id="generalPreparationNotesLabel" for="generalPreparationNotes" style="display:none;">&nbsp;&nbsp;Preparation Notes:</label>
              <textarea id="generalPreparationNotes" style="display:none; border: 2px solid orange;" placeholder="Add Preparation Notes" class="is-admin-comment form-control form-control-sm"></textarea>
            </div>            

            <div class="card-body">
                <div style="width:100%" v-for="(requestReadOnlyProperty, index) in requestReadOnlyProperties" :key="index">
                  <div v-if="(requestReadOnlyProperty.value != '' && requestReadOnlyProperty.value != null) || requestReadOnlyProperty.value === false">
                    <span class="font-weight-light" style="">  <!--Convert to Sentence Case-->
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
                              <span class="badge badge-info">
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
                        <div>Start: {{requestReadOnlyProperty.value.startDateTime}}</div>
                        <div>End: {{requestReadOnlyProperty.value.endDateTime}}</div>
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
                  @click.prevent="onApproveRequest">Approve Request</button>
                <button type="button" class="btn btn-primary btn-sm" 
                  :disabled="isSubmitting" 
                  @click.prevent="onRejectRequest">Need More Information</button>
              </div>
              <div v-else>
                <button type="button" class="btn btn-primary btn-sm" 
                  :disabled="isSubmitting" 
                  @click.prevent="onSubmitRequest">Update</button>
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
            <button type="button" class="btn btn-primary btn-sm" 
              @click.prevent="onPrint">Print</button>              
          </div>         
          <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
          <br>
          <br>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios'
import * as util from '@/common/util.js';
import * as apiMgr from '@/common/apiMgr.js';
import * as localCacheMgr from '@/common/localCacheMgr.js';

export default {
  data () {
    return {  
      isSubmitting: false,
      hasFailure: false,
      failureMessage: "",
      requestReadOnlyProperties: [],
    }
  },

  computed: {

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

    canEditPreparationInfo() {
      var storeState = this.$store.state;
      if (this.inAdminMode && storeState.currentRequest != null && 
          storeState.currentRequest.processingStatus != null &&
          storeState.currentRequest.processingStatus != "underReview" &&
          storeState.currentRequest.processingStatus != "rejected") {
        return true;
      } else {
        return false;
      }

    },

    canEditAdminGeneralComment() {
      var storeState = this.$store.state;
      if (this.inAdminMode && storeState.currentRequest != null && 
          storeState.currentRequest.processingStatus != null &&
          storeState.currentRequest.processingStatus != 'rejected') {
        return true;
      } else {
        return false;
      }

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
      return canEdit;
    },

    isNewRequest() {
      var isNew = true;
      var storeState = this.$store.state;
      if (storeState.currentRequest != null && storeState.currentRequest._id != undefined && storeState.currentRequest._id != null) {
        isNew = false;
      }
      return isNew;
    },

    isApproved() {
      var approved = false;
      var storeState = this.$store.state;
      if (storeState.currentRequest != null && 
          storeState.currentRequest.processingStatus != undefined && 
          (storeState.currentRequest.processingStatus == "approved" || 
           storeState.currentRequest.processingStatus == "completed" ||
           storeState.currentRequest.processingStatus == "prepared")) {
        approved = true;
      }
      return approved;
    },

    adminCommentCtrlId() {
      return this.ctrlId + "AdminComment";
    },

    adminPreparationInfoCtrlId() {
      return this.ctrlId + "PreparationInfo";
    }

  },

  activated() {
    util.logDebugMsg('SubmitRequest.vue activated.');
    let vm = this;
    var storeState = this.$store.state;

    if (storeState.appConfig.submitRequestViewTitle == null) {
      this.$router.push('/login'); // Config data lost, force back to login to refetch data.
      return;
    }

    if (this.inAdminMode) {

      var commentCtrl = $("#generalAdminComment");
      if (storeState.currentRequest.generalAdminComment != undefined && storeState.currentRequest.generalAdminComment != "") {
        commentCtrl.val(storeState.currentRequest.generalAdminComment);
      }

      var notesCtrl = $("#generalPreparationNotes");
      if (storeState.currentRequest.generalPreparationNotes != undefined && storeState.currentRequest.generalPreparationNotes != "") {
        notesCtrl.val(storeState.currentRequest.generalPreparationNotes);
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
          var schedDispValue = {
            startDateTime: null,
            endDateTime: null,
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
      console.log('SubmitRequest.vue created.');
  },

  methods: {

    showHideLabeledTextArea(canEditRequest, ctrlId) {

      var adminCtrlLabel = $("#" + ctrlId + "Label");
      var adminCtrl = $("#" + ctrlId);

      if (canEditRequest) {

        adminCtrl.prop('readonly', false);
        adminCtrl.prop('disabled', false);

        var needToShow = false;

        var adminCtrlVal = adminCtrl.val();
        if (adminCtrlVal != null && adminCtrlVal != "") {
          needToShow = true;
        }

        if (needToShow) {
          adminCtrlLabel.show();
          adminCtrl.show();
        } else {
          adminCtrlLabel.hide();
          adminCtrl.hide();
        }
        
      } else {

        adminCtrl.prop('readonly', true);
        adminCtrl.prop('disabled', true);
        adminCtrl.css("background-color", "white")

        var adminCtrlVal = adminCtrl.val();
        if (adminCtrlVal != null && adminCtrlVal != "") {
          needToShow = true;
        }

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

      var storeState = this.$store.state;
      var adminCtrlLabel = $("#generalAdminCommentLabel");
      var adminCtrl = $("#generalAdminComment");
      if (!adminCtrl.is(':visible')) {
        adminCtrlLabel.show();
        adminCtrl.show();
      } else {
        adminCtrlLabel.hide();
        adminCtrl.hide();
        adminCtrl.val(null);
        if (storeState.currentRequest != null && 
            storeState.currentRequest['generalAdminComment'] != undefined) {
          storeState.currentRequest['generalAdminComment'] = null;
        }
      }
    },

    onAddPreparationNotes(evt) {  

      var storeState = this.$store.state;
      var adminCtrlLabel = $("#generalPreparationNotesLabel");
      var adminCtrl = $("#generalPreparationNotes");
      if (!adminCtrl.is(':visible')) {
        adminCtrlLabel.show();
        adminCtrl.show();
      } else {
        adminCtrlLabel.hide();
        adminCtrl.hide();
        adminCtrl.val(null);

        if (storeState.currentRequest != null && 
            storeState.currentRequest['generalPreparationNotes'] != undefined) {
          storeState.currentRequest['generalPreparationNotes'] = null;
        }
      }
    },

    onApproveRequest(evt) {

      var storeState = this.$store.state;
      var currRequest = storeState.currentRequest;
      if (currRequest != null) {
        currRequest.processingStatus = "approved";
      }
      this.onSubmitRequest(evt);
    },

    onRejectRequest(evt) {

      var storeState = this.$store.state;
      var currRequest = storeState.currentRequest;
      if (currRequest != null) {
        currRequest.processingStatus = "rejected";
      }
      this.onSubmitRequest(evt);
    },

    onSubmitRequest(evt) {
      
      var vm = this;
      var storeState = vm.$store.state;
      var currRequest = storeState.currentRequest;

      if (this.inAdminMode) {

        var comment = $("#generalAdminComment").val();
        comment = comment.trim();
        if (comment != null && comment != "") {
          currRequest.generalAdminComment = comment;
        } else if (currRequest.generalAdminComment != undefined) {
          try {
            currRequest.generalAdminComment = null;
          } catch (err) {}
        }

        var notes = $("#generalPreparationNotes").val();
        notes = notes.trim();
        if (notes != null && notes != "") {
          currRequest.generalPreparationNotes = notes;
        } else if (currRequest.generalPreparationNotes != undefined) {
          try {
            currRequest.generalPreparationNotes = null;
          } catch (err) {}
        }        

      }

      var requestsUrl = apiMgr.getRequestsUrl();

      vm.manageProcessingStatus(storeState.currentRequest, vm.$store.state);

      if (this.isNewRequest) {

        this.submitNewRequest(requestsUrl, storeState.currentRequest, '/home');

      } else {
       
        //Check if item with that id exists
        vm.isSubmitting = true;
        var url = apiMgr.getRequestByIdUrl(storeState.currentRequest._id);

        axios.get(url)
          .then(res => {

              console.log("getRequestsUrl return status: " + res.status);

              if (res.status == 200) {
                console.log("onSubmitRequest - Existing request found. Updating request.");             
                this.submitUpdatedRequest(requestsUrl, storeState.currentRequest, '/home');
              } else {
                console.log("onSubmitRequest - status code is not 200, assume request not found. Creating new request.");
                this.submitNewRequest(requestsUrl, storeState.currentRequest, '/home');
              }          
          })
          .catch((err) => {
              if(err.response != null && err.response.status == 404) { //If that id is not found
                console.log("onSubmitRequest - No existing request found with id. Creating new request.");
                this.submitNewRequest(requestsUrl, storeState.currentRequest, '/home');
              } else {
                vm.hasFailure = true;
                vm.failureMessage = "Server unavailable or not working at this time. Please try later.";        
              }
              vm.isSubmitting = false;                   
          })
      }
    },


    submitNewRequest(requestsUrl, request) {

      var vm = this;
      vm.isSubmitting = true;
      const storeState = vm.$store.state;

      axios.post(requestsUrl, request)
      .then(res => {
          console.log("submitNewRequest response status: " + res.status);
          vm.isSubmitting = false;
          vm.hasFailure = false;
          
          if (res.status == 201 && res.data != null) {
              var requestCreated = res.data;

              localCacheMgr.uncacheItem(util.makeWorkingNewRequestCacheKey(storeState.loginContext.requesterEmail));
              storeState.currentRequest = null;
              storeState.selectedRoom = null;

              vm.onReturnHome();

          } else {
                vm.hasFailure = true;
                vm.failureMessage = "Unable to create the meeting request. Please try again.";
          }       
      })
      .catch((err) => {
          console.log("Create request failed: " + err);
          vm.isSubmitting = false;
          vm.hasFailure = true;

          if (err.response != null && err.response.status == 401) { //401 - Unauthorized.                  
              vm.failureMessage = "You're not authorized to create a meeting request.";
            
          } else if (err.response != null && err.response.status == 400) { //400 - Bad Request.                  
              vm.failureMessage = "The Meeting Request server received a bad request. Please contact your administrator if this problem persists.";

          } else {
              vm.failureMessage = "The Meeting Request server is unavailable or not working at this time.";
          }
      })
    },


    submitUpdatedRequest(requestsUrl, request) {

      var vm = this;
      vm.isSubmitting = true;
      const storeState = vm.$store.state;

      axios.put(requestsUrl, request)
      .then(res => {
          console.log("submitUpdatedRequest response status: " + res.status);
          vm.isSubmitting = false;
          vm.hasFailure = false;
          
          if (res.status == 200 && res.data != null) {
              var requestUdated = res.data;

              localCacheMgr.uncacheItem(util.makeRevisingRequestCacheKey(storeState.loginContext.requesterEmail, requestUdated._id));          
              storeState.currentRequest = null;
              storeState.selectedRoom = null;

              vm.onReturnHome();

          } else {
                vm.hasFailure = true;
                vm.failureMessage = "Unable to create the meeting request. Please try again.";
          }       
      })
      .catch((err) => {
          console.log("Create request failed: " + err);
          //prevent spam clicking
          vm.isSubmitting = false;
          vm.hasFailure = true;

          if (err.response != null && err.response.status == 401) { //401 - Unauthorized.                  
              vm.failureMessage = "You're not authorized to create a meeting request.";
            
          } else if (err.response != null && err.response.status == 400) { //400 - Bad Request.                  
              vm.failureMessage = "The Meeting Request server received a bad request. Please contact your administrator if this problem persist.";

          } else {
              vm.failureMessage = "The Meeting Request server is unavailable or not working at this time.";
          }
      })
    },

    onPrint(evt) {

      var topBar = $('#headerBar');
      var buttons = $(':button');

      topBar.hide();
      buttons.hide();

      window.print();

      topBar.show();
      buttons.show();
      return false;
    },

    onReturnHome() {
      this.$store.state.currentRequest = null;
      this.$store.state.selectedRoom = null;

      if(this.$store.state.inAdminMode){
        this.$router.push("/admin/home");
      } else {
        this.$router.push("/home");
      }
    },

    manageProcessingStatus(request, storeState) {request

      if (request.processingStatus == undefined || request.processingStatus == null) {
        request.processingStatus = "underReview";
      }

      if (request.processingStatus == "rejected" && !this.inAdminMode) {
        request.processingStatus = "underReview";
      }

      if (request.processingStatus == "underReview") {
        request.userCanEdit = false;
        request.adminCanEdit = true;
        request.processingStatusLabel = storeState.appConfig.requestStatusTagUnderReview;
        request.processingStatusMessage = storeState.appConfig.requestStatusMessageUnderReview;
      } else if (request.processingStatus == "approved") {
        request.userCanEdit = false;
        request.adminCanEdit = true;
        request.processingStatusLabel = storeState.appConfig.requestStatusTagApproved;
        request.processingStatusMessage = storeState.appConfig.requestStatusMessageApproved;
      } else if (request.processingStatus == "rejected") {
        request.userCanEdit = true;
        request.adminCanEdit = false;
        request.processingStatusLabel = storeState.appConfig.requestStatusTagRejected;
        request.processingStatusMessage = storeState.appConfig.requestStatusMessageRejected;
      }
    },




  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/*div {
  display: inline-block;
  margin: 16px;
  margin-right: 50px;
}*/
</style>