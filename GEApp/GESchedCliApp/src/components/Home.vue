<template>
<div>
  <div class="container-fluid">
    <div class="row">
      <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">
        <form class="needs-validation" novalidate>
          <button class="btn btn-primary btn-block" type="submit" @click.prevent="onNewRequest">New Request</button>
        </form>
        <div v-if="hasWorkingNewRequestCached">
          <br>
          <form class="needs-validation" novalidate>
            <button class="btn btn-primary btn-block" type="submit" @click.prevent="onContinueRequest">Continue Request</button>
          </form>
        </div>
        <hr>

        <div class="card">
          <div class="card-header text-center bg-secondary text-light">
            <b>Requests</b>
          </div>
        </div>

        <div v-if="currentUserRequests.length < 1">
          <div class="card">
            <br>
            <p style="text-align:center" class="font-italic text-muted">No current requests! Hit "New Request" to create one.</p>
            <br>
          </div>
        </div>
        <div v-else>
          <div v-for="(requestItem, index) in currentUserRequests" :key="index">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">{{requestItem.eventTitle}}</h6>
                <h6 class="card-title"><span :class="requestItem.processingStatus">{{requestItem.processingStatusLabel}}</span></h6>
                <h6 class="card-title">{{requestItem.processingStatusMessage}}</h6>
                <div class="card-text"><i class="label-icon fas fa-building"></i>&nbsp;&nbsp;<b>{{requestItem.locationOfEvent.name}}</b>,&nbsp;{{requestItem.locationOfEvent.building}}</div> 
                <div v-if="requestItem.eventDateTimeDisp != null" class="card-text"><i class="label-icon fas fa-calendar-check"></i>&nbsp;&nbsp;{{requestItem.eventDateTimeDisp}}</div>
                <div class="card-text"><i class="label-icon fas fa-user-circle"></i>&nbsp;&nbsp;{{requestItem.eventGEContactPersonNameDisp}}</div>                      
                <div class="card-text text-muted" style="font-size:80%;margin-bottom: 8px;">Updated On:&nbsp;{{requestItem.updatedAtDisp}}</div>
                <div v-if="requestItem.userCanEdit">
                  <button :id="requestItem._id" type="button" @click.prevent="onEditRequest" class="enableEdit btn btn-warning btn-sm float-right">Edit</button>
                </div>
                <div v-else>
                  <button :id="requestItem._id" type="button" @click.prevent="onViewRequest" class="disableEdit btn btn-primary btn-sm float-right">View</button>
                </div>
                <div v-if="requestItem.eventSchedule != null && requestItem.eventSchedule.startDateTime != null && isPassedDate(requestItem.eventSchedule.startDateTime)">
                  <button :id="requestItem._id" type="button" @click.prevent="onDeleteRequestConfirm" class="enableEdit btn btn-danger btn-sm float-left"><i class="fas fa-trash-alt"></i></button>
                </div>
                <div v-else>
                  <div v-if="requestItem.processingStatus != 'canceled'">
                  <button :id="requestItem._id" type="button" @click.prevent="onCancelRequestConfirm" class="enableEdit btn btn-danger btn-sm float-left">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import * as util from '@/common/util.js';
import * as apiMgr from '@/common/apiMgr.js';
import * as localCacheMgr from '@/common/localCacheMgr.js';
import { getLocalUserRequestById, manageProcessingStatus, prepareRequestsForUI, applyBadgeColorBasedOnProcessingStatus } from '@/common/requestMgr.js'

