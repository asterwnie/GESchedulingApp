<template>
    <div class="container-fluid">
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">

          <form class="needs-validation" novalidate>

            <div class="mb-3" v-for="(requestPrompt, index) in requestPrompts" :key="index">

              <template v-if="(requestPrompt.inputType.ctrlType == 'text' && requestPrompt.screenNum == currentScreenNum)"> 
                <text-input 
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label"
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></text-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'textArea' && requestPrompt.screenNum == currentScreenNum)"> 
                <text-area-input 
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label"
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></text-area-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'email' && requestPrompt.screenNum == currentScreenNum)"> 
                <email-input 
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></email-input>
              </template>

              <!--needs validation-->
              <template v-if="(requestPrompt.inputType.ctrlType == 'number' && requestPrompt.screenNum == currentScreenNum)"> 
                <number-input 
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></number-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'custom' && requestPrompt.inputType.customCtrlId == 'locationOfEventCtrl' && requestPrompt.screenNum == currentScreenNum)"> 
                <event-location-input 
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></event-location-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'custom' && requestPrompt.inputType.customCtrlId == 'eventDateTimeCtrl' && requestPrompt.screenNum == currentScreenNum)"> 
                <event-date-time-input 
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

import { validateRequest, bindUiValuesFromRequest } from '@/common/requestMgr.js'

import textInputCtrl from '@/components/requestPrompts/TextInput.vue'
import textAreaInputCtrl from '@/components/requestPrompts/TextAreaInput.vue'
import emailInputCtrl from '@/components/requestPrompts/EmailInput.vue'
import numberInputCtrl from '@/components/requestPrompts/NumberInput.vue'
import eventLocInputCtrl from '@/components/requestPrompts/EventLocationInput.vue'
import eventDateTimeInputCtrl from '@/components/requestPrompts/EventDateTimeInput.vue'

export default {
  data () {
    return {
      currentScreenNum: 1
    }
  },

  components: {
    textInput: textInputCtrl,
    textAreaInput: textAreaInputCtrl,
    emailInput: emailInputCtrl,
    numberInput: numberInputCtrl,
    eventLocationInput: eventLocInputCtrl,
    eventDateTimeInput: eventDateTimeInputCtrl
  },

  computed: {
    title() {
      return this.$store.state.appConfig.aboutViewTitle; 
    },
    viewDescription() {
      return this.$store.state.appConfig.aboutViewDescription; 
    },
    requestPrompts() {
        return this.$store.state.requestPrompts;
    },
    currentUserEmail() {
      return this.$store.state.currentUser.email;
    },
    currentUserName(){
      return this.$store.state.currentUser.name;
    },
    currentUserPhone(){
      return this.$store.state.currentUser.phone;
    }
  },

  activated() {
    console.log('NewRequest.vue activated.');

    if (this.$store.state.appConfig.requestViewTitle == null) {
      this.$router.push('login'); // Config data lost, force back to login to refetch data.
    }

    this.$store.state.currentViewTitle = this.title;
    this.$store.state.enableNavBar = true;

    if (this.$store.state.currentRequest == null) {
      var workingNewRequest = localCacheMgr.getCachedItem("workingNewRequest");
      if (workingNewRequest != undefined && workingNewRequest != null) {
        this.$store.state.currentRequest = workingNewRequest;
      } else {
        this.$store.state.currentRequest = {};
      }
    }

    this.$store.state.currentRequest["eventGEContactPersonEmail"] = this.currentUserEmail;
    this.$store.state.currentRequest["eventGEContactPersonName"] = this.currentUserName;
    this.$store.state.currentRequest["eventGEContactPersonPhone"] = this.currentUserPhone;

    bindUiValuesFromRequest(this.$store.state.currentRequest, this.currentScreenNum);

  },

  created() {
      console.log('NewRequest.vue created.');
  },

  methods: {

    onContinue (evt) {

      var vm = this;
      var storeState = vm.$store.state;

      var ctrls = $('.is-request-data');
      $.each(ctrls, function (index, inputCtrl) {
        //index becomes a property (acts like currentRequest.------)
        //this references the current request
        storeState.currentRequest[inputCtrl.id] = $(inputCtrl).val();
      });
 
      var allValid = validateRequest(storeState.currentRequest, vm.currentScreenNum);
      
      if (allValid) {

        storeState.currentUser.name = vm.$store.state.currentRequest["eventGEContactPersonName"];
        storeState.currentUser.email = vm.$store.state.currentRequest["eventGEContactPersonEmail"];
        storeState.currentUser.phone = vm.$store.state.currentRequest["eventGEContactPersonPhone"];

        try {
          localCacheMgr.cacheItem("workingNewRequest", vm.$store.state.currentRequest);
        } catch (err) {
          console.log("Not able to locally cache the working new request");
        }

        var usersUrl = apiMgr.getUsersUrl();

        axios.put(usersUrl, vm.$store.state.currentUser)
        .then(res => {
        
            console.log("Successfully saved the user's profile: " + res.status);
            if (res.data != null) {
              storeState.currentUser = res.data;
            }
            vm.isSubmitting = false;
            vm.hasFailure = false;
            vm.$router.push('attentionNotes');
        })
        .catch((err) => {
          
            console.log("Not able to save user profile: " + err);
            // But should not stop the UI from going to the next screen.
            vm.isSubmitting = false;
            vm.hasFailure = false;
            vm.$router.push('attentionNotes');
        })
        
      }
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