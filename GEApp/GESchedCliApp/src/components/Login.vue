<template>

    <div class="containerDiv container-fluid" style="width:100%">
        <div class="row">
            <div class="col col-sm-1 col-md-2 col-lg-4"></div>
            <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%">
                <div>
                    <h4 class="display-8 text-center" v-html="$store.state.appConfig.appTitle"></h4>
                    <br>

                    <div>
                        <div class="pagination-centered"><img src="@/assets/ge-monogram.svg" alt="header" /></div>
                        <div id="loading" class="pagination-centered" :hidden="!isLoading||hasFailure">
                            <br>
                            <br>
                            <i class="fas fa-circle-notch fa-spin fa-lg"></i>
                        </div>
                    </div>
                </div>

                <br>
                <br>
                <div id="loginUI" :hidden="isLoading" style="width:100%">


                        <form class="needs-validation" novalidate>

                        <div class="mb-3">
                            <label for="requesterEmail">Email</label>
                            <input type="email" class="form-control form-control-sm" 
                                    id="requesterEmail" 
                                    v-model.lazy="requesterEmail"                    
                                    placeholder="you@example.com">
                            <p v-if="!$v.requesterEmail.email && canShowError" class="text-danger">Please enter a valid email address.</p>
                            <p v-if="!$v.requesterEmail.required  && canShowError" class="text-danger">A email address is required.</p>
                        </div>

                        <div class="mb-3">
                            <label for="accessCode">Access Code</label>
                            <input type="password" class="form-control form-control-sm" 
                                    id="accessCode" 
                                    v-model.lazy="accessCode">                 
                            <p v-if="!$v.accessCode.required && canShowError" class="text-danger">The access code is required.</p>
                        </div>

                        <div class="custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="remember-me" value="remember-me" v-model="rememberMeChecked">
                            <label class="custom-control-label" for="remember-me">Remember me</label>
                        </div>
                        <br/>
                        <div class="w-25">
                            <button type="submit" 
                                    class="btn btn-primary btn-sm btn-block"
                                    :disabled="isSubmitting"
                                    @click.prevent="submit"
                            >Submit</button>
                        </div>
                        <br/>
                        
                        </form>
                    </div>
            
                    <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>

                    <br>
                    <div style="color:gray">
                        <h4 class="text-center" v-html="$store.state.appConfig.siteName"></h4>
                        <h6 class="text-center" v-html="$store.state.appConfig.siteAddress"></h6>
                        <br>
                    </div>

            </div>
            <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import * as loginContextMgr from '@/common/loginContextMgr.js';
import * as apiMgr from '@/common/apiMgr.js';
import { required, email }  from 'vuelidate/lib/validators';

export default {  
    data () {
        return {
            title: "Login",

            requesterEmail: '',
            accessCode: '',
            rememberMeChecked: 'remember-me',

            canShowError: false,
            
            isSubmitting: false,
            isFetchingDefAppConfig: true,
            isFetchingNotes: true,
            isFetchingHotels: true,
            hasFailure: false,
            failureMessage: ""
        }
    },

    validations: {
        requesterEmail: { required, email },
        accessCode: { required }
    },

    activated() {
        console.log('Login.vue activated.');
        var vm = this; 
    
        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = false;

        const loginContext = this.$store.state.loginContext;    
        loginContextMgr.getCachedLoginContext(loginContext);

        if (loginContext.requesterEmail != null && loginContext.requesterEmail != '') {
            this.requesterEmail = loginContext.requesterEmail; 
        }
    
        if (loginContext.accessCode != null && loginContext.accessCode != '') {
            this.accessCode = loginContext.accessCode;
            loginContext.accessCode = null; // Avoid holding it in memory.
        }
        

        this.getDefAppConfig(); 
        this.getNotes();
        this.getHotels();
    },

    computed: {
        isLoading() {
            return (this.isFetchingDefAppConfig || this.isFetchingNotes || this.isFetchingHotels); 
        }
    },

    methods: {

        getDefAppConfig() {

            var vm = this;
            var url = apiMgr.getAppConfigUrl(); 

            axios.get(url)
                .then(res => {
                    console.log("getDefAppConfig return status: " + res.status);

                    vm.$store.state.appConfig = res.data;
                    vm.isFetchingDefAppConfig = false;
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })

                
        },

        getNotes() {

            var vm = this;
            var url = apiMgr.getNotesUrl(); 

            axios.get(url)
                .then(res => {
                    console.log("getNotesUrl return status: " + res.status);

                    vm.$store.state.notes = res.data;
                    vm.isFetchingNotes = false;
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })

        },

        getHotels() {

            var vm = this;
            var url = apiMgr.getHotelsUrl(); 

            axios.get(url)
                .then(res => {
                    console.log("getHotelsUrl return status: " + res.status);

                    vm.$store.state.hotels = res.data;
                    vm.isFetchingHotels = false;
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })

        },

        submit() {
            var vm = this;
            vm.isSubmitting = true;
            vm.hasFailure = false;

            vm.canShowError = true;

            this.$v.requesterEmail.$touch();
            this.$v.accessCode.$touch();

            var requesterEmailIsInvalid = this.$v.requesterEmail.$error;
            var accessCodeIsInvalid = this.$v.accessCode.$error;

            if (requesterEmailIsInvalid || accessCodeIsInvalid) {
                vm.isSubmitting = false;
                return;
            }

            console.log("About to submit Login for: " + vm.requesterEmail);

            this.$store.state.loginContext.requesterEmail = vm.requesterEmail;

            if (this.rememberMeChecked == 'remember-me') {    
                const loginContext = this.$store.state.loginContext;
                loginContext.requesterEmail = vm.requesterEmail;
                loginContext.accessCode = vm.accessCode;
                loginContextMgr.cacheLoginContext(loginContext);
            } else {
                loginContextMgr.uncacheLoginContext();
            }


            var loginUrl = apiMgr.getLoginUrl();

            var arg = {
                email: vm.requesterEmail,
                accessCode: vm.accessCode
            };

            axios.post(loginUrl, arg)
            .then(res => {
                console.log("Login status: " + res.status);
                vm.isSubmitting = false;
                vm.hasFailure = false;
                const storeState = this.$store.state;

                if (storeState.appDefConfig.devModeIgnoreLoginFailure) {
                    vm.$router.push('dofirst');
                    return;
                }

                if (res.status == 200 && res.data != null) {
                    this.$store.state.currentUser = res.data;
                    if (storeState.currentUser != null && 
                        storeState.currentUser.name != null) {
                        storeState.loginContext.requesterName = storeState.currentUser.name;
                    }
                    vm.$router.push('dofirst'); 
                } else {
                     vm.hasFailure = true;
                     this.failureMessage = "Login failed. Please try again.";
                }
                
            })
            .catch((err) => {
                console.log("Login failed: " + err);
                vm.isSubmitting = false;
                vm.hasFailure = true;

                if (this.$store.state.appDefConfig.devModeIgnoreLoginFailure) {
                    vm.$router.push('dofirst');
                    return;
                }

                vm.isLoginFailed = true;
                if (err.response != null && err.response.status == 401) { //401 - Unauthorized.                  
                    this.failureMessage = "Login failed. Please try again.";
                } else {
                    this.failureMessage = "Server unavailable or not working at this time.";
                }

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