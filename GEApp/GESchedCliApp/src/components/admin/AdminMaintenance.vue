<template>  

    <div class="container-fluid">
      <div class="row">
      <div class="col col-12 col-md-2 col-lg-2"></div>

        <div id="adminBar" class="col col-12 col-md-3 col-lg-3 col-xl-2" style="padding-bottom:10px">
        text
        </div>

        <div id="adminUI" class="col col-12 col-md-5 col-lg-5 col-xl-6">
          text2
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
        currentDate: null,
    }
  },

  computed: {
        title() {
        return this.$store.state.appConfig.adminHomeViewTitle; 
        },
        viewDescription() {
        return this.$store.state.appConfig.adminHomeViewDescription; 
        },
    },

    activated() {
        console.log('AdminHome.vue activated.');
        let vm = this;

        let nowDateTime = new Date();
        var dd = nowDateTime.getDate();
        var mm = nowDateTime.getMonth() + 1; //January is 0!
        var yyyy = nowDateTime.getFullYear();
        if (dd < 10) { dd = '0'+ dd; } 
        if (mm < 10) { mm = '0'+ mm; } 
        var today = yyyy + '-' + mm + '-' + dd;

        console.log(today);

        if (this.$store.state.appConfig.adminHomeViewTitle == null) {
        this.$router.push('/login'); // Config data lost, force back to login to refetch data.
        return;
        }

        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = true;

        

    },

    methods: {
        }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pad-bottom {
  padding-bottom:5px
}
</style>