<template>  
<div class="container-fluid">
    <div class="row">
        <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-8" style="color:gray">
        
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>Alert</strong> some alert here.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <button @click.prevent="$router.push('/admin/home')" type="button" class="btn btn-danger">
                <span class="fas fa-chevron-left"></span>&nbsp;&nbsp;Home
            </button>

            <div style="height:10px"></div>

            <div class="card-header bg-primary text-light">
                <span>
                    Quick Filter&nbsp;
                    <div @click.prevent="resetFilterView" class="badge badge-secondary" style="cursor:pointer; text-align:center; vertical-align:middle; padding:5px">
                        <span><i class="fa fa-user-circle" aria-hidden="true"></i>&nbsp;All Requests</span>
                    </div>
                    <div @click.prevent="onQuickFilter" class="quickFilterButton badge badge-danger" style="cursor:pointer; text-align:center; vertical-align:middle; padding:5px">
                        <span id="rejected"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp;More Info Required</span>
                    </div>

                    <div @click.prevent="onQuickFilter" class="quickFilterButton badge badge-warning" style="cursor:pointer; text-align:center; vertical-align:middle; padding:5px">
                        <span id="underReview"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp;Under Review</span>
                    </div>
                    <div @click.prevent="onQuickFilter" class="quickFilterButton badge badge-success" style="cursor:pointer; text-align:center; vertical-align:middle; padding:5px">
                        <span id="approved"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp;Approved & Completed</span>
                    </div>
                    <div @click.prevent="onQuickFilter" class="quickFilterButton badge badge-info" style="cursor:pointer; text-align:center; vertical-align:middle; padding:5px">
                        <span id="otherStatus"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp;Other Status</span>
                    </div>
                    <div @click.prevent="onQuickFilter" class="quickFilterButtoncard badge badge-primary" style="cursor:pointer; text-align:center; vertical-align:middle; padding:5px">
                        <span id="otherStatus"><i class="fa fa-exclamation-circle" aria-hidden="true"></i>&nbsp;Other Status</span>
                    </div>
                </span>
            </div>
            

        </div>
        <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
    </div>
    <div style="height:10px"></div>
    <div class="row">
    <div class="col col-12 col-md-2 col-lg-2"></div>

    <div id="searchUI" class="col col-12 col-md-3 col-lg-3 col-xl-2" style="margin-bottom:20px">
      <div class="card">
      <div class="card-header bg-primary text-light" id="filterMenu" style="cursor:pointer;" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            Filter By <i class="fa fa-search-plus" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-caret-down" aria-hidden="true"></i>
      </div>
      <div id="collapseOne" class="collapse show" aria-labelledby="filterMenu" data-parent="#accordion">
          <div id="filterMenu" class="card-body" style="padding:10px; width:100%;">

            <div id="inputEventName" class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Event Name</span>
                </div>
                <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
            </div>

            <div id="inputRequesterEmail" class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Requester Email</span>
                </div>
                <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
            </div>

            <div id="inputLocation" class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Location</span>
                </div>
                <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
            </div>

            <div id="inputStatus" class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Status</span>
                </div>
                <select class="custom-select" id="sizeTypeGroupSelect">
                    <option selected></option>
                    <option v-bind:id="statusLabel" v-bind:value='statusLabel' v-for="(statusLabel, index) in statusLabels" :key="index">
                        {{ statusLabel }}
                    </option>
                </select>
            </div>

            <p>add: display per page...</p>

            
            <br>
            <button type="button" class="btn btn-sm btn-primary float-right" @click.prevent="filterView">Search</button>
            <button type="button" class="btn btn-sm btn-secondary" @click.prevent="resetFilterView">Reset</button>
          </div>
        </div>
      </div>
    </div>

    <div id="requestUI" class="col col-12 col-md-5 col-lg-5 col-xl-6">
            <div class="card" style="width:100%">
                    <div class="card-header bg-info text-light">
                        Requests
                    </div>
            </div>
            <div v-if="requestsPreview.length < 1">
                <div class="card">
                    <br>
                    <p style="text-align:center" class="font-italic text-muted">No requests found.</p>
                    <br>
                </div>
            </div>
            <div v-else>
                <div style="height:10px;"></div>
                <div class="container" style="width:100%; display:flex; flex-wrap:wrap;">
                    <div class="request-item card col-12 col-lg-6 col-xl-4" v-for="(requestItem, index) in requestsPreview" :key="index">
                        <div class="card-body">
                            <h6 class="card-title">{{requestItem.eventTitle}}</h6>
                            <h6 class="card-title">Status:&nbsp;<span :class="requestItem.processingStatus">{{requestItem.processingStatusLabel}}</span></h6>
                            <div class="card-text">{{requestItem.eventGEContactPersonName}}</div>
                            <div class="card-text">{{requestItem.locationOfEvent.name}}</div>
                            <div class="card-text">{{requestItem.eventSchedule}}</div>
                            <br>
                            <div class="card-text text-muted">Last updated:&nbsp;{{requestItem.updatedAt.substring(0, requestItem.updatedAt.indexOf("T"))}}</div>
                            <div v-if="requestItem.adminCanEdit">
                                <button :id="requestItem._id" type="button" @click.prevent="onEditViewRequest" class="enableEdit btn btn-warning btn-sm float-right">Edit</button>
                            </div>
                            <div v-else>
                                <button :id="requestItem._id" type="button" @click.prevent="onEditViewRequest" class="disableEdit btn btn-secondary btn-sm float-right">View</button>
                            </div>
                            <button :id="requestItem._id" type="button" @click.prevent="onDeleteRequest" class="btn btn-danger btn-sm float-left">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            <div style="height:10px;"></div>
            <div class="float-right" style="display:flex; flex-direction:horizontal">
                <div class="input-group-prepend">
                    <span class="input-group-text bg-secondary text-light">Page</span>
                </div>&nbsp;
                <div v-if="currentPageNumber > 1">
                    <button @click.prevent="onPageDecrement" style="height:100%" type="button" class="btn btn-secondary btn-sm">
                        <span class="fas fa-chevron-left"></span>
                    </button>
                </div>
                <div v-else>
                    <button style="height:100%" type="button" class="btn btn-secondary btn-sm" disabled>
                        <span class="fas fa-chevron-left"></span>
                    </button>
                </div>
                <div v-for="number in numPages" :key="number">
                    <button @click.prevent="onPagePick" v-bind:id="`page${number}Button`" style="height:100%;" type="button" class="pageNumberButton btn btn-sm">{{ number }}</button>
                </div>
                <div v-if="currentPageNumber != numPages">
                    <button @click.prevent="onPageIncrement" style="height:100%" type="button" class="btn btn-secondary btn-sm">
                        <span class="fas fa-chevron-right"></span>
                    </button>
                </div>
                <div v-else>
                    <button style="height:100%" type="button" class="btn btn-secondary btn-sm" disabled>
                        <span class="fas fa-chevron-right"></span>
                    </button>
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
        previewPerPage: 6, //hardcoded for now
        numPages: 0,
        numRequests: 0,
        currentPageNumber: 1,
        statusLabels: [
            "underReview",
            "rejected",
            "approved",
        ],
        requestsQueryString: "",
    }
  },
  
  computed: {
        title() {
            return this.$store.state.appConfig.adminRequestViewTitle; 
        },
        viewDescription() {
            return this.$store.state.appConfig.adminHomeViewDescription; 
        },
        requestsPreview() {
            return this.$store.state.currentRequestsPreview;
        },
    },

    activated() {
        console.log('AdminRequest.vue activated.');
        let vm = this;

        if (this.$store.state.appConfig.adminRequestViewTitle == null) {
        this.$router.push('/login'); // Config data lost, force back to login to refetch data.
        return;
        }

        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = true;

        //clear all search UI to be blank
        var inputs = $("input");
        inputs.each(function(){
        let inputType = this.type;
        if (inputType == "text" || inputType == "number"){
            this.value = "";
        } else if (inputType == "checkbox"){
            this.checked = false; //needs fixing
        } 
        });

        vm.getNumPages();
        vm.updateRequests();
        vm.$forceUpdate();
        
        
    },

    updated(){
        //console.log('AdminRequest.vue updated.');
        let vm = this;

        //color badge based on status
        $(function() {
        $(".approved").addClass("badge badge-success");
        $(".rejected").addClass("badge badge-danger");
        $(".underReview").addClass("badge badge-warning");
        $(".completed").addClass("badge badge-secondary"); //not yet implemented
        });

        //highlight current page num
        $('.pageNumberButton').each(function(index){
            if($(this).attr('id') == `page${vm.currentPageNumber}Button`){
                $(this).removeClass();
                $(this).addClass('pageNumberButton btn btn-info btn-sm');
            } else {
                $(this).removeClass();
                $(this).addClass('pageNumberButton btn btn-secondary btn-sm');
            }
        });
    },

    methods: {
        onPagePick: function(event){
            if (event){
                console.log("onPagePick activate.");
                let vm = this;
                
                vm.currentPageNumber = event.target.id.replace("page", "").replace("Button", "");
                vm.updateRequests();
            }
        },

        onPageIncrement: function(event){
            if(event){
                console.log("onPageIncrement activate.")
                let vm = this;

                vm.currentPageNumber++;
                vm.updateRequests();
            }
        },

        onPageDecrement: function(event){
            if(event){
                console.log("onPageDecrement activate.")
                let vm = this;

                vm.currentPageNumber--;
                vm.updateRequests();
            }
        },

        updateRequests(){
            console.log("updateRequests activate.");
            let vm = this;

            let pageNumber = vm.currentPageNumber;
            console.log(`Page number: ${pageNumber}`);

            //&summaryFieldsOnly=true
            //&processingStatusContains=underReview
            //&numOfItemsToSkip=20
            //&numOfItemsPerPage=10

            //gather query string
            var url = apiMgr.getRequestsUrl() + `&numOfItemsToSkip=${vm.previewPerPage * (vm.currentPageNumber-1)}&summaryFieldsOnly=true&numOfItemsPerPage=${vm.previewPerPage}`;
            
            if(vm.requestsQueryString != null && vm.requestsQueryString != ""){
                url += vm.requestsQueryString;
            }
            console.log(url);


            //get requests
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
                    
                    vm.requestsQueryString = "";
                    vm.getNumPages();
                    //vm.$forceUpdate();
                    //vm.isFetchingRequests = false;
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })
        },

        filterView: function(event){
            console.log("filterView activated.");
            var queryString = '';
            var vm = this;

            vm.currentPageNumber = 1;
            //collapse search menu
            $("#filterMenu").click();


            //gather event name to query
            var nameToQuery = '';
            var nameSet = $("#inputEventName input");
            
            $.each(nameSet, function( index, item ){
                if(item.value != null && item.value != ""){
                    nameToQuery = item.value;
                    vm.requestsQueryString += `&requestNameContains=${nameToQuery}`;
                }
            });


            //gather requester email to query
            //NOTE: this is misleading right now
            var requesterEmailToQuery = '';
            var requesterEmailSet = $("#inputRequesterEmail input");
            
            $.each(requesterEmailSet, function( index, item ){
                if(item.value != null && item.value != ""){
                    requesterEmailToQuery = item.value;
                    vm.requestsQueryString += `&requesterEmailContains=${requesterEmailToQuery}`;
                }
            });


            //gather location to query
            var locationToQuery = '';
            var locationSet = $("#inputLocation input");

            $.each(locationSet, function( index, item ){
                if(item.value != null && item.value != ""){
                    locationToQuery = item.value;
                    vm.requestsQueryString += `&locationContains=${locationToQuery}`;
                }
            });

            //gather status to query
            var statusToQuery = '';
            var statusSet = $("#inputStatus select option");

            $.each(statusSet, function( index, item ){
                if (item.selected && item.id != ""){
                    statusToQuery = item.id;
                    vm.requestsQueryString += `&processingStatusContains=${statusToQuery}`;
                }
            });
            

            vm.updateRequests();
        },

        resetFilterView: function(event){
            console.log("resetFilterView activated.");
            let vm = this;

            vm.requestsQueryString = null;

            vm.updateRequests();
        },

        getNumPages(){
            console.log("getNumPages activated.");
            let vm = this;

            //get requests and pages count
            var url = apiMgr.getRequestsUrl().replace("requests", "requestscount") + `&numOfItemsPerPage=${vm.previewPerPage}`;
            if(vm.requestsQueryString != null && vm.requestsQueryString != ""){
                url += `&processingStatusContains=${vm.requestsQueryString}`;
            }

            axios.get(url)
                .then(res => {
                    console.log("getRequestsUrl return status: " + res.status);
                    
                    vm.numPages = res.data.numOfPages;
                    vm.numRequests = res.data.count;

                    vm.$forceUpdate();
                    //vm.isFetchingRequests = false;
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })
        },

        onEditViewRequest: function(event) {
            console.log('AdminRequests.vue - onEditViewRequest activate');

            let vm = this;
            let selectedReqId = event.target.id;
            let storeState = this.$store.state;

            var revisingRequest = localCacheMgr.getCachedItem("revisingRequest-" + selectedReqId);
            if (revisingRequest != undefined && revisingRequest != null) {

                storeState.currentRequest = revisingRequest;
                storeState.selectedRoom = storeState.currentRequest.locationOfEvent;
                    
                //check if it is an edit or a view; if edit, go to request/1, if view, go to summary
                if($(event.target).hasClass("enableEdit")){
                    vm.$router.push('/request/1');
                } else if ($(event.target).hasClass("disableEdit")) {
                    vm.$router.push('/requestsummary'); 
                }

            } else {
                //construct query string
                var url = apiMgr.getRequestByIdUrl(selectedReqId);
                console.log(url);

                //get requests
                axios.get(url)
                    .then(res => {
                        console.log("getRequestByIdUrl return status: " + res.status);
 
                        storeState.currentRequest = res.data;
                        storeState.selectedRoom = storeState.currentRequest.locationOfEvent;
                    
                        //check if it is an edit or a view; if edit, go to request/1, if view, go to summary
                        if($(event.target).hasClass("enableEdit")){
                            vm.$router.push('/request/1');
                        } else if ($(event.target).hasClass("disableEdit")) {
                            vm.$router.push('/requestsummary'); 
                        }
                    })
                    .catch((err) => { //todo
                        vm.hasFailure = true;
                        vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                    })
            }

            },

            onDeleteRequest: function (event){
                console.log('AdminRequests.vue - onDeleteRequest activate');
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
            
            
            },

            onQuickFilter: function(event){
                if (event){
                    console.log("onQuickFilter activate.");
                    let vm = this;

                    let statusToQuery = event.target.id;

                    vm.requestsQueryString += `&processingStatusContains=${statusToQuery}`;
                    vm.updateRequests();
                }
            }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pad-bottom{
  padding-bottom:5px
}
a {
    margin:2px
}
</style>