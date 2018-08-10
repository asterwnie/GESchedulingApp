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
          <br>
          <button type="button" class="btn btn-primary btn-sm" 
              @click.prevent="$router.push('/requestsummary')">Continue&nbsp;<i class="fas fa-arrow-right"></i></button>
          <button type="button" class="btn btn-primary btn-sm float-right" 
              @click.prevent="onPrint"><span class="fas fa-print"></span>&nbsp;Print</button>
        </div>
        <br>
        &nbsp;
        <br>
      </div>
    </div>
  </div>
</template>

<script>
import * as util from '@/common/util.js';

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
    },

    isNewRequest() {
      var isNew = true;
      var storeState = this.$store.state;
      if (storeState.currentRequest != null && 
          storeState.currentRequest.processingStatus != undefined && 
          storeState.currentRequest.processingStatus != null && 
          storeState.currentRequest.processingStatus != "newUnsubmitted") {
        isNew = false;
      }
      return isNew;
    },

    inAdminMode() {
      return this.$store.state.inAdminMode;
    }
  },

  activated() {
    console.log('AttentionNotes.vue activated.');

    if (this.inAdminMode && !this.isNewRequest) {
      // In Admin mode review, no need to show these notes.
      this.$router.push('/requestsummary');      
    }

    if (this.$store.state.appConfig.attentionNotesViewTitle == null) {
      this.$router.push('/login'); // Config data lost, force back to login to refetch data.
      return;
    }

    this.$store.state.currentViewTitle = this.title;
    this.$store.state.enableNavBar = true;
  },

  methods: {
    onPrint(evt) {
      util.launchPrint();
    }
  }

}
</script>