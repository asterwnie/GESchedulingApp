<!--Admin "header" (appears on every admin page.)
***NOTE: This will be moved to App.vue once it is fleshed out.
This is NOT the final location of the admin "header" items.

-->
<template>
<div>
    <div style="width:100%; height:3px" class="fixed-top bg-danger z-index:100"></div>
</div>
</template>

<script>
//These need to be moved to their respective pages.
export default {
    computed: {
        title() {
        return "Admin"; 
        },
        viewDescription() {
        return "Admin View"; 
        },
    },

    activated() {
        console.log('AdminView.vue activated.');

        if (this.$store.state.appConfig.adminHomeViewTitle == null) {
        this.$router.push('/login'); // Config data lost, force back to login to refetch data.
        return;
        }

        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = true;
    },

    created() {
        console.log('AdminView.vue created.');
    },

}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.col {
    margin-bottom:20px;
}
.pad-bottom {
    margin-bottom:20px;
}
</style>