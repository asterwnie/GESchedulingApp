<template>

  <div :id="ctrlContainerId">
    <button type="button" class="btn btn-secondary btn-sm" v-if="!inAdminMode" @click.prevent="$router.push('/findroom')">Find</button>&nbsp;<label :for="ctrlId">{{ promptLabel }}</label>&nbsp;&nbsp;<span v-if="inAdminMode" class="badge badge-warning" :adminCommentCtrlId="adminCommentCtrlId" @click.prevent="onAddAdminComment"><span class="far fa-comment-dots"></span></span>
    <textarea :id="ctrlId" :screenNum="screenNum" isRoom="true" class="is-request-data form-control form-control-sm"></textarea>
    <p :id="dataInvalidMsgId" style="display:none;" class="input-required-msg text-danger">Invalid input.</p>
    <p :id="dataRequiredMsgId" style="display:none;" class="input-invalid-msg text-danger">This field is required.</p>
    <textarea :id="adminCommentCtrlId" :screenNum="screenNum" style="display:none; border: 2px solid orange;" placeholder="Add Comment" class="is-admin-comment form-control form-control-sm"></textarea>
  </div>

</template>

<script>
import { addAdminComment } from '@/common/requestMgr.js'

export default {
    props: ['screenNum', 'ctrlId', 'promptLabel', 'dataInvalidMsgId', 'dataRequiredMsgId', 'inAdminMode'],
    
    computed: {
      adminCommentCtrlId() {
        return this.ctrlId + "AdminComment";
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
      }
    }
  }
}
</script>