<template>
  <div class="container-fluid" style="width:100%">
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">

          <div class="card">
            <div class="card-header bg-info text-light">
              Request Summary &nbsp;&nbsp;<span class="badge badge-warning" v-if="inAdminMode" :adminCommentCtrlId="adminCommentCtrlId" @click.prevent="onAddAdminComment"><span class="far fa-comment-dots"></span></span>
            </div>

            <div v-if="inAdminMode">  
              <label id="generalAdminCommentLabel" for="generalAdminComment" style="display:none;">&nbsp;&nbsp;General Comment</label>
              <textarea id="generalAdminComment" :screenNum="screenNum" style="display:none; border: 2px solid orange;" placeholder="Add General Comment" class="is-request-data is-admin-comment form-control form-control-sm"></textarea>
            </div>

            <div class="card-body">
                <div style="width:100%" v-for="(requestReadOnlyProperty, index) in requestReadOnlyProperties" :key="index">
                  <div v-if="(requestReadOnlyProperty.value != '' && requestReadOnlyProperty.value != null) || requestReadOnlyProperty.value === false">
                    <span class="font-weight-light" style="">  <!--Convert to Sentence Case-->
                      {{requestReadOnlyProperty.label}}: 
                    </span>
                    <br>
                    <span class="font-italic">
                      <div v-if="requestReadOnlyProperty.value === true">
                        Yes
                      </div>
                      <div v-else-if="requestReadOnlyProperty.value === false">
                        No
                      </div>
                      <div v-else>
                        {{requestReadOnlyProperty.value}}
                      </div>
                    </span>
                  </div>
                  <div style="height:10px"></div>
                </div>
            </div>
          </div>

         
          <br>
          <div v-if="canEditRequest">
            <button type="button" class="btn btn-primary btn-sm" 
              :disabled="isSubmitting" 
              @click.prevent="onSubmitRequest">Submit Request</button>
              <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
          </div>
          <div v-else>
            <button type="button" class="btn btn-primary btn-sm" 
              @click.prevent="onReturnHome">Return Home</button>
              <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
          </div>

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

    canEditRequest() {
      var canEdit = true;
      var storeState = this.$store.state;
      if (storeState.currentRequest != null && storeState.currentRequest.canEdit != undefined && storeState.currentRequest.canEdit == false) {
        canEdit = false;
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
    },

    inAdminMode() {
      return this.$store.state.inAdminMode;
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
      var reqProperty = {label: requestPrompt.label, value: currentRequest[requestPrompt.inputType.ctrlDataId]};
      vm.requestReadOnlyProperties.push(reqProperty);
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

    onSubmitRequest (evt) {
      
      var vm = this;
      var storeState = vm.$store.state;

      var requestsUrl = apiMgr.getRequestsUrl();

      vm.generateRandomStatusAndComments(storeState.currentRequest, vm.$store.state);

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


    submitNewRequest(requestsUrl, request, goToThisRouteOnSucess) {

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

              if (this.isNewRequest) {
                localCacheMgr.uncacheItem("workingNewRequest");
              } else {
                localCacheMgr.uncacheItem("revisingRequest-" + storeState.currentRequest._id);
              }
              storeState.currentRequest = null;

              vm.$router.push(goToThisRouteOnSucess); 

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
              vm.failureMessage = "The Meeting Request server received a bad request. Please contact your administrator if this problem persist.";

          } else {
              vm.failureMessage = "The Meeting Request server is unavailable or not working at this time.";
          }
      })
    },


    submitUpdatedRequest(requestsUrl, request, goToThisRouteOnSucess) {

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

              if (this.isNewRequest) {
                localCacheMgr.uncacheItem("workingNewRequest");
              } else {
                localCacheMgr.uncacheItem("revisingRequest-" + storeState.currentRequest._id);
              }
              storeState.currentRequest = null;

              vm.$router.push(goToThisRouteOnSucess); 

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
      this.$router.push("/home");
    },

    // Temporary function to generate a random admin comment and request status
    generateRandomStatusAndComments(request, storeState) {


      var statuses = ["underReview", "approved", "rejected"];
      var statusCount = statuses.length;
      var randonStatusIndex = Math.floor((Math.random() * statusCount) + 1);

      var currentIndex = 0;
      statuses.forEach(function(status) {
          currentIndex += 1;
          if (randonStatusIndex == currentIndex) {
              request.processingStatus = status;

              if (request.processingStatus == "underReview") {
                  request.canEdit = false;
                  request.processingStatusLabel = storeState.appConfig.requestStatusTagUnderReview;
                  request.processingStatusMessage = storeState.appConfig.requestStatusMessageUnderReview;
              } else if (request.processingStatus == "approved") {
                request.canEdit = false;
                request.processingStatusLabel = storeState.appConfig.requestStatusTagApproved;
                request.processingStatusMessage = storeState.appConfig.requestStatusMessageApproved;
              } else if (request.processingStatus == "rejected") {
                request.canEdit = true;
                request.processingStatusLabel = storeState.appConfig.requestStatusTagRejected;
                request.processingStatusMessage = storeState.appConfig.requestStatusMessageRejected;
              }
          }
      });

      if (!request.canEdit) {
        return;
      }

      var requestDataFields = ["eventDateTimeData", "locationOfEvent", "numOfGeEmpAttending"];
      var fieldCount = requestDataFields.length;
      var randonIndex = Math.floor((Math.random() * fieldCount) + 1);

      var currentIndex = 0;
      requestDataFields.forEach((dataField) => {
          currentIndex += 1;
          if (randonIndex == currentIndex) {
              request[dataField + 'AdminComment'] = "Tempus congue dapibus lacinia nostra vitae tincidunt urna, lectus nec suspendisse tempus aenean habitasse, vulputate ullamcorper dictumst convallis at sollicitudin.";
          }
      });
    }

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