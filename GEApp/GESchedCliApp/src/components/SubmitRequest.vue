<template>
  <div class="container-fluid" style="width:100%">
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">

          <div class="card">
            <div class="card-header bg-info text-light">
              Request Summary
            </div>
            <div class="card-body">

                <!--For each key in currentRequestKeys-->
                <div class="input-group input-group-sm mb-3" style="width:100%" v-for="(currKey, index) in currentRequestKeys" :key="index">
                  <div class="input-group-prepend"> <!--Convert to Sentence Case-->
                    <span class="input-group-text" id="inputGroup-sizing-sm">
                      {{(currKey.charAt(0).toUpperCase() + currKey.slice(1)).replace(/([A-Z]+)*([A-Z][a-z])/g, "$1 $2")}}
                    </span>
                  </div>
                  <div class="bg-light text-info" style="width:100%; border: 1px solid #cfcfcf; padding:6px"> <!--class="container-fluid" or style="width:100%"-->
                    <span>
                      &nbsp;{{currentRequestData[currKey]}}
                    </span>
                  </div>
                </div>

            </div>
          </div>

         
                  <br>
                  <button type="button" class="btn btn-primary btn-sm" 
                    :disabled="isSubmitting" 
                    @click.prevent="onSubmitRequest">Submit Request</button>
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
      failureMessage: ""
    }
  },

  computed: {
    title() {
      return this.$store.state.appConfig.submitRequestViewTitle; 
    },
    
    currentRequestData(){  
      return this.$store.state.currentRequest;
    },
    currentRequestKeys(){  
      return Object.keys(this.$store.state.currentRequest);
    },
  },

  activated() {
    console.log('SubmitRequest.vue activated.');

    if (this.$store.state.appConfig.submitRequestViewTitle == null) {
      this.$router.push('/login'); // Config data lost, force back to login to refetch data.
      return;
    }

    this.$store.state.currentViewTitle = this.title;
    this.$store.state.enableNavBar = true;
  },

  created() {
      console.log('SubmitRequest.vue created.');
  },

  methods: {
    onSubmitRequest (evt) {
      var vm = this;

      var requestsUrl = apiMgr.getRequestsUrl();

      vm.generateRandomStatusAndComments(vm.$store.state.currentRequest, vm.$store.state);

      axios.post(requestsUrl, vm.$store.state.currentRequest)
      .then(res => {
          console.log("Login status: " + res.status);
          vm.isSubmitting = false;
          vm.hasFailure = false;
          const storeState = this.$store.state;

          if (res.status == 201 && res.data != null) {
              var requestCreated = res.data;

              localCacheMgr.uncacheItem("workingNewRequest");
              vm.$store.state.currentRequest = null;

              vm.$router.push('home'); 

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