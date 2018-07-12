<template>

  <div :id="ctrlContainerId">  
    <label :for="ctrlId">{{ promptLabel }}</label>&nbsp;&nbsp;<span v-if="inAdminMode" class="badge badge-warning" :adminCommentCtrlId="adminCommentCtrlId" @click.prevent="onAddAdminComment"><span class="far fa-comment-dots"></span></span>
    <div class="input-group mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon3">Start</span>
        </div>
        <input :id="ctrlId" :screenNum="screenNum" type="datetime-local" isDateTime="true" :min="currentDate" class="start-date is-request-data form-control form-control-sm" aria-describedby="basic-addon3">
        <div class="input-group-append">
            <span class="input-group-text" id="basic-addon3"><i class="fa fa-calendar"></i></span>
        </div> 
    </div>
    <div class="input-group mb-3">
        <div class="input-group-prepend">
            <span class="input-group-text" id="basic-addon3">End</span>
        </div>
        <input :id="ctrlId" :screenNum="screenNum" type="datetime-local" isDateTime="true" :min="currentDate" class="end-date is-request-data form-control form-control-sm" aria-describedby="basic-addon3">
        <div class="input-group-append">
            <span class="input-group-text" id="basic-addon3"><i class="fa fa-calendar"></i></span>
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