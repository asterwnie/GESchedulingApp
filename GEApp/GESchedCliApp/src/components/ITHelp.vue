<template>
  <div class="container-fluid" style="width:100%">
    <div> 
        <div style="padding:20px; width:100%" class="alert alert-info card">
          <div v-html="viewDescription"></div>
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
</style>