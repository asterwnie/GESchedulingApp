<template>
  <div class="About">
    {{ msg }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: this.$store.state.appConfig.appAboutTitle,
      msg: this.$store.state.appConfig.appAboutDetail
    }
  },

  activated() {
      console.log('About.vue activated.');
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
