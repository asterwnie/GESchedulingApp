<template>

  <div>  
    <label :for="ctrlId">{{ promptLabel }}</label>&nbsp;&nbsp;<span v-if="inAdminMode" class="badge badge-warning" :adminCommentCtrlId="adminCommentCtrlId" @click.prevent="addAdminComment"><span class="far fa-comment-dots"></span></span>
    <input type="text" :id="ctrlId" :screenNum="screenNum" class="is-request-data form-control form-control-sm">
    <p :id="dataInvalidMsgId" style="display:none;" class="text-danger">Invalid input.</p>
    <p :id="dataRequiredMsgId" style="display:none;" class="text-danger">This field is required.</p>
    <textarea :id="adminCommentCtrlId" :screenNum="screenNum" style="display:none; border: 1px solid #c86888;" placeholder="Add Comment" class="is-request-data is-admin-comment form-control form-control-sm"></textarea>
  </div>

</template>

<script>
export default {
  props: ['screenNum', 'ctrlId', 'promptLabel', 'dataInvalidMsgId', 'dataRequiredMsgId', 'inAdminMode'],

  computed: {
    adminCommentCtrlId() {
      return this.ctrlId + "AdminComment";
    }
  },

  methods: {

    addAdminComment(evt) {     
      var adminCommentCtrlSelector = "#" + $(this).attr('adminCommentCtrlId');
      if (!$(adminCommentCtrlSelector).is(':visible')) {
        $(adminCommentCtrlSelector).show();
      } else {
        $(adminCommentCtrlSelector).hide();
      }

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
