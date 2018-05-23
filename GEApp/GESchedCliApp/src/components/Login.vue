<template>

    <div class="containerDiv container">

    <div class="container">
    <h4 class="display-8 text-center">Meeting &#x26; Event</h4>
    <h4 class="display-8 text-center">Request</h4>

    <div class="row-fluid">
    <div class="span12 pagination-centered"><img src="@/assets/ge-monogram.svg" alt="header" /></div>
    </div>

    </div>
    <br>
    <br>

      <div class="row">
        <div class="col-md-8 order-md-1">

          <form class="needs-validation" novalidate>

            <div class="mb-3">
              <label for="email">Email</label>
              <input type="email" class="form-control form-control-sm" 
                     id="email" 
                     v-model.lazy="loginForm.email"
                     placeholder="you@example.com">
              <div class="invalid-feedback">
                Please enter a valid email address.
              </div>
            </div>

            <div class="mb-3">
              <label for="accessCode">Access Code</label>
              <input type="password" class="form-control form-control-sm" 
                     id="accessCode" 
                     v-model.lazy="loginForm.accessCode">
              <div class="invalid-feedback">
                Please enter a valid access code.
              </div>
            </div>

            <div class="custom-control custom-checkbox">
              <input type="checkbox" class="custom-control-input" id="remember-me" v-model="rememberMeChecked">
              <label class="custom-control-label" for="remember-me">Remember me</label>
            </div>
            <br/>
            <div class="w-25">
                <button type="submit" 
                        class="btn btn-primary btn-sm btn-block"
                        :disabled="isSubmitted"
                        @click.prevent="submit"
                >Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {  
    data () {
        return {
            title: "Login",

            loginForm: {
                email: '',
                accessCode: '',
                rememberMeChecked: ''
            },
            
            isSubmitted: false
        }
    },

    activated() {
        console.log('Login.vue activated.');
        this.$store.state.currentViewTitle = this.title;

        var emailInCookie = this.$cookie.get('requesterEmail');
        if (emailInCookie != null) {
            this.loginForm.email = emailInCookie;
            this.loginForm.rememberMeChecked = 'remember-me';
        }
        var accessCodeInCookie = this.$cookie.get('requesterAccessCode');
        if (accessCodeInCookie != null) {
            this.loginForm.accessCode = accessCodeInCookie;
        }
    },

    created() {
        console.log('Login.vue created.');
    },

    methods: {
        submit() {
            var vm = this;
            vm.isSubmitted = true;

            console.log("About to submit Login for: " + vm.loginForm.email);

            this.$store.state.requesterEmail = vm.loginForm.email;

            this.$cookie.set('requesterEmail', this.$store.state.requesterEmail, 3650);
            this.$cookie.set('requesterAccessCode', vm.loginForm.accessCode, 3650);

            const loginUrl = this.$store.state.loginUrl;
            axios.post(loginUrl, this.loginForm)
            .then(res => {
                console.log("Login status: " + res.status);
                //To-Do: check for status 401 - Unauthorized. Display login failure message
                vm.isSubmitted = false;

                vm.$router.push('dofirst'); //For demo only - Remove it.
            })
            .catch(err => {
                console.log("Login failed: " + err);
                vm.isSubmitted = false;

                vm.$router.push('dofirst'); //For demo only - Remove it.
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pagination-centered {
    text-align: center;
}
.containerDiv {
  display: inline-block;
  margin-top: 16px;
}
</style>