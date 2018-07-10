<template>  
<div>
    <admin-view></admin-view>
    <div>All requests go here...</div>
</div> 
</template>

<script>
import adminView from '@/components/admin/AdminCommon.vue'

export default {
    data () {
    return {
    }
  },

  components: {
    adminView: adminView
  },
  
  computed: {
        title() {
        return this.$store.state.appConfig.adminHomeViewTitle; 
        },
        viewDescription() {
        return this.$store.state.appConfig.adminHomeViewDescription; 
        },
        requests() {
          return this.$store.state.requests;
        }
    },

    activated() {
        console.log('AdminHome.vue activated.');

        if (this.$store.state.appConfig.adminHomeViewTitle == null) {
        this.$router.push('/login'); // Config data lost, force back to login to refetch data.
        return;
        }

        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = true;
    },

    created() {
        console.log('AdminHome.vue created.');
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pad-bottom{
  padding-bottom:5px
}
</style>