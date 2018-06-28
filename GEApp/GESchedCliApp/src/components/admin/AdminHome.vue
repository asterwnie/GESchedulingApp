<template>  
<div>
    <admin-view></admin-view>
    <div class="container-fluid">
      <div class="row">
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
          <div class="col col-12 col-auto" style="color:gray">
          <h4 class="text-center" v-html="$store.state.appConfig.siteName"></h4>
          <h6 class="text-center" v-html="$store.state.appConfig.siteAddress"></h6>
          <br>
          </div>
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
      </div>
      <div class="row">
      <div class="col col-12 col-md-2 col-lg-2"></div>

      <div id="adminBar" class="col col-12 col-md-3 col-lg-3 col-xl-2" style="padding-bottom:10px">
        <div class="card">
          <div class="card-header bg-danger text-light">
              Admin Menu
          </div>
          <div class="card-body">
              <div class="card bg-info text-white" @click.prevent="$router.push('/admin/requests')">All Requests</div>
              menu items...
          </div>
        </div>
      </div>

      <div id="adminUI" class="col col-12 col-md-5 col-lg-5 col-xl-6">
          <div id="newRequests">
              <div class="card pad-bottom">
                  <div class="card-header bg-secondary text-light">
                  New Requests
                  </div>
              </div>
              <div class="container" style="display:flex; flex-wrap:wrap;">
                  <div class="request-item card col-12 col-lg-6 col-xl-4" v-for="(request, index) in requests" :key="index">
                    <div class="card-body">
                        <h5 class="card-title">{{request.eventTitle}}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">{{request.eventGEContactPersonName}}</h6>
                        <p class="card-text">{{request.locationOfEvent}}</p>
                        <a href="#" class="card-link">{{eventDateTimeData}}</a>
                    </div>
                  </div>
              </div>
          </div>
          <div id="upcomingRequests" class="pad-bottom">
              <div class="card pad-bottom">
                  <div class="card-header bg-secondary text-light">
                  Upcoming Requests
                  </div>
              </div>
              <div class="container" style="display:flex; flex-wrap:wrap;">
                  <div class="request-item card col-12 col-lg-6 col-xl-4" v-for="(request, index) in requests" :key="index">
                      <div class="card-body">
                          <h5 class="card-title">{{request.eventTitle}}</h5>
                          <h6 class="card-subtitle mb-2 text-muted">{{request.eventGEContactPersonName}}</h6>
                          <p class="card-text">{{request.locationOfEvent}}</p>
                          <a href="#" class="card-link">{{eventDateTimeData}}</a>
                      </div>
                  </div>
              </div>
          </div>
      </div>


      <div class="col col-12 col-md-2 col-lg-2"></div>
    </div>
  </div>
</div>
</template>

<script>
import adminView from '@/components/admin/AdminCommon.vue'

export default {
    data () {
    return {
    }
  },

  components: {
    adminView: adminView
  },

  computed: {
        title() {
        return this.$store.state.appConfig.adminHomeViewTitle; 
        },
        viewDescription() {
        return this.$store.state.appConfig.adminHomeViewDescription; 
        },
        requests() {
          return this.$store.state.requests;
        }
    },

    activated() {
        console.log('AdminHome.vue activated.');

        if (this.$store.state.appConfig.adminHomeViewTitle == null) {
        this.$router.push('/login'); // Config data lost, force back to login to refetch data.
        return;
        }

        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = true;
    },

    created() {
        console.log('AdminHome.vue created.');
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pad-bottom{
  padding-bottom:5px
}
</style>