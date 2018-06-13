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
              <span class="fas fa-align-justify fa-lg" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">

              </span>
              <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                  <a class="dropdown-item" @click="$router.push('login')">Login</a>
                  <a class="dropdown-item" @click="$router.push('home')">Home</a>
                  <a class="dropdown-item" @click="$router.push('findroom')">Find Room</a>
                  <a class="dropdown-item" @click="$router.push('newrequest')">New Request</a>
                  <a class="dropdown-item" @click="$router.push('guestwifi')">Guest WiFi</a>
                  <a class="dropdown-item" @click="$router.push('localhotels')">Local Hotels</a>
                  <a class="dropdown-item" @click="$router.push('localcaterers')">Local Caterers</a>
                  <a class="dropdown-item" @click="$router.push('ithelp')">IT Help</a>
                  <a class="dropdown-item" @click="$router.push('about')">About</a>
              </div>
        </div>
      </div>
    </div>

    <transition name="slide" mode="out-in">
      <keep-alive>
        <!--Current Page-->
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import Router from 'vue-router'

export default {
  name: 'app',
  created() {
    console.log('App.vue created.');

  },
  computed: {
    title() {
      return this.$store.state.currentViewTitle;
    }
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
