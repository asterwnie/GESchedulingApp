<template>  
<div>
    <div class="container-fluid">
        <div class="row">
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
          <div class="col col-12 col-sm-10 col-md-8 col-lg-8" style="color:gray">
            <nav class="navbar navbar-light" style="background-color:#ffb3b3">
            <a class="navbar-brand text-dark">
                <img src="@/assets/ge-monogram.svg" width="30" height="30" class="d-inline-block align-top" alt="">
                Admin Home
            </a>
            </nav>
            <br>
            <div class="text-right font-italic">Welcome back, {{$store.state.currentUser.name}}</div>
            <div style="cursor:pointer;" class="text-right" @click.prevent="$router.push('/login')">Log Out</div>
            <hr>
          </div>
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
      </div>
      <div class="row">
      <div class="col col-12 col-md-2 col-lg-2"></div>

      <div id="adminBar" class="col col-12 col-md-3 col-lg-3 col-xl-2" style="padding-bottom:10px">
        <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>Admin mode activated.</strong> As long as you are in admin mode, the red admin indicator show be above the navigation bar.
            <hr>
            NOTE: THIS NOTE MAY BE REMOVED.*
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
        </div>

        <div class="card">
            <div class="card-header bg-danger text-light" id="adminMenu" style="cursor:pointer;" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                Admin Menu &nbsp;<i class="fa fa-caret-down" aria-hidden="true"></i>
            </div>
            <div id="collapseTwo" class="collapse show" aria-labelledby="adminMenu" data-parent="#accordion">
                <div @click.prevent="$router.push('/admin/requests')" style="cursor:pointer;" class="adminMenuItem card-header bg-secondary text-light">
                    All Requests
                </div>
                <div style="cursor:pointer;" class="adminMenuItem card-header bg-secondary text-light">
                    Create Request
                </div>
                <div style="cursor:pointer;" class="adminMenuItem card-header bg-secondary text-light">
                    Print Request
                </div>
            </div>
        </div>
      </div>

      <div id="adminUI" class="col col-12 col-md-5 col-lg-5 col-xl-6">
          <div id="newRequests">
            <div class="card">
                <div class="card-header bg-info text-light">
                New Requests&nbsp;<button type="button" @click.prevent="$router.push('/admin/requests')" style="cursor:pointer;" class="btn btn-outline-light btn-sm float-right">View All Requests&nbsp;<span class="fas fa-chevron-right"></span></button>
                </div>
            </div>
            <div style="height:10px;"></div>
            <div v-if="requestsPreview == null || requestsPreview == undefined">
                <div class="card">
                    <br>
                    <p style="text-align:center" class="font-italic text-muted">No current requests.</p>
                    <br>
                </div>
            </div>
            <div v-else>
                <div class="container" style="display:flex; flex-wrap:wrap;">
                    <div class="request-item card col-12 col-lg-6 col-xl-4" v-for="(requestItem, index) in requestsPreview" :key="index">
                        <div class="card-body">
                            <h6 class="card-title">{{requestItem.eventTitle}}</h6>
                            <div class="card-text">{{requestItem.eventGEContactPersonName}}</div>
                            <div class="card-text text-muted">Last updated:&nbsp;{{requestItem.updatedAt.substring(0, requestItem.updatedAt.indexOf("T"))}}</div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
          <div style="height:10px;"></div>
          <div id="utilityMenu">
                
                <div class="card-header bg-danger text-light">
                    Utilities (NOTE THESE DO NOT WORK RIGHT NOW)
                </div>
                <div style="height:10px;"></div>
                <div class="card-group">
                        <div class="card" style="background-color:#ffb0b0; cursor:pointer; text-align:center;">
                            <div class="card-body">
                                <h6 class="card-title">
                                    Update Data&nbsp;&nbsp;<span class="fas fa-chevron-right"></span>
                                </h6>
                                <hr>
                                <div class="card-text">
                                    Add or revise Room, Hotel, and Catering data.
                                </div>
                            </div>
                        </div>
                        <div class="card" style="background-color:#ffb0b0; cursor:pointer; text-align:center;">
                            <div class="card-body">
                                <h6 class="card-title">
                                    Send Invite&nbsp;&nbsp;<span class="fas fa-chevron-right"></span>
                                </h6>
                                <hr>
                                <div class="card-text">
                                    Email an access code to a requester.
                                </div>
                            </div>
                        </div>
                        <div class="card" style="background-color:#ffb0b0; cursor:pointer; text-align:center;">
                            <div class="card-body">
                                <h6 class="card-title">
                                    Maintenance&nbsp;&nbsp;<span class="fas fa-chevron-right"></span>
                                </h6>
                                <hr>
                                <div class="card-text">
                                    Flush and archive old, cancelled, and completed requests.
                                </div>
                            </div>
                        </div>
                        <div class="card" style="background-color:#ffb0b0; cursor:pointer; text-align:center;">
                            <div class="card-body">
                                <h6 class="card-title">
                                    Add Admin&nbsp;&nbsp;<span class="fas fa-chevron-right"></span>
                                </h6>
                                <hr>
                                <div class="card-text">
                                    Create a new Admin profile.
                                </div>
                            </div>
                        </div>
                </div>

            </div>
          </div>
      </div>


      <div class="col col-12 col-md-2 col-lg-2"></div>
    </div>
    <div style="height:30px"></div>
    <div class="row">
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
          <div class="col col-12 col-auto" style="color:gray">
          <h4 class="text-center" v-html="$store.state.appConfig.siteName"></h4>
          <h6 class="text-center" v-html="$store.state.appConfig.siteAddress"></h6>
          <br>
          </div>
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
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
        previewRequestNum: 3,
    }
  },

  computed: {
        title() {
        return this.$store.state.appConfig.adminHomeViewTitle; 
        },
        viewDescription() {
        return this.$store.state.appConfig.adminHomeViewDescription; 
        },
        requestsPreview() {
          return this.$store.state.currentRequestsPreview;
        }
    },

    activated() {
        console.log('AdminHome.vue activated.');
        let vm = this;

        if (this.$store.state.appConfig.adminHomeViewTitle == null) {
        this.$router.push('/login'); // Config data lost, force back to login to refetch data.
        return;
        }

        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = true;

        //get requests preview to show
        var url = apiMgr.getRequestsUrl() + `&numOfItemsPerPage=${this.previewRequestNum}`;

        axios.get(url)
            .then(res => {
                console.log("getRequestsUrl return status: " + res.status);
                
                if(vm.$store.state.currentRequestsPreview != null){
                    while(vm.$store.state.currentRequestsPreview.length > 0) {
                    vm.$store.state.currentRequestsPreview.pop();
                    }
                }
                var foundRequests = res.data;

                $.each(foundRequests, function (index, foundRequest) {
                    vm.$store.state.currentRequestsPreview.push(foundRequest);
                });
                
                vm.$forceUpdate();
                //vm.isFetchingRequests = false;
            })
            .catch((err) => {
                vm.hasFailure = true;
                vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
            })

        vm.$forceUpdate();
    },

    created() {
        console.log('AdminHome.vue created.');

        //color badge based on status
        $(function() {
        $(".approved").addClass("badge badge-success");
        $(".rejected").addClass("badge badge-danger");
        $(".underReview").addClass("badge badge-info");
        $(".completed").addClass("badge badge-secondary"); //not yet implemented
        });
    },

    updated(){
        console.log('AdminHome.vue updated.');

        //color badge based on status
        $(function() {
        $(".approved").addClass("badge badge-success");
        $(".rejected").addClass("badge badge-danger");
        $(".underReview").addClass("badge badge-info");
        $(".completed").addClass("badge badge-secondary"); //not yet implemented
        });
    },

    methods: {
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
            console.log('AdminHome.vue - onDeleteRequest activate');
            let vm = this;

            //get request for deletion
            let currId = event.target.id;

            let queryId = `/${currId}`;
            var url = apiMgr.getRequestsUrl().substring(0, apiMgr.getRequestsUrl().indexOf("?")) + queryId + apiMgr.getRequestsUrl().substring(apiMgr.getRequestsUrl().indexOf("?"), apiMgr.getRequestsUrl().length);
            console.log(`AdminHome.vue - Query url: ${url}`);

            //delete request
            axios.delete(url)
                .then(res => {
                    console.log("getRequestsUrl return status: " + res.status);

                    //refresh requestsPreview in UI
                    vm.$nextTick(function () {
                    console.log(`onDeleteRequest - Delete request id: ${currId} success. Refreshing data.`) // => 'updated'

                    //get requestsPreview
                    var url = apiMgr.getRequestsUrl()

                    axios.get(url)
                        .then(res => {
                            console.log("getRequestsUrl return status: " + res.status);
                            
                            while(vm.$store.state.currentRequestsPreview.length > 0) {
                                vm.$store.state.currentRequestsPreview.pop();
                            }
                            var foundRequests = res.data;

                            $.each(foundRequests, function (index, foundRequest) {
                                vm.$store.state.currentRequestsPreview.push(foundRequest);
                            });
                            
                            vm.$forceUpdate();
                            //vm.isFetchingRequests = false;
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
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pad-bottom {
  padding-bottom:5px
}
</style>