<template>
  <div>

    <h5 class="justify-content-center" style="text-align:center;width:100%">Complete these items before each new request.</h5>
    
    <div class="container-fluid justify-content-center">
     
        <!--For each note in noteItems-->
        <div style="padding:10px;" class="alert alert-danger card col-sm-12 col-md-3" v-for="(note, index) in noteItems" :key="index" :hidden="note.type != 'doFirst'">
          <!--if the object is an array,-->
          <template v-if="note.type == 'doFirst'">
            <!--display each item-->
           <!-- <h6 class="alert-heading">Required</h6>-->
            <!--<hr>-->
            {{ note.text }}
          </template>
        </div>
    
    </div>

    <div class="fixed-bottom d-flex justify-content-between">
        <button type="button" class="btn btn-primary btn-sm" @click.prevent="$router.push('newrequest')">Begin New Request</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: "Do First",
      //To-Do: fetch these using the REST API
      //only pull the do first notes
    }
  },

  computed: {
        noteItems() {
            return this.$store.state.notes;
        }
  },
  
  activated() {
      console.log('DoFirst.vue activated.');
      this.$store.state.currentViewTitle = this.title;
      this.$store.state.enableNavBar = true;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  display: inline-block;
  margin: 10px;
  margin-right: 50px;
}

.container-fluid{
  flex-direction: column;
}
</style>