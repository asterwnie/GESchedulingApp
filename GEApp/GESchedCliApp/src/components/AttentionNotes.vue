<template>
  <div>
    <ul>
        <li v-for="(attention) in attentionItems" :key="attention">{{ attention }}<br/>&nbsp;</li>
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
      title: "Attention",
      //To-Do: fetch these using the REST API
      attentionItems: [
          'Please submit all Event Requests at least 48 hours prior to event.',
          'If the request is within 24 hours of the event date & time follow up in person with David Spatara or someone from the facilities team.',
          'Non-GE visitors must sign in and out at reception. List of attendees is required to be provided to reception prior to arrival and emailed to: ResultsWayCommunityReception@ge.com',
          'All GE employees, visitors & contractors entering a lab are required to be escorted by lab authorized personnel and wear lab appropriate clothing and personal protective equipment. Contact the lab manager or EHS for assistance in advance of events involving entry into labs.',
          'It is your responsibility as the event contact to ensure all furniture, trash, food, etc. is cleaned up and put back after the event (Some furnishings will require Facilities assistance to move).'
      ]
    }
  },
  
  activated() {
      console.log('AttentionNotes.vue activated.');
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