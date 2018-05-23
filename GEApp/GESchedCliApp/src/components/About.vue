<template>
  <div class="About">
    {{ msg }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: "About",
      msg: 'This aplication is for in curae rhoncus donec gravida interdum quisque quam, dui condimentum aenean nullam porttitor urna nibh felis hendrerit, litora hac etiam malesuada eleifend risus porttitor. Lorem ipsum eros fermentum curabitur rhoncus sem nisi aliquet torquent inceptos, torquent tristique commodo at consequat laoreet volutpat leo dapibus litora, pulvinar hendrerit pellentesque eget quis inceptos ad dictumst ultrices.'
    }
  },

  activated() {
      console.log('About.vue activated.');
      this.$store.state.currentViewTitle = this.title;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  display: inline-block;
  margin: 20px 20px;
}

</style>
