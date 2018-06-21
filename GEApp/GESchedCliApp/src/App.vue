<!--Outer "wrapper" of the app, appears on every screen-->
<template>
  <div id="app">
    <!--Top bar (header)-->
    <div class="app-bar-style fixed-top d-flex justify-content-between bd-highlight mb-3">
      <!--Back button-->
      <div class="p-2 align-self-center" >
        <a @click="$router.go(-1)"><span class="fas fa-chevron-left fa-lg" :hidden="!$store.state.enableNavBar"></span></a>
      </div>
      <!--Title-->
      <div class="p-2 align-self-center">{{ title }}</div>
      <!--Menu dropdown-->
      <div class="p-2 align-self-center">        
        <div class="dropdown" :hidden="!$store.state.enableNavBar">
              <button type="button" class="btn btn-sm btn-dark" data-toggle="modal" data-target=".main-menu-modal"><span class="fas fa-align-justify fa-lg"></span></button>
        </div>
      </div>
    </div>
    <transition name="slide" mode="out-in">
      <keep-alive>
        <!--Current Page-->
        <router-view></router-view>
      </keep-alive>
    </transition>

    <!-- Modal -->
    <div class="modal fade main-menu-modal" tabindex="-1" role="dialog" aria-labelledby="main-menu-modal-label" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <div class="card text-center">

          <div class="card-body">
            <div class="btn-group-vertical">
            <form>
              <div class="form-group">
                <button type="button" class="btn btn-primary" data-dismiss="modal" @click="$router.push('login')">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Login&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
              </div>
              <div class="form-group">
                <button type="button" width="100%" class="btn btn-primary" data-dismiss="modal" @click="$router.push('/home')">Home</button>
              </div>
              <div class="form-group">
                <button type="button" width="100%" class="btn btn-primary" data-dismiss="modal" @click="$router.push('/findroom')">Find Room</button>
              </div>
              <div class="form-group">
                <button type="button" width="100%" class="btn btn-primary" data-dismiss="modal" @click="$router.push('/dofirst')">New Request</button>
              </div>
              <div class="form-group">
                <button type="button" width="100%" class="btn btn-primary" data-dismiss="modal" @click="$router.push('/guestwifi')">Guest WiFi</button>
              </div>
              <div class="form-group">
                <button type="button" width="100%" class="btn btn-primary" data-dismiss="modal" @click="$router.push('/localhotels')">Local Hotels</button>
              </div>
              <div class="form-group">
                <button type="button" width="100%" class="btn btn-primary" data-dismiss="modal" @click="$router.push('/localcaterers')">Local Caterers</button>
              </div>
              <div class="form-group">
                <button type="button" width="100%" class="btn btn-primary" data-dismiss="modal" @click="$router.push('ithelp')">IT Help</button>
              </div>    
              <div class="form-group">
                <button type="button" width="100%" class="btn btn-primary" data-dismiss="modal" @click="$router.push('about')">About</button>
              </div>             
            </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    </div>


  </div>
</template>

<script>
import Router from 'vue-router'

export default {
  name: 'app',
  created() {
    console.log('App.vue created.');

  },

  data () {
    return {
      modalShowMenu: false
    }
  },

  computed: {
    title() {
      return this.$store.state.currentViewTitle;
    }
  },

  created() {       


  }
}
</script>

<style>
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
  margin-bottom: 12px;
  background-color: rgb(248, 248, 248);
}

.app-bar-style {
  color: #d1d5d8;
  background-color: #2c2c2c;
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


</style>
