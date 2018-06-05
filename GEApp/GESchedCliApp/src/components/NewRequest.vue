<template>
    <div class="container">
      <div class="row">
        <div class="col-md-8 order-md-1">

          <form class="needs-validation" novalidate>

            <div class="row">
              <div class="dropdown">
                &nbsp;&nbsp;&nbsp;<button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Room Quick Pick
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="#">Forum</a>
                <a class="dropdown-item" href="#">Room 1</a>
                <a class="dropdown-item" href="#">Room 2</a>
                </div>
              </div>
               &nbsp;
              <button type="button" class="btn btn-secondary btn-sm" @click.prevent="$router.push('findroom')">Find</button>
             <div class="col-md-6 mb-3">
                
              </div>
              <div class="col-md-6 mb-3">
                <label for="firstName">Room Scheduled</label>
               <textarea class="form-control" aria-label="With textarea"></textarea>
              </div>
              <div class="col-md-6 mb-3">
                <label for="lastName">Meeting/Event Title</label>
                <input type="text" class="form-control form-control-sm" id="ContactName" placeholder="" value="" required>
                <div class="invalid-feedback">
                  The meeting/event tilte is required.
                </div>
              </div>
              <div class="col-md-6 mb-3">
                <label for="lastName">Contact</label>
                <input v-model="contact" type="text" class="form-control form-control-sm" id="ContactName" placeholder="" value="" required>
                <div class="invalid-feedback">
                  Contact name is required.
                </div>
              </div>
            </div>


            <div class="mb-3">
              <label for="email">Email</label>
              <input v-model="email" type="email" class="form-control form-control-sm" id="email" placeholder="you@example.com">
              <div class="invalid-feedback">
                Please enter a valid email address for shipping updates.
              </div>
            </div>

            <br>
            <div class="alert alert-light" role="alert">
              More UI will be added...
            </div>
            <br>

          </form>
        </div>
      </div>
      <div class="footerBar fixed-bottom d-flex justify-content-between">
        <button type="button" class="btn btn-primary btn-sm" @click.prevent="$router.push('notes')">Continue Request ></button>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      title: "New Request",
      contact: "",
      email: ""  
    }
  },

  activated() {
    console.log('NewRequest.vue activated.');
    this.$store.state.currentViewTitle = this.title;
    this.$store.state.enableNavBar = true;
    this.email = this.$store.state.loginContext.requesterEmail;
    this.contact = this.$store.state.loginContext.requesterName;
  },

  created() {
      console.log('NewRequest.vue created.');

  },

  methods: {
    onSubmit (evt) {
      evt.preventDefault();
      alert(JSON.stringify(this.form));
    },
    onReset (evt) {
      evt.preventDefault();
      /* Reset our form values */
      this.form.email = '';
      /* Trick to reset/clear native browser form validation state */
      this.show = false;
      this.$nextTick(() => { this.show = true });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footerBar {
  display: inline-block;
  margin: 16px;
}
</style>