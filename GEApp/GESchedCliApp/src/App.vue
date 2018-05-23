<template>
  <div id="app">
  <div class="app-bar-style fixed-top d-flex justify-content-between bd-highlight mb-3">
    <div class="p-2 align-self-center">
      <a @click="$router.go(-1)">&nbsp;<b>&lt;</b>&nbsp;</a>
    </div>
    <div class="p-2 align-self-center">{{ title }}</div>
    <div class="p-2 align-self-center">        
      <div class="dropdown">
            <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            </button>
            <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item"><router-link to="/login">Login</router-link></a>
                <a class="dropdown-item"><router-link to="/home">Home</router-link></a>
                <a class="dropdown-item"><router-link to="/findroom">Find Room</router-link></a>
                <a class="dropdown-item"><router-link to="/newrequest">New Request</router-link></a>
                <a class="dropdown-item"><router-link to="/ithelp">IT Help</router-link></a>
                <a class="dropdown-item"><router-link to="/about">About</router-link></a>
            </div>
      </div>
    </div>
  </div>
    <transition>
      <keep-alive>
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
</style>
