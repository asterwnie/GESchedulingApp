<template>  
<div>
  <!-- Modal -->
  <div class="modal" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div :hidden="modalUI != 'onDeleteOldRequests'">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel" style="color:red;">Delete Requests</h5>
            <button @click.prevent="onDeleteModalDeselect" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete these requests? This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click.prevent="onDeleteModalDeselect">Cancel</button>
            <button type="button" class="btn btn-primary" @click.prevent="onDeleteOldRequestsConfirm">Confirm Delete</button>
          </div>
        </div>
        <div :hidden="modalUI != 'onDeleteAccessCode'">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteModalLabel">Delete Access Code</h5>
            <button @click.prevent="onDeleteModalDeselect" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this access code? This action cannot be undone.</p>
            <div class="card" id="selectedRequestsUI"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click.prevent="onDeleteModalDeselect">Cancel</button>
            <button type="button" class="btn btn-primary" @click.prevent="onDeleteAccessCodeConfirm">Confirm Delete</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!--Page Contents-->
  <div class="container-fluid">
      <div class="row">
      <div class="col col-12 col-md-2 col-lg-2"></div>

        <div id="adminBar" class="col col-12 col-md-3 col-lg-3 col-xl-2" style="padding-bottom:10px">
        
          <div class="card">
              <div class="bg-secondary text-light card-header">
                Maintenance Menu
              </div>
            </div>

          <div class="accordion" id="menuAccordian">
            <div @click.prevent="onExpandOption" class="card">
              <div class="bg-info text-light card-header" id="flushOldRequestsHeader"  style="cursor:pointer" data-toggle="collapse" data-target="#flushOldRequestsCollapse" aria-expanded="false" aria-controls="flushOldRequestsCollapse">
                Flush Old Requests&nbsp;&nbsp;<i class="fa fa-caret-right" aria-hidden="true"></i>
              </div>
            </div>

            <div class="card">
              <div @click.prevent="onExpandOption" class="bg-info text-light card-header" id="manageAccessCodesHeader" style="cursor:pointer" data-toggle="collapse" data-target="#manageAccessCodesCollapse" aria-expanded="false" aria-controls="manageAccessCodesCollapse">
                Manage Access Codes&nbsp;&nbsp;<i class="fa fa-caret-right" aria-hidden="true"></i>
              </div>
            </div>

            <div class="card">
              <div @click.prevent="onExpandOption" class="bg-info text-light card-header" id="updateAppDataHeader" style="cursor:pointer" data-toggle="collapse" data-target="#updateAppDataCollapse" aria-expanded="false" aria-controls="updateAppDataCollapse">
                Update App Data&nbsp;&nbsp;<i class="fa fa-caret-right" aria-hidden="true"></i>
              </div>
            </div>

          </div>

        </div>

        <div id="adminUI" class="col col-12 col-md-5 col-lg-5 col-xl-6">

          <div class="card">

            <div class="text-light bg-secondary card-header">
              {{currentHeader}}
            </div>


            <div class="collapse show">
              <div class="font-weight-light font-italic card-body">
                No option selected.
              </div>
            </div>

            <div id="flushOldRequestsCollapse" class="collapse" aria-labelledby="flushOldRequests" data-parent="#menuAccordian">
              <div class="card-body">
                <div class="alert alert-danger" role="alert">
                  <strong>Warning</strong> This will permanently delete past older requests. (Archiving is not available in this version of the app.)
                </div>
                <p>Flushing old requests will delete all past requests that fit the criteria. Note that this action cannot be reversed.</p>

                <div class="card">
                  <div class="card-header bg-danger text-light" id="filterMenu">
                        Delete Past Request By
                  </div>
                  <div id="filterMenu" class="card-body" style="padding:10px; width:100%;">

                    <div class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-sm">Older Than</span>
                        </div>
                        <input id="inputOlderThan" type="number" class="form-control" aria-label="Small" :value="deleteOlderThanNumDays" aria-describedby="inputGroup-sizing-sm">
                        <div class="input-group-append">
                        <span class="input-group-text" id="inputGroup-sizing-sm">days</span>
                        </div>
                    </div>
                    <div>
                        <p class="text-danger validation-msg" style="display:none;" id="REQUIRED-MSG-FOR-inputOlderThan">A number is required.</p>
                        <p class="text-danger" style="display:none;" id="INVALID-MSG-FOR-inputOlderThan">Only a positive number is allowed.</p>
                    </div>

                    <div class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-sm">Event Name</span>
                        </div>
                        <input id="inputEventName" type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
                    </div>

                    <div class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-sm">Requester Email</span>
                        </div>
                        <input id="inputRequesterEmail" type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm">
                    </div>

                    <div class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroup-sizing-sm">Status</span>
                        </div>
                        <select class="custom-select" id="inputProcessingStatus">
                            <option selected></option>
                            <option v-bind:id="statusItem.statusValue" v-bind:value='statusItem.statusValue' v-for="(statusItem, index) in processingStatusOptions" :key="index">
                                {{ statusItem.statusLabel }}
                            </option>

                        </select>
                    </div>
                    
                    <br>
                    <button type="button" class="float-right btn btn-sm btn-danger" @click.prevent="onDeleteOldRequestsModal">Delete Past Requests</button>
                    <button type="button" class="btn btn-sm btn-secondary" @click.prevent="clearSearchUI">Reset</button>
                    
                  </div>
              </div>

              <div class="float-right">
                <p class="text-success" :hidden="hasFailure || !canShowRequestResult">{{requestResultMessage}}</p>
                <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
              </div>

              </div>
            </div>


            <update-app-data-info-component-ctrl></update-app-data-info-component-ctrl>


            <div id="manageAccessCodesCollapse" class="collapse" aria-labelledby="manageAccessCodes" data-parent="#menuAccordian">
              <div class="card-body">

                <div class="alert alert-danger" role="alert">
                  <strong>Note:</strong> This does NOT update the access code data import file.
                </div>
                
                <div id="manageUserAccessCodes">
                  <div class="form-group">
                    <label for="createNewAccessCode">Create New Access Code</label>
                    <input class="form-control" id="createNewAccessCode" aria-describedby="newAccessCode" placeholder="Enter New Code">
                  </div>
                  <div class="float-right">
                    <input id="accessCodeCreateIsAdmin" type="checkbox" name="isAdmin">&nbsp;Is Admin<br>
                    <button type="button" class="btn btn-sm btn-primary" @click.prevent="onAccessCodeCreate">Create</button>
                  </div>
                  
                  <p class="text-success" :hidden="hasFailure || !canShowAccessCodeResultCreate">{{accessCodeResultMessageCreate}}</p>
                  <p class="text-danger" :hidden="!hasFailure || !isAccessCodeCreateFailure">{{failureMessage}}</p>
                  <div style="height:50px"></div>
                  <hr>
                  <div style="height:10px"></div>
                  <div class="form-group">
                    <label for="deleteAccessCode">Delete Access Code</label>
                    <input class="form-control" id="deleteAccessCode" aria-describedby="deleteAccessCode" placeholder="Enter Existing Code">
                    <small id="deleteAccessCodeHelp" class="form-text text-muted">If the code matches one in the database, it will be deleted.</small>
                  </div>
                  <div class="float-right">
                    <input id="accessCodeDeleteIsAdmin" type="checkbox" name="isAdmin">&nbsp;Is Admin<br>
                    <button type="button" class="btn btn-sm btn-danger" @click.prevent="onAccessCodeDelete">Delete</button>
                  </div>
                  <p class="text-success" :hidden="hasFailure || !canShowAccessCodeResultDelete">{{accessCodeResultMessageDelete}}</p>
                  <p class="text-danger" :hidden="!hasFailure || !isAccessCodeDeleteFailure">{{failureMessage}}</p>
                </div>

                <div style="height:50px"></div>
                <hr>

                <div class="card">
                  <div class="card-body">
                    <h6 class="card-title">
                      Existing User Codes
                    </h6>
                    <div v-if="accessCodesList != null">
                      <div v-for="(code, index) in accessCodesList" :key="index">
                        {{code.code}}<br>
                      </div>
                    </div>
                  </div>
                </div>
                <small>Contact your app manager for a list of Admin codes.</small>

              </div>
            </div>
            <div style="height:30px"></div>
          </div>
        </div>


      <div class="col col-12 col-md-2 col-lg-2"></div>
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
</div>
</template>

