<template>
<div>

  <!--Create a drop list with a for-each taking all of the roomCapabilties-->

  <p>to do...</p>
  test images:
  <br>
  <div class="span12 pagination-centered"><img src="@/assets/Classroom-Setup-40-Max.jpg" alt="header" /></div>
  <br>
  <div class="span12 pagination-centered"><img src="@/assets/U-Setup-40-Max.jpg" alt="header" /></div>
  
  <!--not working right now-->
  <div v-for="(room, index) in rooms" :key="index" width="100%">
    <div class="card">
      <div class="card-body">
        <h6 class="card-title">{{room.name}}</h6>
        <p class="card-text" :hidden="room.sizeType == null ||room.sizeType == ''">phone: {{room.sizeType}}</p>
      </div>
    </div>
  </div>

</div>
</template>

<script>
export default {
  data () {
    return {
      title: this.$store.state.appConfig.roomsViewTitle,
      viewDescription: this.$store.state.appConfig.roomsViewDescription,
      rooms: this.$store.state.rooms
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