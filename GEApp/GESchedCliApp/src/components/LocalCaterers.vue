<template>

<div class="container-fluid" style="width:100%;">
    <div class="row">
      <div class="col col-sm-1 col-md-2 col-lg-4"></div>
      <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">
          <p>{{ viewDescription }}</p>
          <br/>
          <div class="LocalCaterers">
            <div v-for="(caterer, index) in catererItems" :key="index">
                <p>{{ caterer }}</p> <!--style this so it has less spacing later-->
            </div>
          </div>

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
      return this.$store.state.appConfig.caterersViewTitle; 
    },
    viewDescription() {
      return this.$store.state.appConfig.caterersViewDescription; 
    },
    catererItems() {
      return this.$store.state.caterers;
    }
  },

  activated() {
    console.log('LocalCaterers.vue activated.');

    if (this.$store.state.appConfig.caterersViewTitle == null) {
      this.$router.push('login'); // Config data lost, force back to login to refetch data.
    }

    this.$store.state.currentViewTitle = this.title;
   this.$store.state.enableNavBar = true;
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>