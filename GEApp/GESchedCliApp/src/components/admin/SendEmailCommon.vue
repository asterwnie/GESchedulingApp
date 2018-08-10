<template>  
    <div>
        <div class="row">
            <div class="col col-12 col-md-1 col-lg-2"></div>
            <div class="col col-12 col-md-10 col-lg-8" style="color:gray" v-if="supportDoAnother">
                <button @click.prevent="onReset" type="button" class="float-right btn btn-secondary">Add Another</button>
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
            <p class="text-danger validation-msg" style="display:none;" id="REQUIRED-MSG-FOR-recipientName">The recipient name is required.</p>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon2">Recipient Email</span>
                </div>
                <input id="recipientEmail" type="text" class="form-control" aria-label="recipient-email" aria-describedby="basic-addon2">
            </div>
            <p class="text-danger validation-msg" style="display:none;" id="INVALID-MSG-FOR-recipientEmail">Please enter a valid email address.</p>
            <p class="text-danger validation-msg" style="display:none;" id="REQUIRED-MSG-FOR-recipientEmail">A email address is required.</p>
            <button @click.prevent="onGenerateEmail" type="button" class="float-right btn btn-sm btn-primary">Generate Email</button>
            <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
            </div>

            <div id="adminUI" class="col col-12 col-md-6 col-lg-4 col-xl-5">
            <div class="form-group">
                <label for="emailPreview">Email Preview</label>
                <textarea class="form-control" id="emailPreview" rows="10" readonly></textarea>
            </div>
            
            <div v-if="canEmail">
                <button type="button" @click.prevent="onNavOut" class="btn btn-sm btn-primary">{{navOutButtonLabel}}</button>
                <a :href="`mailto:${recipientEmail}?subject=${emailSubject}&body=${emailStringDataExport}`">
                    <button type="button" class="float-right btn btn-sm btn-primary">Launch Email</button>
                </a>
            </div>
            <div v-else>
                <button type="button" @click.prevent="onNavOut" class="btn btn-sm btn-primary">{{navOutButtonLabel}}</button>
                <button type="button" class="float-right btn btn-sm btn-primary" disabled>Launch Email</button>
            </div>         
            </div>

            <div class="col col-12 col-md-1 col-lg-2"></div>
        </div>
  </div>
</template>

<script>
import axios from 'axios';
import * as util from '@/common/util.js';
import * as apiMgr from '@/common/apiMgr.js';
import * as localCacheMgr from '@/common/localCacheMgr.js';
import * as textTransformer from '@/common/textTransformer.js';
import { validatePrompts } from '@/common/requestMgr.js'

export default {

    props: ['emailSubject', 
            'emailTemplate', 
            'navOutButtonLabel', 
            'navOutRoutePath', 
            'supportDoAnother', 
            'emailSubject', 
            'emailTemplate', 
            'defRecipientName', 
            'defRecipientEmail',
            'needMostRecentUserAccessCode',
            'needMostRecentAdminAccessCode',
            ],

    data () {
        return {
            hasFailure: false,
            failureMessage: null,
            recipientEmail: defRecipientEmail,
            recipientName: defRecipientName,
            emailStringDataExport: null,
            emailStringDataDisplay: null,
            canEmail: false,
        }
    },

    activated() {
        console.log('SendEmailCommon.vue activated.');
        let vm = this;

        if (this.$store.state.appConfig.siteCode == null) {
            this.$router.push('/login'); // Config data lost, force back to login to refetch data.
            return;
        }

        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = true;
        
        if (this.needMostRecentUserAccessCode) {
            this.getMostRecentUserAccessCode();
        }
        if (this.needMostRecentAdminAccessCode) {
            this.getMostRecentAdminAccessCode();
        }

        this.onReset();
    },


    methods: {

        onNavOut() {
            this.$store.state.defRecipientNameForSendEmail = null;
            this.$store.state.defRecipientEmailForSendEmail = null;
            this.$router.push(this.navOutRoutePath);
        },       


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

        
        getMostRecentAdminAccessCode() {

            var vm = this;
            let url = apiMgr.getAccessCodesUrl() + "&findOne=true&isForAdmin=true";

            axios.get(url)
                .then(res => {
                    console.log("getAccessCodesUrl return status: " + res.status);

                    if (res.status == 200 && res.data != null && res.data.length >= 1) {
                        vm.$store.state.mostRecentAdminAccessCode = res.data[0].code;
                    } else {
                        vm.hasFailure = true;
                        vm.failureMessage = "No Admin user access code available. Please try later.";                         
                    }
                    
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later. [error code: 9]";                               
                })
        },

        onGenerateEmail () {
            console.log("onGenerateEmail activated.");
            let vm = this;

            vm.isValid = true;

            vm.recipientName = $("#recipientName").val();
            vm.recipientEmail = $("#recipientEmail").val();
            
            var prompts = [];
            prompts.push({ isRequired: true, inputType: { ctrlType: "email", ctrlDataId: "recipientEmail" } });
            prompts.push({ isRequired: true, inputType: { ctrlType: "text", ctrlDataId: "recipientName" } });

            var allValid = validatePrompts(prompts);
            
            if(allValid){
                vm.hasFailure = false;

                //Replace meta tags
                vm.emailStringDataExport = textTransformer.transformAsMailToBodyText(vm.emailTemplate);

                while(vm.emailStringDataExport.indexOf("[") > -1){
                    vm.emailStringDataExport = vm.emailStringDataExport
                        .replace('[RECIPIENTNAME]', vm.recipientName)
                        .replace('[RECIPIENTEMAIL]', vm.recipientEmail)
                        .replace('[APPLINK]', vm.$store.state.appConfig.appLink)
                        .replace('[ACCESSCODE]', vm.$store.state.mostRecentUserAccessCode)
                        .replace('[ADMINACCESSCODE]', vm.$store.state.mostRecentAdminAccessCode)
                        .replace('[ADMINNAME]', vm.$store.state.currentAdminUser.name)
                        .replace('[APPNAME]', vm.$store.state.appConfig.appName);
                }
                
                //Reformat for display in preview
                vm.emailStringDataDisplay = vm.emailStringDataExport.replace(/%0D%0A/g, '\n').replace(/%20/g, ' ');

                $("#emailPreview").val(vm.emailStringDataDisplay);  

                //$("#emailPreview")[0].disabled = false;
                vm.canEmail = true;
            }
            
            vm.$forceUpdate();          
        },


        onReset() {

            $(".validation-msg").hide();    
            $("#recipientEmail").val(this.defRecipientEmail);
            $("#recipientName").val(this.defRecipientName);
            $("#emailPreview").val(null);  

            this.emailStringDataExport = null;
            this.emailStringDataDisplay = null;
            
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