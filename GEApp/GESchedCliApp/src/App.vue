<!--Outer "wrapper" of the app, appears on every screen-->
<template>
  <div id="app">

    <!--Top bar (header)-->
    <div id="headerBar" class="app-bar-style fixed-top bd-highlight mb-3">
      <!--Admin Red Bar-->
      <div v-if="$store.state.inAdminMode">
        <div style="width:100%; height:3px; z-index:100" class="fixed-top bg-danger"></div>
      </div>
      <div class="d-flex justify-content-between">
        <!--Back button-->
        <div class="p-2 align-self-center">
          <a @click="$router.go(-1)"><span class="fas fa-chevron-left fa-lg" :hidden="!$store.state.enableNavBar || $store.state.hideBackNav"></span></a><span :hidden="!isInDebugMode">&nbsp;({{windowWidth}},{{windowHeight}})&nbsp;Small:&nbsp;{{this.$store.state.isInSmallWidthMode}}</span>
        </div>       
        <!--Title-->
        <div class="p-2 align-self-center">{{ title }}</div>
        <!--Menu button-->
        <div class="p-2 align-self-center">
          <div id="menuButton" :hidden="!$store.state.enableNavBar" style="cursor:pointer;" class="navbar-toggle" data-toggle="offcanvas" data-target="#myNavmenu" data-canvas="body">
            <span class="fas fa-align-justify fa-lg text-white"></span>
          </div>
        </div>
      </div>
    </div>
    <transition><!--<transition name="slide" mode="out-in">-->
      <keep-alive>
        <!--Current Page-->
        <router-view></router-view>
      </keep-alive>
    </transition>
    <div :hidden="!isInDebugMode" id="debugOutput">
      <br>
      <button class="btn btn-secondary btn-sm"  @click.prevent="onClearDebug">Clear Debug</button> 
      <button class="btn btn-secondary btn-sm"  @click.prevent="onClearLocalCache">Clear Local Cache</button> 
      <button class="btn btn-secondary btn-sm"  @click.prevent="onShowLocalCache">Local Cache</button>
      <button class="btn btn-secondary btn-sm"  @click.prevent="onRequestData">Request Data</button>
      <br>
      <div id="debugOutput"></div>
      <br>
      <ul></ul>
    </div>

    <!--Menu slidein-->
    <nav id="myNavmenu" class="navmenu navmenu-default navmenu-fixed-right offcanvas bg-secondary" role="navigation">
      <div style="width:100%;" class="text-light mx-auto">
        <div style="width:100%; text-align:center; margin:20px; margin-left:0px; margin-bottom:30px">
          <img style="height:50px; width:auto" src="@/assets/ge-monogram-white.png"/>
        </div>
        <hr>
        <div class="nav">
          <div style="width:100%;" class="btn-group-vertical">
            <form style="width:100%">
              <div class="form-group">
                <button type="button" width="100%" v-on:click="collapseMenu" class="btn btn-secondary" data-dismiss="modal" @click="$router.push('/login')">Log Out</button>
              </div>
              <hr>
              <div v-if="$store.state.inAdminMode">
                <h5 width="100%" style="text-align:center">Admin Menu</h5><br>
                <div class="form-group">
                  <button type="button" width="100%" v-on:click="collapseMenu" class="btn btn-secondary" data-dismiss="modal" @click="$router.push('/admin/home')">Admin Home</button>
                </div>
                <div class="form-group">
                  <button type="button" width="100%" v-on:click="collapseMenu" class="btn btn-secondary" data-dismiss="modal" @click="$router.push('/admin/sendinvite')">Send Invite</button>
                </div>
                <div class="form-group">
                  <button type="button" width="100%" v-on:click="collapseMenu" class="btn btn-secondary" data-dismiss="modal" @click="$router.push('/admin/manageaccounts')">Manage Accounts</button>
                </div>
                <div class="form-group">
                  <button type="button" width="100%" v-on:click="collapseMenu" class="btn btn-secondary" data-dismiss="modal" @click="$router.push('/admin/maintenance')">Admin Maintenance</button>
                </div>
                <hr>
                <h5 width="100%" style="text-align:center">User Menu</h5><br>
              </div>
              <div v-else>
                <div class="form-group">
                  <button type="button" width="100%" v-on:click="collapseMenu" class="btn btn-secondary" data-dismiss="modal" @click="$router.push('/home')">Home</button>
                </div>
              </div>
              <div class="form-group">
                <button type="button" width="100%" v-on:click="collapseMenu" class="btn btn-secondary" data-dismiss="modal" @click="$router.push('/findroom')">Find Room</button>
              </div>
              <div class="form-group">
                <button type="button" width="100%" v-on:click="collapseMenu" class="btn btn-secondary" data-dismiss="modal" @click="$router.push('/dofirst/true')">New Request</button>
              </div>
              <div class="form-group">
                <button type="button" width="100%" v-on:click="collapseMenu" class="btn btn-secondary" data-dismiss="modal" @click="$router.push('/guestwifi')">Guest WiFi</button>
              </div>
              <div class="form-group">
                <button type="button" width="100%" v-on:click="collapseMenu" class="btn btn-secondary" data-dismiss="modal" @click="$router.push('/localhotels')">Local Hotels</button>
              </div>
              <div class="form-group">
                <button type="button" width="100%" v-on:click="collapseMenu" class="btn btn-secondary" data-dismiss="modal" @click="$router.push('/localcaterers')">Local Caterers</button>
              </div>
              <div class="form-group">
                <button type="button" width="100%" v-on:click="collapseMenu" class="btn btn-secondary" data-dismiss="modal" @click="$router.push('/ithelp')">IT Help</button>
              </div>    
              <div class="form-group">
                <button type="button" width="100%" v-on:click="collapseMenu" class="btn btn-secondary" data-dismiss="modal" @click="$router.push('/about')">About</button>
              </div>             
            </form>
            </div>
        </div>
      </div>
    </nav>



  <!-- Modal -->
  <div class="modal" id="requestActionConfirmDialog" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteModalLabel" style="color: red;">{{requestActionDialogTitle}}</h5>
          <button @click.prevent="onCancelDeleteRequest" type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>{{requestActionDialogMessage}}</p>
          <div class="card" v-if="selectedRequestForAction != null">
            <div class="card-body">
              <h6 class="card-title">{{selectedRequestForAction.eventTitle}}</h6>
              <h6 class="card-title"><span :class="selectedRequestForAction.processingStatus">{{selectedRequestForAction.processingStatusLabel}}</span></h6>
              <div class="card-text"><i class="label-icon fas fa-building"></i>&nbsp;&nbsp;<b>{{selectedRequestForAction.locationOfEvent.name}}</b>,&nbsp;{{selectedRequestForAction.locationOfEvent.building}}</div> 
              <div v-if="selectedRequestForAction.eventDateTimeDisp != null" class="card-text"><i class="label-icon fas fa-calendar-check"></i>&nbsp;&nbsp;{{selectedRequestForAction.eventDateTimeDisp}}</div>
              <div class="card-text"><i class="label-icon fas fa-user-circle"></i>&nbsp;&nbsp;{{selectedRequestForAction.eventGEContactPersonName}}</div>                      
              <div class="card-text text-muted" style="font-size:80%;margin-bottom: 8px;">Updated On:&nbsp;{{selectedRequestForAction.updatedAtDisp}}</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click.prevent="onCancelActionOnRequest">{{requestActionDialogDismissBtnLabel}}</button>
          <button type="button" class="btn btn-primary" @click.prevent="onConfirmedActionOnRequest">{{requestActionDialogConfirmBtnLabel}}</button>
        </div>
      </div>
    </div>
  </div>


  </div>
