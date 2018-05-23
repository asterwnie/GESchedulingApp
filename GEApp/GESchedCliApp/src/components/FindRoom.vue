<template>
<div>
  <p>to do...</p>
</div>
</template>

<script>
export default {
  data () {
    return {
      title: "Find Room"    
    }
  },

  activated() {
      console.log('FindRoom.vue activated.');
      this.$store.state.currentViewTitle = this.title;
  },

  created() {
    console.log('FindRoom.vue created.');
  }
}
</script>

<!-- Style scoped to the html template define in this file only -->
<style scoped>
div {
  display: inline-block;
  margin: 20px 20px;
}
</style>