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
                                   v-model="requesterEmail"        
                                   placeholder="you@example.com">
                            <p class="text-danger" style="display:none;" id="INVALID-MSG-FOR-requesterEmail">Please enter a valid email address.</p>
                            <p class="text-danger" style="display:none;" id="REQUIRED-MSG-FOR-requesterEmail">A email address is required.</p>
                        </div>

                        <div class="mb-3">
                            <label for="accessCode">Access Code</label>
                            <input type="password" class="form-control form-control-sm" 
                                   v-model="accessCode" 
                                   id="accessCode">                 
                            <p class="text-danger" style="display:none;" id="REQUIRED-MSG-FOR-accessCode">The access code is required.</p>
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
                                    @click.prevent="onLogin"
                            >Login</button>
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
import * as apiMgr from '@/common/apiMgr.js';
import * as localCacheMgr from '@/common/localCacheMgr.js';
import * as textTranformer from '@/common/textTranformer.js';
import { validatePrompts, inferNumOfRequestScreens } from '@/common/requestMgr.js'

export default {  
    data () {
        return {
            title: "Login",

            requesterEmail: '',
            accessCode: '',
            rememberMeChecked: 'remember-me',
            
            isSubmitting: false,

            isFetchingDefAppConfig: true,
            isFetchingNotes: true,
            isFetchingHotels: true,
            isFetchingRequestPrompts: true,

            canShowError: false,
            hasFailure: false,
            failureMessage: ""
        }
    },



    activated() {
        console.log('Login.vue activated.');
        var vm = this; 
        var storeState = this.$store.state;
    
        storeState.currentViewTitle = this.title;
        storeState.enableNavBar = false;
 
        var cachedLoginContext = localCacheMgr.getCachedItem("loginContextKey");
        if (cachedLoginContext != null) {
            storeState.loginContext = cachedLoginContext;  
        }

        if (storeState.loginContext != null && storeState.loginContext.requesterEmail != null && storeState.loginContext.requesterEmail != '') {
            this.requesterEmail = storeState.loginContext.requesterEmail; 
        }
    
        if (storeState.loginContext != null && storeState.loginContext.accessCode != null && storeState.loginContext.accessCode != '') {
            this.accessCode = storeState.loginContext.accessCode;
            storeState.loginContext.accessCode = null; // Avoid holding it in memory.
        }

        this.isFetchingDefAppConfig = true;
        this.isFetchingNotes = true;
        this.isFetchingHotels = true;
        this.isFetchingRequestPrompts = true;
        this.isFetchingRooms = true;
        
        this.getDefAppConfig(); 
        this.getNotes();
        this.getHotels();
        this.getRequestPrompts();
        this.getRooms();
        this.getRequests();

    },

    computed: {
        isLoading() {
            return (
                this.isFetchingDefAppConfig || 
                this.isFetchingNotes || 
                this.isFetchingHotels ||
                this.isFetchingRequestPrompts ||
                this.isFetchingRooms ||
                this.isFetchingRequests
                ); 
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

        getRequestPrompts() {

            var vm = this;
            var url = apiMgr.getRequestPromptsUrl(); 

            axios.get(url)
                .then(res => {
                    console.log("getRequestPrompt return status: " + res.status);

                    vm.$store.state.requestPrompts = res.data;
                    inferNumOfRequestScreens(vm.$store.state.requestPrompts);
                    vm.isFetchingRequestPrompts = false;
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })

        },

        getNotes() {

            var vm = this;
            var url = apiMgr.getNotesUrl() + '?orderBy=seqNum:1';

            axios.get(url)
                .then(res => {
                    console.log("getNotesUrl return status: " + res.status);

                    vm.$store.state.notes = textTranformer.tranformNotes(res.data);
                    vm.isFetchingNotes = false;
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })

        },

        getHotels() {

            var vm = this;
            var url = apiMgr.getHotelsUrl() + '?orderBy=seqNum:1'; 

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

        getRooms() {

            var vm = this;
            var url = apiMgr.getRoomsUrl(); 

            axios.get(url)
                .then(res => {
                    console.log("getRoomsUrl return status: " + res.status);

                    vm.$store.state.rooms = res.data;
                    vm.isFetchingRooms = false;
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })

        },

        getRequests() {

            var vm = this;
            var url = apiMgr.getRequestsUrl(); 

            axios.get(url)
                .then(res => {
                    console.log("getRequestsUrl return status: " + res.status);

                    vm.$store.state.requests = res.data;
                    vm.isFetchingRequests = false;
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })

        },


        onLogin() {
            var vm = this;
            vm.isSubmitting = true;
            vm.hasFailure = false;

            vm.canShowError = true;

            var prompts = [];

            prompts.push({ isRequired: true, inputType: { ctrlType: "email", ctrlDataId: "requesterEmail" } });
            prompts.push({ isRequired: true, inputType: { ctrlType: "text", ctrlDataId: "accessCode" } });

            var allValid = validatePrompts(prompts);

            if (!allValid) {
                vm.isSubmitting = false;
                return;
            }

            console.log("About to submit Login for: " + vm.requesterEmail);

            this.$store.state.loginContext.requesterEmail = vm.requesterEmail;

            if (this.rememberMeChecked == 'remember-me') {    
                const loginContext = this.$store.state.loginContext;
                loginContext.requesterEmail = vm.requesterEmail;
                loginContext.accessCode = vm.accessCode;
                localCacheMgr.cacheItem("loginContextKey", loginContext);
            } else {
                localCacheMgr.uncacheItem("loginContextKey");
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

                if ((res.status == 200 || res.status == 201) && res.data != null) {
                    storeState.currentUser = res.data;
                    if (storeState.currentUser != null && 
                        storeState.currentUser.name != null) {
                        storeState.loginContext.requesterName = storeState.currentUser.name;
                    }

                    if(res.data.isAdmin){
                        vm.$router.push('/admin/home');
                    } else {
                        vm.$router.push('/home');
                    }
                     
                } else {
                     vm.hasFailure = true;
                     vm.failureMessage = "Login failed. Please try again.";
                }
                
            })
            .catch((err) => {
                console.log("Login failed: " + err);
                vm.isSubmitting = false;
                vm.hasFailure = true;

                vm.isLoginFailed = true;
                if (err.response != null && err.response.status == 401) { //401 - Unauthorized.                  
                    vm.failureMessage = "Login failed. Please try again.";
                } else {
                    vm.failureMessage = "Server unavailable or not working at this time.";
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