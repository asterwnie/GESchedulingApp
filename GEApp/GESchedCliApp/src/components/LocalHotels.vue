<template>
  <div class="container">
    <p>{{ viewDescription }}</p>

    <br/>

    <div v-for="(hotel, index) in hotels" :key="index" width="100%">
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
</template>

<script>
export default {
  data () {
    return {
      title: this.$store.state.appConfig.hotelsViewTitle,
      viewDescription: this.$store.state.appConfig.hotelsViewDescription,
      hotels: this.$store.state.hotels
    }
  },

  activated() {
      console.log('LocalHotels.vue activated.');
      this.$store.state.currentViewTitle = this.title;
      this.$store.state.enableNavBar = true;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
