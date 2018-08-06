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
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">
          <div class="alert alert-info">{{ viewDescription }}</div>
          <h6>Location:</h6>
          <div class="font-weight-light">
            <div class="text-left" v-html="$store.state.appConfig.siteName"></div>
            <div class="text-left" v-html="$store.state.appConfig.siteAddress"></div>
          </div>
          <hr>
          <br/>
          <div v-if="hotelItems.length < 1 || hotelItems == null">
            <div class="card font-italic">
              <div class="card-body">
                No local hotels provided.
              </div>
            </div>
          </div>
          <div v-else>
            <div v-for="(hotel, index) in hotelItems" :key="index" width="100%">
              <div class="card" style="margin-bottom:6px">
                <div class="card-header" style="background-color:#a9d7eb">
                  <h6 class="card-title" style="margin-top:10px">{{hotel.name}}</h6>
                </div>
                <div class="card-body" style="background-color:#d5eff2">
                  <div class="card-text" v-for="(line, index) in hotel.address" :key="index">
                    {{line}}
                  </div>
                  <br>
                  <div class="card-text" :hidden="hotel.phone == null ||hotel.phone == ''"><i class="fas fa-phone"></i> <span v-html="hotel.phone"></span></div>
                  <div class="card-text" :hidden="hotel.fax == null ||hotel.fax == ''">Fax: {{hotel.fax}}</div>
                  <div class="card-text" :hidden="hotel.website == null || hotel.website == ''"><i class="far fa-window-restore"></i> Website: <span v-html="hotel.website"></span></div>
                  <div class="card-text" :hidden="hotel.discount == null ||hotel.discount == ''">Discount: {{hotel.discount}}</div> <!-- .corpRates or .Discount -->
                  <br>
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
import * as textTransformer from '@/common/textTransformer.js';

export default {
  data () {
    return {
      isFetchingHotels: true, 
      hasFailure: false,
      failureMessage: ""
    }
  },

  computed: {
    title() {
      return this.$store.state.appConfig.hotelsViewTitle; 
    },
    viewDescription() {
      return this.$store.state.appConfig.hotelsViewDescription; 
    },
    hotelItems() {
      return this.$store.state.hotels;
    },
    isLoading() {
      return (
          this.isFetchingHotels
          ); 
    }
  },

  activated() {
    console.log('LocalHotels.vue activated.');

    if (this.$store.state.appConfig.hotelsViewTitle == null) {
      this.$router.push('/login'); // Config data lost, force back to login to refetch data.
      return;
    }

    this.$store.state.currentViewTitle = this.title;
    this.$store.state.enableNavBar = true;

    this.isFetchingHotels = true;
    this.getHotels();
  },

  methods: {
    getHotels() {

        var vm = this;
        var url = apiMgr.getHotelsUrl() + '&orderBy=seqNum:1'; 

        axios.get(url)
            .then(res => {
                console.log("getHotelsUrl return status: " + res.status);

                vm.$store.state.hotels = textTransformer.transformHotels(res.data);
                vm.isFetchingHotels = false;                  
            })
            .catch((err) => {
                vm.hasFailure = true;
                vm.failureMessage = "Server unavailable or not working at this time. Please try later.  [error code: 4]";   
                vm.isFetchingHotels = false;                            
            })

    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  margin-top: 24px;
}
</style>
