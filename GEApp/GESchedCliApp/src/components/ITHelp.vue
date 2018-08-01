<template>
  <div>
    <div v-html="viewDescription"></div>
    <br>
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
      return this.$store.state.appConfig.techSupportViewTitle; 
    },
    viewDescription() {
      return this.$store.state.appConfig.techSupportViewDescription; 
    },
  },

  activated() {
    console.log('ITHelp.vue activated.');

    if (this.$store.state.appConfig.techSupportViewTitle == null) {
      this.$router.push('/login'); // Config data lost, force back to login to refetch data.
      return;
    }

    this.$store.state.currentViewTitle = this.title;
    this.$store.state.enableNavBar = true;
  },

  created() {
    console.log('ITHelp.vue created.');
  }
}
</script>


<!-- Style scoped to the html template define in this file only -->
<style scoped>
div {
  display: inline-block;
  margin: 16px;

}
</style>