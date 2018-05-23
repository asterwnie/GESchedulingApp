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
      title: "Submit Request"    
    }
  },

  activated() {
    console.log('SubmitRequest.vue activated.');
    this.$store.state.currentViewTitle = this.title;
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