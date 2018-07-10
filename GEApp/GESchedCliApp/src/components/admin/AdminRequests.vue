<template>  
<div class="container-fluid">
    <div class="row">
    <div class="col col-12 col-md-2 col-lg-2"></div>

    <div id="searchUI" class="col col-12 col-md-3 col-lg-3 col-xl-2" style="margin-bottom:20px">
      <div class="card">
      <div class="card-header bg-primary text-light" id="headingOne" style="cursor:pointer;" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            Search Menu <i class="fa fa-search-plus" aria-hidden="true"></i>&nbsp;&nbsp;<i class="fa fa-caret-down" aria-hidden="true"></i>
      </div>
      <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
          <div id="filterMenu" class="card-body" style="padding:10px; width:100%;">

            <!--filter items-->
              filter items...
            
            <br>
            <!--<button type="button" class="btn btn-sm btn-primary float-right" v-on:click="filterView">Search</button>
            <button type="button" class="btn btn-sm btn-secondary" v-on:click="resetFilterView">Reset</button>-->
          </div>
        </div>
      </div>
    </div>

    <div id="roomUI" class="col col-12 col-md-5 col-lg-5 col-xl-6">
      <!--header-->
      <!--cards-->
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <strong>Alert</strong> some alert here.
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="bg-info" v-if="requestsPreview.length < 1">
                <div class="card">
                    <br>
                    <p style="text-align:center" class="font-italic text-muted">No current requests.</p>
                    <br>
                </div>
            </div>
            <div v-else>
                <div class="card" style="width:100%">
                    <div class="card-header bg-info text-light" style="text-align:center">
                        Requests
                    </div>
                </div>
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
                            <div v-if="requestItem.canEdit">
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
                    <button style="height:100%" type="button" class="btn btn-secondary btn-sm">
                        <span class="fas fa-chevron-left"></span>
                    </button>
                </div>
                <div v-for="number in numPages" :key="number">
                    <button @click.prevent="onPagePick" v-bind:id="`page${number}Button`" style="height:100%;" type="button" class="pageNumberButton btn btn-sm">{{ number }}</button>
                </div>
                <div v-if="currentPageNumber != numPages">
                    <button style="height:100%" type="button" class="btn btn-secondary btn-sm">
                        <span class="fas fa-chevron-right"></span>
                    </button>
                </div>
            </div>
    </div>

    <div class="col col-12 col-md-2 col-lg-2"></div>
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
        previewPerPage: 3,
        numPages: 4, //hardcoded for now
        currentPageNumber: 4,
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
        console.log('AdminRequest.vue activated.');
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
        console.log('AdminRequest.vue created.');
        let vm = this;

        //color badge based on status
        $(function() {
        $(".approved").addClass("badge badge-success");
        $(".rejected").addClass("badge badge-danger");
        $(".underReview").addClass("badge badge-info");
        $(".completed").addClass("badge badge-secondary"); //not yet implemented
        });

        //highlight current page num
        $('.pageNumberButton').each(function(index){
            if($(this).attr('id') == `page${vm.currentPageNumber}Button`){
                $(this).addClass('btn-info');
            } else {
                $(this).addClass('btn-secondary');
            }
        });
    },

    updated(){
        console.log('AdminRequest.vue updated.');
        let vm = this;

        //color badge based on status
        $(function() {
        $(".approved").addClass("badge badge-success");
        $(".rejected").addClass("badge badge-danger");
        $(".underReview").addClass("badge badge-info");
        $(".completed").addClass("badge badge-secondary"); //not yet implemented
        });

        //highlight current page num
        $('.pageNumberButton').each(function(index){
            if($(this).attr('id') == `page${vm.currentPageNumber}Button`){
                $(this).addClass('btn-info');
            } else {
                $(this).addClass('btn-secondary');
            }
        });
    },

    methods: {
        onPagePick: function(event){
            if (event){
                console.log("onPagePick activate.");
                
                let pageNumber = event.target.id.replace("page", "").replace("Button", "");
                console.log(`Page number: ${pageNumber}`);
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
</style>