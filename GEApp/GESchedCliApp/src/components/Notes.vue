<template>
  <div>
    <ul>
      <!--For each note in noteItems-->
	    <div v-for="(note, index) in noteItems" :key="index" :hidden="note.type != 'attention'">
        <!--if the object is an array,-->
	      <template v-if="note.type == 'attention'">
          <!--display each item-->
	        <li>{{ note.text }}</li>
	      </template>
	    </div>
    </ul>

    <div class="fixed-bottom d-flex justify-content-between">
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
  margin: 16px;
  margin-right: 50px;
}
</style>