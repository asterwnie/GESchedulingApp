<!--Admin "header" (appears on every admin page.)-->
<template>
<div>
  <div style="width:100%; height:3px" class="fixed-top bg-danger z-index:-100"></div>
  <div class="container-fluid">
    <div class="row">
        <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
        <div class="col col-12 col-auto" style="color:gray">
        <h4 class="text-center" v-html="$store.state.appConfig.siteName"></h4>
        <h6 class="text-center" v-html="$store.state.appConfig.siteAddress"></h6>
        <br>
        </div>
        <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
    </div>
    <div class="row">
    <div class="col col-12 col-md-2 col-lg-2"></div>

    <div id="adminBar" class="col col-12 col-md-3 col-lg-3 col-xl-2">
      <div class="card">
        <div class="card-header bg-danger text-light">
            Admin Menu
        </div>
        <div class="card-body">
            menu items...
        </div>
      </div>
    </div>

    <div id="adminUI" class="col col-12 col-md-5 col-lg-5 col-xl-6">
        <div id="newRequests" class="pad-bottom">
            <div class="card pad-bottom">
                <div class="card-header bg-secondary text-light">
                New Requests
                </div>
            </div>
            <div class="container" style="display:flex; flex-wrap:wrap;">
                    <div class="request-item card col-12 col-lg-6 col-xl-4">
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="#" class="card-link">Card link</a>
                            <a href="#" class="card-link">Another link</a>
                        </div>
                    </div>
                    <div class="request-item card col-12 col-lg-6 col-xl-4">
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="#" class="card-link">Card link</a>
                            <a href="#" class="card-link">Another link</a>
                        </div>
                    </div>
                    <div class="request-item card col-12 col-lg-6 col-xl-4">
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="#" class="card-link">Card link</a>
                            <a href="#" class="card-link">Another link</a>
                        </div>
                    </div>
                    <div class="request-item card col-12 col-lg-6 col-xl-4">
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="#" class="card-link">Card link</a>
                            <a href="#" class="card-link">Another link</a>
                        </div>
                    </div>

                </div>
        </div>
        <div id="upcomingRequests" class="pad-bottom">
            <div class="card pad-bottom">
                <div class="card-header bg-secondary text-light">
                Upcoming Requests
                </div>
            </div>
            <div class="container">
                    <div class="request-item card col-12 col-lg-6 col-xl-4">
                        <div class="card-body">
                            <h5 class="card-title">Card title</h5>
                            <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
                            <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                            <a href="#" class="card-link">Card link</a>
                            <a href="#" class="card-link">Another link</a>
                        </div>
                    </div>

                </div>
        </div>
    </div>


    <div class="col col-12 col-md-2 col-lg-2"></div>
  </div>
</div>
</div>
</template>

<script>
export default {
    computed: {
        title() {
        return this.$store.state.appConfig.adminHomeViewTitle; 
        },
        viewDescription() {
        return this.$store.state.appConfig.adminHomeViewDescription; 
        },
        noteItems() {
                return this.$store.state.notes;
        }
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