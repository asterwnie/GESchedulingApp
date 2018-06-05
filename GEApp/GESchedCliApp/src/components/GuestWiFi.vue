<template>
  <div class="GuestWiFi">
     {{ msg }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: this.$store.state.appConfig.guestWifiTitle,
      msg: this.$store.state.appConfig.guestWifiDetail //wrong thing; pull it from notes.json
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
  margin: 20px 20px;
}

</style>
