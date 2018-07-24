<template>
  <div>

    <h5 class="justify-content-center" style="text-align:center;width:100%">Complete these items before each new request.</h5>
    <br>
    <div class="container-fluid" style="width:100%">
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">
          <!--For each note in noteItems-->
          <div style="padding:10px; width:100%" class="alert alert-danger card" v-for="(note, index) in noteItems" :key="index" :hidden="note.type != 'DoFirst'">
            <!--if the object is an array,-->
          <template v-if="note.type == 'DoFirst'">
            <!--display each item-->
            <span v-html="note.text"></span>
          </template>
          </div>
          <br>
          <button type="button" class="btn btn-primary btn-sm" @click.prevent="$router.push('/request/1')">Begin New Request</button>
        </div>
        <br>
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
      return this.$store.state.appConfig.doFirstViewTitle; 
    },
    viewDescription() {
      return this.$store.state.appConfig.doFirstDescription; 
    },
    noteItems() {
      return this.$store.state.notes;
    },
    inAdminMode() {
      return this.$store.state.inAdminMode;
    }
  },

  activated() {
    console.log('DoFirst.vue activated.');

    if (this.$route.params.isNewRequest != null && this.$route.params.isNewRequest == "true") {
      this.$store.state.currentRequest = null;
      this.$store.state.selectedRoom = null;
    }

    if (this.inAdminMode) {
       this.$router.push('/request/1'); // In Admin mode, no need to show these notes.
    }

    if (this.$store.state.appConfig.doFirstViewTitle == null) {
      this.$router.push('/login'); // Config data lost, force back to login to refetch data.
    }

    this.$store.state.currentViewTitle = this.title;
    this.$store.state.enableNavBar = true;
  }
}

// ToDo: Add a method called process text to look for [links] and convert it to html:
// <a :href="link-goes-here"><span :class="badge badge-info">website</span></a>

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footerBar {
  display: inline-block;
  margin: 16px;
}
.container{
  flex-direction: column;
  display: flex;
}
</style>