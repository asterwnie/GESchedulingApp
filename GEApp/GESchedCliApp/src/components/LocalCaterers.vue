<template>

<div class="container-fluid" style="width:100%;">
    <div>
       <div id="loading" class="pagination-centered" :hidden="!isLoading||hasFailure">
        <br>
        <br>
        <i class="fas fa-circle-notch fa-spin fa-lg"></i>
      </div>
    </div>
    <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
    <div class="row" :hidden="isLoading">
      <div class="col col-sm-1 col-md-2 col-lg-4"></div>
      <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">
          <div class="alert alert-info">{{ viewDescription }}</div>
          <h4>Location:</h4>
          <div class="font-weight-light">
            <div class="text-left" v-html="$store.state.appConfig.siteName"></div>
            <div class="text-left" v-html="$store.state.appConfig.siteAddress"></div>
          </div>
          <hr>
          <br/>
          <div v-if="catererItems == null">
            <div class="card font-italic">
              <div class="card-body">
                No local caterers provided.
              </div>
            </div>
          </div>
          <div v-else>
            <div class="LocalCaterers text-white">
              <div class="card bg-success" style="margin-bottom:7px" v-for="(caterer, index) in catererItems" :key="index">
                  <div class="card-header">{{ caterer.name }}</div>
                  <div class="card-body">
                    <div class="card-text" v-for="(line, index) in caterer.address" :key="index">
                      {{line}}
                    </div>
                    <br>
                    <div></div>
                    <div></div>
                  </div>
              </div>
            </div>
          </div>

      </div>

    
    
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import * as apiMgr from '@/common/apiMgr.js';

export default {
  data () {
    return {
      isFetchingCaterers: true,
      hasFailure: false,
      failureMessage: ""
    }
  },

  computed: {
    title() {
      return this.$store.state.appConfig.caterersViewTitle; 
    },
    viewDescription() {
      return this.$store.state.appConfig.caterersViewDescription; 
    },
    catererItems() {
      return this.$store.state.caterers;
    },
    isLoading() {
      return (
          this.isFetchingCaterers
          ); 
    }
  },

  activated() {
    console.log('LocalCaterers.vue activated.');

    if (this.$store.state.appConfig.caterersViewTitle == null) {
      this.$router.push('login'); // Config data lost, force back to login to refetch data.
    }

    this.$store.state.currentViewTitle = this.title;
    this.$store.state.enableNavBar = true;

    this.isFetchingCaterers = true;
    this.getCaterers();
  },

  methods: {
      getCaterers() {

      var vm = this;
      var url = apiMgr.getCaterersUrl() + '&orderBy=seqNum:1'; 

      axios.get(url)
          .then(res => {
              console.log("getCaterersUrl return status: " + res.status);

              vm.$store.state.caterers = res.data;
              vm.isFetchingCaterers = false;
          })
          .catch((err) => {
              vm.hasFailure = true;
              vm.failureMessage = "Server unavailable or not working at this time. Please try later. [error code: 5]";  
              vm.isFetchingCaterers = false;                             
          })

  },
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>