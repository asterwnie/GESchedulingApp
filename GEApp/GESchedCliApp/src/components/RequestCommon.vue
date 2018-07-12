<template>
    <div class="container-fluid">
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">

          <form class="needs-validation" novalidate>

            <div class="mb-3" v-for="(requestPrompt, index) in requestPrompts" :key="index">

              <template v-if="(requestPrompt.inputType.ctrlType == 'text' && requestPrompt.screenNum == currentScreenNum)"> 
                <text-input 
                  :inAdminMode="inAdminMode"
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label"
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></text-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'textArea' && requestPrompt.screenNum == currentScreenNum)"> 
                <text-area-input 
                  :inAdminMode="inAdminMode"
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label"
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></text-area-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'email' && requestPrompt.screenNum == currentScreenNum)"> 
                <email-input 
                  :inAdminMode="inAdminMode"
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></email-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'number' && requestPrompt.screenNum == currentScreenNum)"> 
                <number-input 
                  :inAdminMode="inAdminMode"
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></number-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'yesNoWithComment' && requestPrompt.screenNum == currentScreenNum)"> 
                <yes-no-with-comment-input 
                  :inAdminMode="inAdminMode"
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></yes-no-with-comment-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'yesNo' && requestPrompt.screenNum == currentScreenNum)"> 
                <yes-no-input 
                  :inAdminMode="inAdminMode"
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></yes-no-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'selectRoom' && requestPrompt.screenNum == currentScreenNum)"> 
                <event-location-input
                  :inAdminMode="inAdminMode" 
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></event-location-input>
              </template>

              <!--WORK NEEDED-->
              <template v-if="(requestPrompt.inputType.ctrlType == 'eventSchedule' && requestPrompt.screenNum == currentScreenNum)"> 
                <event-date-time-input 
                  :inAdminMode="inAdminMode"
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></event-date-time-input>
              </template>

            </div>
            <br>
            <div class="mb-3">
              <button type="button" class="btn btn-primary btn-sm" @click.prevent="onContinue">Continue Request ></button>
            </div>
          </form>
        </div>

      </div>

    </div>
</template>

<script>
import axios from 'axios'
import * as apiMgr from '@/common/apiMgr.js';
import * as localCacheMgr from '@/common/localCacheMgr.js';

//import Room from '@/../GESchedApiApp/server-api/models/roomModel.js'

import { validateRequest, bindUiValuesFromRequest } from '@/common/requestMgr.js'

import textInputCtrl from '@/components/requestPrompts/TextInput.vue'
import textAreaInputCtrl from '@/components/requestPrompts/TextAreaInput.vue'
import emailInputCtrl from '@/components/requestPrompts/EmailInput.vue'
import numberInputCtrl from '@/components/requestPrompts/NumberInput.vue'
import yesNoInputCtrl from '@/components/requestPrompts/YesNoInput.vue'
import yesNoWithCommentInputCtrl from '@/components/requestPrompts/YesNoWithCommentInput.vue'
import eventLocInputCtrl from '@/components/requestPrompts/EventLocationInput.vue'
import eventDateTimeInputCtrl from '@/components/requestPrompts/EventDateTimeInput.vue'

