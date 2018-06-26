<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">
        <form class="needs-validation" novalidate>
          <button class="btn btn-primary btn-block" type="submit" @click.prevent="$router.push('dofirst')">New Request</button>
        </form>
        <br/>
        <br/>

    <div class="card">
      <div class="card-header text-center bg-secondary text-light">
        <b>Requests</b>
      </div>
    </div>

    <div v-if="requestsData.length < 1">
      <div class="card">
        <br>
        <p style="text-align:center" class="font-italic text-muted">No requests yet! Hit "New Request" to create one.</p>
        <br>
      </div>
    </div>
    <div v-else>
      <div v-for="(requestItem, index) in requestsData" :key="index">
        <div class="card">
          <div class="card-body">
            <h6 class="card-title">{{requestItem.eventTitle}}</h6>
            <h6 class="card-title">Status:&nbsp;<span :class="requestItem.processingStatus">{{requestItem.processingStatusLabel}}</span></h6>
            <p class="card-text font-italic">{{requestItem.processingStatusMessage}}</p>
            <div class="card-text text-muted">Last updated:&nbsp;{{requestItem.updatedAt.substring(0, requestItem.updatedAt.indexOf("T"))}}</div>
            <div v-if="requestItem.canEdit">
              <button :id="requestItem._id" type="button" v-on:click="onEditViewRequest" class="enableEdit btn btn-warning btn-sm float-right">Edit</button>
            </div>
            <div v-else>
              <button :id="requestItem._id" type="button" v-on:click="onEditViewRequest" class="disableEdit btn btn-secondary btn-sm float-right">View</button>
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
    requestsData(){
      return this.$store.state.requestsData;
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
                    
                    while(vm.$store.state.requestsData.length > 0) {
                      vm.$store.state.requestsData.pop();
                    }
                    var foundRequests = res.data;

                    $.each(foundRequests, function (index, request) {
                      vm.$store.state.requestsData.push(request);
                    });
                    
                    vm.isFetchingRequests = false;
                    //vm.$forceUpdate();
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })
  },

  beforeMount(){
    console.log('Home.vue beforeMount activated.');

    //color badge based on status
    $(function(){
            $(".approved").addClass("badge badge-success");
            $(".rejected").addClass("badge badge-danger");
            $(".underReview").addClass("badge badge-info");
            $(".completed").addClass("badge badge-secondary"); //not yet implemented
        });
  },

  created() {
    console.log('Home.vue created.');
    
  },

  methods:{
    onEditViewRequest: function(event){
        if(event){
          console.log('Home.vue - onEditViewRequest activate');
          let vm = this;

          
          this.$store.state.currentRequest = {};
            
          //get request for edit/view
          let currId = event.target.id;

          let queryId = `&requestIdContains=${currId}`;
          var url = apiMgr.getRequestsUrl() + queryId;
          console.log(`Home.vue - Query url: ${url}`);

            axios.get(url)
                .then(res => {
                    console.log("getRequestsUrl return status: " + res.status);

                    while(vm.$store.state.currentRequest.length > 0) {
                        vm.$store.state.currentRequest.pop();
                      }
                    var foundRequests = res.data;
                    $.each(Object.keys(foundRequests[0]), function(index, key){
                      vm.$store.state.currentRequest[key] = foundRequests[0][key];
                    });

                   // vm.isFetchingRequests = false;
                    
                    try {
                      localCacheMgr.cacheItem("workingNewRequest", vm.$store.state.currentRequest);
                      console.log("onEditViewRequest - Successfully injected view request into cache.");
                    } catch (err) {
                      console.log("onEditViewRequest - Not able to locally cache the working new request.");
                    }

                    
                    //check if it is an edit or a view; if edit, go to request/1, if view, go to summary
                    if($(event.target).hasClass("enableEdit")){
                      vm.$router.push('/request/1');
                    } else if ($(event.target).hasClass("disableEdit")) {
                      vm.$router.push('/submitrequest');
                    }
                    
                })
                .catch((err) => {
                    console.log(err);
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })

          
        }
      },
    },
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>