<template>
  <div>
    <div>{{ message }}</div>
    <br>
    <div>
    <a id="emailIT" href="mailto:example@website.com?subject=This%20is%20a%20subject&body=message%20goes%20here.%0D%0ASecond line.">Send email to IT Help</a>
    </div>
  </div>
</template>


<script>
export default {
  data () {
    return {
      title: "IT Help",
      message: "Results Way offers the MyTech Lounge located on the third-floor at tower 3. While onsite, MyTech Lounge is your solution to any IT help & questions you may have."
    }
  },

  activated() {
      console.log('ITHelp.vue activated.');
      this.$store.state.currentViewTitle = this.title;
      this.$store.state.enableNavBar = true;
  },

  created() {
    console.log('ITHelp.vue created.');
  }
}
</script>


<!-- Style scoped to the html template define in this file only -->
<style scoped>
div {
  display: inline-block;
  margin: 16px;

}
</style>