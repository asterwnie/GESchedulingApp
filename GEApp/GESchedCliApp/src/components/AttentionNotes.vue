<template>
  <div>
    <div class="container-fluid" style="width:100%">
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">
          <!--For each note in noteItems-->
          <div style="padding:10px; width:100%" class="alert alert-warning card" v-for="(note, index) in noteItems" :key="index" :hidden="note.type != 'Attention'">
            <!--if the object is an array,-->
            <template v-if="note.type == 'Attention'">
              <!--display each item-->
              {{ note.text }}
            </template>

          </div>
        </div>

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
    }
  },
  
  computed: {
    title() {
      return this.$store.state.appConfig.attentionNotesViewTitle; 
    },
    viewDescription() {
      return this.$store.state.appConfig.attentionNotesDescription; 
    },
    noteItems() {
            return this.$store.state.notes;
    }
  },

  activated() {
    console.log('AttentionNotes.vue activated.');

    if (this.$store.state.appConfig.attentionNotesViewTitle == null) {
      this.$router.push('/login'); // Config data lost, force back to login to refetch data.
      return;
    }

    this.$store.state.currentViewTitle = this.title;
    this.$store.state.enableNavBar = true;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container-fluid{
  flex-direction: column;
  display: flex;
}
</style>