export default {

  props: ['currentScreenNum', 'requestId'],

  components: {
    textInput: textInputCtrl,
    textAreaInput: textAreaInputCtrl,
    emailInput: emailInputCtrl,
    numberInput: numberInputCtrl,
    yesNoInput: yesNoInputCtrl,
    yesNoWithCommentInput: yesNoWithCommentInputCtrl,
    eventLocationInput: eventLocInputCtrl,
    eventDateTimeInput: eventDateTimeInputCtrl
  },

  computed: {

    requestPrompts() {
      return this.$store.state.requestPrompts;
    },

    currentUserEmail() {
      var email = null;
      if (this.$store.state.currentUser != null) {
        email = this.$store.state.currentUser.email;
      }
      return email;
    },

    currentUserName() {
      return this.$store.state.currentUser.name;
    },

    currentUserPhone() {
      return this.$store.state.currentUser.phone;
    },

    isNewRequest() {
      var isNew = true;
      var storeState = this.$store.state;
      if (storeState.currentRequest != null && storeState.currentRequest._id != undefined && storeState.currentRequest._id != null) {
        isNew = false;
      }
      return isNew;
    },

    inAdminMode() {
      if(this.isNewRequest){
        return false;
      }
      return this.$store.state.inAdminMode;
    }

  },

  activated() {
    console.log('RequestCommon.vue activated.');
    var storeState = this.$store.state;

    if (storeState.appConfig.newRequestViewTitle == null) {
      this.$router.push('/login'); // Config data lost, force back to login to refetch data.
      return;
    }

    $('.is-admin-comment').hide();
    if (this.isNewRequest) {
      $('.is-admin-comment').val("");
    }

    if (this.isNewRequest) {
      storeState.currentViewTitle = storeState.appConfig.newRequestViewTitle;
      storeState.currentRequest = null;
    } else {
      storeState.currentViewTitle = storeState.appConfig.editRequestViewTitle;
    }
    storeState.enableNavBar = true;

    if (storeState.currentRequest == null) {
      var workingNewRequest = localCacheMgr.getCachedItem("workingNewRequest");
      if (workingNewRequest != undefined && workingNewRequest != null) {

        storeState.currentRequest = workingNewRequest;
      } else {
        storeState.currentRequest = {};
        storeState.currentRequest.userCanEdit = true;
        storeState.currentRequest.adminCanEdit = false;
      }
    } else {
      var revisingRequest = localCacheMgr.getCachedItem("revisingRequest-" + storeState.currentRequest._id);
      if (revisingRequest != undefined && revisingRequest != null) {
        storeState.currentRequest = revisingRequest;
      }
    }

    this.InitDependsOnControls();


    if (this.currentUserEmail != null) {
      storeState.currentRequest["eventGEContactPersonEmail"] = this.currentUserEmail;
    }

    if (this.currentUserName != null) {
      storeState.currentRequest["eventGEContactPersonName"] = this.currentUserName;
    }

    if (this.currentUserPhone != null) {
      storeState.currentRequest["eventGEContactPersonPhone"] = this.currentUserPhone;
    }

    bindUiValuesFromRequest(storeState.currentRequest, this.currentScreenNum, this.inAdminMode);
  },

  deactivated() {
      console.log('RequestCommon.vue deactivated.');

      var vm = this;
      var storeState = vm.$store.state;

       this.bindCtrlValuesToRequestProperties();
      
      try {
        if (this.isNewRequest) {
          localCacheMgr.cacheItem("workingNewRequest", storeState.currentRequest);
        } else {
          localCacheMgr.cacheItem("revisingRequest-" + storeState.currentRequest._id, storeState.currentRequest);
        }
      } catch (err) {
        console.log("Not able to locally cache the working request");
      }

      if (vm.currentScreenNum == 1 && storeState.currentUser != null) {
          var usersUrl = apiMgr.getUsersUrl();

          storeState.currentUser.email = storeState.currentRequest.eventGEContactPersonEmail;
          storeState.currentUser.name = storeState.currentRequest.eventGEContactPersonName;
          storeState.currentUser.phone = storeState.currentRequest.eventGEContactPersonPhone;

          axios.put(usersUrl, storeState.currentUser)
            .then(res => {           
                console.log("Successfully saved the user's profile: " + res.status);
                if (res.data != null) {
                  storeState.currentUser = res.data;
                }               
            })
            .catch((err) => {             
                console.log("Not able to save user profile: " + err);
                // But should not stop the UI from going to the next screen.
                vm.isSubmitting = false;
                vm.hasFailure = false;
                vm.$router.push('/attentionNotes');

                // if (!vm.isNewRequest) {
                //   vm.$router.push('/requestsummary');
                // } else {
                //   vm.$router.push('/attentionNotes');
                // }
            })
      }
  },

  methods: {

    onContinue (evt) {

      var vm = this;
      var storeState = vm.$store.state;

      this.bindCtrlValuesToRequestProperties();
 
      var allValid = validateRequest(storeState.currentRequest, vm.currentScreenNum);
      
      if (allValid) {

        // if (storeState.currentUser != null) {
        //   storeState.currentUser.name = vm.$store.state.currentRequest["eventGEContactPersonName"];
        //   storeState.currentUser.email = vm.$store.state.currentRequest["eventGEContactPersonEmail"];
        //   storeState.currentUser.phone = vm.$store.state.currentRequest["eventGEContactPersonPhone"];
        // }

        var nextScreenNum = vm.currentScreenNum + 1;
        if (nextScreenNum <= vm.$store.state.numOfRequestScreens) {
          vm.$router.push('/request/' + nextScreenNum);          
        } else {

          vm.$router.push('/attentionNotes');
          // if (!vm.isNewRequest) {
          //   vm.$router.push('/requestsummary');
          // } else {
          //   vm.$router.push('/attentionNotes');
          // }
        }
        
      }
    },


    bindCtrlValuesToRequestProperties() {

      var storeState = this.$store.state; 
      var vm = this;

      let foundStartDate = null;
      let foundEndDate = null;

      var ctrls = $('.is-request-data');
      $.each(ctrls, function (index, inputCtrl) {

        //index becomes a property (obj1['prop1'] acts like obj1.prop1)
        
        if ($(inputCtrl).attr('screenNum') == vm.currentScreenNum) {

          var ctrlVal = $(inputCtrl).val();
          if (ctrlVal != null && typeof ctrlVal == "string") {
            ctrlVal = ctrlVal.trim();
          }

          if ($(inputCtrl).attr('isBoolean') == "true") {
              let tempVal = $(inputCtrl);
              storeState.currentRequest[inputCtrl.id] = tempVal[0].checked;  
          } else if ($(inputCtrl).attr('isNumeric') == "true") {
            try {
              if (ctrlVal == null || ctrlVal == "") {
                try {
                  delete storeState.currentRequest[inputCtrl.id];
                } catch (err) {}
              } else {
                storeState.currentRequest[inputCtrl.id] = parseInt(ctrlVal);               
              }
            } catch (err) {
              console.log(`Unable to assign ${ctrlVal} to ${inputCtrl.id}`);
            }
          } else if ($(inputCtrl).attr('isRoom') == "true") {
              // ToDo: Need to track and store the select room from Find Room
              // ToDo: need to assign the selected room
              if(storeState.selectedRoom != null && storeState.selectedRoom != undefined){
                storeState.currentRequest[inputCtrl.id] = storeState.selectedRoom;
              }
          } else if ($(inputCtrl).attr('isDateTime') == "true") {
              if($(inputCtrl).val() != ""){
                if($(inputCtrl).hasClass("start-date")){
                  foundStartDate = $(inputCtrl).val()
                } else if ($(inputCtrl).hasClass("end-date")) {
                  foundEndDate = $(inputCtrl).val();
                }
                storeState.currentRequest[inputCtrl.id] = {
                  startDate: foundStartDate,
                  endDate: foundEndDate,
                } 
              }

          } else {
            storeState.currentRequest[inputCtrl.id] = ctrlVal;
          } 

        }        
      });

      if (this.inAdminMode) {
        var adminCommentctrls = $('.is-admin-comment');
        $.each(adminCommentctrls, function (index, inputCtrl) {

          if ($(inputCtrl).attr('screenNum') == vm.currentScreenNum) {
            var ctrlVal = $(inputCtrl).val();
            if (ctrlVal != null && typeof ctrlVal == "string") {
              ctrlVal = ctrlVal.trim();
            }
            if (ctrlVal == null || ctrlVal == "") {
              try {
                delete storeState.currentRequest[inputCtrl.id];
              } catch (err) {}
            } else {
              storeState.currentRequest[inputCtrl.id] = ctrlVal;
            }
          }

        });
      }
    },


    InitDependsOnControls() {

      var vm = this;
      var storeState = this.$store.state; 

      $.each(this.requestPrompts, function (index, prompt) {
        var dependsOn = prompt.inputType.dependsOn;
        if (prompt.screenNum == vm.currentScreenNum && dependsOn != undefined && dependsOn != null) {
          if (storeState.currentRequest[dependsOn] == true) {
            $("#"+prompt.inputType.ctrlDataId+"Container").show();
          } else {
            $("#"+prompt.inputType.ctrlDataId+"Container").hide();
            if (storeState.currentRequest[prompt.inputType.ctrlDataId] != undefined) {
              delete storeState.currentRequest[prompt.inputType.ctrlDataId];
            }
          }
          $("#"+dependsOn).attr("dependentCtrlId", prompt.inputType.ctrlDataId);
        }
      });

      var ctrls = $('[dependentCtrlId]');
      $.each(ctrls, function (index, ctrl) {
        $(ctrl).change(function() { 
            var isChecked = $(this).is(':checked')
            var dependentCtrlId = $(this).attr("dependentCtrlId");
            var ctrl = $("#"+dependentCtrlId);
            var ctrlContainer = $("#"+dependentCtrlId+"Container");
            if (isChecked) {          
              ctrlContainer.show();
            } else {
              ctrlContainer.hide();
              var checkedAttr = ctrl.prop('checked');
              if (checkedAttr != undefined && checkedAttr != "") {
                ctrl.prop('checked', false);
              } else {
                ctrl.val("");
              }
              if (storeState.currentRequest[dependentCtrlId] != undefined) {
                delete storeState.currentRequest[dependentCtrlId];
              }
            }
        });
      });
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
.container{
  flex-direction: column;
  display: flex;
}
</style>