<template>
  <div v-html="viewDescription">
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
      return this.$store.state.appConfig.aboutViewTitle; 
    },
    viewDescription() {
      return this.$store.state.appConfig.aboutViewDescription; 
    }
  },

  activated() {
    console.log('About.vue activated.');

    if (this.$store.state.appConfig.aboutViewTitle == null) {
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
div {
  display: inline-block;
  margin: 20px 20px;
}

</style>
