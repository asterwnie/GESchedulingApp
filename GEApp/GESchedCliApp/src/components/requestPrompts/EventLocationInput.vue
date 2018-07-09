<template>

  <div :id="ctrlContainerId">
    <button type="button" class="btn btn-secondary btn-sm" v-if="!inAdminMode" @click.prevent="$router.push('/findroom')">Find</button>&nbsp;<label :for="ctrlId">{{ promptLabel }}</label>&nbsp;&nbsp;<span v-if="inAdminMode" class="badge badge-warning" :adminCommentCtrlId="adminCommentCtrlId" @click.prevent="onAddAdminComment"><span class="far fa-comment-dots"></span></span>
    <div :id="ctrlId" :screenNum="screenNum" isRoom="true" class="is-request-data">
      <div v-if="selectedRoom != null && selectedRoom != undefined">
        <div class="card" v-bind:class="selectedRoom._id">
          <div class="card-body">
            <h6 class="card-title">{{selectedRoom.name}}</h6>
            <div class="card-text" :hidden="selectedRoom.building == null || selectedRoom.building == ''">Building: {{selectedRoom.building}}</div>
            <div class="card-text" :hidden="selectedRoom.sizeType == null || selectedRoom.sizeType == ''">Size Type: {{selectedRoom.sizeType}}</div>
            <div class="card-text" :hidden="selectedRoom.seatingCapacity == null || selectedRoom.seatingCapacity == ''">Seating Capacity: {{selectedRoom.seatingCapacity}}</div>
            <div class="card-text" :hidden="selectedRoom.capabilities == null || selectedRoom.capabilities.length == 0">
              <hr>
              <span class="badge badge-info" v-for="(capability, index) in selectedRoom.capabilities" :key="index">
                {{capability}}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="card">
          <div class="card-body">
            <h6 class="font-weight-light font-italic">No location chosen. Use "Find" to select a location!</h6>
          </div>
        </div>
      </div>
    </div>
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
      },
      selectedRoom(){
        return this.$store.state.selectedRoom;
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