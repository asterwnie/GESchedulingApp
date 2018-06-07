<template>
  <div>
    {{ viewDescription }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: this.$store.state.appConfig.aboutViewTitle,
      viewDescription: this.$store.state.appConfig.aboutViewDescription
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
