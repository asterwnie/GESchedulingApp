<template>

    <div class="container-fluid" style="width:100%;">
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">
          
          <div class="GuestWiFi">
            {{ viewDescription }}
          </div>


        </div>
      </div>
    </div>



</template>

<script>
export default {
  data () {
    return {
      title: this.$store.state.appConfig.guestWifiViewTitle,
      viewDescription: this.$store.state.appConfig.guestWifiViewDescription
    }
  },

  activated() {
      console.log('GuestWiFi.vue activated.');
      this.$store.state.currentViewTitle = this.title;
      this.$store.state.enableNavBar = true;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  display: inline-block;
}
.container-fluid{
  flex-direction: column;
  display: flex;
}

</style>
