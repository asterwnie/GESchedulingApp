<template>
<div>
<!-- Modal -->
<div class="modal" id="deleteRequestModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="deleteModalLabel">Delete Request</h5>
        <button @click.prevent="onCancelDeleteRequest" type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to delete this request? This action cannot be undone.</p>

        <div class="card" v-if="selectedRequestForDelete != null">
        <div class="card-body">
            <h6 class="card-title">{{selectedRequestForDelete.eventTitle}}</h6>
            <h6 class="card-title"><span :class="selectedRequestForDelete.processingStatus">{{selectedRequestForDelete.processingStatusLabel}}</span></h6>
            <div class="card-text"><i class="label-icon fas fa-building"></i>&nbsp;&nbsp;<b>{{selectedRequestForDelete.locationOfEvent.name}}</b>,&nbsp;{{selectedRequestForDelete.locationOfEvent.building}}</div> 
            <div v-if="selectedRequestForDelete.eventDateTimeDisp != null" class="card-text"><i class="label-icon fas fa-calendar-check"></i>&nbsp;&nbsp;{{selectedRequestForDelete.eventDateTimeDisp}}</div>
            <div class="card-text"><i class="label-icon fas fa-user-circle"></i>&nbsp;&nbsp;{{selectedRequestForDelete.eventGEContactPersonName}}</div>                      
            <div class="card-text text-muted" style="font-size:80%;margin-bottom: 8px;">Updated On:&nbsp;{{selectedRequestForDelete.updatedAtDisp}}</div>
        </div>
        </div>       
        
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click.prevent="onCancelDeleteRequest">Cancel</button>
        <button type="button" class="btn btn-primary" @click.prevent="onDeleteRequest">Confirm Delete</button>
      </div>
    </div>
  </div>
