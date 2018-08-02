<template>
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
            <div class="card-text"><i class="fas fa-building"></i>&nbsp;&nbsp;<b>{{requestItem.locationOfEvent.name}}</b>,&nbsp;{{requestItem.locationOfEvent.building}}</div> 
            <div v-if="requestItem.eventDateTimeDisp != null" class="card-text"><i class="fas fa-calendar-check"></i>&nbsp;&nbsp;{{requestItem.eventDateTimeDisp}}</div>
            <div class="card-text"><i class="fas fa-user-circle"></i>&nbsp;&nbsp;{{requestItem.eventGEContactPersonName}}</div>                      
            <div class="card-text text-muted" style="font-size:80%;margin-bottom: 8px;">Updated On:&nbsp;{{requestItem.updatedAtDisp}}</div>
            <div v-if="requestItem.userCanEdit">
              <button :id="requestItem._id" type="button" @click.prevent="onEditRequest" class="enableEdit btn btn-warning btn-sm float-right">Edit</button>
            </div>
            <div v-else>
              <button :id="requestItem._id" type="button" @click.prevent="onViewRequest" class="disableEdit btn btn-secondary btn-sm float-right">View</button>
            </div>
            <button :id="requestItem._id" type="button" @click.prevent="onDeleteRequest" class="enableEdit btn btn-danger btn-sm float-left"><i class="fas fa-trash-alt"></i></button>
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

export default {
  data () {
    return {
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

              if (request.eventSchedule != null && 
                 request.eventSchedule.startDateTime != null &&
                 request.eventSchedule.endDateTime != null) {
                request.eventDateTimeDisp = util.makeEventDateTimeDisplay(request.eventSchedule.startDateTime, request.eventSchedule.endDateTime);
              }

              vm.$store.state.currentUserRequests.push(request);
            });
            
            vm.isFetchingRequests = false;
        })
        .catch((err) => {
            vm.hasFailure = true;
            vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
        })

  },

  created() {
    console.log('Home.vue created.');
    
    //color badge based on status
    $(function() {
      $(".approved").addClass("badge badge-success");
      $(".rejected").addClass("badge badge-danger");
      $(".underReview").addClass("badge badge-info");
      $(".completed").addClass("badge badge-secondary"); //not yet implemented
    });
  },

  updated(){
    console.log('Home.vue updated.');

    //color badge based on status
    $(function() {
      $(".approved").addClass("badge badge-success");
      $(".rejected").addClass("badge badge-danger");
      $(".underReview").addClass("badge badge-warning");
      $(".completed").addClass("badge badge-secondary"); //not yet implemented
    });
  },

  methods:{

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
      storeState.selectedRoom = selectedRequest.locationOfEvent;

      //check if it is an edit or a view; if edit, go to request/1, if view, go to summary
      if($(event.target).hasClass("enableEdit")){
        vm.$router.push('/request/1');
      } else if ($(event.target).hasClass("disableEdit")) {
        vm.$router.push('/requestsummary'); 
      }

    },

    onViewRequest: function(event) {
      console.log('Home.vue - onEditViewRequest activate');

      let vm = this;
      let selectedReqId = event.target.id;
      let storeState = this.$store.state;

      var selectedRequest = null;

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
      storeState.selectedRoom = selectedRequest.locationOfEvent;

      //check if it is an edit or a view; if edit, go to request/1, if view, go to summary
      if($(event.target).hasClass("enableEdit")){
        vm.$router.push('/request/1');
      } else if ($(event.target).hasClass("disableEdit")) {
        vm.$router.push('/requestsummary'); 
      }

    },

    onDeleteRequest: function (event){
        console.log('Home.vue - onDeleteRequest activate');
        let vm = this;

        //get request for deletion
        let currId = event.target.id;
    
        var url = apiMgr.getRequestByIdUrl(currId);
        console.log(`Home.vue - Query url: ${url}`);

        //delete request
        axios.delete(url)
            .then(res => {
                console.log("getRequestsUrl return status: " + res.status);

                //refresh requests in UI
                vm.$nextTick(function () {
                  console.log(`onDeleteRequest - Delete request id: ${currId} success. Refreshing data.`) // => 'updated'

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
                          
                          vm.isFetchingRequests = false;
                      })
                      .catch((err) => {
                          vm.hasFailure = true;
                          vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                      })
                })
            })
            .catch((err) => {
                console.log(err);
                vm.hasFailure = true;
                vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
            })
      
      
    }
  },
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>