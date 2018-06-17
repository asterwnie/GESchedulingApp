<template>
    <div class="container-fluid">
      <div class="row">
        <div class="col col-sm-1 col-md-2 col-lg-4"></div>
        <div class="col col-12 col-sm-10 col-md-8 col-lg-4" style="width:100%;">

          <form class="needs-validation" novalidate>

            <div class="mb-3" v-for="(requestPrompt, index) in requestPrompts" :key="index">

              <template v-if="requestPrompt.inputType.ctrlType == 'text'"> 
                <text-input 
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label"
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></text-input>
              </template>

              <template v-if="requestPrompt.inputType.ctrlType == 'textArea'"> 
                <text-area-input 
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label"
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></text-area-input>
              </template>

              <template v-if="requestPrompt.inputType.ctrlType == 'email'"> 
                <email-input 
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></email-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'custom' && requestPrompt.inputType.customCtrlId == 'locationOfEventCtrl')"> 
                <meeting-location-input 
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></meeting-location-input>
              </template>

              <template v-if="(requestPrompt.inputType.ctrlType == 'custom' && requestPrompt.inputType.customCtrlId == 'eventDateTimeCtrl')"> 
                <meeting-date-time-input 
                  :screenNum="currentScreenNum"
                  :ctrlId="requestPrompt.inputType.ctrlDataId" 
                  :promptLabel="requestPrompt.label" 
                  :dataRequiredMsgId="'REQUIRED-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"
                  :dataInvalidMsgId="'INVALID-MSG-FOR-'+requestPrompt.inputType.ctrlDataId"></meeting-date-time-input>
              </template>

            </div>
            <br>

          </form>
        </div>

      </div>
      <div class="footerBar fixed-bottom d-flex justify-content-between">
        <button type="button" class="btn btn-primary btn-sm" @click.prevent="onContinue">Continue Request ></button>
      </div>
    </div>
</template>

<script>
import { validateRequest, bindUiValuesFromRequest } from '@/common/requestMgr.js'

import textInputCtrl from '@/components/requestPrompts/TextInput.vue'
import textAreaInputCtrl from '@/components/requestPrompts/TextAreaInput.vue'
import emailInputCtrl from '@/components/requestPrompts/EmailInput.vue'
import meetingLocInputCtrl from '@/components/requestPrompts/MeetingLocationInput.vue'
import meetingDateTimeInputCtrl from '@/components/requestPrompts/MeetingDateTimeInput.vue'

export default {
  data () {
    return {
      title: "New Request",
      currentScreenNum: 1,
      contact: "",
      email: "",
      ctrlId: "ID111" ,
      ctrlPrompt: "Prompt 1:",
      ctrlType: "textArea"
    }
  },

  components: {
    textInput: textInputCtrl,
    textAreaInput: textAreaInputCtrl,
    emailInput: emailInputCtrl,
    meetingLocationInput: meetingLocInputCtrl,
    meetingDateTimeInput: meetingDateTimeInputCtrl
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
    }
  },

  activated() {
    console.log('NewRequest.vue activated.');
    this.$store.state.currentViewTitle = this.title;
    this.$store.state.enableNavBar = true;

    if (this.$store.state.currentRequest == null) {
      this.$store.state.currentRequest = {}
    }

    var vm = this;
    var ctrls = $('.is-request-data');
    $.each(ctrls, function (index, inputCtrl) {
      vm.$store.state.currentRequest['ValidStateFor' + inputCtrl.id] = true;
    });

    this.email = this.$store.state.loginContext.requesterEmail;
    this.contact = this.$store.state.loginContext.requesterName;

  },

  created() {
      console.log('NewRequest.vue created.');

  },

  methods: {
    onContinue (evt) {
      var vm = this;
      var ctrls = $('.is-request-data');
      $.each(ctrls, function (index, inputCtrl) {
        vm.$store.state.currentRequest[inputCtrl.id] = $(inputCtrl).val();
      });

      var assignmentCount =  bindUiValuesFromRequest(vm.$store.state.currentRequest, vm.currentScreenNum);
      
      var hasInvalidData = validateRequest(vm.$store.state.currentRequest, vm.currentScreenNum);
      
      if (!hasInvalidData) {
        this.$router.push('attentionNotes');
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