</template>

<script>
import Router from 'vue-router'
import * as util from '@/common/util.js';
import { centralStore } from '@/common/centralStore.js'
import * as localCacheMgr from '@/common/localCacheMgr.js';
import { applyBadgeColorBasedOnProcessingStatus } from '@/common/requestMgr.js'

export default {
  name: 'app',
  created() {
    console.log('App.vue created.');
  },

  data () {
    return {
      modalShowMenu: false,
      windowWidth: 0,
      windowHeight: 0,

    }
  },

  updated(){
    console.log('Home.vue updated.');
    applyBadgeColorBasedOnProcessingStatus();
  },


  computed: {

    isModalBeingDisplayed(){
      return this.$store.state.isModalBeingDisplayed;
    },

    title() {
      return this.$store.state.currentViewTitle;
    },

    isAdmin(){
      this.$store.state.inAdminMode;
    },

    isInDebugMode() {
      var isInDebugModeVal = false;
      var isInDebugModeVal = this.$route.query.debug;
      if (isInDebugModeVal == "true") {
        this.$store.state.isInDebugMode = true;
        this.$store.state.cliDebugMsgSqeNum = 0;
      }
      if (this.$store.state.isInDebugMode == true) {
        isInDebugModeVal = true;
      }
      return isInDebugModeVal;
    },

    selectedRequestForAction() {
      var reqAction = this.$store.state.actionForSelectedRequest;
      if (reqAction.forDelete != null) {
        return reqAction.forDelete;
      } else if (reqAction.forCancel != null) {
        return reqAction.forCancel;
      }
      return null;
    },

    requestActionDialogTitle() {
      var reqAction = this.$store.state.actionForSelectedRequest;
      if (reqAction.forDelete != null) {
        return reqAction.forDeleteDlgTitle;
      } else if (reqAction.forCancel != null) {
        return reqAction.forCancelDlgTitle;
      }
      return null;
    },

    requestActionDialogMessage() {
      var reqAction = this.$store.state.actionForSelectedRequest;
      if (reqAction.forDelete != null) {
        return reqAction.forDeleteDlgMsg;
      } else if (reqAction.forCancel != null) {
        return reqAction.forCancelDlgMsg;
      }
      return null;
    },

    requestActionDialogDismissBtnLabel() {
      var reqAction = this.$store.state.actionForSelectedRequest;
      if (reqAction.forDelete != null) {
        return reqAction.forDeleteDismissBtnLabel;
      } else if (reqAction.forCancel != null) {
        return reqAction.forCancelDismissBtnLabel;
      }
      return null;
    },

    requestActionDialogConfirmBtnLabel() {
      var reqAction = this.$store.state.actionForSelectedRequest;
      if (reqAction.forDelete != null) {
        return reqAction.forDeleteConfirmBtnLabel;
      } else if (reqAction.forCancel != null) {
        return reqAction.forCancelConfirmBtnLabel;
      }
      return null;
    }

  },

  watch:{
    $route (to, from){
      window.scrollTo(0, 0);

      this.$store.state.enableNavBar = true;
      this.$store.state.hideBackNav  = false;
      
      if (this.$store.state.inAdminMode) {
        if (to.name == "AttentionNotes" && this.$store.state.previousPage == "AttentionNotes") {
          if (from.path.indexOf('/request/') > -1) {

            if (from.path.indexOf('/3') > -1) {
              this.$router.push('/request/2'); 
            } else if (from.path.indexOf('/2') > -1) {
              this.$router.push('/request/1'); 
            } else if (from.path.indexOf('/1') > -1) {
              this.$router.push('/admin/home');
            }

          } else {
            this.$router.push('/request/'+this.$store.state.numOfRequestScreens); 
          }
        }
      }

      this.$store.state.previousPage = from.name;

      util.detectIsInSmallWidthMode();

      if (this.isInDebugMode) {
        this.windowWidth = $(window).width();
        this.windowHeight = $(window).height();
      }
    },

    isModalBeingDisplayed: function (){
      console.log("App.vue - Cleaning up modal backdrop.");
      let vm = this;

      let backdrops = document.getElementsByClassName("modal-backdrop");
      $.each(backdrops, function(){
        this.addEventListener("click", function(){
          $.each(document.getElementsByClassName("modal-backdrop"), function(){
            $('.modal').modal('hide');
            $('body').removeClass('modal-open');
            this.remove();
            vm.$store.state.isModalBeingDisplayed = false;
          });
        });
      });

    }
  },

  methods: {

    collapseMenu: function(event) {
      if (event) {
        //collapse menu
        $("#menuButton").click();
      }
    },
    
    onCancelActionOnRequest() {
        console.log('App.vue - onCancelActionOnRequest');

        this.$store.state.actionForSelectedRequest.forDelete = null;
        this.$store.state.actionForSelectedRequest.forDeleteFromView = null;

        this.$store.state.actionForSelectedRequest.forCancel = null;
        this.$store.state.actionForSelectedRequest.forCancelFromView = null;

        $('#requestActionConfirmDialog').modal('hide');
        this.$store.state.isModalBeingDisplayed = false;
    },

    onConfirmedActionOnRequest() {
        console.log('App.vue - onConfirmedActionOnRequest');

        var reqAction = this.$store.state.actionForSelectedRequest;
        if (reqAction.forDelete != null) {
          util.centralEvent.$emit('onDeleteSelectedRequest');
        } else if (reqAction.forCancel != null) {
          util.centralEvent.$emit('onCancelSelectedRequest');
        }
    },


    onClearDebug: function(event) {
      if (event) {
        $("#debugOutput ul").html("");
      }
    },

    onClearLocalCache: function(event) {
      if (event) {
        localCacheMgr.clearLocalCache();
      }
    },

    onShowLocalCache: function(event) {
      if (event) {
        var cachedItems = localCacheMgr.getLocalCacheCollection();
        if (cachedItems.length > 0) {
          $.each(cachedItems, function (index, cachedItem) {
            util.logDebugMsg("CACHE-KEY: " + cachedItem.key);
            util.logDebugMsg("CACHE-ITEM: " + cachedItem.jsonValue);
          });
        } else {
          util.logDebugMsg("The Local Storage Cache is empty!");
        }
      }
    },

    onRequestData: function(event) {
      if (event) {
        var storeState = centralStore.state;
        util.logDebugMsg("Showing eventSchedule:");

        if (storeState.currentRequest != null && storeState.currentRequest["eventSchedule"] != undefined && storeState.currentRequest["eventSchedule"] != null) {
          util.logDebugMsg("eventSchedule - startDateTime: " + util.getDateTimeDisplay(storeState.currentRequest["eventSchedule"].startDateTime));
          util.logDebugMsg("eventSchedule - endDateTime: " + util.getDateTimeDisplay(storeState.currentRequest["eventSchedule"].endDateTime));

        } else {
          util.logDebugMsg("eventSchedule not defined");
        }
      }
    }
  }
  
}
</script>

