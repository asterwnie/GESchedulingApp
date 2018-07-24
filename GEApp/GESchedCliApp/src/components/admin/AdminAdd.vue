<template>  

    <div class="container-fluid">
        <div class="row">
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
          <div class="col col-12 col-sm-10 col-md-8 col-lg-8">
      
            <div class="card" style="width:100%">
              <div class="card-header bg-danger text-light">
                  Invite Admin
                  
              </div>
            </div> 

          </div>
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
      </div>
      <div style="height:10px"></div>
      <div class="row">
      <div class="col col-12 col-md-2 col-lg-2"></div>

        <div id="adminBar" class="col col-12 col-md-3 col-lg-3 col-xl-2" style="padding-bottom:10px">

            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Recipient Name</span>
                </div>
                <input id="recipientNameAdmin" type="text" class="form-control" placeholder="John Doe" aria-label="recipient-name" aria-describedby="basic-addon1">
            </div>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon2">Recipient Email</span>
                </div>
                <input id="recipientEmailAdmin" type="text" class="form-control" placeholder="johndoe@ge.com" aria-label="recipient-email" aria-describedby="basic-addon2">
            </div>

            <button @click.prevent="onGenerateEmail" type="button" class="float-right btn btn-primary">Generate Email</button>
            <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
        </div>

        <div id="adminUI" class="col col-12 col-md-5 col-lg-5 col-xl-6">
            <div class="form-group">
                <label for="emailPreview">Email Preview</label>
                <textarea class="form-control" id="emailPreview" rows="10" disabled></textarea>
            </div>
            <div v-if="canEmail">
                <a :href="`mailto:${recipientEmail}?subject=${addAdminEmailSubject}&body=${emailStringDataExport}`">
                    <button type="button" class="float-right btn btn-primary">Send Email</button>
                </a>
            </div>
            <div v-else>
                <button type="button" class="float-right btn btn-primary" disabled>Send Email</button>
            </div>
            
        </div>


      <div class="col col-12 col-md-2 col-lg-2"></div>
    </div>
    <div style="height:30px"></div>
    <div class="row">
      <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
      <div class="col col-12 col-sm-10 col-md-8 col-lg-8">
  
        <div class="card" style="width:100%">
          <div class="card-header bg-danger text-light">
              Current Admins
              
          </div>
        </div> 

        <div id="currentAdminUI">
          <div class="card">
            <div v-if="adminUsers != null" class="card-body">
              <div v-for="admin in adminUsers" :key="admin">
                <div class="float-left"><h6>{{admin.name}}</h6></div>
                <div class="float-right font-weight-light">{{admin.email}}</div>
              </div>
            </div>
          </div>
        </div> 

      </div>
      <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
  </div>
    <div style="height:30px"></div>
    <div class="row">
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
          <div class="col col-12 col-auto" style="color:gray">
          <h5 class="text-center" v-html="$store.state.appConfig.siteName"></h5>
          <h6 class="text-center" v-html="$store.state.appConfig.siteAddress"></h6>
          <br>
          </div>
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as apiMgr from '@/common/apiMgr.js';
import * as localCacheMgr from '@/common/localCacheMgr.js';

export default {
    data () {
    return {
        hasFailure: false,
        failureMessage: "",

        hasBeenActivated: false,

        previewRequestNum: 3,
        recipientEmail: "",
        recipientName: "",
        emailStringDataExport: "",
        emailStringDataDisplay: "",
        canEmail: false,
        adminUsers: [],
    }
  },

  computed: {
        title() {
            return this.$store.state.appConfig.adminAddViewTitle; 
        },
        viewDescription() {
            return this.$store.state.appConfig.adminAddViewDescription; 
        },
        addAdminEmailSubject() {
            return this.$store.state.appConfig.addAdminEmailSubject;
        }
    },

    activated() {
        console.log('AdminHome.vue activated.');
        let vm = this;

        if (this.$store.state.appConfig.adminAddViewTitle == null) {
            this.$router.push('/login'); // Config data lost, force back to login to refetch data.
            return;
        }

        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = true;
        
        vm.hasBeenActivated = true;
        vm.recipientName = "";
        vm.recipientEmail = "";

        
        //get admin users
        let url = apiMgr.getUsersUrl() + "&isAdmin=true";

        axios.get(url)
            .then(res => {
                console.log("getAdminUsers return status: " + res.status);
                
                if(vm.adminUsers != null){
                        while(vm.adminUsers.length > 0) {
                        vm.adminUsers.pop();
                        }
                    }

                var foundAdminUsers = res.data;

                $.each(foundAdminUsers, function (index, foundAdminUser) {
                    vm.adminUsers.push(foundAdminUser);
                });
                
            })
            .catch((err) => {
                vm.hasFailure = true;
                vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
            })
    },

    updated(){
        if(this.hasBeenActivated){
            let vm = this;
            $("#emailPreview")[0].value = vm.emailStringDataDisplay;
        }
    },

    methods: {

        validateEmailString (inputVal) {
            let vm = this;
            let isValid = true;
            var email = null;

            try {
                var emailRegEx = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/i;
                email = inputVal.match(emailRegEx);
            } catch (err) {
                console.warn("validateEmailPrompt error: " + err);
            }

            if (email == null) {
                isValid = false;
                vm.hasFailure = true;
                vm.failureMessage = "Invalid email.";
            }

            return isValid;
        },

        onGenerateEmail () {
            console.log("onGenerateEmail activated.");
            let vm = this;

            vm.isValid = true;

            vm.recipientName = $("#recipientNameAdmin")[0].value;
            vm.recipientEmail = $("#recipientEmailAdmin")[0].value;
            
            if(vm.recipientName != "" && vm.recipientEmail != ""){

                let isValid = vm.validateEmailString(vm.recipientEmail);
                let adminName = vm.$store.state.currentAdminUser.name;
                
                if(isValid){
                    vm.hasFailure = false;

                    //replace email and name (and access code)
                    vm.emailStringDataExport = vm.$store.state.appConfig.addAdminEmailTemplate.replace('[RECIPIENTNAME]', vm.recipientName).replace('[RECIPIENTEMAIL]', vm.recipientEmail).replace('[ACCESSCODE]', vm.$store.state.tempAccessCode).replace('[ADMINNAME]', adminName);
                    
                    //reformat for display in preview
                    vm.emailStringDataDisplay = vm.emailStringDataExport.replace(/%0D%0A/g, '\n').replace(/%20/g, ' ');

                    $("#emailPreview")[0].disabled = false;
                    vm.canEmail = true;
                }
                
            } else {
                vm.hasFailure = true;
                vm.failureMessage = "Fields cannot be empty."
            }
          
            vm.$forceUpdate();
            
        },


    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pad-bottom {
  padding-bottom:5px
}
</style>