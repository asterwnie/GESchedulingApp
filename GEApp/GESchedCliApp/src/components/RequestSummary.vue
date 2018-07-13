<template>
  <div class="container-fluid" style="width:100%">
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">

          <div class="card">
            <div class="card-header bg-info text-light">
              Request Summary &nbsp;&nbsp;<span class="badge badge-warning" v-if="canEditRequest && inAdminMode" :adminCommentCtrlId="adminCommentCtrlId" @click.prevent="onAddAdminComment"><span class="far fa-comment-dots"></span></span>
            </div>

            <div v-if="canEditRequest">  
              <label id="generalAdminCommentLabel" for="generalAdminComment" style="display:none;">&nbsp;&nbsp;General Comment</label>
              <textarea id="generalAdminComment" style="display:none; border: 2px solid orange;" placeholder="Add General Comment" class="is-admin-comment form-control form-control-sm"></textarea>
            </div>

            <div class="card-body">
                <div style="width:100%" v-for="(requestReadOnlyProperty, index) in requestReadOnlyProperties" :key="index">
                  <div v-if="(requestReadOnlyProperty.value != '' && requestReadOnlyProperty.value != null) || requestReadOnlyProperty.value === false">
                    <span class="font-weight-light" style="">  <!--Convert to Sentence Case-->
                      {{requestReadOnlyProperty.label}}: 
                    </span>
                    <br>
                    <div v-if="requestReadOnlyProperty.value.name != null">
                      <span class="font-italic">
                        {{requestReadOnlyProperty.value.name}}
                      </span>
                    </div>
                    <div v-else-if="requestReadOnlyProperty.value.startDateTime != null">
                      <span class="font-italic">
                        <div>Start: {{requestReadOnlyProperty.value.startDateTime.toDateString()}}</div>
                        <div>End: {{requestReadOnlyProperty.value.endDateTime}}</div>
                      </span>
                    </div>
                    <div v-else>
                      {{requestReadOnlyProperty.value}}
                    </div>
                    <div v-if="requestReadOnlyProperty.adminComment != null">
                      <span class="font-italic">
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
                @click.prevent="onSubmitRequest">Submit Request</button>
            </div>
          </div>
          <div v-else>
            <button type="button" class="btn btn-primary btn-sm" 
              @click.prevent="onReturnHome">Return</button>
              
          </div>
          <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
      </div>
    </div>
  </div>

</template>

<script>
import axios from 'axios'
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

    canEditRequest() {
      var canEdit = false;
      var storeState = this.$store.state;

      if (this.isNewRequest) {
        canEdit = true;
      } else if (!this.inAdminMode && storeState.currentRequest != null && storeState.currentRequest.userCanEdit != undefined && storeState.currentRequest.userCanEdit == true) {
        canEdit = true;
      } else if (this.inAdminMode &&storeState.currentRequest != null && storeState.currentRequest.adminCanEdit != undefined && storeState.currentRequest.adminCanEdit == true) {
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

    adminCommentCtrlId() {
      return this.ctrlId + "AdminComment";
    }

  },

  activated() {
    console.log('SubmitRequest.vue activated.');
    let vm = this;
    var storeState = this.$store.state;

    if (storeState.appConfig.submitRequestViewTitle == null) {
      this.$router.push('/login'); // Config data lost, force back to login to refetch data.
      return;
    }

    if (this.inAdminMode) {
      var commentCtrl = $("#generalAdminComment");
      var comment = commentCtrl.val("");
      if (storeState.currentRequest.generalAdminComment != undefined) {
        commentCtrl.val(storeState.currentRequest.generalAdminComment);
      }
    }

    if (this.canEditRequest) {
      storeState.currentViewTitle = storeState.appConfig.submitRequestViewTitle;
    } else {
      storeState.currentViewTitle = storeState.appConfig.viewRequestViewTitle;
    }

    storeState.enableNavBar = true;

    let requestPrompts = storeState.requestPrompts;
    let currentRequest = storeState.currentRequest;

    this.requestReadOnlyProperties = [];
    requestPrompts.forEach(function(requestPrompt) {

      var val = currentRequest[requestPrompt.inputType.ctrlDataId];

      if (val != undefined && val != null && val != "") {
        var reqProperty = { label: requestPrompt.label, value: val, adminComment: null };
        
        if (requestPrompt.inputType.isValueBoolean) {
          
          if (currentRequest[requestPrompt.inputType.ctrlDataId] == true) {
            reqProperty.value = "Yes";
          } else {
            reqProperty.value = "No";
          }
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

    onAddAdminComment(evt) {  
      var adminCtrlLabel = $("#generalAdminCommentLabel");
      var adminCtrl = $("#generalAdminComment");
      if (!adminCtrl.is(':visible')) {
        adminCtrlLabel.show();
        adminCtrl.show();
      } else {
        adminCtrlLabel.hide();
        adminCtrl.hide();
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
            delete currRequest.generalAdminComment;
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

              localCacheMgr.uncacheItem("workingNewRequest");
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

              localCacheMgr.uncacheItem("revisingRequest-" + storeState.currentRequest._id);          
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

    onReturnHome(){
      this.$store.state.currentRequest = null;
      this.$store.state.selectedRoom = null;

      if(this.$store.state.inAdminMode){
        this.$router.push("/admin/requests");
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