</div>
<!--Page Contents-->
<div class="container-fluid">
    <div class="row">
        <div class="col col-12 col-sm-1 col-md-1 col-lg-2"></div>
        <div class="col col-12 col-sm-10 col-md-10 col-lg-8" style="color:gray">
        <div style="padding:18px;background-color:#ffb3b3;">
        <div class="float-left"><img src="@/assets/ge-monogram.svg" width="40" height="40" class="d-inline-block align-top" alt=""></div>
        <div class="welcome-back-msg">{{welcomeMessage}}</div>
        <div style="cursor:pointer;" class="logoff-label" @click.prevent="$router.push('/login')">Log Out&nbsp;<span class="fas fa-chevron-right"></span></div>
        </div>
        </div>
        <div class="col col-12 col-sm-1 col-md-1 col-lg-2"></div>
    </div>
    
    <div style="height:10px"></div>

    <div class="row">
        <div class="col col-12 col-sm-1 col-md-1 col-lg-2"></div>
        <div class="col col-12 col-sm-10 col-md-10 col-lg-8" style="color:gray">
    
            <div class="card" style="width:100%">
                    <div class="card-header bg-info text-light">
                        {{requestResultCaption}} 
                    </div>
            </div>

        </div>
        <div class="col col-12 col-sm-1 col-md-1 col-lg-2"></div>
    </div>

    <div style="height:10px"></div>

    <div class="row">
    <div class="col col-12 col-sm-1 col-md-1 col-lg-2"></div>

    <div id="searchUI" class="col col-12 col-sm-10 col-md-4 col-lg-4 col-xl-2" style="margin-bottom:20px">
        <div class="card-header">
            <span>
                Quick Filter:&nbsp;<br>
                <button id="allRequest" @click.prevent="resetFilterView" class="btn btn-xs btn-info">All Requests</button>
                <button id="underReview" @click.prevent="onQuickFilter" class="btn btn-xs btn-warning">{{underReviewLabel}}</button>
                <button id="rejected" @click.prevent="onQuickFilter" class="btn btn-xs btn-danger" >{{rejectedLabel}}</button>                
                <button id="approved" @click.prevent="onQuickFilter" class="btn btn-xs btn-success">{{approvedLabel}}</button>
            </span>
        </div>
        <div style="height:10px"></div>
      <div class="card">
      <div class="card-header bg-primary text-light" id="filterMenu" style="cursor:pointer;" data-toggle="collapse" data-target="#filterPanel" aria-expanded="true" aria-controls="filterPanel">
      <i class="fa fa-search-plus" aria-hidden="true"></i>&nbsp;&nbsp;Custom Filter&nbsp;&nbsp;<i class="fa fa-caret-down" aria-hidden="true"></i>
      </div>
      <div id="filterPanel" class="collapse show" aria-labelledby="filterMenu" data-parent="#accordion">
          <div id="filterMenu" class="card-body" style="padding:10px; width:100%;">

            <div id="inputEventName" class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Event Name</span>
                </div>
                <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
            </div>

            <div id="inputRequesterName" class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">Requester Name</span>
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
                <span class="input-group-text" id="inputGroup-sizing-sm">Room/Location</span>
                </div>
                <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
            </div>

            <div id="inputStatus" class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Status</span>
                </div>
                <select class="custom-select">
                    <option selected></option>
                    <option v-bind:id="statusItem.statusValue" v-bind:value='statusItem.statusValue' v-for="(statusItem, index) in processingStatusOptions" :key="index">
                        {{ statusItem.statusLabel }}
                    </option>
                </select>
            </div>

            <div id="inputPreviewPerPage" class="input-group input-group-sm mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="inputGroup-sizing-sm">Items Per Page</span>
                </div>
                <select class="custom-select" id="default-6">
                    <option value="6" selected>6</option>
                    <option value="8">8</option>
                    <option value="10">10</option>
                    <option value="12">12</option>
                </select>
            </div>
            
            <br>
            <button type="button" class="btn btn-sm btn-primary float-right" @click.prevent="filterView">Search</button>
            <button type="button" class="btn btn-sm btn-secondary" @click.prevent="resetFilterView">Reset</button>
          </div>
        </div>
      </div>
    </div>

    <div id="requestUI" class="col col-12 col-md-6 col-lg-4 col-xl-6">
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
                    <div :class="[requestItem._id, 'request-item', 'card', 'col-12', 'col-xl-6']" v-for="(requestItem, index) in requestsPreview" :key="index">
                        <div class="card-body">
                            <h6 class="card-title">{{requestItem.eventTitle}}</h6>
                            <h6 class="card-title"><span :class="requestItem.processingStatus">{{requestItem.processingStatusLabel}}</span></h6>
                            <div class="card-text"><i class="label-icon fas fa-building"></i>&nbsp;&nbsp;<b>{{requestItem.locationOfEvent.name}}</b>,&nbsp;{{requestItem.locationOfEvent.building}}</div> 
                            <div v-if="requestItem.eventDateTimeDisp != null" class="card-text"><i class="label-icon fas fa-calendar-check"></i>&nbsp;&nbsp;{{requestItem.eventDateTimeDisp}}</div>
                            <div class="card-text"><i class="label-icon fas fa-user-circle"></i>&nbsp;&nbsp;{{requestItem.eventGEContactPersonName}}</div>                      
                            <div class="card-text text-muted" style="font-size:80%;margin-bottom: 8px;">Updated On:&nbsp;{{requestItem.updatedAtDisp}}</div>
                            <div v-if="requestItem.adminCanEdit">
                                <button :id="requestItem._id" style="cursor:pointer" type="button" @click.prevent="onEditViewRequest" class="enableEdit btn btn-warning btn-sm float-right">Edit</button>
                            </div>
                            <div v-else>
                                <button :id="requestItem._id" style="cursor:pointer" type="button" @click.prevent="onEditViewRequest" class="disableEdit btn btn-secondary btn-sm float-right">View</button>
                            </div>
                            <button :id="requestItem._id" type="button" @click.prevent="onDeleteModalSelect" class="btn btn-danger btn-sm float-left"><i class="fas fa-trash-alt"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            <div style="height:10px;"></div>
            <div class="float-right" style="display:flex; flex-direction:horizontal">
                <div class="input-group-prepend">
                    Total: {{numRequests}}&nbsp;&nbsp;<span class="input-group-text bg-secondary text-light">Page</span>
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

            <div style="height:60px;"></div>
            
    </div>

    <div class="col col-12 col-md-1 col-lg-2"></div>
    </div>
    <div style="height:30px"></div>
    <div class="row">
        <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
        <div class="col col-12 col-auto" style="color:gray">
          <div class="site-name-footer" v-html="$store.state.appConfig.siteName"></div>
          <div class="site-address-footer" v-html="$store.state.appConfig.siteAddress"></div>
        <br>
        </div>
        <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
    </div>
</div> 
</div>
</template>

