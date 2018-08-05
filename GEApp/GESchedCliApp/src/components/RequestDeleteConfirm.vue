<template>
  <div>
    test 1 2 3 !
    <!-- Modal Dialog for delete a Request -->
    <div class="modal" id="deleteRequestModalDialog" tabindex="-1" role="dialog" aria-labelledby="deleteRequestModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="deleteRequestModalLabel">Delete Request</h5>
            <button @click.prevent="onCancelDeleteRequest" type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete this request? This action cannot be undone.</p>

            <div class="card-body">
                <h6 class="card-title">{{requestItem.eventTitle}}</h6>
                <h6 class="card-title"><span :class="requestItem.processingStatus">{{requestItem.processingStatusLabel}}</span></h6>
                <div class="card-text"><i class="label-icon fas fa-building"></i>&nbsp;&nbsp;<b>{{requestItem.locationOfEvent.name}}</b>,&nbsp;{{requestItem.locationOfEvent.building}}</div> 
                <div v-if="requestItem.eventDateTimeDisp != null" class="card-text"><i class="label-icon fas fa-calendar-check"></i>&nbsp;&nbsp;{{requestItem.eventDateTimeDisp}}</div>
                <div class="card-text"><i class="label-icon fas fa-user-circle"></i>&nbsp;&nbsp;{{requestItem.eventGEContactPersonName}}</div>                      
                <div class="card-text text-muted" style="font-size:80%;margin-bottom: 8px;">Updated On:&nbsp;{{requestItem.updatedAtDisp}}</div>
            </div>

          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click.prevent="onCancelDeleteRequest">Cancel</button>
            <button type="button" class="btn btn-primary" @click.prevent="onDeleteRequest">Confirm Delete</button>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
import * as apiMgr from '@/common/apiMgr.js';

export default {
 
  data () {
    return {
        isFetchingRequests: false,
        hasFailure: false,
        failureMessage: null
    }
  },

  activated() {
    console.log('RequestDeleteConfirm activated.');
    let vm = this;
  },

  computed: {

    requestItem() {
      return this.$store.state.selectedRequestForDelete;
    }

  },

  methods: {

    onDeleteRequest: function(event) {

        var vm = this;
        this.hasFailure = false;
        this.isFetchingRequests = false;
        this.failureMessage = null;

        var reqId = this.requestItem._id;

        var url = apiMgr.getRequestByIdUrl(reqId);
        console.log(`onDeleteRequest - Query url: ${url}`);

        //delete request
        axios.delete(url)
          .then(res => {
            console.log("Request delete return status: " + res.status);

            //get requests for current user
            let queryUser = `&requesterEmailContains=${vm.$store.state.currentUser.email}`;
            var url = apiMgr.getRequestsUrl() + queryUser;

            axios.get(url)
              .then(res => {
                  console.log("getRequestsUrl return status: " + res.status);
                  
                  while(vm.$store.state.currentUserRequests.length > 0) {
                    vm.$store.state.currentUserRequests.pop();
                  }
                  var foundRequests = res.data;

                  $.each(foundRequests, function (index, request) {
                    vm.$store.state.currentUserRequests.push(request);
                  });
                  
                  vm.isFetchingRequests = false;
              })
              .catch((err) => {
                  vm.hasFailure = true;
                  vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
              })
               
          })
          .catch((err) => {
            console.log(err);
            vm.hasFailure = true;
            vm.failureMessage = "Server unavailable or not working at this time. Please try later.";                               
          })
                
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
