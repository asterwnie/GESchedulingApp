<template>  

    <div class="container-fluid">
        <div class="row">
            <div class="col col-12 col-md-1 col-lg-2"></div>
            <div class="col col-12 col-md-10 col-lg-8" style="color:gray">
        
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    <strong>Send Invite</strong> {{viewDescription}}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <button @click.prevent="onResetAdd" type="button" class="float-right btn btn-secondary">Add Another</button>

            </div>
            <div class="col col-12 col-md-1 col-lg-2"></div>
        </div>
        <div style="height:10px"></div>
      <div class="row">
      <div class="col col-12 col-md-1 col-lg-2"></div>

        <div id="adminBar" class="col col-12 col-md-4 col-lg-4 col-xl-3" style="padding-bottom:10px">
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">Recipient Name</span>
                </div>
                <input id="recipientName" type="text" class="form-control" aria-label="recipient-name" aria-describedby="basic-addon1">
            </div>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon2">Recipient Email</span>
                </div>
                <input id="recipientEmail" type="text" class="form-control" aria-label="recipient-email" aria-describedby="basic-addon2">
            </div>

            <button @click.prevent="onGenerateEmail" type="button" class="float-right btn btn-primary">Generate Email</button>
            <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
        </div>

        <div id="adminUI" class="col col-12 col-md-6 col-lg-4 col-xl-5">
            <div class="form-group">
                <label for="emailPreview">Email Preview</label>
                <textarea class="form-control" id="emailPreview" rows="10" readonly></textarea>
            </div>
            <div v-if="canEmail">
                <a :href="`mailto:${recipientEmail}?subject=${sendInviteEmailSubject}&body=${emailStringDataExport}`">
                    <button type="button" class="float-right btn btn-primary">Launch Email</button>
                </a>
            </div>
            <div v-else>
                <button type="button" class="float-right btn btn-primary" disabled>Launch Email</button>
            </div>
            
        </div>


      <div class="col col-12 col-md-1 col-lg-2"></div>
    </div>
    <div style="height:30px"></div>
    <div class="row">
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
          <div class="col col-12 col-auto" style="color:gray">
          <div class="site-name-footer" v-html="$store.state.appConfig.siteName"></div>
          <div class="site-address-footer" v-html="$store.state.appConfig.siteAddress"></div>
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
import * as textTransformer from '@/common/textTransformer.js';

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
    }
  },

  computed: {
        title() {
            return this.$store.state.appConfig.adminSendInviteViewTitle; 
        },
        viewDescription() {
            return this.$store.state.appConfig.adminSendInviteViewDescription; 
        },
        sendInviteEmailSubject() {
            return this.$store.state.appConfig.sendInviteEmailSubject;
        }
    },

    activated() {
        console.log('AdminSendInvite.vue activated.');
        let vm = this;

        if (this.$store.state.appConfig.adminSendInviteViewTitle == null) {
            this.$router.push('/login'); // Config data lost, force back to login to refetch data.
            return;
        }

        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = true;
        
        vm.hasBeenActivated = true;
        vm.recipientName = "";
        vm.recipientEmail = "";

        this.getMostRecentUserAccessCode();
    },

    updated(){
        if(this.hasBeenActivated){
            let vm = this;
            $("#emailPreview")[0].value = vm.emailStringDataDisplay;
        }
    },

    methods: {

        getMostRecentUserAccessCode() {

            var vm = this;
            let url = apiMgr.getAccessCodesUrl() + "&findOne=true";

            axios.get(url)
                .then(res => {
                    console.log("getAccessCodesUrl return status: " + res.status);

                    if (res.status == 200 && res.data != null && res.data.length >= 1) {
                        vm.$store.state.mostRecentUserAccessCode = res.data[0].code;
                    } else {
                        vm.hasFailure = true;
                        vm.failureMessage = "No user access code available. Please try later.";                         
                    }
                    
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later. [error code: 8]";                               
                })
        },

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

            vm.recipientName = $("#recipientName")[0].value;
            vm.recipientEmail = $("#recipientEmail")[0].value;
            
            if(vm.recipientName != "" && vm.recipientEmail != ""){

                let isValid = vm.validateEmailString(vm.recipientEmail);
                let adminName = vm.$store.state.currentAdminUser.name;
                
                if(isValid){
                    vm.hasFailure = false;

                    //replace email and name (and access code)
                    vm.emailStringDataExport = textTransformer.transformAsMailToBodyText(vm.$store.state.appConfig.sendInviteEmailTemplate)
                        .replace('[RECIPIENTNAME]', vm.recipientName)
                        .replace('[RECIPIENTEMAIL]', vm.recipientEmail)
                        .replace('[APPLINK]', vm.$store.state.appConfig.appLink)
                        .replace('[ACCESSCODE]', vm.$store.state.mostRecentUserAccessCode)
                        .replace('[ADMINNAME]', adminName);
                    
                    //reformat for display in preview
                    vm.emailStringDataDisplay = vm.emailStringDataExport.replace(/%0D%0A/g, '\n').replace(/%20/g, ' ');

                    //$("#emailPreview")[0].disabled = false;
                    vm.canEmail = true;
                }
                
            } else {
                vm.hasFailure = true;
                vm.failureMessage = "Required fields cannot be empty."
            }
          
            vm.$forceUpdate();
            
        },

        onResetAdd(){

            $("input").each(function(){
                if(this.id.indexOf("recipient") > -1 && this.id.indexOf("AdminInput") <= -1){
                    this.value = "";
                }
            });

            this.emailStringDataExport = "";
            this.emailStringDataDisplay = "";
            
            this.$forceUpdate();
        }


    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pad-bottom {
  padding-bottom:5px
}
</style>