<script>
import axios from 'axios';
import * as util from '@/common/util.js';
import * as apiMgr from '@/common/apiMgr.js';
import * as localCacheMgr from '@/common/localCacheMgr.js';
import { getLocalUserRequestById } from '@/common/requestMgr.js'

export default {
    data () {
    return {
        previewPerPage: 6, //hardcoded for now
        numPages: 0,
        numRequests: 0,
        requestResultCaption: "Requests - All",
        currentPageNumber: 1,
        requestsQueryString: "",
        deleteMode: false,
        processingStatusOptions: this.$store.state.processingStatusOptions,
        underReviewLabel: this.$store.state.appConfig.requestStatusTagUnderReview,
        rejectedLabel: this.$store.state.appConfig.requestStatusTagRejected,
        approvedLabel: this.$store.state.appConfig.requestStatusTagApproved
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
        },

        selectedRequestForDelete() {
            return this.$store.state.selectedRequestForDelete;
        },

        welcomeMessage() {
            var welcomeMsg = "Welcome";
            try {               
                var userFullName = this.$store.state.currentAdminUser.name;
                var nameParts = userFullName.split(' ');
                var firstName = nameParts[0];
                welcomeMsg = "Welcome, " + firstName;
                var maxLenGoodForSmallPhone = 28;
                if (util.detectIsInSmallWidthMode() && welcomeMsg.length > maxLenGoodForSmallPhone) {
                    welcomeMsg = firstName;
                }
            } catch (err) {}  
            return welcomeMsg;      
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

        if (util.detectIsInSmallWidthMode()) {
            //collapse search menu
            $("#filterPanel").removeClass("show");
            $("#filterPanel").removeClass("hide");
        }

        vm.clearSearchUI();
        vm.updateRequests();
        vm.$forceUpdate();

        $('#allRequest').focus();
    },


    updated(){
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

    deactivated(){
        console.log("AdminHome.vue deactivated.");
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

            if (util.detectIsInSmallWidthMode()) {
                //collapse search menu
                $("#filterPanel").removeClass("show");
                $("#filterPanel").removeClass("hide");
            }

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

                        foundRequest.updatedAtDisp = util.getDateTimeDisplay(foundRequest.updatedAt);

                        if (foundRequest.eventSchedule != null && 
                            foundRequest.eventSchedule.startDateTime != null &&
                            foundRequest.eventSchedule.endDateTime != null) {
                            foundRequest.eventDateTimeDisp = util.makeEventDateTimeDisplay(foundRequest.eventSchedule.startDateTime, foundRequest.eventSchedule.endDateTime);
                        }

                        vm.$store.state.currentRequestsPreview.push(foundRequest);
                    });
                                       
                    vm.getNumPages();
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
            vm.requestsQueryString = "";

            vm.requestResultCaption = "Requests - custom filter"

            if (util.detectIsInSmallWidthMode()) {
                //collapse search menu
                $("#filterPanel").removeClass("show");
                $("#filterPanel").removeClass("hide");
            }

            //get preview per page
            vm.previewPerPage = $("#inputPreviewPerPage select")[0].value;

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
            var requesterEmailToQuery = '';
            var requesterEmailSet = $("#inputRequesterEmail input");
            
            $.each(requesterEmailSet, function( index, item ){
                if(item.value != null && item.value != ""){
                    requesterEmailToQuery = item.value;
                    vm.requestsQueryString += `&requesterEmailContains=${requesterEmailToQuery}`;
                }
            });

            //gather requester name to query
            var requesterNameToQuery = '';
            var requesterNameSet = $("#inputRequesterName input");
            
            $.each(requesterNameSet, function( index, item ){
                if(item.value != null && item.value != ""){
                    requesterNameToQuery = item.value;
                    vm.requestsQueryString += `&requesterNameContains=${requesterNameToQuery}`;
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
            vm.requestResultCaption = "Requests - All"
            vm.requestsQueryString = null;
            vm.clearSearchUI();
            vm.updateRequests();
        },

        getNumPages(){
            console.log("getNumPages activated.");
            let vm = this;

            //get requests and pages count
            var url = apiMgr.getRequestsUrl().replace("requests", "requestscount") + `&numOfItemsPerPage=${vm.previewPerPage}`;
            if(vm.requestsQueryString != null && vm.requestsQueryString != ""){
                url += `${vm.requestsQueryString}`;
            }

            axios.get(url)
                .then(res => {
                    console.log("getRequestsUrl return status: " + res.status);
                    
                    vm.numPages = res.data.numOfPages;
                    vm.numRequests = res.data.count;

                    var newCountPart = " (" + vm.numRequests + ")";
                    var beginCountPart = vm.requestResultCaption.indexOf("(");
                    if (beginCountPart > -1) {
                        // Need to remove the previous number part first.
                        var requestResultCaptionSuffix = vm.requestResultCaption.substring(beginCountPart, vm.requestResultCaption.length);
                        var requestResultCaptionPrefix = vm.requestResultCaption.replace(requestResultCaptionSuffix, '').trim();                     
                        vm.requestResultCaption = requestResultCaptionPrefix + newCountPart;
                    } else {
                        vm.requestResultCaption = vm.requestResultCaption + newCountPart;
                    }

                    vm.$forceUpdate();                   
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })
        },


        onEditViewRequest: function(event) {
            console.log('AdminHome.vue - onEditViewRequest activate');

            let vm = this;
            let selectedReqId = event.target.id;
            let storeState = this.$store.state;

            var revisingRequest = localCacheMgr.getCachedItem(util.makeRevisingRequestCacheKey(storeState.loginContext.requesterEmail, selectedReqId));
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

        onDeleteRequest() {
            console.log('AdminHome.vue - onDeleteRequest');
            let vm = this;

            let currId = this.$store.state.selectedRequestForDelete._id;                
            var url = apiMgr.getRequestByIdUrl(currId);
            console.log(`Home.vue - Query url: ${url}`);
            
            axios.delete(url) // send delete request
                .then(res => {
                    console.log("getRequestsUrl return status: " + res.status);
                    vm.removeRequestPreviewFromLocalCollection(currId);
                    this.$store.state.selectedRequestForDelete = null;
                    $('#deleteRequestModal').modal('hide');
                })
                .catch((err) => {
                    if (err.response.status == 400) {
                        vm.removeRequestPreviewFromLocalCollection(currId);
                    } else {
                        console.log(err);
                        vm.hasFailure = true;
                        vm.failureMessage = "Server unavailable or not working at this time. Please try later.";       
                    }                        
                })           
        },

        removeRequestPreviewFromLocalCollection: function(id) {
            var indexToRemove = -1;
            $.each(this.$store.state.currentRequestsPreview, function (index, reqPreview) {
                if (reqPreview._id == id) {
                    indexToRemove = index;
                }
            });      
            if (indexToRemove > -1) {
                this.$store.state.currentRequestsPreview.splice(indexToRemove, 1);
            } 
        },

        onQuickFilter: function(event) {
            if (event) {
                console.log("onQuickFilter activate.");
                let vm = this;

                if (util.detectIsInSmallWidthMode()) {
                    //collapse search menu
                    $("#filterPanel").removeClass("show");
                    $("#filterPanel").removeClass("hide");
                }

                vm.currentPageNumber = 1;
                vm.requestsQueryString = "";
                let statusToQuery = event.target.id;

                var filterLabel = util.getProcessingStatusOptionLabel(statusToQuery);

                vm.requestResultCaption = "Requests - " + filterLabel;
                

                vm.requestsQueryString += `&processingStatusContains=${statusToQuery}`;
                vm.updateRequests();
            }
        },

        onDeleteModalSelect: function(event){
            if(event){
                console.log("onDeleteModalSelect");
                let vm = this;

                let currId = event.currentTarget.id;
                this.$store.state.selectedRequestForDelete = getLocalUserRequestById(currId, true);
                
                $('#deleteRequestModal').modal('show');
            }
        },

        onCancelDeleteRequest(){
            console.log('onCancelDeleteRequest');
            let vm = this;
            this.$store.state.selectedRequestForDelete = null;
            $('#deleteRequestModal').modal('hide');
        },

        clearSearchUI(){
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

            var selects = $('select');
            selects.each(function(){
                if (this.id != null && this.id != "") {
                    if (this.id.indexOf("default") > -1) {
                        //if there is a default, reselect it
                        this.value = this.id.replace("default-", "");
                    } else {
                        this.value = "";
                    }
                } else {
                    this.value = "";
                }
            });
        }

    }
} 
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pad-bottom {
  padding-bottom:5px
}
a {
    margin:2px
}

</style>