<template>

<div class="container-fluid" style="width:100%;">
    <div class="row">
      <div class="col col-sm-1 col-md-2 col-lg-4"></div>
      <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">
          <div class="alert alert-info">{{ viewDescription }}</div>
          <h4>Location:</h4>
          <div class="font-weight-light">
            <div class="text-left" v-html="$store.state.appConfig.siteName"></div>
            <div class="text-left" v-html="$store.state.appConfig.siteAddress"></div>
          </div>
          <hr>
          <br/>
          <div v-if="catererItems == null">
            <div class="card font-italic">
              <div class="card-body">
                No local caterers provided.
              </div>
            </div>
          </div>
          <div v-else>
            <div class="LocalCaterers text-white">
              <div class="card bg-success" style="margin-bottom:7px" v-for="(caterer, index) in catererItems" :key="index">
                  <div class="card-header">{{ caterer.name }}</div>
                  <div class="card-body">
                    <div class="card-text" v-for="(line, index) in caterer.address" :key="index">
                      {{line}}
                    </div>
                    <br>
                    <div></div>
                    <div></div>
                  </div>
              </div>
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
  },

  created(){
    console.log(this.catererItems);
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>