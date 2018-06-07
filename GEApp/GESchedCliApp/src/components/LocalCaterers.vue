<template>
  <div class="container">
    <p>{{ viewDescription }}</p>
    <br/>
    <div v-for="(caterer, index) in caterers" :key="index">
        <p>{{ caterer }}</p> <!--style this so it has less spacing later-->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: this.$store.state.appConfig.caterersViewTitle,
      viewDescription: this.$store.state.appConfig.caterersViewDescription,
      caterers: this.$store.state.caterers
    }
  },

  activated() {
      console.log('LocalCaterers.vue activated.');
      this.$store.state.currentViewTitle = this.title;
      this.$store.state.enableNavBar = true;
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  display: inline-block;
  margin: 20px 20px;
}
</style>