<style>
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 50px;
  margin-bottom: 12px;
  background-color: rgb(248, 248, 248);
}

.app-bar-style {
  color: #d1d5d8;
  background-color: #2c2c2c;
}

.label-icon {
    color: rgb(80, 80, 80);
}
.btn-xs {
  padding: .55rem .3rem;
  font-weight: bold;
  font-size: .775rem;
  line-height: .5;
  border-radius: .2rem;
  cursor: pointer; 
  text-align: center; 
  vertical-align: middle;
  margin: 2px;
}

.site-name-footer {
  font-weight: bold;
  font-size  : .885rem;
  line-height  : .5;
  text-align: center; 
  vertical-align: middle; 
  padding: 6px;
}
.site-address-footer {
  font-size  : .775rem;
  line-height  : .5;
  text-align: center; 
  vertical-align: middle; 
  padding: 6px;
}
.welcome-back-msg {
  color: rgb(63, 63, 63);
  font-weight: bold;
  font-size  : 92%;
  line-height  : .5; 
  text-align: right;
  vertical-align: middle; 
  padding: 6px;
}
.logoff-label {
  font-weight: bold;
  color: rgb(219, 120, 120);
  font-size  : 75%;
  line-height  : .5; 
  text-align: right;
  vertical-align: middle; 
  padding: 3px;
}

.white-glyphicon {
  color: #fff;
}

.slide-enter-active {
    animation: slide-in 200ms ease-out forwards;
}

.slide-leave-active {
    animation: slide-out 200ms ease-out forwards;
}

@keyframes slide-in {
    from {
        transform: translateY(-30px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes slide-out {
    from {
        transform: translateY(0);
        opacity: 1;
    }
    to {
        transform: translateY(-30px);
        opacity: 0;
    }
}

.navmenu-fixed-right {
   left: auto !important;
}

body.canvas-sliding, body.canvas-slid {
    left: auto !important;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {display:none;}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.capability-badge-style{
  background-color:#919191;
}
 
</style>
