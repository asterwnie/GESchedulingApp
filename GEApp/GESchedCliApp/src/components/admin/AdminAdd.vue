<template>  

    <div class="container-fluid">
        <div class="row">
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
          <div class="col col-12 col-sm-10 col-md-8 col-lg-8">
      
            <div class="card" style="width:100%">
              <div class="card-header bg-danger text-light">
                  Invite Admin
                  <button @click.prevent="onResetAdd" type="button" class="float-right btn btn-outline-light">Add Another</button>
              </div>
            </div> 

          </div>
          <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
      </div>
      <div class="row">
      <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>

        <div class="col col-12 col-sm-10 col-md-8 col-lg-8 accordion" id="adminAddAccordian">
            <div class="card">
                <div class="card-header" cursor="pointer" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="addAdminCollapse" id="addAdminHeading">
                    Step 1: Add Admin<p class="float-right text-success" :hidden="!hasSuccess">&nbsp;&nbsp;{{successMessage}}</p>
                </div>

                <div id="collapseAddAdmin" class="collapse show" aria-labelledby="addAdminCollapse" data-parent="#adminAddAccordian">
                    <div class="card-body">
                        <div class="form-group">
                            <label for="recipientNameAdminInput">Recipient Name<i class="required-star">*</i></label>
                            <input type="text" class="form-control" id="recipientNameAdminInput" aria-describedby="nameHelp" placeholder="ex. John Doe">
                            <small id="nameHelp" class="form-text text-muted">How the name is displayed here is how it will be displayed in the app.</small>
                        </div>
                        <div class="form-group">
                            <label for="recipientEmailAdminInput">Email address<i class="required-star">*</i></label>
                            <input type="text" class="form-control" id="recipientEmailAdminInput" aria-describedby="recipient-email" placeholder="ex. johndoe@ge.com">
                        </div>
                        <div class="form-group">
                            <label for="recipientPhoneAdminInput">Phone Number</label>
                            <input type="text" class="form-control" id="recipientPhoneAdminInput" aria-describedby="recipient-phone" placeholder="ex. 1-800-800-800">
                        </div>
                        <button @click.prevent="onAddAdmin" type="button" class="float-right btn btn-primary">Add Admin</button>
                        <div style="height:30px"></div>
                        <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
                    </div>
                </div>
            </div>
            <div class="card">
                <div class="card-header" cursor="pointer" data-toggle="collapse" data-target="#sendNotificationCollapse" aria-expanded="false" aria-controls="sendNotificationCollapse" id="sendNotificationHeading">
                    Step 2: Send Notification
                </div>
                <div id="collapseSendNotification" class="collapse" aria-labelledby="sendNotificationCollapse" data-parent="#adminAddAccordian">
                    <div class="card-body row">
                        <div id="adminBar" class="col col-12 col-lg-6 col-xl-5">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">Recipient Name</span>
                                </div>
                                <input id="recipientNameAdmin" type="text" class="form-control" placeholder="ex. John Doe" aria-label="recipient-name" aria-describedby="basic-addon1" disabled>
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon2">Recipient Email</span>
                                </div>
                                <input id="recipientEmailAdmin" type="text" class="form-control" placeholder="ex. johndoe@ge.com" aria-label="recipient-email" aria-describedby="basic-addon2" disabled>
                            </div>
                            <div v-if="canGenerateEmail">
                                <button @click.prevent="onGenerateEmail" type="button" class="float-right btn btn-primary">Generate Email</button>
                            </div>
                            <div v-else>
                                <button type="button" class="float-right btn btn-primary" disabled>Generate Email</button>
                            </div>
                            
                            <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
                        </div>

                        <div id="adminUI" class="col col-12 col-lg-6 col-xl-7">
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
                    </div>
                </div>
            </div>
        </div>


      <div class="col col-12 col-sm-1 col-md-2 col-lg-2"></div>
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

        <div v-if="adminUsers != null" id="currentAdminUI">
          <div v-for="(admin, index) in adminUsers" :key="index" class="card">
            <div class="card-body">
                <div class="float-left"><h6>{{admin.name}}</h6></div>
                <div class="float-right font-weight-light">{{admin.email}}</div>
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
        hasSuccess: false,
        successMessage: "",

        hasBeenActivated: false,

        previewRequestNum: 3,
        recipientEmail: "",
        recipientName: "",
        recipientPhone: "",
        emailStringDataExport: "",
        emailStringDataDisplay: "",
        canEmail: false,
        adminUsers: [],

        canGenerateEmail: false,
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

        
        vm.refreshAdminUI();
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

        refreshAdminUI(){
            let vm = this;

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
                    
                    vm.$forceUpdate();
                    
                })
                .catch((err) => {
                    vm.hasFailure = true;
                    vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
                })
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

        onAddAdmin(){
            console.log("onAddAdmin activate.");
            let vm = this;

            vm.recipientName = $("#recipientNameAdminInput")[0].value;
            vm.recipientEmail = $("#recipientEmailAdminInput")[0].value;
            vm.recipientPhone = $("#recipientPhoneAdminInput")[0].value;
            
            if(vm.recipientName != "" && vm.recipientEmail != ""){

                let isValid = vm.validateEmailString(vm.recipientEmail);

                 if(isValid){

                    //gather new user
                    let newUser = {
                        email: vm.recipientEmail,
                        name: vm.recipientName,
                        isAdmin: true,
                    };
                    if(vm.recipientPhone != ""){
                        newUser.phone = vm.recipientPhone;
                    }

                    //get url
                    let url = apiMgr.getUsersUrl();
                    
                    //create (post) new user
                    axios.post(url, newUser)
                        .then(res => {
                            console.log("onAddAdmin return status: " + res.status);
                            
                            vm.hasFailure = false;
                            vm.hasSuccess = true;

                            vm.successMessage = "Success!"

                            //replace email and name in UI
                            $("#recipientNameAdmin")[0].value = vm.recipientName;
                            $("#recipientEmailAdmin")[0].value = vm.recipientEmail;

                            $("#recipientNameAdmin")[0].disabled = false;
                            $("#recipientEmailAdmin")[0].disabled = false;
                            vm.canGenerateEmail = true;

                            $("#collapseAddAdmin").collapse("hide");
                            $("#collapseSendNotification").collapse('show');

                            vm.refreshAdminUI();
                            vm.$forceUpdate();

                        })
                        .catch((err) => {
                            vm.hasFailure = true;
                            vm.failureMessage = `An error has occured. ${err}`;                               
                        })
                    
                }

            } else {
                vm.hasFailure = true;
                vm.failureMessage = "Fields cannot be empty."
            }
        },


    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pad-bottom {
  padding-bottom:5px
}
.required-star {
  color: red
}
</style>