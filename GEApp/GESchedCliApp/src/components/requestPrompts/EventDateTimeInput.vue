<template>

  <div :id="ctrlContainerId">  
    <label :for="ctrlId">{{ promptLabel }}</label>&nbsp;&nbsp;<span v-if="inAdminMode" class="badge badge-warning" :adminCommentCtrlId="adminCommentCtrlId" @click.prevent="onAddAdminComment"><span class="far fa-comment-dots"></span></span>
    <br>
    <label>Start</label>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <i class="input-group-text fa fa-calendar" aria-hidden="true"></i>
      </div>
      <input :id="ctrlId" :screenNum="screenNum" type="date" isDateTime="true" :min="currentDate" class="start-date is-request-data form-control form-control-sm" aria-describedby="basic-addon3">
      <div class="input-group-append">
        <select :id="ctrlId" :screenNum="screenNum" class="custom-select form-control form-control-sm">
          <option selected class="start-time is-request-data" :screenNum="screenNum" :id="ctrlId"></option>
          <option :class="['H-0', 'start-time', 'is-request-data']" isDateTime="true" :screenNum="screenNum" :id="ctrlId" time="0">12:00 AM</option>
          <option :class="[`H-${numberAM}`, 'start-time', 'is-request-data']" isDateTime="true" :screenNum="screenNum" :id="ctrlId" v-for="numberAM in numHours" :key="`A-${numberAM}`" :time="numberAM">
            {{numberAM}}:00 AM
          </option>
          <option :class="['H-12', 'start-time', 'is-request-data']" isDateTime="true" :screenNum="screenNum" :id="ctrlId" time="12">12:00 PM</option>
          <option :class="[`H-${numberPM+12}`, 'start-time', 'is-request-data']" isDateTime="true" :screenNum="screenNum" :id="ctrlId" v-for="numberPM in numHours" :key="`B-${numberPM}`" :time="numberPM+12">
            {{numberPM}}:00 PM
          </option>
      </select>
      </div>
    </div>
    <label>End</label>
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <i class="input-group-text fa fa-calendar" aria-hidden="true"></i>
      </div>
      <input :id="ctrlId" :screenNum="screenNum" type="date" isDateTime="true" :min="currentDate" class="end-date is-request-data form-control form-control-sm" aria-describedby="basic-addon3">
      <div class="input-group-append">
        <select :id="ctrlId" :screenNum="screenNum" isDateTime="true" class="custom-select end-time is-request-data form-control form-control-sm">
          <option class="hoursInput H-0" value="0">12:00 AM</option>
          <option :class="['hoursInput', `H-${numberAM}`]" v-for="numberAM in numHours" :key="`A-${numberAM}`" :value="numberAM">
            {{numberAM}}:00 AM
          </option>
          <option class="hoursInput H-12" value="12" selected>12:00 PM</option>
          <option :class="['hoursInput', `H-${numberPM+12}`]" v-for="numberPM in numHours" :key="`B-${numberPM}`" :value="numberPM+12">
            {{numberPM}}:00 PM
          </option>
        </select>
      </div>
    </div>
    <p :id="dataInvalidMsgId" style="display:none;" class="text-danger">Invalid input.</p>
    <p :id="dataRequiredMsgId" style="display:none;" class="text-danger">This field is required.</p>
    <textarea :id="adminCommentCtrlId" :screenNum="screenNum" style="display:none; border: 2px solid orange;" placeholder="Add Comment" class="is-admin-comment form-control form-control-sm"></textarea>
  </div>

</template>

<script>
export default {
  props: ['screenNum', 'ctrlId', 'promptLabel', 'dataInvalidMsgId', 'dataRequiredMsgId', 'inAdminMode'],

  data (){
    return {
      numHours: 11,
    }
  },

  computed: {
    adminCommentCtrlId() {
      return this.ctrlId + "AdminComment";
    },
    ctrlContainerId() {
      return this.ctrlId + "Container";
    },
    currentDate(){
      let currDate = new Date().toLocaleString();
      currDate = currDate.substring(0, currDate.indexOf(',')).replace(/\//g, '-');
      return currDate;
    }
  },

  methods: {
    onAddAdminComment(evt) {     
      var adminCtrl = $("#" +$(this).attr('adminCommentCtrlId'));
      if (!adminCtrl.is(':visible')) {
          adminCtrl.show();
      } else {
          adminCtrl.hide();
      }
    }
  }
}
</script>