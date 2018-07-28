<template>

  <div :id="ctrlContainerId">  
    <label :for="ctrlId">{{ promptLabel }}</label>&nbsp;<i v-if="isRequired" class="required-star">*</i>&nbsp;&nbsp;<span v-if="inAdminMode" class="badge badge-warning" :adminCommentCtrlId="adminCommentCtrlId" @click.prevent="onAddAdminComment"><span class="far fa-comment-dots"></span></span><br>
    <label class="switch">
    <input type="checkbox" isBoolean="true" :id="ctrlId" :dependentCtrlId="additionalCommentCtrlId" :screenNum="screenNum" class="is-request-data form-control form-control-sm">
    <span class="slider round"></span>
    </label>
    <div :id="additionalCommentCtrlContainerId" style="display:none;" :screenNum="screenNum" class="is-additional-comment"> 
    <input type="text" :id="additionalCommentCtrlId" :screenNum="screenNum" placeholder="Additional Specification" class="is-request-data form-control form-control-sm">
    </div>
    <p :id="dataInvalidMsgId" style="display:none;" class="text-danger">Invalid input.</p>
    <p :id="dataRequiredMsgId" style="display:none;" class="text-danger">This field is required.</p>
    <textarea :id="adminCommentCtrlId" :screenNum="screenNum" style="display:none; border: 2px solid orange;" placeholder="Add Comment" class="is-admin-comment form-control form-control-sm"></textarea>
  </div>

</template>

<script>
export default {
  props: ['screenNum', 'ctrlId', 'promptLabel', 'dataInvalidMsgId', 'dataRequiredMsgId', 'inAdminMode', 'isRequired'],

  computed: {
    adminCommentCtrlId() {
      return this.ctrlId + "AdminComment";
    },
    additionalCommentCtrlId() {
      return this.ctrlId + "AdditionalComment";
    },
    additionalCommentCtrlContainerId() {
      return this.ctrlId + "AdditionalCommentContainer";
    },
    ctrlContainerId() {
      return this.ctrlId + "Container";
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.required-star {
  color: red
}
</style>
