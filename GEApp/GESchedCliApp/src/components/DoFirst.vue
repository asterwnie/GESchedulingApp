<template>
  <div>

    <h5 class="justify-content-center" style="text-align:center;width:100%">Complete these items before each new request.</h5>
    <br>
    <div class="container-fluid" style="width:100%">
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">
          <!--For each note in noteItems-->
          <div style="padding:10px; width:100%" class="alert alert-danger card" v-for="(note, index) in noteItems" :key="index" :hidden="note.type != 'doFirst'">
            <!--if the object is an array,-->
          <template v-if="note.type == 'doFirst'">
            <!--display each item-->
           <!-- <h6 class="alert-heading">Required</h6>-->
            <!--<hr>-->
            <span class="text-center" v-html="note.text"></span>
          </template>
          </div>
        </div>

      </div>
    </div>

    <div class="fixed-bottom d-flex justify-content-between" style="margin: 10px;">
        <button type="button" class="btn btn-primary btn-sm" @click.prevent="$router.push('newrequest')">Begin New Request</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: this.$store.state.appConfig.doFirstViewTitle
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

// ToDo: Add a method called process text to look for [links] and convert it to html:
// <a :href="link-goes-here"><span :class="badge badge-info">website</span></a>

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container-fluid{
  flex-direction: column;
  display: flex;
}
</style>