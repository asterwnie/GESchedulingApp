<template>
    

    <div class="container-fluid" style="width:100%;">
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">
          
            <p>{{ viewDescription }}</p>

          <br/>
          <div v-for="(hotel, index) in hotelItems" :key="index" width="100%">
            <div class="card">
              <div class="card-body">
                <h6 class="card-title">{{hotel.name}}</h6>
                <p class="card-text" v-for="(line, index) in hotel.address" :key="index">
                  {{line}}
                </p>
                <p class="card-text" :hidden="hotel.phone == null ||hotel.phone == ''">phone: {{hotel.phone}}</p>
                <p class="card-text" :hidden="hotel.fax == null ||hotel.fax == ''">Fax: {{hotel.fax}}</p>
                <p class="card-text" :hidden="hotel.corpRates == null ||hotel.corpRates == ''">Discount: {{hotel.corpRates}}</p>
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
