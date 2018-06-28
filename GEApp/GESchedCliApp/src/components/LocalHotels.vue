<template>
    

    <div class="container-fluid" style="width:100%;">
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">
            
          <h4>Location:</h4>
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
              <div class="card" style="margin-bottom:7px">
                <div class="card-header" style="background-color:#a9d7eb">
                  <h6 class="card-title">{{hotel.name}}</h6>
                </div>
                <div class="card-body" style="background-color:#d5eff2">
                  <div class="card-text" v-for="(line, index) in hotel.address" :key="index">
                    {{line}}
                  </div>
                  <br>
                  <div class="card-text" :hidden="hotel.phone == null ||hotel.phone == ''"><i class="fas fa-phone"></i> {{hotel.phone}}</div>
                  <div class="card-text" :hidden="hotel.fax == null ||hotel.fax == ''">Fax: {{hotel.fax}}</div>
                  <div class="card-text" :hidden="hotel.corpRates == null ||hotel.corpRates == ''">Discount: {{hotel.corpRates}}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>


    


</template>

<script>
export default {
  data () {
    return {
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  margin-top: 24px;
}
</style>
