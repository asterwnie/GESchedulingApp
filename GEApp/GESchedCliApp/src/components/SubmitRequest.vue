<template>
    <div class="container">
      <div class="row">
        <div class="col-md-8 order-md-1">

 
            <br>
            <div class="alert alert-light" role="alert">
            Request Summary Goes Here...
            </div>
            <br>

        </div>
      </div>
      <div class="fixed-bottom d-flex justify-content-between">
        
        <button type="button" class="btn btn-primary btn-sm" 
          :disabled="isSubmitting" 
          @click.prevent="onSubmitRequest">Submit Request</button>
          <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
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
  /*  viewDescription() {
      return this.$store.state.appConfig.hotelsViewDescription; 
    },*/
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



    }
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  display: inline-block;
  margin: 16px;
  margin-right: 50px;
}
</style>