<template>
  <div>
    <div class="container-fluid" style="width:100%">
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-sm-10 col-md-8 col-lg-4" style="width:100%;">
          <!--For each note in noteItems-->
          <div style="padding:10px; width:100%" class="alert alert-warning card" v-for="(note, index) in noteItems" :key="index" :hidden="note.type != 'attention'">
            <!--if the object is an array,-->
            <template v-if="note.type == 'attention'">
              <!--display each item-->
              {{ note.text }}
            </template>

          </div>
        </div>
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
      </div>
    </div>
    <div class="fixed-bottom d-flex justify-content-between" style="margin: 10px;">
      <button type="button" class="btn btn-primary btn-sm" @click.prevent="$router.push('submitrequest')">Continue Request ></button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: "Notes",
      
    }
  },
  
  computed: {
        noteItems() {
            return this.$store.state.notes;
        }
  },

  activated() {
      console.log('Notes.vue activated.');
      this.$store.state.currentViewTitle = this.title;
      this.$store.state.enableNavBar = true;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  display: inline-block;
  /*margin: 10px;*/
  
}
.container{
  -webkit-flex-direction: row;
  flex-direction: column;
  display: flex;
}
</style>