export default {
  data () {
    return {
        hasFailure: false,
        failureMessage: null,
        isFetchingRequests: false
      }
  },

  computed: {

    title() {
      return this.$store.state.appConfig.homeViewTitle; 
    },
    
    viewDescription() {
      return this.$store.state.appConfig.homeViewDescription; 
    },

    currentUserRequests() {
      return this.$store.state.currentUserRequests;
    },

    isNewRequest() {
      var isNew = true;
      var storeState = this.$store.state;
      if (storeState.currentRequest != null && storeState.currentRequest._id != undefined && storeState.currentRequest._id != null) {
        isNew = false;
      }
      return isNew;
    },

    currentRequestData() {
      return this.$store.state.currentRequest;
    },

    hasWorkingNewRequestCached() {
      return this.$store.state.hasWorkingNewRequestCache;
    },

    selectedRequestForDelete() {
      return this.$store.state.actionForSelectedRequest.forDelete;
    }
  },


  activated() {
    console.log('Home.vue activated.');
    let vm = this;

    if (vm.$store.state.appConfig.homeViewTitle == null) {
      vm.$router.push('/login'); // Config data lost, force back to login to refetch data.
      return;
    }

    vm.$store.state.currentViewTitle = this.title;
    vm.$store.state.enableNavBar = true;
    this.$store.state.hideBackNav  = true;

    this.checkHasWorkingNewRequestCached();

    //get requests for current user
    let queryUser = `&requesterEmailContains=${this.$store.state.currentUser.email}`;
    var url = apiMgr.getRequestsUrl() + queryUser;

    axios.get(url)
        .then(res => {
            console.log("getRequestsUrl return status: " + res.status);
            
            while(vm.$store.state.currentUserRequests.length > 0) {
              vm.$store.state.currentUserRequests.pop();
            }
            var foundRequests = res.data;

            $.each(foundRequests, function (index, request) {
              request.updatedAtDisp = util.getDateTimeDisplay(request.updatedAt);

              request.eventGEContactPersonNameDisp = request.eventGEContactPersonName;
              if (request.eventGEContactPersonNameDisp == null && request.eventGEContactPersonNameDisp == "") {
                request.eventGEContactPersonNameDisp = request.eventGEContactPersonEmail; 
              } else {
                request.eventGEContactPersonNameDisp += `, (${request.eventGEContactPersonEmail})`;
              }

              if (request.eventSchedule != null && 
                 request.eventSchedule.startDateTime != null &&
                 request.eventSchedule.endDateTime != null) {
                request.eventDateTimeDisp = util.makeEventDateTimeDisplay(request.eventSchedule.startDateTime, request.eventSchedule.endDateTime);
              }

              vm.$store.state.currentUserRequests.push(request);          
            });

            prepareRequestsForUI(vm.$store.state.currentUserRequests);
            vm.isFetchingRequests = false;
        })
        .catch((err) => {
            vm.hasFailure = true;
            vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
        })

  },


  created() {
    console.log('Home.vue created.');
    let vm = this;

    applyBadgeColorBasedOnProcessingStatus();

    util.centralEvent.$on('onDeleteSelectedRequest', () => {
      if (vm.$store.state.actionForSelectedRequest.forDeleteFromView == "Home.vue") {
        vm.onDeleteRequest();
      }
    });

    util.centralEvent.$on('onCancelSelectedRequest', () => {
      if (vm.$store.state.actionForSelectedRequest.forCancelFromView == "Home.vue") {
        vm.onCancelRequest();
      }
    });
  },


  updated(){
    console.log('Home.vue updated.');
    applyBadgeColorBasedOnProcessingStatus();
  },


  methods:{

    isPassedDate(startDateTime) {
      var daysOld = 1;
      var oneDateAgo = Date.now()+ -daysOld*24*3600*1000;
      oneDateAgo = new Date(oneDateAgo);
      var start = new Date(startDateTime);
      if (start < oneDateAgo) {
        return true;
      } else {
        return false;
      }
    },

    checkHasWorkingNewRequestCached() {
      let storeState = this.$store.state;
      storeState.hasWorkingNewRequestCache = false;
      let workingNewRequest = localCacheMgr.getCachedItem(util.makeWorkingNewRequestCacheKey(this.$store.state.loginContext.requesterEmail));
      if (workingNewRequest != null) {
        storeState.hasWorkingNewRequestCache = true;
      }
      workingNewRequest = null;
    },

    onNewRequest: function(event) {
      console.log('Home.vue - onNewRequest activate');
      this.$store.state.currentRequest = null;
      localCacheMgr.uncacheItem(util.makeWorkingNewRequestCacheKey(this.$store.state.loginContext.requesterEmail));
      this.$router.push('/dofirst/true');
    },

    onContinueRequest: function(event) {
      this.$store.state.currentRequest = null;
      console.log('Home.vue - onNewRequest activate');
      this.$router.push('/dofirst/true');
    },

    onEditRequest: function(event) {
      console.log('Home.vue - onEditViewRequest activate');

      let vm = this;
      let selectedReqId = event.target.id;
      let storeState = this.$store.state;

      var selectedRequest = null;

      var revisingRequest = localCacheMgr.getCachedItem(util.makeRevisingRequestCacheKey(storeState.loginContext.requesterEmail, selectedReqId));
      if (revisingRequest != undefined && revisingRequest != null) {
        selectedRequest = revisingRequest;
      } else {
        storeState.currentUserRequests.forEach(function(request) {
          if (request._id == selectedReqId) {
            selectedRequest = request;
          }
        });
      }

      storeState.currentRequest = selectedRequest;

      //check if it is an edit or a view; if edit, go to request/1, if view, go to summary
      if($(event.target).hasClass("enableEdit")){
        vm.$router.push('/request/1');
      } else if ($(event.target).hasClass("disableEdit")) {
        vm.$router.push('/requestsummary'); 
      }

    },

    onViewRequest: function(event) {
      console.log('Home.vue - onViewRequest activate');

      let vm = this;
      let selectedReqId = event.target.id;
      let storeState = this.$store.state;

      var selectedRequest = null;

      // If viewing a request the assumption is that it should be edited and 
      // therefore clear out any from the cache and rely on the one from the server.
      var revisingRequest = localCacheMgr.getCachedItem(util.makeRevisingRequestCacheKey(storeState.loginContext.requesterEmail, selectedReqId));
      if (revisingRequest != undefined && revisingRequest != null) {
        localCacheMgr.uncacheItem(util.makeRevisingRequestCacheKey(storeState.loginContext.requesterEmail, selectedReqId));
      } 

      storeState.currentUserRequests.forEach(function(request) {
        if (request._id == selectedReqId) {
          selectedRequest = request;
        }
      });
      
      storeState.currentRequest = selectedRequest;

      //check if it is an edit or a view; if edit, go to request/1, if view, go to summary
      if($(event.target).hasClass("enableEdit")){
        vm.$router.push('/request/1');
      } else if ($(event.target).hasClass("disableEdit")) {
        vm.$router.push('/requestsummary'); 
      }

    },

    onCancelRequestConfirm: function (event) {
        console.log('onCancelRequestConfirm');

        let currId = event.currentTarget.id;
        this.$store.state.actionForSelectedRequest.forCancelFromView = "Home.vue";
        this.$store.state.actionForSelectedRequest.forCancel = getLocalUserRequestById(currId, false);
        $('#requestActionConfirmDialog').modal('show');
    },


    onCancelRequest: function (event) {

      var vm = this;
      vm.isSubmitting = true;
      const storeState = vm.$store.state;

      var request = vm.$store.state.actionForSelectedRequest.forCancel;
      request.processingStatus = "canceled";

      manageProcessingStatus(request);

      if (request.processingStatusLabel != undefined && request.processingStatusLabel != null) {
        delete request.processingStatusLabel;
      }
      if (request.processingStatusMessage != undefined && request.processingStatusMessage != null) {
        delete request.processingStatusMessage;
      }

      var reqUrl = apiMgr.getRequestsUrl();

      axios.put(reqUrl, request)
      .then(res => {
          console.log("submit request for update response status: " + res.status);
          vm.isSubmitting = false;
          vm.hasFailure = false;
          
          if (res.status == 200 && res.data != null) {
              var requestUdated = res.data;
            
            this.$store.state.actionForSelectedRequest.forCancelFromView = null;
            this.$store.state.actionForSelectedRequest.forCancel = null;
            $('#requestActionConfirmDialog').modal('hide');

            //refresh requests in UI
            vm.$nextTick(function () {
              vm.refetchUserRequests();
            });

          } else {
                vm.hasFailure = true;
                vm.failureMessage = "Unable to update meeting request. Please try again.";
          }       
      })
      .catch((err) => {
          console.log("submit request update failed: " + err);
          //prevent spam clicking
          vm.isSubmitting = false;
          vm.hasFailure = true;

          if (err.response != null && err.response.status == 401) { //401 - Unauthorized.                  
              vm.failureMessage = "You're not authorized to update a meeting request.";
            
          } else if (err.response != null && err.response.status == 400) { //400 - Bad Request.                  
              vm.failureMessage = "The Meeting Request server received a bad request. Please contact your administrator if this problem persist.";

          } else {
              vm.failureMessage = "The Meeting Request server is unavailable or not working at this time.";
          }
      })

    },


    onDeleteRequestConfirm: function (event) {
        console.log('onDeleteRequestConfirm');

        let currId = event.currentTarget.id;
        this.$store.state.actionForSelectedRequest.forDeleteFromView = "Home.vue";
        this.$store.state.actionForSelectedRequest.forDelete = getLocalUserRequestById(currId, false);
        $('#requestActionConfirmDialog').modal('show');
    },


    refetchUserRequests() { 
      console.log('refetchUserRequest');
      let vm = this;

      //get requests for current user
      let queryUser = `&requesterEmailContains=${vm.$store.state.currentUser.email}`;
      var url = apiMgr.getRequestsUrl() + queryUser;

      axios.get(url)
          .then(res => {
              console.log("getRequestsUrl return status: " + res.status);
              
              while(vm.$store.state.currentUserRequests.length > 0) {
                vm.$store.state.currentUserRequests.pop();
              }
              var foundRequests = res.data;

              $.each(foundRequests, function (index, request) {
                vm.$store.state.currentUserRequests.push(request);
              });
              
              prepareRequestsForUI(vm.$store.state.currentUserRequests);

              vm.isFetchingRequests = false;
          })
          .catch((err) => {
              vm.hasFailure = true;
              vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
          })
    },

    
    onDeleteRequest() {
        console.log('Home.vue - onDeleteRequest activate');
        let vm = this;

        let currId = this.$store.state.actionForSelectedRequest.forDelete._id;
    
        var url = apiMgr.getRequestByIdUrl(currId);
        console.log(`Home.vue - Query url: ${url}`);

        //delete request
        axios.delete(url)
          .then(res => {
            console.log("getRequestsUrl return status: " + res.status);

            this.$store.state.actionForSelectedRequest.forDeleteFromView = null;
            this.$store.state.actionForSelectedRequest.forDelete = null;

            $('#requestActionConfirmDialog').modal('hide');

            //refresh requests in UI
            vm.$nextTick(function () {
              vm.refetchUserRequests();
            });

          })
          .catch((err) => {
              console.log(err);
              vm.hasFailure = true;
              vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
          })

    }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.label-icon {
    color: rgb(80, 80, 80);
}
</style>