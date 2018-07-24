<template>  

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
              <div class="bg-info text-light card-header" id="flushOldRequestsHeader" cursor="pointer" data-toggle="collapse" data-target="#flushOldRequestsCollapse" aria-expanded="false" aria-controls="flushOldRequestsCollapse">
                Flush Old Requests&nbsp;&nbsp;<i class="fa fa-caret-right" aria-hidden="true"></i>
              </div>
            </div>

            <div class="card">
              <div @click.prevent="onExpandOption" class="bg-info text-light card-header" id="updateAppDataHeader" cursor="pointer" data-toggle="collapse" data-target="#updateAppDataCollapse" aria-expanded="false" aria-controls="updateAppDataCollapse">
                Update App Data&nbsp;&nbsp;<i class="fa fa-caret-right" aria-hidden="true"></i>
              </div>
            </div>

            <div class="card">
              <div @click.prevent="onExpandOption" class="bg-info text-light card-header" id="manageAccessCodesHeader" cursor="pointer" data-toggle="collapse" data-target="#manageAccessCodesCollapse" aria-expanded="false" aria-controls="manageAccessCodesCollapse">
                Manage Access Codes&nbsp;&nbsp;<i class="fa fa-caret-right" aria-hidden="true"></i>
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
                  <strong>Warning</strong> This will permanently delete old requests. (Archiving will be implemented at a later time)
                </div>
                <p>Flushing old requests will delete all requests older than {{deleteOlderThanNumDays}} days (this number can be configured in the app config). Note that this action cannot be reversed.</p>

                <div class="card">
                  <div class="card-header bg-danger text-light" id="filterMenu">
                        Delete By
                  </div>
                  <div id="filterMenu" class="card-body" style="padding:10px; width:100%;">

                    <div id="inputEventName" class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-sm">Event Name</span>
                        </div>
                        <input type="text" class="form-control" aria-label="Small" placeholder="Optional" aria-describedby="inputGroup-sizing-sm">
                    </div>

                    <div id="inputRequesterEmail" class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-sm">Requester Email</span>
                        </div>
                        <input type="text" class="form-control" aria-label="Small" placeholder="Optional" aria-describedby="inputGroup-sizing-sm">
                    </div>

                    <div id="inputStatus" class="input-group input-group-sm mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="inputGroup-sizing-sm">Status</span>
                        </div>
                        <select class="custom-select" id="sizeTypeGroupSelect">
                            <option selected></option>
                            <option v-bind:id="statusLabel" v-bind:value='statusLabel' v-for="(statusLabel, index) in statusLabels" :key="index">
                                {{ statusLabel }}
                            </option>
                        </select>
                    </div>
                    
                    <br>
                    <button type="button" class="float-right btn btn-sm btn-danger" @click.prevent="onDeleteOldRequests">Delete Old Requests</button>
                    <button type="button" class="btn btn-sm btn-secondary" @click.prevent="resetFilterView">Reset</button>
                    
                  </div>
              </div>

              <div class="float-right">
                <p class="text-success" :hidden="hasFailure || !canShowRequestResult">{{requestResultMessage}}</p>
                <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>
              </div>

              </div>
            </div>

            <div id="updateAppDataCollapse" class="collapse" aria-labelledby="updateAppData" data-parent="#menuAccordian">
              <div class="card-body">

                <div class="alert alert-warning" role="alert">
                  <strong>Notice</strong> This section is incomplete.
                </div>

                <p>Instructions on how to update data will be posted here. This is a work in progress.</p>

              </div>
            </div>

            <div id="manageAccessCodesCollapse" class="collapse" aria-labelledby="manageAccessCodes" data-parent="#menuAccordian">
              <div class="card-body">

                <div class="alert alert-danger" role="alert">
                  Note that this does NOT update the access code text file. Work in progress.
                </div>
                
                <div class="form-group">
                  <label for="createNewAccessCode">Create New Access Code</label>
                  <input type="email" class="form-control" id="createNewAccessCode" aria-describedby="newAccessCode" placeholder="abc987">
                </div>
                <button type="button" class="float-right btn btn-sm btn-primary" @click.prevent="onAccessCodeCreate">Create</button>

                <p class="text-success" :hidden="hasFailure || !canShowAccessCodeResultCreate">{{accessCodeResultMessageCreate}}</p>
                <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>


                <div style="height:35px"></div>
                <hr>
                <div style="height:10px"></div>

                <div class="form-group">
                  <label for="deleteAccessCode">Delete Access Code</label>
                  <input type="email" class="form-control" id="deleteAccessCode" aria-describedby="deleteAccessCode" placeholder="zyx123">
                  <small id="deleteAccessCodeHelp" class="form-text text-muted">If the code matches one in the database, it will be deleted.</small>
                </div>
                <button type="button" class="float-right btn btn-sm btn-danger" @click.prevent="onAccessCodeDelete">Delete</button>

                <p class="text-success" :hidden="hasFailure || !canShowAccessCodeResultDelete">{{accessCodeResultMessageDelete}}</p>
                <p class="text-danger" :hidden="!hasFailure">{{failureMessage}}</p>


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

        canShowRequestResult: false,
        requestResultMessage: "Button does not work right now.",

        canShowAccessCodeResultCreate: false,
        accessCodeResultMessageCreate: "",
        canShowAccessCodeResultDelete: false,
        accessCodeResultMessageDelete: "",

        previewRequestNum: 3,
        currentHeader: "Select a maintenance option.",

        statusLabels: [
            "underReview",
            "rejected",
            "approved",
        ],
    }
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

        this.$store.state.currentViewTitle = this.title;
        this.$store.state.enableNavBar = true;

        

    },

    deactivated() {

    },

    methods: {

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

      onDeleteOldRequests() {
        console.log("onDeleteOldRequests activated.");
        let vm = this;

        vm.canShowResult = true;
        
      },

      onAccessCodeDelete() {
        console.log("onAccessCodeDelete activated.");
        let vm = this;

        vm.canShowAccessCodeResultDelete = true;
        vm.accessCodeResultMessageDelete = "This button does not work yet.";


      },

      onAccessCodeCreate() {
        console.log("onAccessCodeCreate activated.");
        let vm = this;

        vm.canShowAccessCodeResultCreate = true;
        vm.accessCodeResultMessageCreate = "This button does not work yet.";

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