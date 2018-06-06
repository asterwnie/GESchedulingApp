<template>
<div>
  <p>to do...</p>
  test images:
  <br>
  <div class="span12 pagination-centered"><img src="@/assets/Classroom-Setup-40-Max.jpg" alt="header" /></div>
  <br>
  <div class="span12 pagination-centered"><img src="@/assets/U-Setup-40-Max.jpg" alt="header" /></div>
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
      this.$store.state.enableNavBar = true;
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