<script>
import updateAppDataInfoComponent from '@/components/admin/UpdateAppDataInfo.vue'

import axios from 'axios';
import * as util from '@/common/util.js';
import * as apiMgr from '@/common/apiMgr.js';
import * as localCacheMgr from '@/common/localCacheMgr.js';
import { validatePrompts } from '@/common/requestMgr.js'

export default {
    data () {
    return {
        hasFailure: false,
        failureMessage: "",
        canShowRequestResult: false,
        requestResultMessage: "Button does not work right now.",
        canShowAccessCodeResultCreate: false,
        accessCodeResultMessageCreate: "",
        canShowAccessCodeResultDelete: false,
        accessCodeResultMessageDelete: "",

        canShowRequestResult: false,
        requestResultMessage: "",
        previewRequestNum: 3,
        currentHeader: "Select a maintenance option.",
        requestsToDelete: null,
        processingStatusOptions: this.$store.state.processingStatusOptions,

        modalUI: null,
        isAccessCodeDeleteFailure: false,
        isAccessCodeCreateFailure: false,

        accessCodesList: null,
    }
  },

      components: {
        updateAppDataInfoComponentCtrl: updateAppDataInfoComponent
    },


  computed: {
        title() {
        return this.$store.state.appConfig.adminMaintenanceViewTitle; 
        },
        viewDescription() {
        return this.$store.state.appConfig.adminMaintenanceViewDescription; 
        },
        deleteOlderThanNumDays() {
          return this.$store.state.appConfig.deleteOlderThanNumDays; 
        }
    },

    activated() {
        console.log('AdminHome.vue activated.');
        let vm = this;

        if (this.$store.state.appConfig.adminMaintenanceViewTitle == null) {
        this.$router.push('/login'); // Config data lost, force back to login to refetch data.
        return;
        }

        vm.getUserAccessCodes();

        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = true;
    },


    methods: {

      getUserAccessCodes(){
        console.log("getUserAccessCodes activate.");
        let vm = this;

        vm.hasFailure = false;

        let url = apiMgr.getAccessCodesUrl();
        axios.get(url)
              .then(res => {
                console.log("deleteAccessCode return status: " + res.status);                
                
                vm.accessCodesList = [];
                var foundCodes = res.data;

                $.each(foundCodes, function (index, foundCode) {
                   vm.accessCodesList.push(foundCode);
                });

                vm.$forceUpdate();
                
              })
              .catch((err) => {
                vm.hasFailure = true;
                vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                 
              })
        
      },

      onExpandOption: function(event) {
        if (event){
          let vm = this;

          let currId = event.target.id.replace("Header", "");
          console.log(currId);

          //change title
          vm.currentHeader = vm.lowerCamelCaseToTitleCase(currId);

          //collapse all others and only show selected
          $('.collapse').collapse("hide");
          $(`#${currId}Collapse`).collapse("show");
        }
      },

      lowerCamelCaseToTitleCase(input) {
        let vm = this;

        let upperCaseSet = input.match(/[A-Z]+/g);
        if(upperCaseSet != null){
          upperCaseSet.forEach((upperCaseLetter, index) => {
              input = input.replace(upperCaseLetter, ' '+upperCaseLetter);
          });
        }

        input = input.replace(input.charAt(0), input.charAt(0).toUpperCase());

        return input;
      },

      onDeleteOldRequestsModal() {
        console.log("onDeleteOldRequestsModal activated.");
        let vm = this;
        var requestsToQuery = "";
        vm.hasFailure = false;

        var prompts = [];
        prompts.push({ isRequired: true, inputType: { ctrlType: "number", ctrlDataId: "inputOlderThan" } }); 

        var isValid = validatePrompts(prompts);
        if (!isValid) {
          return;
        }

        $('#deleteModal').modal('show');
        this.$store.state.isModalBeingDisplayed = true;
        vm.modalUI = "onDeleteOldRequests";

        //get query to delete. Gather days old to query
        var daysOldInputLocation = $("#inputOlderThan");
        var daysOldInputLocationVal = daysOldInputLocation.val();
        if(daysOldInputLocationVal != "" && daysOldInputLocationVal != null){
          requestsToQuery += `&daysOld=${daysOldInputLocationVal}`;
        }

        //gather eventName to query
        var eventNameInputLocation = $("#inputEventName");
        var eventNameInputLocationVal = eventNameInputLocation.val();
        if(eventNameInputLocationVal != "" && eventNameInputLocationVal != null){
          requestsToQuery += `&eventName=${eventNameInputLocationVal}`;
        }

        //gather requesterEmail to query
        var requesterEmailInputLocation = $("#inputRequesterEmail");
        var requesterEmailInputLocationVal = requesterEmailInputLocation.val();
        if(requesterEmailInputLocationVal != "" && requesterEmailInputLocationVal != null){
          requestsToQuery += `&requesterEmail=${requesterEmailInputLocationVal}`;
        }

        //gather processingStatus to query
        var processingStatusInputLocation = $("#inputProcessingStatus");
        var processingStatusInputLocationVal = processingStatusInputLocation.val();
        if(processingStatusInputLocationVal != "" && processingStatusInputLocationVal != null){
          requestsToQuery += `&processingStatus=${processingStatusInputLocationVal}`;
        }
        
        vm.requestsToDelete = requestsToQuery;

        //Note: for future enhancement, get numbers of requests that will be deleted to confirm.
        
      },

      onDeleteModalDeselect(){
        console.log('onDeleteModalDeselect activated. requestsToDelete unset.');
        let vm = this;
        vm.requestsToDelete = null;
        $('#deleteModal').modal('hide');
        this.$store.state.isModalBeingDisplayed = false;
      },

      onDeleteOldRequestsConfirm() {
        console.log("onDeleteOldRequestsConfirm activated.");
        let vm = this;

        //delete requests
        let url = apiMgr.getRequestsUrl().replace("requests", "deleterequests") + vm.requestsToDelete;

        axios.get(url)
          .then(res => {
              console.log("onDeleteOldRequests return status: " + res.status);

              vm.canShowRequestResult = true;

              if(res.data.deletedCount == 0){
                vm.requestResultMessage = "No requests matched for deletion."
              } else {
                vm.requestResultMessage = `${res.data.deletedCount} requests successfully deleted.`;
              }

              $('#deleteModal').modal('hide');
              this.$store.state.isModalBeingDisplayed = false;
              vm.$forceUpdate();
          })
          .catch((err) => {
              vm.hasFailure = true;
              vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
          })
        
      },

      clearSearchUI() {
        //clear all search UI to be blank
        var inputs = $("input");
        inputs.each(function(){
          let inputType = this.type;
          if (inputType == "text" || inputType == "number"){
            this.value = "";
          } else if (inputType == "checkbox"){
            this.checked = false;
          }
        });

        var selects = $('select');
        selects.each(function(){
          if (this.id != null && this.id != "") {
            if (this.id.indexOf("default") > -1) {
              //if there is a default, reselect it
              this.value = this.id.replace("default-", "");
            } else {
              this.value = "";
            }
          } else {
            this.value = "";
          }
        });

        //special default for this view
        $("#inputOlderThan")[0].value = this.deleteOlderThanNumDays;

      },


      checkIfAccessCodeExists(isAdminCode, inputCode){
        let vm = this;

        if (inputCode != "" && inputCode != null){

          let url = apiMgr.getAccessCodesUrl().replace("accessCodes", `isAccessCodeExist/${inputCode}`);

          if(isAdminCode){
            url += `&isForAdmin=true`;
          }

          axios.get(url)
            .then(res => {
              console.log("checkIfAccessCodeExists return status: " + res.status);                
              return res.data.exist;
            })
            .catch((err) => {
              return false;                       
            })

        } else {
          vm.hasFailure = true;
          vm.failureMessage = "Please fill out field.";  
          return null;
        }

        
      },


      onAccessCodeDelete() {
        console.log("onAccessCodeDelete activated.");
        let vm = this;

        vm.hasFailure = false;
        vm.isAccessCodeDeleteFailure = false;
        vm.isAccessCodeCreateFailure = false;
        vm.canShowAccessCodeResultCreate = false;
        vm.canShowAccessCodeResultDelete = false;

        let inputCode = $("#deleteAccessCode")[0].value;
        let isAdminCode = $("#accessCodeDeleteIsAdmin")[0].checked;




        var doesAccessCodeExist = new Promise(function(resolve, reject) {
          if (inputCode != "" && inputCode != null){

            let url = apiMgr.getAccessCodesUrl().replace("accessCodes", `isAccessCodeExist/${inputCode}`);

            if(isAdminCode){
              url += `&isForAdmin=true`;
            }

            axios.get(url)
              .then(res => {
                console.log("checkIfAccessCodeExists return status: " + res.status);                
                resolve(res.data.exist);
              })
              .catch((err) => {
                resolve(false);                       
              })

          } else {
            vm.hasFailure = true;
            vm.isAccessCodeDeleteFailure = true;
            vm.failureMessage = "Please fill out field.";  
            resolve(null);
          }
        });

        doesAccessCodeExist.then(function(value) {
          if (value){

            let url = apiMgr.getAccessCodesUrl().replace("accessCodes", `isAccessCodeExist/${inputCode}`);
            if (isAdminCode){
              url += `&isForAdmin=${isAdminCode}`;
            }

            axios.delete(url)
              .then(res => {
                console.log("deleteAccessCode return status: " + res.status);                
                
                vm.hasFailure = false;

                vm.getUserAccessCodes();

                vm.canShowAccessCodeResultDelete = true;
                vm.accessCodeResultMessageDelete = "Code successfully deleted.";

              })
              .catch((err) => {
                vm.hasFailure = true;
                vm.isAccessCodeDeleteFailure = true;
                vm.failureMessage = `An error has occured. ${err}`;                 
              })
            
          } else if (value === false){
            vm.hasFailure = true;
            vm.isAccessCodeDeleteFailure = true;
            if(isAdminCode){
              vm.failureMessage = "Error: Admin Code not found in database.";
            } else {
              vm.failureMessage = "Error: User Code not found in database.";
            }
          }
        });

      },

      onAccessCodeCreate() {
        console.log("onAccessCodeCreate activated.");
        let vm = this;

        vm.hasFailure = false;
        vm.isAccessCodeCreateFailure = false;
        vm.isAccessCodeDeleteFailure = false;
        vm.canShowAccessCodeResultCreate = false;
        vm.canShowAccessCodeResultDelete = false;

        let inputCode = $("#createNewAccessCode")[0].value;
        let isAdminCode = $("#accessCodeCreateIsAdmin")[0].checked;

        var doesAccessCodeExist = new Promise(function(resolve, reject) {
          if (inputCode != "" && inputCode != null){

            let url = apiMgr.getAccessCodesUrl().replace("accessCodes", `isAccessCodeExist/${inputCode}`);

            if(isAdminCode){
              url += `&isForAdmin=true`;
            }

            axios.get(url)
              .then(res => {
                console.log("checkIfAccessCodeExists return status: " + res.status);                
                resolve(res.data.exist);
              })
              .catch((err) => {
                resolve(false);                       
              })

          } else {
            vm.hasFailure = true;
            vm.isAccessCodeCreateFailure = true;
            vm.failureMessage = "Please fill out field.";  
            resolve(null);
          }
        });

        doesAccessCodeExist.then(function(value) {
          if (value === false){

            let url = apiMgr.getAccessCodesUrl();

            let newAccessCode = {
              code: inputCode,
            };
            if (isAdminCode){
              newAccessCode.isForAdmin = isAdminCode;
            }

            axios.post(url, newAccessCode)
              .then(res => {
                console.log("postAccessCode return status: " + res.status);                
                
                vm.hasFailure = false;

                vm.getUserAccessCodes();

                vm.canShowAccessCodeResultCreate = true;
                vm.accessCodeResultMessageCreate = "Code successfully created.";
              })
              .catch((err) => {
                vm.hasFailure = true;
                vm.isAccessCodeCreateFailure = true;
                vm.failureMessage = `An error has occured. ${err}`;

              })
            
          } else if (value === true){
            vm.hasFailure = true;
            vm.isAccessCodeCreateFailure = true;
            if(isAdminCode){
              vm.failureMessage = "Error: Admin Code already exists.";
            } else {
              vm.failureMessage = "Error: User Code already exists.";
            }
          }
        });

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