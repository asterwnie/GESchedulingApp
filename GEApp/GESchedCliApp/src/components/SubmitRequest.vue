<template>
    <div class="container">
      <div class="row">
        <div class="col-md-8 order-md-1">

 
            <br>
            <div class="alert alert-light" role="alert">
            Request Summary Goes Here...
            </div>
            <br>

        </div>
      </div>
      <div class="fixed-bottom d-flex justify-content-between">
        <button type="button" class="btn btn-primary btn-sm" @click.prevent="$router.push('home')">Submit Request</button>
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
      return this.$store.state.appConfig.submitRequestViewTitle; 
    },
  /*  viewDescription() {
      return this.$store.state.appConfig.hotelsViewDescription; 
    },*/
  },

  activated() {
    console.log('SubmitRequest.vue activated.');

    if (this.$store.state.appConfig.submitRequestViewTitle == null) {
      this.$router.push('login'); // Config data lost, force back to login to refetch data.
    }

    this.$store.state.currentViewTitle = this.title;
    this.$store.state.enableNavBar = true;
  },

  created() {
      console.log('SubmitRequest.vue created.');
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  display: inline-block;
  margin: 16px;
  margin-right: 50px;
}
</style>