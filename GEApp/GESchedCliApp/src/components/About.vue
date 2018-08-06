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
</style>
