<template>
  <div>
    <ul>
        <li v-for="(attention) in attentionItems" :key="attention">{{ attention }}<br/>&nbsp;</li>
    </ul>

    <div class="fixed-bottom d-flex justify-content-between">
        <button type="button" class="btn btn-primary btn-sm" @click.prevent="$router.push('newrequest')">Begin New Request</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: "Do First",
      //To-Do: fetch these using the REST API
      attentionItems: [
        'You need to reserve your event space or room first before submitting a request using this application.',
        'To reserve the Forum for an event:  check the Results Way site calendar in the GAL at ~Health MBO Results Way to see if it is available. For all other conference and training rooms check the GAL for the specific location and reserve the conference room for the date & time of your event.',
        'If you have any questions please reach out to David.Spatara@ge.com.'
      ]
    }
  },
  
  activated() {
      console.log('DoFirst.vue activated.');
      this.$store.state.currentViewTitle = this.title;
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