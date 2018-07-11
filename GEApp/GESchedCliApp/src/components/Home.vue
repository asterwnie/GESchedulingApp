<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">
        <form class="needs-validation" novalidate>
          <button class="btn btn-primary btn-block" type="submit" @click.prevent="onNewRequest">New Request</button>
        </form>
        <div v-if="currentRequestData != null">
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
            <h6 class="card-title">Status:&nbsp;<span :class="requestItem.processingStatus">{{requestItem.processingStatusLabel}}</span></h6>
            <p class="card-text font-italic">{{requestItem.processingStatusMessage}}</p>
            <div class="card-text text-muted">Last updated:&nbsp;{{requestItem.updatedAt.substring(0, requestItem.updatedAt.indexOf("T"))}}</div>
            <div v-if="requestItem.userCanEdit">
              <button :id="requestItem._id" type="button" @click.prevent="onEditViewRequest" class="enableEdit btn btn-warning btn-sm float-right">Edit</button>
            </div>
            <div v-else>
              <button :id="requestItem._id" type="button" @click.prevent="onEditViewRequest" class="disableEdit btn btn-secondary btn-sm float-right">View</button>
            </div>
            <button :id="requestItem._id" type="button" @click.prevent="onDeleteRequest" class="enableEdit btn btn-danger btn-sm float-left">Delete</button>
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

    onNewRequest: function(event) {
      console.log('Home.vue - onNewRequest activate');
      this.$store.state.currentRequest = null;
      localCacheMgr.uncacheItem("workingNewRequest");
      this.$router.push('/dofirst');
    },

    onContinueRequest: function(event) {
      this.$store.state.currentRequest = null;
      console.log('Home.vue - onNewRequest activate');
      this.$router.push('/dofirst');
    },

    onEditViewRequest: function(event) {
      console.log('Home.vue - onEditViewRequest activate');

      let vm = this;
      let selectedReqId = event.target.id;
      let storeState = this.$store.state;

      var selectedRequest = null;

      var revisingRequest = localCacheMgr.getCachedItem("revisingRequest-" + selectedReqId);
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

    onDeleteRequest: function (event){
        console.log('Home.vue - onDeleteRequest activate');
        let vm = this;

        //get request for deletion
        let currId = event.target.id;

        let queryId = `/${currId}`;
        var url = apiMgr.getRequestsUrl().substring(0, apiMgr.getRequestsUrl().indexOf("?")) + queryId + apiMgr.getRequestsUrl().substring(apiMgr.getRequestsUrl().indexOf("?"), apiMgr.getRequestsUrl().length);
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