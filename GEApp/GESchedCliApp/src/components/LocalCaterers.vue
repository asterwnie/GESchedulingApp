<template>
  <div class="LocalCaterers">
    <div v-for="(msg, index) in msgList" :key="index">
        <p>{{ msg }}</p> <!--style this so it has less spacing later-->
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: this.$store.state.appConfig.localCaterersTitle,
      msgList: this.$store.state.appConfig.localCaterersDetail //this message is an array right now
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
