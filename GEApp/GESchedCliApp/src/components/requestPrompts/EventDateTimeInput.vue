<template>

  <div :id="ctrlContainerId">  
    <label :for="ctrlId">{{ promptLabel }}</label>&nbsp;&nbsp;<span v-if="inAdminMode" class="badge badge-warning" :adminCommentCtrlId="adminCommentCtrlId" @click.prevent="onAddAdminComment"><span class="far fa-comment-dots"></span></span>
    <br>
    <div :id="ctrlId" :screenNum="screenNum" isEventDateTime="true" class="is-request-data">
     
      <div class="input-group mb-3">
         <label>Start:&nbsp;</label>
        <input :id="startDateCtrlId" :screenNum="screenNum" type="date" :min="currentDate" v-on:change="onStartDateChanged" class="is-request-data-part form-control form-control-sm" aria-describedby="basic-addon3">
        <div class="input-group-append">
          <select :id="startTimeCtrlId" :screenNum="screenNum" class="is-request-data-part custom-select form-control form-control-sm">
            <option v-for="(timeOption, index) in timeOptions" :key="index" 
              :value="timeOption.time">
              {{timeOption.label}}
            </option>
          </select>
        </div>
      </div>
      
      <div class="input-group mb-3">
        <label>End:&nbsp;&nbsp;</label>
        <input :id="endDateCtrlId" :screenNum="screenNum" type="date" :min="currentDate" class="is-request-data-part form-control form-control-sm" aria-describedby="basic-addon3">
        <div class="input-group-append">
          <select :id="endTimeCtrlId" :screenNum="screenNum" class="is-request-data-part custom-select form-control form-control-sm">
            <option v-for="(timeOption, index) in timeOptions" :key="index" 
              :value="timeOption.time">
              {{timeOption.label}}
            </option>
          </select>
        </div>
      </div>
    </div>
    <p :id="dataInvalidMsgId" style="display:none;" class="text-danger">Invalid input.</p>
    <p :id="dataRequiredMsgId" style="display:none;" class="text-danger">This field is required.</p>
    <textarea :id="adminCommentCtrlId" :screenNum="screenNum" style="display:none; border: 2px solid orange;" placeholder="Add Comment" class="is-admin-comment form-control form-control-sm"></textarea>
  </div>

</template>

<script>
import * as util from '@/common/util.js';

export default {
  props: ['screenNum', 'ctrlId', 'promptLabel', 'dataInvalidMsgId', 'dataRequiredMsgId', 'inAdminMode'],

  data (){
    return {
      timeOptions: null
    }
  },

  activated() {
 
    util.logDebugMsg('EventDateTimeInput.vue activated.');

    if (this.timeOptions == null) {

      util.logDebugMsg('Creating time options.');

      this.timeOptions = [];
      var curLabel = null;
      var curTime = null;
      var hrStr  = "00";
      var minStr = "00";
      var secStr = "00";
      
      this.timeOptions.push({ time: "00:00:00", label: '12:00 AM' });
      this.timeOptions.push({ time: "00:30:00", label: '12:30 AM' });

      var suffix = " AM";
      for (var i = 1; i <= 11; i++) {
        if (i < 10) { hrStr = "0" + i.toString(); } else { hrStr = i.toString(); }
        minStr = "00";
        curTime = hrStr + ":" + minStr + ":" + secStr;
        curLabel = i + ":" + minStr + suffix;
        this.timeOptions.push({ time: curTime, label: curLabel });
        
        if (i < 10) { hrStr = "0" + i.toString(); } else { hrStr = i.toString(); }
        minStr = "30";
        curTime = hrStr + ":" + minStr + ":" + secStr;
        curLabel = i + ":" + minStr + suffix;
        this.timeOptions.push({ time: curTime, label: curLabel });
      }

      this.timeOptions.push({ time: "12:00:00", label: '12:00 PM' });
      this.timeOptions.push({ time: "12:30:00", label: '12:30 PM' });

      suffix = " PM";
      for (var i = 1; i <= 11; i++) {
        hrStr = (i+12).toString();
        minStr = "00";
        curTime = hrStr + ":" + minStr + ":" + secStr;
        curLabel = i + ":" + minStr + suffix;
        this.timeOptions.push({ time: curTime, label: curLabel });
        
        hrStr = (i+12).toString();
        minStr = "30";
        curTime = hrStr + ":" + minStr + ":" + secStr;
        curLabel = i + ":" + minStr + suffix;
        this.timeOptions.push({ time: curTime, label: curLabel });
      }

    }
  },

  computed: {

    isNewRequest() {
      var isNew = true;
      var storeState = this.$store.state;
      if (storeState.currentRequest != null && storeState.currentRequest._id != undefined && storeState.currentRequest._id != null) {
        isNew = false;
      }
      return isNew;
    },

    startDateCtrlId() {
      return this.ctrlId + "StartDate";
    },

    startTimeCtrlId() {
      return this.ctrlId + "StartTime";
    },

    endDateCtrlId() {
      return this.ctrlId + "EndDate";
    },

    endTimeCtrlId() {
      return this.ctrlId + "EndTime";
    },

    adminCommentCtrlId() {
      return this.ctrlId + "AdminComment";
    },

    ctrlContainerId() {
      return this.ctrlId + "Container";
    },

    currentDate(){
      let nowDateTime = new Date();
      var timeParts = util.getDateTimeParts(nowDateTime);
      var fullDateUsingDashes = timeParts.fullDateUsingDashes;

      return fullDateUsingDashes;
    }
  },

  methods: {
    onAddAdminComment(evt) {     
      var adminCtrl = $("#" +$(this).attr('adminCommentCtrlId'));
      if (!adminCtrl.is(':visible')) {
          adminCtrl.show();
      } else {
          adminCtrl.hide();
          adminCtrl.val(null);
      }
    },

    onStartDateChanged: function(evt) {
      var newStartVal = $(evt.srcElement).val();
      var endDateCtrlId = evt.srcElement.id.replace("StartDate", "EndDate");
      var endDateVal = $('#' + endDateCtrlId).val();
      if (newStartVal != null && newStartVal != "" && (endDateVal == null || endDateVal == "")) {
        $('#' + endDateCtrlId).val(newStartVal);
      }
    }
  }
}
</script>